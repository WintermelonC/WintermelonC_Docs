# 字符串体系

UE 提供了一套多层次的字符串类型，每种都有明确用途：`FString` 是可变的通用字符串，`FName` 是不可变的哈希标识符，`FText` 是面向本地化的显示文本，`FStringView` 是零拷贝的只读视图。理解它们的分工是写好 UE C++ 的基础

## 1 字符串类型概览

| 类型 | 可变 | 用途 | 对应 STL |
| --- | --- | --- | --- |
| `FString` | 是 | 通用字符串 | `std::string` |
| `FName` | 否 | 标识符、资源名，哈希存储 | — |
| `FText` | 否 | 面向用户的本地化文本 | — |
| `FStringView` | 否 | 零拷贝只读视图 | `std::string_view` |
| `TCHAR` | — | 基础字符类型 | `char` / `wchar_t` |

## 2 TCHAR 与编码

`TCHAR` 是 UE 的跨平台字符类型，定义随平台不同：

| 平台 | `TCHAR` | 编码 |
| --- | --- | --- |
| Windows | `wchar_t`（2 字节） | UTF-16 |
| 其他平台 | `char` | UTF-8 |

字符串字面量要用 `TEXT()` 宏包裹，让编译器生成正确类型的字面量：

```cpp linenums="1"
const TCHAR* Str = TEXT("Hello UE5");   // 跨平台一致
```

UE5 默认源码编码为 UTF-8，需要显式转换编码时用专门的转换类：

```cpp linenums="1"
FTCHARToUTF8 Convert(TEXT("中文"));   // TCHAR → UTF-8
const char* Utf8 = Convert.Get();

FUTF8ToTCHAR ConvertBack(Utf8);       // UTF-8 → TCHAR
const TCHAR* Tchar = ConvertBack.Get();
```

## 3 FString

`FString` 是最常用的可变字符串，定义于 `Engine/Source/Runtime/Core/Public/Containers/UnrealString.h`：

```cpp linenums="1"
FString Str = TEXT("Hello");
Str += TEXT(" World");                        // 拼接
int32 Len = Str.Len();                        // 长度
bool bEmpty = Str.IsEmpty();                  // 是否为空
bool bContain = Str.Contains(TEXT("World"));  // 是否包含
```

常用操作：

| 操作 | 方法 |
| --- | --- |
| 拼接 | `+` / `Append` |
| 查找 | `Find` / `Contains` |
| 分割 | `Split` / `ParseIntoArray` |
| 大小写 | `ToUpper` / `ToLower` |
| 裁剪 | `TrimStartAndEnd` / `TrimStart` / `TrimEnd` |
| 替换 | `Replace` |
| 截取 | `Left` / `Right` / `Mid` / `LeftChop` / `RightChop` |
| 比较 | `==` / `Equals` |

### 3.1 格式化与解析

```cpp linenums="1"
FString S1 = FString::Printf(TEXT("HP: %d"), 100);                       // printf 风格
FString S2 = FString::Format(TEXT("{0} / {1}"), {TEXT("A"), TEXT("B")}); // 占位符风格
FString S3 = FString::FromInt(42);                                       // 数字转字符串
FString S4 = FString::SanitizeFloat(3.14159f);                           // 浮点转字符串

int32 N = FCString::Atoi(*S3);   // 字符串转数字
float F = FCString::Atof(*S4);   // 字符串转浮点
```

## 4 FName

`FName` 是不可变的标识符，定义于 `Engine/Source/Runtime/CoreUObject/Public/UObject/NameTypes.h`。它的核心特点是 **哈希驻留**：所有 `FName` 都存放在全局名字表（Name Pool）中，相同字符串只存一份

```cpp linenums="1"
FName Name1 = FName(TEXT("MyActor"));
FName Name2 = FName(TEXT("MyActor"));

bool bSame = (Name1 == Name2);   // true，比较的是表索引
```

FName 的特性：

