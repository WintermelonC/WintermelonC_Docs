# 反射系统与 UHT

反射（Reflection）是 Unreal Engine 最核心的底层机制之一。它让程序在运行时能够查询并操作自身的类结构——知道一个类有哪些属性、哪些函数，甚至动态读写它们。标准 C++ 只提供非常有限的 RTTI（`typeid`、`dynamic_cast`），而 UE 通过 UHT 生成代码，构建了一套完整且强大的反射体系

## 1 什么是反射

反射是指程序在 **运行时** 能够查询和操作自身结构的能力。UE 反射与原生 C++ RTTI 的对比：

| 能力 | C++ RTTI | UE 反射 |
| --- | --- | --- |
| 获取类名 | `typeid(T).name()` | `GetClass()->GetName()` |
| 类型转换 | `dynamic_cast` | `Cast<>` |
| 遍历属性 | 不支持 | `TFieldIterator<FProperty>` |
| 按名查找成员 | 不支持 | `FindPropertyByName`、`FindFunction` |
| 序列化 | 需手写 | 引擎自动处理 |
| 跨语言暴露 | 不支持 | 可暴露给蓝图 |

反射是以下所有能力的 **基石**：

- 蓝图与 C++ 互操作
- 编辑器细节面板与属性定制
- 自动序列化（存档、网络复制）
- 垃圾回收的引用追踪

## 2 UHT：反射的生成器

UHT（Unreal Header Tool）是 Epic 自研的 **代码生成器**，在真正的 C++ 编译之前运行。它的输入是带反射宏的头文件，输出是 `.generated.h` 与 `.gen.cpp` 两个文件：

```text linenums="1"
源码头文件 MyClass.h
    │  包含 UCLASS / UPROPERTY / UFUNCTION / GENERATED_BODY
    ▼
UHT 解析（词法 + 语法分析，理解宏与类型）
    │
    ├──▶ MyClass.generated.h    声明（StaticClass、注册函数等）
    │
    └──▶ MyClass.gen.cpp        实现（反射数据构造、元信息注册）
             │
             ▼
       与源码一起编译，生成运行时反射数据
```

UHT 的工作流程大致为：

1. 扫描项目中所有包含 `#include "*.generated.h"` 的头文件
2. 解析 `UCLASS` / `USTRUCT` / `UENUM` / `UINTERFACE` 等宏及其说明符
3. 解析 `UPROPERTY` / `UFUNCTION` 及 `meta` 元数据
4. 为每个类生成静态反射注册代码
5. 生成错误报告（如 `UCLASS` 位置错误、缺少 `GENERATED_BODY` 等）

!!! tip "UHT 本质上是一个独立程序"

    UHT 作为独立可执行文件（`UnrealHeaderTool`）在构建早期由 Unreal Build Tool（UBT）调用，它与编辑器、游戏运行时代码解耦。它解析的其实是"带 UE 扩展语法的 C++ 头文件"，能理解 `UPROPERTY` 后面括号里的参数

## 3 反射宏与生成的代码

### 3.1 头文件中的写法

```cpp linenums="1"
// MyActor.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyActor.generated.h"   // 必须最后包含

UCLASS(Blueprintable)
class MYPROJECT_API AMyActor : public AActor
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
    float Health = 100.0f;

    UFUNCTION(BlueprintCallable, Category = "Stats")
    void TakeDamage(float Damage);
};
```

### 3.2 GENERATED_BODY 的作用

`GENERATED_BODY()` 是 UHT 生成代码的 **锚点**，它展开为一段宏，把 UHT 在 `.generated.h` 中为当前类准备的成员注入类体。简化后的等价声明大致如下：

```cpp linenums="1"
// GENERATED_BODY() 简化展开后的内容
public:
    static UClass* StaticClass();                                        // 获取 UClass
    virtual UClass* GetClass() const override;                           // 虚函数版
    static void StaticRegisterNativesAMyActor();                         // 注册 UFUNCTION
    static const TCHAR* GetConfigName();                                 // 配置支持
    virtual void AddReferencedObjects(FReferenceCollector& Collector) override; // GC 引用
```

!!! question "GENERATED_BODY 和 GENERATED_UCLASS_BODY 有什么区别"

    `GENERATED_UCLASS_BODY()` 是 UE4 早期宏，除了声明反射成员，还会生成一个带 `FObjectInitializer` 参数的构造函数声明。UE4 后期已统一推荐用 `GENERATED_BODY()`，构造函数自己手动声明即可

### 3.3 .gen.cpp 中的实现

