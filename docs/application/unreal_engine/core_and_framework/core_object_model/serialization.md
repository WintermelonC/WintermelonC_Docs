# 序列化

序列化（Serialization）是把对象状态转换为可存储或传输的字节流、并能反序列化恢复的过程。UE 的序列化以 `FArchive` 为统一抽象，驱动了存档、网络复制、对象复制、编辑器操作等大量子系统

## 1 序列化概览

UE 中序列化支撑的核心场景：

| 场景 | 说明 |
| --- | --- |
| 存档 / 读档 | `SaveGame`、关卡保存 |
| 网络复制 | 属性同步、RPC 参数 |
| 对象复制 | `DuplicateObject`、克隆 Actor |
| 编辑器 | 复制粘贴、撤销重做 |
| 资源烹饪 | 打包时剥离编辑器数据 |

所有这些场景共用同一套反射序列化机制：标记了 `UPROPERTY` 的成员由引擎自动读写

## 2 FArchive

`FArchive` 是序列化的抽象基类，定义于 `Engine/Source/Runtime/Core/Public/Serialization/Archive.h`：

```cpp linenums="1"
// FArchive（简化）
class FArchive
{
public:
    virtual void Serialize(void* Data, int64 Length) = 0;  // 读写原始字节
    virtual bool IsSaving() const { return false; }        // 是否保存
    virtual bool IsLoading() const { return false; }       // 是否加载

    FArchive& operator<<(int32& Value);     // 各类型重载
    FArchive& operator<<(FString& Value);
    FArchive& operator<<(FName& Value);
    FArchive& operator<<(UObject*& Value);  // 对象引用
};
```

读写通过 `operator<<` 完成，同一份代码根据 `IsSaving` / `IsLoading` 自动区分方向：

```cpp linenums="1"
int32 HP = 100;
FString Name = TEXT("Hero");

Ar << HP;        // 保存时写入，加载时读出
Ar << Name;
```

常用派生类：

| 派生类 | 用途 |
| --- | --- |
| `FMemoryWriter` / `FMemoryReader` | 内存缓冲区读写 |
| `FArchiveSaveCompressedProxy` | 压缩保存 |
| `FObjectAndNameAsStringProxyArchive` | 文本导出 |
| `FStructuredArchive` | 结构化（JSON）格式 |

## 3 UObject::Serialize 与 UPROPERTY

每个 `UObject` 都有虚函数 `Serialize(FArchive& Ar)`，默认实现会通过反射自动序列化所有 `UPROPERTY` 成员：

```cpp linenums="1"
// Object.h（简化）
class UObject
{
    // ...
    virtual void Serialize(FArchive& Ar);   // 序列化入口
};
```

重写它来手动序列化额外数据：

```cpp linenums="1"
void UMyObject::Serialize(FArchive& Ar)
{
    Super::Serialize(Ar);            // 先处理所有 UPROPERTY

    Ar << CustomData;                // 再手动读写额外数据
    Ar << bSomeFlag;
}
```

!!! warning "非 UPROPERTY 成员不会被自动序列化"

    只有 `UPROPERTY` 修饰的成员才参与自动序列化。裸成员、STL 容器不会被处理，需要自己在 `Serialize` 里手动 `Ar <<` 读写

## 4 自定义序列化与版本控制

### 4.1 对象引用

`operator<<(UObject*&)` 序列化的 **不是内存地址**，而是对象引用（路径 + 导入/导出表），因此存档跨会话、跨机器依然有效：

```cpp linenums="1"
UPROPERTY()
UTexture2D* Texture;

// 内部机制：保存时写入资源路径，加载时按路径解析
```

### 4.2 版本控制

存档需要向后兼容，UE 提供引擎版本与自定义版本：

```cpp linenums="1"
void UMyObject::Serialize(FArchive& Ar)
{
    Super::Serialize(Ar);

    // 引擎版本检查
    if (Ar.UEVer() >= VER_UE5_0)
    {
        Ar << NewField;
    }

    // 自定义版本（用 GUID 标识）
    if (Ar.CustomVer(FMyVersion::GUID) >= FMyVersion::AddedField)
    {
        Ar << AddedField;
    }
}
```

### 4.3 变长整数

小整数用变长编码节省空间：

```cpp linenums="1"
Ar.SerializeIntPacked(Count);   // 变长编码，小值占用更少字节
```

## 5 序列化的应用场景

### 5.1 存档 SaveGame

```cpp linenums="1"
// 保存
TArray<uint8> Data;
FMemoryWriter Writer(Data, true);
MyObject->Serialize(Writer);

// 读取
FMemoryReader Reader(Data, true);
MyObject->Serialize(Reader);
```

### 5.2 网络复制

属性同步与 RPC 参数同样走序列化，引擎对 `UPROPERTY(Replicated)` 自动编解码

### 5.3 对象复制

`DuplicateObject` 通过序列化克隆对象，`Transient` 与 `DuplicateTransient` 控制哪些成员被跳过

## 6 版本管理

| 机制 | 说明 |
| --- | --- |
| `Ar.UEVer()` | 引擎版本号，向后兼容检查 |
| `Ar.CustomVer(FGuid)` | 自定义版本，按 GUID 查询 |
| `FCustomVersionContainer` | 版本容器，随存档保存 |
| `Transient` | 标记成员不参与序列化 |

!!! tip "存档兼容策略"

    给数据加字段时，不要直接改变现有布局，而是用版本判断：旧存档读到旧版本就跳过新字段，新存档读到新版本就读新字段。这样老玩家的存档仍可正常加载

## 7 常见陷阱与最佳实践

- 只有 `UPROPERTY` 成员会被自动序列化，裸成员要手动 `Ar <<`
- 不需要保存的成员加 `UPROPERTY(Transient)`，临时数据不写进存档
- 序列化 `UObject*` 时序列化的是引用，不是地址，不要存裸地址
- 修改存档结构时用版本控制，保证向后兼容
- 序列化大量数据用 `FMemoryWriter` / `FMemoryReader`，避免频繁磁盘 IO
- 网络复制的成员加 `Replicated` / `ReplicatedUsing`
