# 智能指针

UE 的智能指针用于管理 **非 `UObject`** 的普通 C++ 对象，与 STL 智能指针一一对应，但在线程安全、性能与对象生命周期控制上有自己的一套设计

## 1 智能指针概览

UE 提供了四类智能指针，定位与 STL 对应关系如下：

| 类型 | 对应 STL | 所有权 | 可空 |
| --- | --- | --- | --- |
| `TSharedPtr` | `std::shared_ptr` | 共享 | 是 |
| `TSharedRef` | — | 共享 | 否（保证非空） |
| `TWeakPtr` | `std::weak_ptr` | 弱引用 | 是 |
| `TUniquePtr` | `std::unique_ptr` | 独占 | 是 |

核心定义位于 `Engine/Source/Runtime/Core/Public/Templates/SharedPointer.h` 与 `UniquePtr.h`

!!! warning "只用于非 UObject 对象"

    智能指针只能管理普通 C++ 对象（`F` 开头类、结构体等）。`UObject` 派生对象由 GC 管理，**不要** 用 `TSharedPtr` 去包，否则两套生命周期系统会互相冲突

## 2 TSharedPtr 与 TSharedRef

`TSharedPtr` 是最常用的共享所有权指针，多个 `TSharedPtr` 可以指向同一对象，引用计数归零时自动析构：

```cpp linenums="1"
TSharedPtr<FMyData> Ptr1 = MakeShared<FMyData>();    // 创建
TSharedPtr<FMyData> Ptr2 = Ptr1;                     // 拷贝，计数 +1
Ptr1.Reset();                                        // 释放自己的引用
```

`TSharedRef` 与 `TSharedPtr` 本质相同，但 **保证非空**，因此访问时无需判空：

```cpp linenums="1"
TSharedRef<FMyData> Ref = MakeShared<FMyData>();     // 创建即非空
Ref->DoSomething();                                  // 无需判空

TSharedPtr<FMyData> Ptr = Ref;                       // TSharedRef → TSharedPtr 隐式转换
TSharedRef<FMyData> Ref2 = Ptr.ToSharedRef();        // 必须保证 Ptr 非空
```

创建方式总结：

| 方式 | 说明 |
| --- | --- |
| `MakeShared<T>()` | 分配对象 + 控制块，返回 `TSharedRef`，推荐 |
| `MakeShareable(RawPtr)` | 接管已存在的裸指针 |
| `StaticCastSharedRef` / `ConstCastSharedRef` | 智能指针间的类型转换 |

## 3 TWeakPtr

`TWeakPtr` 是弱引用，**不增加** 引用计数，用于观察对象而不影响其生命周期，最常见的用途是 **打破循环引用**：

```cpp linenums="1"
TSharedPtr<FMyData> Data = MakeShared<FMyData>();
TWeakPtr<FMyData> Weak = Data;                // 不增加计数

if (TSharedPtr<FMyData> Pinned = Weak.Pin())  // 对象还活着则"提升"为强引用
{
    Pinned->DoSomething();
}
```

!!! tip "循环引用问题"

    两个对象互相用 `TSharedPtr` 持有对方，引用计数永远不为零，谁都无法释放，造成内存泄漏。把其中一方换成 `TWeakPtr` 即可打破这个环

## 4 TUniquePtr

`TUniquePtr` 是独占所有权指针，不可拷贝、只能移动，语义与 `std::unique_ptr` 一致：

```cpp linenums="1"
TUniquePtr<FMyData> Uniq = MakeUnique<FMyData>();

TUniquePtr<FMyData> Other = MoveTemp(Uniq);   // 移动所有权，Uniq 变为空

FMyData* Raw = Uniq.Release();                // 放弃所有权，返回裸指针
Uniq.Reset();                                 // 销毁对象
```

## 5 线程安全与引用计数

UE 智能指针通过 `ESPMode` 模板参数控制引用计数的线程安全级别：

| 模式 | 引用计数实现 | 适用场景 |
| --- | --- | --- |
| `ESPMode::ThreadSafe` | 原子操作（`FThreadSafeCounter`） | 默认，跨线程使用 |
| `ESPMode::NotThreadSafe` | 普通 `int32` | 单线程，零原子开销 |