UHT 为每个类生成 `StaticClass()` 与注册函数的实现。以 `StaticClass()` 为例，它通过 **懒加载** 方式构造 `UClass`：

```cpp linenums="1"
// MyActor.gen.cpp（简化）
UClass* Z_Construct_UClass_AMyActor();

UClass* AMyActor::StaticClass()
{
    static UClass* Class = nullptr;
    if (!Class)
    {
        Class = Z_Construct_UClass_AMyActor();  // 真正构建 UClass 及其反射数据
    }
    return Class;
}
```

`Z_Construct_UClass_AMyActor()` 内部会：

1. 创建 `UClass` 对象并设置父类
2. 注册所有 `FProperty` 与 `UFunction`
3. 关联 `ClassConstructor` 函数指针（指向真正调用 C++ 构造函数的 thunk）
4. 计算类标志与类型转换位掩码

!!! tip "反射数据是惰性构建的"

    反射数据并非引擎启动时一次性全部生成，而是在第一次访问 `StaticClass()` 时按需构建（通过 `FCompiledInDefer` 保证初始化顺序安全），从而降低启动开销

## 4 反射数据模型

反射信息在运行时以对象形式存在，其类型层次定义于 `Engine/Source/Runtime/CoreUObject/Public/UObject/Class.h`：

```text linenums="1"
UObject
└── UField                    // 所有反射字段的基类
    ├── UStruct               // 可包含字段与函数的"聚合体"
    │   ├── UClass            // 类的元信息（含父类链、ClassConstructor）
    │   ├── UScriptStruct     // USTRUCT 结构体元信息
    │   └── UFunction         // 函数元信息（含参数、返回值）
    ├── UEnum                 // 枚举元信息
    └── FProperty（UE5）      // 属性元信息（UE4 中为 UProperty）
```

`UStruct` 是核心容器，内部维护了一个 `FProperty` 链表：

```cpp linenums="1"
// Class.h（简化）
class UStruct : public UField
{
    // ...
    FProperty* ChildProperties;      // 属性链表头
    FField*    ChildPropertiesLast;  // 链表尾
    int32      PropertiesSize;       // 属性区总大小（用于拷贝 CDO 默认值）
};
```

### 4.1 属性类型体系

`FProperty` 是抽象基类，每种 C++ 类型对应一个派生类：

```text linenums="1"
FProperty
├── FBoolProperty          // bool
├── FByteProperty          // uint8 / TEnumAsByte
├── FNumericProperty       // 数值基类
│   ├── FIntProperty       // int32
│   ├── FInt64Property     // int64
│   ├── FFloatProperty     // float
│   └── FDoubleProperty    // double
├── FStrProperty           // FString
├── FNameProperty          // FName
├── FTextProperty          // FText
├── FArrayProperty         // TArray
├── FMapProperty           // TMap
├── FSetProperty           // TSet
├── FStructProperty        // USTRUCT 结构体
├── FObjectProperty        // UObject* 及派生（含软引用等）
├── FEnumProperty          // 枚举
└── FDelegateProperty      // 委托
```

每个 `FProperty` 都携带名字、偏移量、类型信息与 `meta` 元数据，使引擎能够 **在不知道具体类型的情况下** 读写任意对象的任意属性

### 4.2 类标志与类型转换加速

每个 `UClass` 持有一组 **类标志**（`EClassFlags`）与一个类型转换位掩码：

```cpp linenums="1"
// Class.h（简化）
class UClass : public UStruct
{
    // ...
    EClassFlags ClassFlags;          // CLASS_Abstract、CLASS_Interface 等
    uint32      ClassCastFlags;      // 用于加速 Cast<> 的位掩码
    UObject*    ClassDefaultObject;  // CDO 指针
};
```

!!! tip "Cast<> 为什么比 dynamic_cast 快"

    每个类在编译期被分配一个唯一的位（`ClassCastFlags`），并继承所有父类的位。`Cast<T>` 先做一次按位与（`ClassCastFlags & T::StaticClassCastFlags()`），绝大多数情况 O(1) 命中；只有涉及多继承等复杂情况时才回退到 `IsChildOf` 走父类链

## 5 反射的运行时应用

### 5.1 Cast<> 的实现原理

`Cast<>` 是 UE 类型转换的标准方式，基于反射而非 C++ RTTI：

```cpp linenums="1"
// Cast 简化实现
template<class T>
FORCEINLINE T* Cast(UObject* Src)
{
    return Src && Src->GetClass()->IsChildOf(T::StaticClass()) ? (T*)Src : nullptr;
}
```