| 特性 | 说明 |
| --- | --- |
| 不可变 | 创建后内容不能修改 |
| 大小写不敏感 | `"Actor"` 与 `"actor"` 视为同一个 |
| O(1) 比较 | 比较内部索引而非逐字符比较 |
| 可带数字后缀 | `GetNumber()` 解析尾部的数字 |

```cpp linenums="1"
FName N = FName(TEXT("Enemy_3"));
int32 Num = N.GetNumber();       // 3
FString S = N.ToString();        // FName → FString
```

!!! tip "什么时候用 FName"

    用于 **内部标识符**——对象名、资源名、属性名、Socket 名等需要频繁比较、不会改变的字符串。不用于面向用户的文本（交给 `FText`），也不用于需要拼接修改的字符串（交给 `FString`）

## 5 FText

`FText` 是面向用户的本地化文本，定义于 `Engine/Source/Runtime/Core/Public/Internationalization/Text.h`。它支持翻译表、复数规则与格式化，**只用于显示，不用于逻辑**

```cpp linenums="1"
FText Text1 = FText::FromString(TEXT("欢迎"));              // 运行时构造
FText Text2 = NSLOCTEXT("MyNamespace", "Key", "Hello");     // 本地化宏
FText Text3 = FText::Format(
    NSLOCTEXT("MyNamespace", "Format", "剩余 {0} 秒"),
    FText::AsNumber(5));                                    // 带占位符格式化
```

!!! question "本地化是什么意思"

    本地化（Localization，简称 L10n）指让同一套代码在不同语言环境下显示对应语言的文本。`NSLOCTEXT("MyNamespace", "Key", "Hello")` 里的 `"Hello"` 并不是最终显示的字符串，而是一个 **查找键**（Namespace + Key），运行时引擎会根据当前语言设置，从翻译表里查出对应语言的译文

    - `MyNamespace`：命名空间，用于把文本分组（按模块或功能）
    - `Key`：命名空间内的唯一标识
    - `"Hello"`：默认源文本，找不到翻译时兜底显示

    例如游戏支持中文时，键 `"Hello"` 在中文翻译表中对应"你好"，引擎在中文环境下自动显示"你好"，代码本身无需改动。对比之下，`FText::FromString(TEXT("欢迎"))` 是 **硬编码** 字符串，不会被翻译，只有 `NSLOCTEXT` 才是可本地化的正确做法

三种字符串之间的转换：

```cpp linenums="1"
FString S = Text.ToString();      // FText → FString（可能丢失本地化）
FText   T = FText::FromString(S); // FString → FText
FName   N = FName(*S);            // FString → FName
```

!!! warning "FText 不能直接参与逻辑运算"

    `FText` 没有 `==` 比较、不能拼接、不能排序，只用于展示。把 `FText` 当 `FString` 用会带来隐式的本地化查询开销与逻辑错误

## 6 FStringView

`FStringView` 是只读、非拥有的字符串视图，类似 `std::string_view`，定义于 `Engine/Source/Runtime/Core/Public/Containers/StringView.h`：

```cpp linenums="1"
FString Full = TEXT("Hello World");
FStringView View = Full;              // 零拷贝视图
FStringView Sub = View.Mid(6, 5);     // "World"，不复制数据

if (View.StartsWith(TEXT("Hello"))) { /* ... */ }
```

它的优势是 **零拷贝**：函数参数需要只读字符串时用它，避免不必要的 `FString` 拷贝

## 7 常见陷阱与最佳实践

- 字符串字面量用 `TEXT()` 包裹，保证跨平台编码一致
- **不要** 用 `std::string`，UE 反射与容器不认它，全部用 `FString`
- 标识符用 `FName`（O(1) 比较），显示文本用 `FText`，其余用 `FString`
- 需要只读参数时传 `FStringView` 或 `const FString&`，避免拷贝
- 不要拿 `FText` 做比较、拼接、排序等逻辑操作
- `FString` 到 `TCHAR*` 用 `*Str` 解引用（`FCString::Atoi(*Str)`）
- 编码转换用 `FTCHARToUTF8` / `FUTF8ToTCHAR` 等封装，不要手动转
