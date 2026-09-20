# UE5 C++

UE5 使用的 C++ 并不是一门新的编程语言，而是 **标准 C++（C++17 / C++20）加上一套由 Epic 提供的运行时框架**。这套框架以 `UObject` 为核心，提供了反射、垃圾回收、序列化、网络复制、蓝图互操作等能力。理解 UE5 C++ 的关键，在于理解它与"原生 STL C++"之间的关系：语法完全一致，但工程实践、容器、字符串、内存管理几乎全部被 UE 自己的库所替代

## 1 UE5 C++ 与原生 STL 的异同点

### 1.1 相同点

UE5 C++ 建立在标准 C++ 之上，以下内容与原生 C++ **完全一致**：

- **语言语法**：类、继承、多态、虚函数、模板、lambda、`constexpr`、`auto`、右值引用与移动语义等
- **类型系统**：`int32` / `uint32` / `int64` / `uint64` / `float` / `double` / `bool` 等基础类型照常使用（只是 Epic 推荐用 `int32` 这种明确位宽的别名替代 `int`）
- **运算符、控制流、函数重载、命名空间**：用法不变
- **标准库部分子集**：`<cmath>`、`<algorithm>` 的部分内容、`<type_traits>` 等在 UE 代码中仍可使用，但通常被 UE 的封装替代
- **OOP 与设计模式**：继承、组合、接口等思想保持一致

可以简单理解为：**你会写标准 C++，就会写 UE5 C++，只是需要换一套"轮子"**

### 1.2 不同点

Epic 为引擎提供了一整套 **自有标准库**，并在绝大多数场景下 **禁止直接使用 STL 容器**。原因是多方面的：

1. **跨平台一致性**：`std::map`、`std::vector` 在不同平台、不同编译器、不同标准库实现下行为与内存布局不完全一致，而游戏需要精确控制内存与二进制序列化（存档、网络同步）
2. **与垃圾回收集成**：`UObject` 由 GC 管理，STL 容器无法被 GC 追踪引用
3. **内存追踪与调试**：UE 有 `Malloc`/`FMalloc` 内存分配器体系，STL 分配的内存不在统计范围内，影响内存分析与优化
4. **序列化与反射**：UE 容器需要配合反射系统进行 `UPROPERTY` 自动序列化，STL 容器无法直接参与
5. **性能与内存布局**：UE 容器针对游戏做了大量优化（如 `TArray` 的 slack 机制、`TInlineAllocator` 栈内分配、`TMap` 的哈希控制）

### 1.3 对应关系总览

| 用途 | 原生 STL | UE5 等价物 |
| --- | --- | --- |
| 动态数组 | `std::vector` | `TArray` |
| 链表 | `std::list` | `TDoubleLinkedList` |
| 哈希表 | `std::unordered_map` | `TMap` |
| 有序映射 | `std::map` | `TMap`（需自行排序，无内建红黑树有序容器） |
| 集合 | `std::set` / `std::unordered_set` | `TSet` |
| 栈 | `std::stack` | `TArray`（用 `Push`/`Pop` 模拟，无独立栈） |
| 队列 | `std::queue` | `TQueue` |
| 字符串 | `std::string` / `std::wstring` | `FString` |
| 字符串视图 | `std::string_view` | `FStringView` / `FName` |
| 共享指针 | `std::shared_ptr` | `TSharedPtr` |
| 弱指针 | `std::weak_ptr` | `TWeakPtr` |
| 独占指针 | `std::unique_ptr` | `TUniquePtr` |
| 函数对象 | `std::function` | `TFunction` / 委托（Delegate） |
| 元组 | `std::tuple` | `TTuple` |
| 可选值 | `std::optional` | `TOptional` |
| 变体 | `std::variant` | `TVariant` |
| RTTI 类型信息 | `typeid` / `dynamic_cast` | `Cast<>` + 反射系统 |

!!! question "为什么游戏引擎要另起炉灶"

    - 游戏运行在 **持续数小时甚至数天** 的实时循环中，内存碎片、缓存未命中、隐藏的堆分配都会被无限放大
    - 需要 **确定性**：跨平台联机、回放系统要求同一逻辑在不同设备上结果一致，STL 的某些实现细节不稳定
    - 需要 **热更新与序列化**：反射让"把对象存盘 / 通过内存镜像同步"成为可能，这是 STL 做不到的

## 2 核心对象模型：`UObject`

[UObject 体系](./uobject.md){:target="_blank"}

`UObject` 是 UE 对象体系的根，提供了四大基础能力：

1. **反射（Reflection）**：运行时查询类信息、属性、函数
2. **垃圾回收（GC）**：基于标记-清扫自动管理生命周期
3. **序列化（Serialization）**：存档、读盘、网络复制
4. **编辑器集成**：在细节面板、蓝图编辑器中显示与编辑

几乎所有参与引擎逻辑的类都继承自 `UObject` 或它的子类：

```cpp linenums="1"
UObject
├── AActor                    // 可放入场景的物体
│     └── APawn / ACharacter / AController ...
├── UActorComponent           // 组件
│     ├── USceneComponent     // 有变换的组件
│     └── UActorComponent 其他
├── UGameInstance / UWorld / ULevel
└── UDataAsset / UUserWidget ...
```

