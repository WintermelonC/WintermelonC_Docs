# 内存管理与垃圾回收

UE5 的内存管理分为两条 **并行的主线**：一条是管理 `UObject` 的垃圾回收（GC），另一条是管理普通 C++ 对象的分配器与智能指针。两者职责分明、不能混用，理解它们的边界是写出健壮代码的前提

## 1 内存管理概览

UE5 的内存体系可以分成三层：

```text linenums="1"
应用层
├── UObject 派生对象        → 由 GC 自动管理
├── 非 UObject 的 C++ 对象  → 智能指针 / 手动管理
└── 原始内存分配            → FMemory → GMalloc
```

核心原则：

- **`UObject` 交给 GC**：`UObject` 派生对象不用 `new`/`delete`，也不放进 `TSharedPtr`
- **普通 C++ 对象用智能指针**：`TSharedPtr` / `TUniquePtr` / `TWeakPtr`
- **底层统一走分配器**：所有内存分配最终经 `GMalloc` 与 `FMemory` 完成

!!! tip "为什么要分两条主线"

    `UObject` 需要被 GC 追踪引用、参与序列化和反射，而普通 C++ 对象追求确定性析构与零开销。把两者强行统一会同时损失双方的优点

## 2 内存分配器：FMalloc 体系

所有内存分配最终都通过全局分配器指针 `GMalloc`，其类型为抽象基类 `FMalloc`：

```cpp linenums="1"
// Engine/Source/Runtime/Core/Public/HAL/MallocBase.h（简化）
class FMalloc
{
public:
    virtual void* Malloc(SIZE_T Size, uint32 Alignment) = 0;
    virtual void* Realloc(void* Ptr, SIZE_T NewSize, uint32 Alignment) = 0;
    virtual void  Free(void* Ptr) = 0;
    virtual SIZE_T GetAllocatedSize(void* Ptr) = 0;
    // ...
};
```

业务代码通过 `FMemory` 的静态函数间接调用 `GMalloc`：

```cpp linenums="1"
void* Ptr = FMemory::Malloc(1024, 16);   // 分配
Ptr = FMemory::Realloc(Ptr, 2048, 16);   // 重分配
FMemory::Free(Ptr);                      // 释放
```

常见的平台分配器实现：

| 分配器 | 特点 |
| --- | --- |
| `FMallocBinned` / `FMallocBinned2` / `FMallocBinned3` | 按大小分"箱"（bin），减少碎片，最常用 |
| `FMallocAnsi` | 基于虚拟内存的兜底实现 |
| `FMallocTBB` | 基于 Intel TBB 的分配器 |
| `FMallocMimalloc` | 基于 mimalloc 的高性能分配器 |

!!! tip "分箱（Binning）的意义"

    游戏会频繁分配大量小块内存。分箱分配器把相近大小的请求归入同一个"箱"，预分配页并切块复用，从而大幅降低内存碎片与分配开销

## 3 UObject 垃圾回收概述

`UObject` 数量庞大、引用关系复杂，手动管理极易出错，因此引擎用 **标记-清扫（Mark-Sweep）** 算法自动回收：

```text linenums="1"
标记阶段：从根集出发，遍历所有引用，标记可达对象
    │
    ▼
清扫阶段：未标记的对象视为垃圾，逐个销毁
```

GC 的入口函数是 `CollectGarbage`：

```cpp linenums="1"
// Engine/Source/Runtime/CoreUObject/Private/UObject/GarbageCollection.cpp（简化）
void CollectGarbage(EObjectFlags KeepFlags, bool bPerformFullPurge)
{
    // 1. 可达性分析（标记）
    ReachabilityAnalysis(KeepFlags);

    // 2. 收集不可达对象
    GatherUnreachableObjects(bForceSingleThreaded);

    // 3. 解除哈希表引用
    UnhashUnreachableObjects(Unhashables);

    // 4. 销毁不可达对象
    IncrementalPurgeGarbage(bPerformFullPurge);
}
```

GC 的触发时机包括：

