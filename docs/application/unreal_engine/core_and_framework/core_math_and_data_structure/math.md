# 数学体系

UE 的数学库是游戏逻辑的地基，所有 3D 变换、碰撞、动画都建立在其上。核心类型包括向量 `FVector`、旋转 `FRotator`、四元数 `FQuat`、变换 `FTransform` 与矩阵 `FMatrix`，以及工具类 `FMath`

## 1 数学库概览

| 类型 | 用途 |
| --- | --- |
| `FVector` | 三维向量（位置、方向、速度） |
| `FRotator` | 欧拉角旋转（Pitch / Yaw / Roll） |
| `FQuat` | 四元数旋转 |
| `FTransform` | 平移 + 旋转 + 缩放 |
| `FMatrix` | 4×4 矩阵 |
| `FVector2D` | 二维向量（屏幕坐标） |
| `FColor` / `FLinearColor` | 颜色 |
| `FBox` / `FSphere` / `FPlane` | 几何形状 |
| `FMath` | 数学函数工具类 |

!!! tip "UE5 的坐标系与单位"

    UE 使用 **左手坐标系**（Z 轴向上），长度单位是 **厘米**（1 个 UU = 1 cm）。因此 `FVector(0, 0, 1)` 是向上，`FVector(1, 0, 0)` 是向前（X 轴）

## 2 FVector

`FVector` 表示三维向量，定义于 `Engine/Source/Runtime/Core/Public/Math/Vector.h`。UE5 中 `FVector` 使用 `double` 精度以支持大世界坐标（LWC），需要单精度时用 `FVector3f`：

```cpp linenums="1"
FVector Pos = FVector(100.0, 200.0, 300.0);
FVector Up  = FVector::UpVector;        // (0, 0, 1)
FVector Fwd = FVector::ForwardVector;   // (1, 0, 0)
FVector Right= FVector::RightVector;    // (0, 1, 0)
```

常用运算：

```cpp linenums="1"
FVector A = FVector(1, 0, 0);
FVector B = FVector(0, 1, 0);

FVector Sum = A + B;                 // 加减
FVector Scaled = A * 3.0;            // 数乘

double Dot = A | B;                  // 点积（0，垂直）
FVector Cross = A ^ B;               // 叉积（(0,0,1)）

double Len = A.Size();               // 长度
double LenSq = A.SizeSquared();      // 长度平方（更快）
FVector Norm = A.GetSafeNormal();    // 归一化（零向量安全）

double Dist = FVector::Dist(A, B);   // 两点距离
bool bNear = A.IsNearlyZero();       // 是否近似零向量
```

## 3 FRotator

`FRotator` 用欧拉角表示旋转，单位是 **度**，定义于 `Engine/Source/Runtime/Core/Public/Math/Rotator.h`：

```cpp linenums="1"
FRotator Rot = FRotator(30.0, 45.0, 0.0);   // (Pitch, Yaw, Roll)
double Pitch = Rot.Pitch;                   // 绕 Y 轴
double Yaw   = Rot.Yaw;                     // 绕 Z 轴
double Roll  = Rot.Roll;                    // 绕 X 轴

FVector Dir = Rot.Vector();                 // 该旋转对应的方向向量
FRotator Norm = Rot.GetNormalized();        // 归一化到 [-180, 180]
```

!!! warning "欧拉角与万向锁"

    `FRotator` 直观但在某些姿态下会发生万向锁（Gimbal Lock），插值也不平滑。做旋转插值或组合时，应转成 `FQuat` 运算，最后再转回 `FRotator`

!!! question "什么是万向锁"

    万向锁（Gimbal Lock）是欧拉角表示旋转的固有问题：当三个旋转轴中的中间那个轴转到 **±90 度** 时，第一个轴和第三个轴的旋转轴会重合，从而丢失一个自由度

    以 UE 为例，`FRotator` 按固定顺序绕三个轴旋转（Pitch 绕 Y 轴、Yaw 绕 Z 轴、Roll 绕 X 轴）。当 Pitch 转到 90 度时，Yaw 和 Roll 的旋转效果会"合并"到同一个平面——此时无论改 Yaw 还是改 Roll，得到的旋转都相同，物体无法独立绕某个方向转动

    直观例子：模拟飞机时，如果机头垂直朝上（Pitch = 90°），那么偏航（Yaw）和滚转（Roll）会变成同一个动作，飞机再也无法单独转向某个方向。四元数用四维量表示三维旋转，不存在这种轴重合问题，所以插值和平滑旋转都用它

## 4 FQuat 四元数

`FQuat` 用四元数表示旋转，定义于 `Engine/Source/Runtime/Core/Public/Math/Quat.h`。它避免了万向锁，插值平滑，是引擎内部旋转的标准表示：

```cpp linenums="1"
FRotator Rot = FRotator(0, 90, 0);
FQuat Quat = Rot.Quaternion();              // FRotator → FQuat
FRotator Back = Quat.Rotator();             // FQuat → FRotator

FVector V = FVector(1, 0, 0);
FVector Rotated = Quat.RotateVector(V);     // 旋转向量

FQuat From = FQuat::Identity;
FQuat To = FQuat(FVector(0, 0, 1), PI / 2); // 绕 Z 轴转 90 度
FQuat Mid = FQuat::Slerp(From, To, 0.5);    // 球面插值
```