> 与 `UObject` 对应，纯数据、无需 GC 的结构体用 `USTRUCT`，枚举用 `UENUM`，接口用 `UINTERFACE`

## 3 反射系统与 UHT

[反射系统与 UHT](./reflection_and_uht.md){:target="_blank"}

### 3.1 工作原理

UE 使用 **UHT（Unreal Header Tool）** 在编译前扫描头文件中的宏，生成对应的 `.generated.h` 文件。反射信息最终以 `UClass` / `UProperty`（UE5 中为 `FProperty`）等对象的形式存在，供运行时使用

```cpp linenums="1"
// MyActor.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyActor.generated.h"   // 必须最后包含

UCLASS()
class MYPROJECT_API AMyActor : public AActor
{
    GENERATED_BODY()            // UHT 生成的样板代码

public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
    float Health = 100.0f;

    UFUNCTION(BlueprintCallable, Category = "Stats")
    void TakeDamage(float Damage);
};
```

### 3.2 反射的用途

- **蓝图互操作**：`BlueprintCallable`、`BlueprintReadWrite` 让蓝图可以调用函数、读写变量
- **编辑器细节面板**：`EditAnywhere` 使属性在细节面板中可编辑
- **自动序列化**：标记了 `UPROPERTY` 的成员会被自动存档/恢复
- **GC 追踪**：只有 `UPROPERTY` 修饰的 `UObject*` 指针才会被垃圾回收器追踪，防止被提前回收

## 4 内存管理与垃圾回收

[内存管理与垃圾回收](./memory_management_and_gc.md){:target="_blank"}

### 4.1 GC 机制

UE 采用 **标记-清扫（Mark-Sweep）** 垃圾回收：

1. 从根集（Root Set，如 `UWorld`、`UGameInstance`）出发，遍历所有被引用的对象并标记
2. 清除所有未被标记的对象

**关键规则**：一个 `UObject*` 指针只有在被 `UPROPERTY` 修饰时，才会被 GC 视为有效引用

```cpp linenums="1"
UCLASS()
class AMyActor : public AActor
{
    GENERATED_BODY()

    UPROPERTY()                       // 受 GC 保护
    UStaticMeshComponent* Mesh;

    UStaticMeshComponent* BadRef;     // 危险！GC 可能提前回收
};
```

### 4.2 生命周期管理手段

| 场景 | 手段 |
| --- | --- |
| `UObject` 派生对象 | 靠 `UPROPERTY` 引用 + GC |
| 非 `UObject` 的 C++ 对象 | `TSharedPtr` / `TUniquePtr` 智能指针 |
| 手动控制 GC 时机 | `UObject::ConditionalBeginDestroy`、`MarkAsGarbage`、`AddToRoot` |
| 主动触发 GC | `GEngine->ForceGarbageCollection()` |
| 持有对非拥有对象的弱引用 | `TWeakObjectPtr` |

### 4.3 常见内存陷阱

- `UObject` 派生类 **不要** 用 `new`/`delete` 手动管理，也不要放进 `TSharedPtr`
- 裸 `UObject*` 成员必须加 `UPROPERTY`
- `TArray<UObject*>` 中的指针同样需要 `UPROPERTY` 才能被 GC 追踪；跨对象强引用可考虑 `TWeakObjectPtr`

## 5 字符串体系

UE 提供了多套字符串类型，各有明确用途：

| 类型 | 可变性 | 用途 |
| --- | --- | --- |
| `FString` | 可变 | 通用字符串，类似 `std::string` |
| `FName` | 不可变 | 标识符、资源名，哈希存储，比较极快 |
| `FText` | 不可变 | 面向用户的、需本地化的文本 |
| `FStringView` | 只读视图 | 零拷贝的字符串视图，类似 `std::string_view` |
| `TCHAR` | — | UE 的字符类型（Windows 下为 `wchar_t`，其他平台为 `char`） |

```cpp linenums="1"
FString Str = TEXT("Hello");
FName Name = FName(TEXT("MyActor"));
FText Text = FText::FromString(TEXT("欢迎"));

FString S = Name.ToString();   // FName -> FString
FString T = Text.ToString();   // FText -> FString
```

> 字符串字面量请用 `TEXT("...")` 宏包裹，以保证跨平台编码一致

## 6 容器体系

### 6.1 `TArray`

UE 最常用的容器，对应 `std::vector`，但有额外机制：

- **Slack（预留空间）**：`Reserve` 预留容量；`Shrink` 收缩
- **内联分配器**：`TArray<Type, TInlineAllocator<16>>` 把小数组直接放在栈上，避免堆分配
- **常用操作**：`Add`、`Emplace`、`Insert`、`RemoveAt`、`RemoveAll`、`Find`、`Contains`、`IndexOfByKey`、`Reserve`、`Empty`

```cpp linenums="1"
TArray<int32> Numbers;
Numbers.Add(1);
Numbers.Emplace(2);          // 原地构造，比 Add 少一次拷贝
Numbers.Reserve(100);        // 预留容量
Numbers.RemoveAll([](int32 N) { return N < 0; });
```

