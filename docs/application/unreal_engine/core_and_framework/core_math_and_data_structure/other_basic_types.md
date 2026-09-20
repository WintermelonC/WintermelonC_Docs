# 其他基础类型

除了向量、旋转与容器，UE 还提供了一批基础类型与工具类，覆盖时间、标识符、整数坐标、可选值等常见需求。这些类型统一使用 Epic 的命名与位宽约定，替代平台相关的原生类型

## 1 类型概览

| 类型 | 用途 |
| --- | --- |
| `int8` ~ `int64` / `uint8` ~ `uint64` | 明确位宽的整型 |
| `float` / `double` | 浮点 |
| `FDateTime` | 日期时间点 |
| `FTimespan` | 时间间隔 |
| `FGuid` | 全局唯一标识符 |
| `FIntPoint` / `FIntVector` | 整数坐标 |
| `FIntRect` | 整数矩形 |
| `FVector2D` | 二维向量 |
| `TOptional` | 可选值 |

## 2 整数与浮点类型

UE 用明确位宽的别名替代原生 `int` / `long`，保证跨平台一致：

| UE 类型 | 对应原生类型 | 字节 |
| --- | --- | --- |
| `int8` / `uint8` | `char` / `unsigned char` | 1 |
| `int16` / `uint16` | `short` / `unsigned short` | 2 |
| `int32` / `uint32` | `int` / `unsigned int` | 4 |
| `int64` / `uint64` | `long long` / `unsigned long long` | 8 |
| `float` | `float` | 4 |
| `double` | `double` | 8 |

```cpp linenums="1"
int32 Count = 10;
uint64 BigId = 1234567890123ULL;
float Speed = 10.0f;
```

!!! tip "为什么不用原生 int"

    `int` 的位宽在不同平台上可能不同，而游戏存档、网络同步要求确定的字节数。用 `int32` / `uint64` 等明确位宽的别名，跨平台行为一致，也便于序列化

## 3 FDateTime

`FDateTime` 表示日期时间点（年、月、日、时、分、秒、毫秒），定义于 `Engine/Source/Runtime/Core/Public/Misc/DateTime.h`：

```cpp linenums="1"
FDateTime Now = FDateTime::Now();         // 本地时间
FDateTime Utc = FDateTime::UtcNow();      // UTC 时间

FDateTime T(2026, 9, 20, 14, 30, 0);      // 年 月 日 时 分 秒
int32 Year = T.GetYear();
int32 Hour = T.GetHour();

FString S = T.ToString();                 // 格式化为字符串
```

与 Unix 时间戳互转：

```cpp linenums="1"
int64 Unix = T.ToUnixTimestamp();                    // 秒
FDateTime Back = FDateTime::FromUnixTimestamp(Unix);

int64 Ticks = T.GetTicks();                          // 100 纳秒刻度
```

## 4 FTimespan

`FTimespan` 表示一段时间间隔，定义于 `Engine/Source/Runtime/Core/Public/Misc/Timespan.h`：

```cpp linenums="1"
FTimespan Span = FTimespan::FromSeconds(90.5);
FTimespan Span2 = FTimespan(0, 1, 30, 0);    // 天 时 分 秒

double TotalSec = Span.GetTotalSeconds();
double TotalMs = Span.GetTotalMilliseconds();
FString S = Span.ToString();
```

`FDateTime` 与 `FTimespan` 可以配合运算：

```cpp linenums="1"
FDateTime Start = FDateTime::Now();
FDateTime End = Start + FTimespan::FromMinutes(5);   // 加时间
FTimespan Diff = End - Start;                        // 时间差
```

## 5 FGuid

`FGuid` 是 128 位的全局唯一标识符，定义于 `Engine/Source/Runtime/Core/Public/Misc/Guid.h`，常用于标识资源、插件、类型等：

```cpp linenums="1"
FGuid Guid = FGuid::NewGuid();                 // 生成新 GUID

FString S = Guid.ToString();                   // 转为字符串
FGuid Parsed;
bool bOk = FGuid::Parse(S, Parsed);            // 从字符串解析

bool bValid = Guid.IsValid();                  // 是否为非零 GUID
```

!!! tip "FGuid 的用途"

    `FGuid` 用于需要全局唯一标识的场景——资源 ID、插件 ID、会话 ID 等。它按位比较，可作 `TMap` 的键，并支持 `UPROPERTY` 序列化

## 6 整型点与矩形

### 6.1 FIntPoint 与 FIntVector

`FIntPoint` 是整数二维点，常用于屏幕坐标与网格位置，定义于 `Engine/Source/Runtime/Core/Public/Math/IntPoint.h`：

```cpp linenums="1"
FIntPoint Pt = FIntPoint(1920, 1080);
int32 X = Pt.X;
int32 Y = Pt.Y;

FIntVector Voxel = FIntVector(1, 2, 3);       // 整数三维
```

### 6.2 FIntRect

`FIntRect` 是整数矩形，定义于 `Engine/Source/Runtime/Core/Public/Math/IntRect.h`：

```cpp linenums="1"
FIntRect Rect = FIntRect(0, 0, 100, 50);
int32 W = Rect.Width();                       // 100
int32 H = Rect.Height();                      // 50
bool bContain = Rect.Contains(FIntPoint(10, 10));

FIntRect Clipped = Rect.Clip(OtherRect);      // 裁剪交集
```

### 6.3 FVector2D

`FVector2D` 是二维浮点向量，常用于 UI 与纹理坐标，定义于 `Engine/Source/Runtime/Core/Public/Math/Vector2D.h`：

```cpp linenums="1"
FVector2D UV = FVector2D(0.5, 0.5);
double Len = UV.Size();
FVector2D Norm = UV.GetSafeNormal();
```

## 7 TOptional

`TOptional` 表示"可能有、也可能没有"的值，类似 `std::optional`，定义于 `Engine/Source/Runtime/Core/Public/Misc/Optional.h`：

```cpp linenums="1"
TOptional<int32> Maybe;
if (!Maybe.IsSet()) { /* 无值 */ }

Maybe = 42;
int32 V = Maybe.GetValue();             // 取值
int32 D = Maybe.GetValueOrDefault();    // 取默认值
```

## 8 其他实用类型

### 8.1 FPlatformTime

获取程序运行时间，常用于性能测量：

```cpp linenums="1"
double StartSec = FPlatformTime::Seconds();   // 秒
uint64 StartCycles = FPlatformTime::Cycles(); // CPU 周期
```

### 8.2 FPlatformProcess

```cpp linenums="1"
FPlatformProcess::Sleep(0.5f);   // 休眠 0.5 秒
```

### 8.3 FInterval

表示区间：

```cpp linenums="1"
FInterval Interval(0.0f, 1.0f);   // [0, 1] 闭区间
bool bContain = Interval.Contains(0.5f);
```

## 9 常见陷阱与最佳实践

- 用 `int32` / `uint64` 等明确位宽类型，**不要** 用原生 `int` / `long`
- 时间戳存 `int64` Unix 秒数（`ToUnixTimestamp`），便于跨平台持久化
- 显示时间用 `FDateTime::ToString`，不要在游戏循环里反复构造字符串
- `FGuid` 是 128 位，序列化到网络/存档时注意字节顺序
- `TOptional` 访问前先 `IsSet()`，否则 `GetValue` 会断言
- 性能测量用 `FPlatformTime::Seconds` / `Cycles`，不要用 `FDateTime`
