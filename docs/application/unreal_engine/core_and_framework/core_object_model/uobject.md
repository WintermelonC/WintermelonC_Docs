# UObject 体系

`UObject` 是 Unreal Engine 对象系统的 **根基**，所有参与引擎逻辑、需要被反射、垃圾回收或序列化的类，几乎都直接或间接继承自它

## 1 什么是 UObject

`UObject` 的核心价值可以概括为四点：

- **反射（Reflection）**：在运行时查询类的元信息（属性、函数、层级关系）
- **垃圾回收（GC）**：以标记-清扫算法自动管理对象生命周期
- **序列化（Serialization）**：支持存档、读盘、网络复制与内存镜像
- **编辑器集成**：在细节面板、蓝图编辑器、世界大纲中可视化编辑

与普通 C++ 类相比，`UObject` 的关键差异在于：

| 维度 | 普通 C++ 类 | `UObject` |
| --- | --- | --- |
| 内存管理 | 手动 `new`/`delete` 或智能指针 | 由 GC 统一回收 |
| 类型信息 | `typeid` / `dynamic_cast` | 反射系统 + `Cast<>` |
| 构造函数 | 直接调用 | 由引擎经 `ClassConstructor` 函数指针间接调用 |
| 序列化 | 需自行实现 | 引擎自动处理 `UPROPERTY` 成员 |
| 跨语言 | 不支持 | 可暴露给蓝图 |

## 2 类继承层次与源码结构

`UObject` 的定义位于 `Engine/Source/Runtime/CoreUObject/Public/UObject/Object.h`，其继承链为：

```text linenums="1"
UObjectBase
└── UObjectBaseUtility
    └── UObject
        ├── AActor
        ├── UActorComponent
        ├── UWorld
        └── ...
```

`UObjectBase` 是最底层、**不含虚函数** 的基类，只负责承载对象的四个核心字段：

```cpp linenums="1"
// Engine/Source/Runtime/CoreUObject/Public/UObject/Object.h
class COREUOBJECT_API UObjectBase
{
    // ...
protected:
    EObjectFlags  ObjectFlags;   // 对象标志位，如 RF_Standalone、RF_ClassDefaultObject
    int32         InternalIndex; // 在全局对象数组 GUObjectArray 中的索引
    UClass*       ClassPrivate;  // 指向所属 UClass（类元信息）
    FName         NamePrivate;   // 对象名（FName 哈希存储）
    UObject*      OuterPrivate;  // 外层对象（用于组织层级、包结构）
};
```

`UObjectBaseUtility` 在此基础上提供大量 **非虚辅助函数**（如 `GetOuter`、`GetName`、`IsA` 的封装），而 `UObject` 才是真正引入虚函数、参与反射与 GC 的类：

```cpp linenums="1"
class COREUOBJECT_API UObject : public UObjectBaseUtility
{
    GENERATED_BODY()
public:
    virtual ~UObject();

    UClass* GetClass() const;                 // 获取所属类
    UObject* GetOuter() const;                // 获取外层对象
    virtual UWorld* GetWorld() const;         // 获取所在世界

    virtual void BeginDestroy();              // 销毁流程第一步
    virtual void FinishDestroy();             // 销毁流程最后一步
    virtual bool IsReadyForFinishDestroy();   // 是否可完成销毁
    virtual void Serialize(FArchive& Ar);     // 序列化入口

    static void AddReferencedObjects(UObject* InThis, FReferenceCollector& Collector); // GC 引用收集
};
```

!!! tip "四个核心字段的作用"

    `ClassPrivate` 决定对象的"类型"，`OuterPrivate` 决定对象的"归属"，`NamePrivate` 提供稳定的标识，`InternalIndex` 则让 GC 能在全局数组中快速定位对象

## 3 UObject 的创建与初始化

`UObject` **不能** 直接 `new`，必须经由引擎的构造流程。创建入口是模板函数 `NewObject`：

```cpp linenums="1"
// Engine/Source/Runtime/CoreUObject/Public/UObject/UObjectGlobals.h
template<class T>
T* NewObject(UObject* Outer, const UClass* Class, FName Name = NAME_None,
             EObjectFlags Flags = RF_NoFlags, UObject* Template = nullptr, ...);
```

其内部调用链为：

```text linenums="1"
NewObject<T>()
└── StaticConstructObject_Internal()
    ├── StaticAllocateObject()      // 分配内存、注册到全局对象表
    └── ClassConstructor(...)       // 通过函数指针调用真正的构造函数
        └── FObjectInitializer 初始化
            └── PostInitProperties()
```

