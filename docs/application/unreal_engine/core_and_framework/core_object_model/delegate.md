# 委托

委托（Delegate）是 UE 的事件与回调机制，可以理解为 **强类型、可绑定多个回调的 `std::function`**，它让对象之间能以解耦的方式通信——发送方只负责广播，不关心有哪些接收方

## 1 委托概览

UE 委托按"能否多播"与"能否被蓝图绑定"分为三类：

| 类型 | 宏前缀 | 多播 | 蓝图绑定 | 反射 |
| --- | --- | --- | --- | --- |
| 单播 | `DECLARE_DELEGATE` | 否 | 否 | 否 |
| 多播 | `DECLARE_MULTICAST_DELEGATE` | 是 | 否 | 否 |
| 动态 | `DECLARE_DYNAMIC_*` | 可选 | 是 | 是 |

核心定义位于 `Engine/Source/Runtime/Core/Public/Delegates/Delegate.h`

!!! question "委托和 std::function 有什么区别"

    `std::function` 只能存单个可调用对象，而 UE 委托支持多播广播、`FDelegateHandle` 按句柄移除、弱引用绑定（GC 安全）以及动态委托的蓝图互操作，是专门为游戏事件系统设计的更强封装

!!! question "一个文件声明的委托，其他文件能直接用吗"

    可以，但必须能看到声明。`DECLARE_DELEGATE` 宏展开后本质是 **声明了一个类型（类）**，遵循 C++ 普通的可见性规则：只要声明在头文件里，其他文件 `#include` 该头文件后即可直接使用；若声明在类内部（嵌套），则要用 `AMyActor::FOnCompleted` 这样的限定名访问。动态委托要能被 UHT 解析，因此同样建议声明在头文件中

    ```cpp linenums="1"
    // MyDelegates.h（全局作用域声明）
    DECLARE_DELEGATE_OneParam(FOnHealthChanged, float);
    
    // 其他文件里
    #include "MyDelegates.h"
    FOnHealthChanged OnHealthChanged;   // 直接用
    ```

## 2 单播委托

单播委托只绑定一个回调，用 `DECLARE_DELEGATE` 系列宏声明：

```cpp linenums="1"
DECLARE_DELEGATE(FOnCompleted);                       // 无参
DECLARE_DELEGATE_OneParam(FOnDamage, float);          // 一个参数
DECLARE_DELEGATE_TwoParams(FOnHit, AActor*, float);   // 两个参数
DECLARE_DELEGATE_RetVal(bool, FOnValidate);           // 带返回值
```

使用：

```cpp linenums="1"
FOnDamage OnDamage;
OnDamage.BindUObject(this, &AMyActor::OnTakeDamage);  // 绑定 UObject 成员函数
OnDamage.ExecuteIfBound(10.0f);                       // 有绑定才执行
```

单播委托每次绑定都会 **覆盖** 上一次的绑定：

```cpp linenums="1"
OnDamage.BindUObject(this, &AMyActor::OnTakeDamage);
OnDamage.BindLambda([](float D){ /* ... */ });   // 覆盖上一个
```

## 3 多播委托

多播委托可以同时绑定多个回调，用 `DECLARE_MULTICAST_DELEGATE` 系列宏声明：

```cpp linenums="1"
DECLARE_MULTICAST_DELEGATE(FOnAllDone);
DECLARE_MULTICAST_DELEGATE_OneParam(FOnHealthChanged, float);
```

使用 `Add` 系列绑定、`Broadcast` 广播：

```cpp linenums="1"
FOnHealthChanged OnHealthChanged;
OnHealthChanged.AddUObject(this, &AMyActor::HandleHealthChanged);
OnHealthChanged.AddLambda([](float H){ /* ... */ });
OnHealthChanged.Broadcast(100.0f);   // 依次触发所有绑定
```

通过 `FDelegateHandle` 可以移除指定的绑定：

```cpp linenums="1"
FDelegateHandle Handle = OnHealthChanged.AddUObject(this, &AMyActor::HandleHealthChanged);
OnHealthChanged.Remove(Handle);       // 按句柄移除
OnHealthChanged.RemoveAll();          // 全部移除
```

## 4 动态委托

动态委托用 `DECLARE_DYNAMIC_*` 声明，**必须** 经过反射，因此：

- 绑定的函数必须是 `UFUNCTION`
- 参数类型必须能被 UHT 解析
- 可以被蓝图绑定（`BlueprintAssignable`）

```cpp linenums="1"
// 动态多播
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnHealthChanged, float, NewHealth);

UCLASS()
class AMyActor : public AActor
{
    GENERATED_BODY()

public:
    UPROPERTY(BlueprintAssignable, Category = "Events")
    FOnHealthChanged OnHealthChanged;   // 蓝图可绑定此事件
};
```

C++ 侧用 `AddDynamic` / `Broadcast`：