!!! question "为什么引擎内部用 FQuat 而不是 FRotator"

    四元数没有万向锁、可以平滑插值（Slerp）、组合旋转更快更稳定，因此 `FTransform` 内部用 `FQuat` 存旋转。`FRotator` 主要用于与人交互（编辑器、蓝图）和输入

!!! question "四元数具体是如何表示旋转的"

    一个四元数 q = (x, y, z, w)，其中 x、y、z 是虚部，w 是实部。绕单位轴 u 旋转角度 θ 的旋转四元数为：

    `q = (u.x·sin(θ/2), u.y·sin(θ/2), u.z·sin(θ/2), cos(θ/2))`

    对向量 v 施加旋转时，把它看作纯四元数 (v, 0)，做 `v' = q · v · q⁻¹` 运算，其中 q⁻¹ 是 q 的共轭（虚部取反）。UE 的 `FQuat(Axis, AngleRad)` 构造器就是按这个公式计算的，`FQuat(X, Y, Z, W)` 则直接存四个分量。旋转四元数需模长为 1，且 q 与 -q 表示同一个旋转

## 5 FTransform

`FTransform` 组合了平移、旋转与缩放，定义于 `Engine/Source/Runtime/Core/Public/Math/Transform.h`：

```cpp linenums="1"
FTransform T;
T.SetLocation(FVector(100, 0, 0));              // 平移
T.SetRotation(FRotator(0, 90, 0).Quaternion()); // 旋转
T.SetScale3D(FVector(2, 2, 2));                 // 缩放

FVector P = T.TransformPosition(FVector(0, 0, 10));  // 变换点（含平移）
FVector V = T.TransformVector(FVector(1, 0, 0));     // 变换方向（不含平移）

FTransform Inv = T.Inverse();                   // 逆变换
FTransform Rel = A.GetRelativeTransform(B);     // A 相对 B 的变换
```

`TransformPosition` 与 `TransformVector` 的区别：

| 方法 | 应用平移 | 用途 |
| --- | --- | --- |
| `TransformPosition` | 是 | 变换点（位置） |
| `TransformVector` | 否 | 变换方向（向量） |

## 6 FMatrix

`FMatrix` 是 4×4 矩阵，定义于 `Engine/Source/Runtime/Core/Public/Math/Matrix.h`，主要用于渲染与投影：

```cpp linenums="1"
FMatrix M = FMatrix::Identity;
FVector V = M.TransformPosition(FVector(1, 0, 0));
```

游戏逻辑中优先用 `FTransform`，`FMatrix` 多用于底层渲染与批量变换

## 7 颜色体系

UE 提供两种颜色类型，定义于 `Engine/Source/Runtime/Core/Public/Math/Color.h`：

| 类型 | 精度 | 用途 |
| --- | --- | --- |
| `FColor` | 8 位（0-255） | 存储、纹理像素 |
| `FLinearColor` | 浮点（0-1） | 运算、光照、材质 |

```cpp linenums="1"
FColor Color = FColor::Red;
FLinearColor Linear = FLinearColor::Green;

FColor Back = Linear.ToFColor();       // FLinearColor → FColor
FLinearColor L2 = FLinearColor(Color); // FColor → FLinearColor
```

## 8 几何类型

```cpp linenums="1"
FBox Box(FVector(-100, -100, -100), FVector(100, 100, 100));  // AABB
bool bInside = Box.IsInside(FVector(0, 0, 0));
FVector Center = Box.GetCenter();
FVector Size = Box.GetSize();

FSphere Sphere(FVector(0, 0, 0), 50.0);                // 球
FRay Ray(FVector(0, 0, 0), FVector(1, 0, 0));          // 射线
```

## 9 FMath 工具类

`FMath` 是静态工具类，定义于 `Engine/Source/Runtime/Core/Public/Math/UnrealMathUtility.h`：

```cpp linenums="1"
float C = FMath::Clamp(1.5f, 0.0f, 1.0f);           // 钳制
float L = FMath::Lerp(0.0f, 10.0f, 0.5f);           // 线性插值
double A = FMath::Abs(-5.0);                        // 绝对值
double S = FMath::Sin(FMath::DegreesToRadians(90.0));
int32 F = FMath::FloorToInt(3.7f);                  // 取整
bool bEq = FMath::IsNearlyEqual(1.0f, 1.000001f);   // 近似比较
```

随机数：

```cpp linenums="1"
FRandomStream Rand(12345);          // 带种子
float R1 = Rand.FRand();            // [0, 1)
int32 R2 = Rand.RandRange(1, 10);   // [1, 10]
```

## 10 常见陷阱与最佳实践

- 长度单位是 **厘米**，别当成米
- 坐标系是 **左手系**、Z 轴向上，与常见数学教材（右手系）不同
- 旋转插值、组合用 `FQuat`，不要直接对 `FRotator` 的 Pitch/Yaw/Roll 分别插值
- `FVector` 是 `double` 精度，需要单精度时用 `FVector3f`，避免隐式转换与精度损失
- 比较浮点向量用 `IsNearlyEqual` / `IsNearlyZero`，不要用 `==`
- 归一化用 `GetSafeNormal()`，避免对零向量调用 `Normalize()` 产生 NaN
- `TransformVector` 不应用平移，变换位置时用 `TransformPosition`