```cpp linenums="1"
// 默认线程安全
TSharedPtr<FMyData> A = MakeShared<FMyData>();

// 明确指定非线程安全（性能更优，仅限单线程）
TSharedPtr<FMyData, ESPMode::NotThreadSafe> B = MakeShared<FMyData, ESPMode::NotThreadSafe>();
```

## 6 智能指针的实现原理

### 6.1 控制块

`TSharedPtr` 只存两样东西：对象指针与指向 **控制块** 的引用控制器。控制块独立于对象存放引用计数与自定义删除器：

```cpp linenums="1"
// SharedPointerInternals.h（简化）
template<class ObjectType>
class TReferenceControllerWithDeleter : public TReferenceControllerBase
{
    int32 SharedReferenceCount;   // 强引用计数
    int32 WeakReferenceCount;     // 弱引用计数
    DeleterType Deleter;          // 自定义删除器
};
```

所有拷贝同一对象的 `TSharedPtr` 共享同一个控制块，拷贝时只增减计数，不复制对象：

```text linenums="1"
TSharedPtr A ──▶ 对象
      │
      └──▶ 控制块（强引用计数 = 2，弱引用计数 = 1）
TSharedPtr B ──▶ 对象（同一份）
      │
      └──▶ 控制块（同一份）
```

### 6.2 引用计数类型

线程安全模式下，引用计数用 `FThreadSafeCounter`（基于原子操作）；非线程安全模式下直接用 `int32`，避免原子开销：

```cpp linenums="1"
// 线程安全
FThreadSafeCounter SharedReferenceCount;

// 非线程安全
int32 SharedReferenceCount;
```

## 7 TSharedFromThis

若对象内部需要从 `this` 获得指向自己的 `TSharedPtr`，让类继承 `TSharedFromThis<T>`：

```cpp linenums="1"
class FMyClass : public TSharedFromThis<FMyClass>
{
public:
    TSharedRef<FMyClass> AsShared()
    {
        return SharedThis(this);   // 返回指向自己的共享引用
    }
};
```

!!! warning "必须先被 TSharedPtr 持有"

    调用 `SharedThis(this)` 前，对象 **必须** 已经由某个 `TSharedPtr` 持有（通过 `MakeShared` 创建）。如果对象还在栈上或由裸指针持有，会触发断言

## 8 UObject 相关指针

`UObject` 有自己的一套指针体系，与本节智能指针 **不可混用**：

| 类型 | 强弱 | 用途 |
| --- | --- | --- |
| `TWeakObjectPtr<T>` | 弱 | 观察 `UObject`，可感知 GC 回收，`IsValid()` 判断 |
| `TStrongObjectPtr<T>` | 强 | 强持有 `UObject`，防止被 GC 回收 |
| `TSoftObjectPtr<T>` | 软 | 按路径引用资产，按需加载 |

```cpp linenums="1"
TWeakObjectPtr<AActor> WeakActor = SomeActor;
if (WeakActor.IsValid())
{
    AActor* A = WeakActor.Get();
}

TStrongObjectPtr<UTexture2D> StrongTex(LoadedTexture);  // 保活
```

!!! question "TWeakPtr 和 TWeakObjectPtr 有什么区别"

    `TWeakPtr` 用于普通 C++ 对象，观察的是引用计数；`TWeakObjectPtr` 用于 `UObject`，观察的是 GC 状态（基于全局对象表的索引 + 序列号）。两者机制完全不同，不能互换

## 9 常见陷阱与最佳实践

- **不要** 用 `TSharedPtr` 管理 `UObject`，`UObject` 交给 GC
- 优先用 `MakeShared` / `MakeUnique` 创建，而不是先 `new` 再包装
- 打破循环引用时，把其中一方的 `TSharedPtr` 换成 `TWeakPtr`
- `TSharedRef` 保证非空，逻辑上不可能为空时优先用它，省去判空
- `TUniquePtr` 转移所有权用 `MoveTemp`，不要尝试拷贝
- `TSharedFromThis` 的对象 **必须** 先被 `TSharedPtr` 持有再调 `SharedThis`
- 跨线程共享对象用默认的 `ThreadSafe` 模式，纯单线程才用 `NotThreadSafe` 优化