关键点：

- `StaticAllocateObject` 负责分配内存、设置 `ObjectFlags`、把对象登记进 `GUObjectArray`，并处理对象名冲突
- 真正的 C++ 构造函数由 UHT 生成的 `ClassConstructor` 函数指针 **间接调用**，而非直接 `new`
- `FObjectInitializer` 在构造期间收集 `CreateDefaultSubobject` 创建的子对象，供序列化时按名匹配

```cpp
// 组件类构造函数中的典型写法
UMyComponent::UMyComponent(const FObjectInitializer& ObjectInitializer)
    : Super(ObjectInitializer)
{
    Mesh = ObjectInitializer.CreateDefaultSubobject<UStaticMeshComponent>(this, TEXT("Mesh"));
}
```

!!! question "什么是 CDO（Class Default Object）"

    CDO 是每个 `UClass` 在类注册时创建的 **默认实例**，作为该类所有实例的原型（Archetype）。新对象初始化时会从 CDO 拷贝默认值，因此构造函数会在类加载时执行一次（构造 CDO），也会在每次 `NewObject` 时再执行。这就是"不要在构造函数里做游戏逻辑"的原因——它可能被执行多次

## 4 UObject 的销毁与生命周期

`UObject` 的销毁 **不是** 直接 `delete`，而是走一条可被 GC 打断的异步流程：

```text
ConditionalBeginDestroy()
└── BeginDestroy()                    // 标记 RF_BeginDestroyed，开始清理
    └── IsReadyForFinishDestroy()     // 询问是否可销毁（可异步等待）
        └── FinishDestroy()           // 标记 RF_FinishDestroyed，释放资源
```

- `MarkAsGarbage()`：主动把对象标记为垃圾，等待 GC 回收
- `ConditionalBeginDestroy()`：手动启动销毁流程（GC 也会调用它）
- `AddToRoot()` / `RemoveFromRoot()`：把对象加入根集，防止被回收

对象的状态由 `EObjectFlags` 中的 `RF_BeginDestroyed`、`RF_FinishDestroyed` 标志位跟踪：

```cpp linenums="1"
// Engine/Source/Runtime/CoreUObject/Public/UObject/ObjectMacros.h
enum EObjectFlags
{
    RF_NoFlags            = 0x00000000,
    RF_Standalone         = 0x00000002,  // 独立对象，包保存时单独序列化
    RF_ClassDefaultObject = 0x00000010,  // 是 CDO
    RF_ArchetypeObject    = 0x00000020,  // 是原型对象
    RF_Transient          = 0x00000040,  // 不参与存档
    RF_BeginDestroyed     = 0x00008000,
    RF_FinishDestroyed    = 0x00010000,
    // ...
};
```

## 5 反射系统：UClass 与属性

反射系统把 C++ 的编译期类型信息"镜像"为运行时可查询的对象。核心类型定义在 `Engine/Source/Runtime/CoreUObject/Public/UObject/Class.h`：

```text linenums="1"
UObject
└── UField                        // 反射系统的基类（字段）
    ├── UStruct                   // 结构体：UClass、UScriptStruct、UFunction 的基类
    │   ├── UClass                // 类的元信息
    │   ├── UScriptStruct         // USTRUCT 结构体的元信息
    │   └── UFunction             // 函数的元信息
    ├── UEnum                     // 枚举元信息
    └── FProperty（UE5）/ UProperty（UE4）  // 属性元信息
```

!!! tip "UE4 与 UE5 的属性类型差异"

    在 UE4 中属性是 `UProperty`（继承自 `UField`），而 UE5 将属性重构为 `FProperty`（不再继承 `UObject`，而是独立的内存结构），大幅降低了反射属性的内存开销

通过反射可以遍历类的所有属性：

```cpp linenums="1"
for (TFieldIterator<FProperty> It(GetClass()); It; ++It)
{
    FProperty* Prop = *It;
    UE_LOG(LogTemp, Log, TEXT("Property: %s"), *Prop->GetName());
}
```

每个参与反射的类都持有自己的 `UClass`，通过 `StaticClass()` 访问：

```cpp linenums="1"
UClass* ActorClass = AActor::StaticClass();
UClass* ObjClass   = MyObject->GetClass();      // 运行时获取实际类型
bool bIsActor      = MyObject->IsA<AActor>();   // 类型检查
```

## 6 垃圾回收（GC）