- 关卡切换、加载卸载资源时
- 编辑器中的各种操作（保存、编译蓝图等）
- 手动调用 `GEngine->ForceGarbageCollection()`
- 内存压力较大时引擎自动触发

## 4 标记阶段：可达性分析

### 4.1 根集

标记从 **根集（Root Set）** 出发，根集由两部分组成：

- 引擎标记为根的对象（如 `GEngine`、`GWorld` 等，带有 `RF_MarkAsRootSet` 标志）
- 通过 `AddToRoot()` 显式加入根集的对象

```cpp linenums="1"
MyObject->AddToRoot();      // 加入根集，GC 不会回收
MyObject->RemoveFromRoot(); // 移出根集
```

### 4.2 引用收集

标记阶段的核心是 **引用收集器** `FReferenceCollector`，它负责从一个对象出发收集其引用的其他 `UObject`：

```cpp linenums="1"
// FReferenceCollector 的关键方法（简化）
class FReferenceCollector
{
public:
    void AddReferencedObject(UObject*& Object);            // 登记单个引用
    void AddReferencedObjects(TArray<UObject*>& Objects);  // 登记数组引用
    void AddStableReference(UObject** Object);             // 登记稳定引用
};
```

每个 `UObject` 的引用来源有两个：

1. **反射自动收集**：UHT 为类生成的 `AddReferencedObjects` 会遍历所有 `UPROPERTY` 成员
2. **手动登记**：重写 `AddReferencedObjects` 为裸指针手动登记

```cpp linenums="1"
void AMyActor::AddReferencedObjects(UObject* InThis, FReferenceCollector& Collector)
{
    Super::AddReferencedObjects(InThis, Collector);        // 先收集 UPROPERTY
    Collector.AddReferencedObject(MyNonUPROPERTYObject);   // 手动登记裸指针
}
```

!!! warning "裸指针不会被自动追踪"

    只有 `UPROPERTY` 修饰的 `UObject*` 成员才会被 GC **自动** 追踪。普通裸 `UObject*` 成员、`TArray<UObject*>` 里的指针，如果既不写 `UPROPERTY` 也不在 `AddReferencedObjects` 里手动登记，GC 就不知道它们的存在，可能在使用期间就把对象回收掉

### 4.3 可达性分析流程

`ReachabilityAnalysis` 内部大致做三件事：

1. 把所有对象初始标记为"不可达"（对应内部标志 `EInternalObjectFlags::Unreachable`，`KeepFlags` 指定的对象除外）
2. 从根集出发，通过 `FGCReferenceProcessor` 沿引用关系遍历，把可达对象重新标记为可达
3. 遍历结束后仍不可达的对象进入清扫阶段

## 5 清扫阶段：销毁不可达对象

清扫阶段把不可达对象逐个销毁，且可以 **分帧执行** 以避免卡顿：

- `IncrementalPurgeGarbage`：按时间片分批销毁，避免单帧阻塞
- 每个对象的销毁走 `BeginDestroy` → `FinishDestroy` 流程

```text linenums="1"
ConditionalBeginDestroy()
└── BeginDestroy()                 // 标记 RF_BeginDestroyed，释放底层资源
    └── IsReadyForFinishDestroy()  // 异步任务是否完成
        └── FinishDestroy()        // 标记 RF_FinishDestroyed，最终释放
```

对象销毁后会从全局对象表 `GUObjectArray` 中移除，其内存交还给 `GMalloc`

!!! tip "为什么分帧清扫"

    一个关卡可能同时有数万个 `UObject` 变成垃圾，若在同一帧全部析构会造成明显卡顿。分帧清扫把销毁工作摊到多帧，保证帧率平稳

## 6 引用类型与所有权

UE 为 `UObject` 提供了多种引用类型，强度各不相同：