### 5.2 遍历与按名访问

```cpp linenums="1"
// 遍历所有属性
for (TFieldIterator<FProperty> It(MyClass); It; ++It)
{
    FProperty* Prop = *It;
}

// 按名查找
FProperty* HealthProp = MyClass->FindPropertyByName(TEXT("Health"));
UFunction* Func      = MyClass->FindFunctionByName(TEXT("TakeDamage"));
```

### 5.3 动态读写属性

通过 `FProperty` 可以在不知道具体类型的情况下读写值，这是蓝图与编辑器操作 C++ 对象的底层机制：

```cpp linenums="1"
FProperty* Prop = MyClass->FindPropertyByName(TEXT("Health"));
if (Prop)
{
    float Value = 50.0f;
    Prop->SetValue_InContainer(MyObject, &Value);  // 写
    Prop->GetValue_InContainer(MyObject, &Value);  // 读
}
```

## 6 UPROPERTY 说明符

`UPROPERTY(...)` 的说明符控制属性在编辑器、蓝图、网络与 GC 中的行为：

| 说明符 | 作用 |
| --- | --- |
| `EditAnywhere` | 编辑器可编辑（含默认值面板） |
| `EditDefaultsOnly` | 仅在类默认值中可编辑 |
| `EditInstanceOnly` | 仅在实例中可编辑 |
| `VisibleAnywhere` | 只读显示 |
| `BlueprintReadOnly` | 蓝图只读 |
| `BlueprintReadWrite` | 蓝图可读写 |
| `Transient` | 不参与序列化 |
| `SaveGame` | 参与 `SaveGame` 存档 |
| `Replicated` | 网络复制 |
| `ReplicatedUsing` | 用指定函数处理复制回调 |
| `Instanced` | 编辑器中可实例化子对象 |
| `Category = "xxx"` | 在细节面板中分组 |
| `meta = (...)` | 附加元数据 |

```cpp linenums="1"
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats",
          meta = (ClampMin = "0.0", ClampMax = "100.0"))
float Health = 100.0f;
```

## 7 UFUNCTION 说明符

`UFUNCTION(...)` 的说明符决定函数如何暴露给蓝图、网络与命令行：

| 说明符 | 作用 |
| --- | --- |
| `BlueprintCallable` | 蓝图可调用 |
| `BlueprintPure` | 纯函数（无副作用，显示为绿色节点） |
| `BlueprintImplementableEvent` | 蓝图实现，C++ 只声明 |
| `BlueprintNativeEvent` | C++ 提供默认实现，蓝图可重写 |
| `Exec` | 可在控制台调用 |
| `CallInEditor` | 可在编辑器调用 |
| `Server` / `Client` / `NetMulticast` | RPC 网络执行端 |
| `Reliable` / `Unreliable` | RPC 可靠性 |
| `WithValidation` | 生成 RPC 校验函数 |

```cpp linenums="1"
UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Stats")
void TakeDamage(float Damage);          // 声明，配合 _Implementation

UFUNCTION(Server, Reliable, WithValidation)
void ServerFire();                      // 服务器 RPC
```

!!! tip "BlueprintNativeEvent 的命名约定"

    使用 `BlueprintNativeEvent` 时，C++ 实现函数名需要加 `_Implementation` 后缀（如 `TakeDamage_Implementation`），蓝图重写则不加。`BlueprintImplementableEvent` 则完全由蓝图实现，C++ 无默认实现

## 8 常见陷阱与最佳实践

- `.generated.h` 必须作为头文件 **最后一个** include，否则 UHT 或编译会报错
- 每个参与反射的类体里 **必须** 有 `GENERATED_BODY()`
- `UFUNCTION` / `UPROPERTY` 宏 **不能** 放在纯 `namespace` 的自由函数上，必须依附于反射类
- `UCLASS` / `USTRUCT` 宏与其类体之间 **不能** 有任何宏或注释阻断（UHT 需要紧邻解析）
- 修改头文件的反射宏后需重新构建，UHT 会重新生成 `.generated.h` / `.gen.cpp`
- 反射属性类型必须能被 UHT 解析，类型不完整或缺少 include 会导致 UHT 报"未识别类型"错误

!!! warning "不要在 UPROPERTY 里用裸 STL 容器"

    `UPROPERTY` 只能修饰 UE 支持反射的类型（`TArray`、`TMap`、`TSet`、`FString`、`UObject*`、`USTRUCT` 等）。`std::vector`、`std::string` 等 STL 类型无法被 UHT 解析，会直接编译报错