GC 的实现位于 `Engine/Source/Runtime/CoreUObject/Private/UObject/GarbageCollection.cpp`，入口函数是 `CollectGarbage`：

```cpp linenums="1"
// GarbageCollection.cpp
void CollectGarbage(EObjectFlags KeepFlags, bool bPerformFullPurge)
{
    // 1. 可达性分析（标记阶段）
    ReachabilityAnalysis(KeepFlags);

    // 2. 收集不可达对象
    GatherUnreachableObjects(bForceSingleThreaded);

    // 3. 解除哈希、清理引用
    UnhashUnreachableObjects(Unhashables);

    // 4. 销毁不可达对象
    PurgeGarbage(PurgeFlags);
}
```

标记阶段的核心是 **引用收集器** `FReferenceCollector`，它从根集出发，沿着引用关系遍历所有可达对象：

```cpp linenums="1"
// UObject 类中可供重写的引用收集入口
void AMyActor::AddReferencedObjects(UObject* InThis, FReferenceCollector& Collector)
{
    Super::AddReferencedObjects(InThis, Collector);
    Collector.AddReferencedObject(MyNonUPROPERTYObject); // 手动登记非 UPROPERTY 引用
}
```

!!! warning "最重要的 GC 规则"

    只有 `UPROPERTY` 修饰的 `UObject*` 成员才会被 GC **自动** 追踪。裸 `UObject*` 指针、`TArray<UObject*>` 中的指针如果不加 `UPROPERTY`，GC 不知道它们的存在，可能在对象仍被使用时将其回收。实在无法加 `UPROPERTY` 时，可重写 `AddReferencedObjects` 手动登记

## 7 序列化与网络复制

`UObject::Serialize(FArchive& Ar)` 是序列化的总入口，`FArchive` 是一套 **对称的读写流** 抽象：

| `FArchive` 派生类 | 用途 |
| --- | --- |
| `FMemoryWriter` / `FMemoryReader` | 内存缓冲区读写 |
| `FArchiveSaveCompressedProxy` | 压缩存档 |
| `FObjectAndNameAsStringProxyArchive` | 文本导出 |
| 网络通道 | 属性复制 |

序列化与反射紧密配合：标记了 `UPROPERTY` 的成员会被自动读写，而 `SaveConfig`/`LoadConfig`、存档系统、网络复制都建立在同一套反射序列化之上

```cpp linenums="1"
void UMyObject::Serialize(FArchive& Ar)
{
    Super::Serialize(Ar);   // 自动序列化所有 UPROPERTY 成员

    if (Ar.IsSaving())
    {
        Ar << MyCustomData; // 手动读写额外数据
    }
}
```

## 8 常用宏与说明符

| 宏 | 作用 |
| --- | --- |
| `UCLASS()` | 标记类参与反射，可加 `Blueprintable`、`Abstract`、`Within` 等说明符 |
| `USTRUCT()` | 标记结构体参与反射（不参与 GC，除非被 `UPROPERTY` 引用） |
| `UENUM()` | 标记枚举参与反射 |
| `UINTERFACE()` | 声明接口的 `UObject` 包装类 |
| `GENERATED_BODY()` | UHT 生成的样板代码，提供 `StaticClass`、反射声明 |
| `UPROPERTY()` | 标记成员变量，可加 `EditAnywhere`、`BlueprintReadWrite`、`Category` 等 |
| `UFUNCTION()` | 标记成员函数，可加 `BlueprintCallable`、`BlueprintPure`、`Server` 等 |

## 9 常见陷阱与最佳实践

- `UObject` 派生类 **不要** 用 `new`/`delete`，创建用 `NewObject`，销毁交给 GC 或 `ConditionalBeginDestroy`
- 裸 `UObject*` 成员 **必须** 加 `UPROPERTY`，否则可能被 GC 提前回收
- **不要** 用 `TSharedPtr` 管理 `UObject`，两套生命周期系统会互相冲突
- **不要** 在构造函数里做游戏逻辑，构造函数会在 CDO 创建时被执行多次
- 类型转换优先用 `Cast<>`（基于反射），失败返回 `nullptr`，比 `static_cast` 安全
- `.generated.h` 必须作为头文件 **最后一个** include
- `USTRUCT` 本身不参与 GC，持有 `UObject*` 时需配合 `UPROPERTY` 或手动引用

```cpp linenums="1"
if (AMyActor* Actor = Cast<AMyActor>(SomeActor))
{
    Actor->DoSomething();
}
```