| 引用类型 | 强弱 | 说明 |
| --- | --- | --- |
| `UPROPERTY` 指针 | 强 | GC 自动追踪，保活对象 |
| `AddToRoot` | 强 | 加入根集，永不回收（直到 `RemoveFromRoot`） |
| `TStrongObjectPtr` | 强 | 非 `UPROPERTY` 场景下的强引用封装 |
| `TWeakObjectPtr` | 弱 | 对象被 GC 后可感知，`IsValid()` 判断 |
| `TSoftObjectPtr` | 弱（软） | 存资源路径，需 `LoadSynchronous()` 加载 |
| `FSoftObjectPath` | 弱（软） | 纯路径字符串，用于资源引用 |

### 6.1 TWeakObjectPtr 的实现原理

`TWeakObjectPtr` 底层是 `FWeakObjectPtr`，它不直接存指针，而是存 **对象索引 + 序列号**：

```cpp linenums="1"
// FWeakObjectPtr（简化）
class FWeakObjectPtr
{
    int32 ObjectIndex;         // 在 GUObjectArray 中的索引
    int32 ObjectSerialNumber;  // 对象被销毁后序号失效
};
```

全局对象表 `GUObjectArray` 里每个对象都有一个 `FUObjectItem`，其中包含指针、标志位与序列号。当对象被 GC 回收后，其槽位会更新序列号，`FWeakObjectPtr` 据此判断对象是否仍存活，从而避免悬垂指针：

```cpp linenums="1"
TWeakObjectPtr<AActor> WeakActor = SomeActor;
if (WeakActor.IsValid())          // 对象还活着
{
    AActor* A = WeakActor.Get();
}
```

### 6.2 TSoftObjectPtr 与软引用

软引用用于引用 **尚未加载** 的资源（如关卡中的资产）：

```cpp linenums="1"
UPROPERTY(EditAnywhere, Category = "Assets")
TSoftObjectPtr<UTexture2D> SoftTexture;             // 存路径，不强制加载

UTexture2D* Tex = SoftTexture.LoadSynchronous();    // 按需同步加载
```

## 7 非 UObject 的内存管理

普通 C++ 对象（`F` 开头类、结构体、模板类）不参与 GC，用智能指针管理：

| 类型 | 对应 STL | 说明 |
| --- | --- | --- |
| `TSharedPtr` | `std::shared_ptr` | 共享所有权 |
| `TSharedRef` | — | 保证非空的共享引用 |
| `TWeakPtr` | `std::weak_ptr` | 弱引用，不增加计数 |
| `TUniquePtr` | `std::unique_ptr` | 独占所有权 |

```cpp linenums="1"
TSharedPtr<FMyData> Data = MakeShared<FMyData>();
TWeakPtr<FMyData> Weak   = Data;
TUniquePtr<FMyData> Uniq = MakeUnique<FMyData>();
```

### 7.1 FGCObject：让普通类持有 UObject 引用

如果某个 **非 `UObject`** 的类需要持有 `UObject` 引用并保证其不被回收，可继承 `FGCObject`：

```cpp linenums="1"
class FMyManager : public FGCObject
{
    UObject* HeldObject;

public:
    virtual void AddReferencedObjects(FReferenceCollector& Collector) override
    {
        Collector.AddReferencedObject(HeldObject);
    }
};
```

## 8 常见陷阱与最佳实践

- `UObject` 派生对象 **不要** 用 `new`/`delete`，用 `NewObject` 创建、交给 GC 回收
- 裸 `UObject*` 成员 **必须** 加 `UPROPERTY`，或重写 `AddReferencedObjects` 手动登记
- **不要** 用 `TSharedPtr` 管理 `UObject`，两套生命周期系统会互相冲突
- 跨对象持有他人引用时优先用 `TWeakObjectPtr`，避免形成无法回收的强引用环
- `AddToRoot` 后 **记得** `RemoveFromRoot`，否则对象永不回收造成内存泄漏
- 判断 `UObject` 是否有效用 `IsValid()`，它同时检查指针非空与 GC 未标记销毁
- 持有非 `UObject` 引用给 `UObject` 用时注意生命周期，多播委托用毕要 `RemoveAll`