### 6.2 `TMap` 与 `TSet`

- `TMap<Key, Value>`：哈希表，对应 `std::unordered_map`
- `TSet<Type>`：哈希集合，对应 `std::unordered_set`
- UE **没有** 内建的红黑树有序 `std::map`/`std::set`，需要有序时自行排序 `TArray`
- 多值映射可用 `TMultiMap`

```cpp linenums="1"
TMap<FString, int32> Scores;
Scores.Add(TEXT("A"), 100);
if (int32* Ptr = Scores.Find(TEXT("A")))
{
    *Ptr += 10;
}
```

### 6.3 迭代器

```cpp linenums="1"
for (int32 N : Numbers) { /* 范围 for */ }

for (auto It = Numbers.CreateIterator(); It; ++It)  // 可在遍历中删除
{
    if (*It < 0) { It.RemoveCurrent(); }
}
```

## 7 智能指针

UE 的智能指针用于管理 **非 `UObject`** 的对象，与 STL 智能指针对应：

| 类型 | 对应 STL | 说明 |
| --- | --- | --- |
| `TSharedPtr` | `std::shared_ptr` | 共享所有权，线程安全的引用计数 |
| `TSharedRef` | —（不可为空） | 保证非空的共享引用 |
| `TWeakPtr` | `std::weak_ptr` | 弱引用，不增加计数 |
| `TUniquePtr` | `std::unique_ptr` | 独占所有权 |

```cpp linenums="1"
TSharedPtr<FMyData> Data = MakeShared<FMyData>();
TWeakPtr<FMyData> Weak = Data;
TUniquePtr<FMyData> Unique = MakeUnique<FMyData>();
```

> 注意区分两套弱引用：`TWeakPtr` 针对普通 C++ 对象；`TWeakObjectPtr` 针对 `UObject`，能感知 GC 状态（`IsValid()`）

## 8 委托（Delegate）

委托是 UE 的事件/回调机制，可理解为强类型、可多播的 `std::function`，分三大类：

| 类型 | 宏前缀 | 特点 |
| --- | --- | --- |
| 单播 | `DECLARE_DELEGATE` | 只绑定一个函数 |
| 多播 | `DECLARE_MULTICAST_DELEGATE` | 可绑定多个，`Broadcast` 广播 |
| 动态 | `DECLARE_DYNAMIC_*` | 可被蓝图绑定，序列化 |

```cpp linenums="1"
// 声明
DECLARE_DELEGATE_OneParam(FOnDamageDelegate, float);

// 使用
FOnDamageDelegate OnDamage;
OnDamage.BindUObject(this, &AMyActor::OnTakeDamage);  // 绑定 UObject 成员
OnDamage.BindLambda([](float D){ /* ... */ });
OnDamage.ExecuteIfBound(10.0f);
```

多播委托绑定后需在析构前 `RemoveAll` 解绑，避免悬垂引用。绑定 `UObject` 函数用 `BindUObject`（GC 安全），绑定普通 C++ 对象用 `BindRaw`（需自行保证生命周期）

## 9 编码规范与命名约定

Epic 有一套严格的命名前缀约定：

| 前缀 | 类型 |
| --- | --- |
| `U` | `UObject` 派生类（`UMyActor`） |
| `A` | `AActor` 派生类（`AMyActor`） |
| `S` | Slate UI 控件 |
| `T` | 模板类（`TArray`、`TMap`） |
| `F` | 普通结构体 / 类（`FVector`、`FString`） |
| `E` | 枚举（`ECollisionChannel`） |
| `I` | 接口类（`IInterface`） |
| `b` | 布尔变量前缀（`bIsDead`） |

其他约定：

- 头文件必须以 `#include "XXX.generated.h"` **作为最后一个 include**
- 优先包含 `<CoreMinimal.h>`
- 成员变量通常用 `CamelCase`，局部变量也可用；遵循 Epic 的 `Engine/Source/Programming/CodingStandard.md`

## 10 常见陷阱与最佳实践

1. **`UObject` 指针必须加 `UPROPERTY`**，否则可能被 GC 提前回收
2. **`.generated.h` 必须最后包含**，且每个参与反射的头文件都要有
3. **不要 `new`/`delete` `UObject`**：用 `NewObject<>` 创建，交给 GC 回收
4. **不要用 STL 容器承载 `UObject` 反射属性**：使用 `TArray` 等 UE 容器并加 `UPROPERTY`
5. **不要用 `TSharedPtr` 管理 `UObject`**：两套生命周期系统会互相冲突
6. **类型转换用 `Cast<>`**，而不是 C 风格转换或 `static_cast`，它基于反射，失败返回 `nullptr`
7. **字符串字面量用 `TEXT()`**，保证编码跨平台一致
8. **多播委托记得解绑**，避免访问已销毁对象
9. **避免在构造函数中调用蓝图/游戏逻辑**：构造函数只应做默认值初始化（UE 会在运行时多次构造 CDO）

```cpp linenums="1"
AMyActor* Actor = Cast<AMyActor>(SomeActor);
if (Actor)
{
    Actor->DoSomething();
}
```