```cpp linenums="1"
OnHealthChanged.AddDynamic(this, &AMyActor::HandleHealthChanged);  // 按名字反射绑定
OnHealthChanged.Broadcast(100.0f);
```

!!! tip "动态委托为什么慢"

    动态委托通过函数名做反射查找（`FindFunction`），再通过 `UFunction` 调用，比普通委托多一层间接开销，因此仅在需要蓝图绑定时使用

## 5 事件

事件（`DECLARE_EVENT`）是一种特殊的多播委托，**只有声明它的类** 可以调用 `Broadcast`：

```cpp linenums="1"
DECLARE_EVENT(AMyActor, FOnBeginOverlapEvent);

UCLASS()
class AMyActor : public AActor
{
    GENERATED_BODY()

public:
    FOnBeginOverlapEvent OnBeginOverlap;   // 外部只能 Add，只有 AMyActor 能 Broadcast
};
```

这样可以把"谁能广播、谁只能订阅"的权限约束在类型层面，避免误用

## 6 绑定方式详解

| 绑定方法 | 适用对象 | 说明 |
| --- | --- | --- |
| `BindUObject` | `UObject` 成员函数 | GC 安全，对象销毁后自动失效 |
| `BindRaw` | 裸指针成员函数 | 需自行保证生命周期 |
| `BindSP` | `TSharedPtr` 成员函数 | 共享指针保活 |
| `BindLambda` | lambda | 无状态或按值捕获 |
| `BindWeakLambda` | 持有弱引用 + lambda | 对象销毁后自动失效 |
| `BindStatic` | 静态/自由函数 | 无对象依赖 |
| `BindUFunction` | `UObject` + 函数名 | 反射按名绑定 |

```cpp linenums="1"
OnDone.BindUObject(this, &AMyActor::OnCompleted);   // UObject
OnDone.BindRaw(RawPtr, &FMyClass::OnCompleted);     // 裸指针
OnDone.BindSP(SharedPtr, &FMyClass::OnCompleted);   // 智能指针
OnDone.BindLambda([](){ /* ... */ });               // lambda
OnDone.BindStatic(&StaticFunction);                 // 静态函数
```

!!! warning "BindRaw 与 BindWeakLambda"

    `BindRaw` 绑定的裸对象若被销毁，回调会变成悬垂引用，务必保证生命周期。`BindWeakLambda` 则对 `UObject` 持有弱引用，对象销毁后回调自动失效，更安全

## 7 实现原理

委托底层由模板类实现，单播委托内部持有一个 **引用计数的绑定实例**：

```text linenums="1"
TBaseDelegate
└── 持有 IDelegateInstance（引用计数）
        └── 具体实现包装绑定的函数指针 / lambda / UFunction
```

多播委托则维护一组绑定实例，`FDelegateHandle` 是指向某个实例的句柄：

```text linenums="1"
TMulticastDelegate
└── TArray<IDelegateInstance*>
        ├── 实例 1  ── FDelegateHandle A
        ├── 实例 2  ── FDelegateHandle B
        └── ...
```

`Broadcast` 时依次遍历实例并调用；`Remove(Handle)` 按句柄删除对应实例

!!! question "单播委托内部的引用计数作用是什么"

    单播委托把绑定目标包装成一个堆上分配的 `IDelegateInstance`，引用计数就是用来管理这个实例生命周期的，作用有三点：一是支持廉价拷贝——拷贝委托只共享实例、计数加一，不复制绑定内容；二是自动释放——最后一个副本析构或重新绑定时计数归零，实例才被 `delete`，避免泄漏与双重释放；三是重新绑定——再次 `BindXxx` 会释放旧实例、创建新实例

    ```text linenums="1"
    FOnDamage A;                  // 空委托
    A.BindLambda(...);            // 创建实例（计数 = 1）
    FOnDamage B = A;              // 拷贝：共享实例（计数 = 2）
    A.BindUObject(...);           // 重新绑定：旧实例计数 -1
    ```
    
    !!! tip "引用计数 ≠ 绑定 UObject 的强引用"
    
        引用计数管理的是"绑定实例"这个包装对象本身；而 `BindUObject` 内部用 `TWeakObjectPtr` **弱持有** 该 `UObject`，不会阻止 GC。对象被回收后 `IsBound()` 返回 false、`ExecuteIfBound` 不再触发，这正是 `BindUObject` 比 `BindRaw` 安全的原因

## 8 常见陷阱与最佳实践

- 持有委托的对象析构前，多播委托要 `RemoveAll`，避免回调访问已销毁对象
- 绑定 `UObject` 成员函数优先用 `BindUObject` / `BindWeakLambda`，它们能感知对象销毁
- 绑定裸指针成员用 `BindRaw` 时，必须自己保证生命周期
- 动态委托的参数类型必须支持反射，`UFUNCTION` 才能被 `BindDynamic`
- 多播委托不保证调用顺序，不要依赖绑定先后
- 多播委托 **不要** 依赖返回值，只有最后一个返回值会被使用
