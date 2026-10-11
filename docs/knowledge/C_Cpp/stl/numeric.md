# 数值库

## 1 数学函数

C++ 的数学函数定义在 `<cmath>`（C++ 版本）中。这里的函数绝大多数来自 C 标准库的 `<math.h>`，C++11 起为它们提供了 **`float` / `double` / `long double` 三个重载版本**（后缀 `f`、无后缀、后缀 `l`），并补充了大量 C99 新增的数学函数

```cpp linenums="1"
#include <cmath>

double x = std::sqrt(2.0);        // double 版本
float  y = std::sqrt(2.0f);       // float 版本
long double z = std::sqrt(2.0L);  // long double 版本
```

!!! tip "为什么用 `<cmath>` 而不是 `<math.h>`"

    - `<cmath>`：函数保证位于 `std` 命名空间，C++ 推荐使用
    - `<math.h>`：函数位于全局命名空间（老式 C 风格）
    
    C++ 中应优先 `#include <cmath>` 并加 `std::` 前缀，避免命名冲突

| 类别 | 常用函数 |
|---|---|
| 指数对数 | `exp`、`exp2`、`expm1`、`log`、`log2`、`log10`、`log1p` |
| 幂与根 | `pow`、`sqrt`、`cbrt`、`hypot` |
| 三角 | `sin`、`cos`、`tan`、`asin`、`acos`、`atan`、`atan2` |
| 双曲 | `sinh`、`cosh`、`tanh`、`asinh`、`acosh`、`atanh` |
| 取整 | `ceil`、`floor`、`trunc`、`round`、`nearbyint`、`lround` |
| 余数 | `fmod`、`remainder`、`remquo` |
| 绝对值 | `abs`、`fabs`、`fdim` |
| 浮点操作 | `frexp`、`ldexp`、`modf`、`scalbn`、`copysign`、`fma` |
| 判断 | `isnan`、`isinf`、`isfinite`、`isnormal`、`signbit`、`fpclassify` |
| 常量（C++20） | `std::numbers::pi`、`e`、`phi`、`sqrt2`、`ln2` 等 |

### 1.1 指数与对数

| 函数 | 含义 | 数学表达 |
|---|---|---|
| `exp(x)` | 自然指数 | $e^x$ |
| `exp2(x)` | 2 的幂 | $2^x$ |
| `expm1(x)` | $e^x - 1$ | 小 $x$ 时精度更高 |
| `log(x)` | **自然对数** | $\ln x$ |
| `log2(x)` | 以 2 为底 | $\log_2 x$ |
| `log10(x)` | 以 10 为底 | $\log_{10} x$ |
| `log1p(x)` | $\ln(1+x)$ | 小 $x$ 时精度更高 |

```cpp linenums="1"
#include <cmath>
#include <iostream>

std::cout << std::exp(1.0);      // 2.71828（e）
std::cout << std::exp2(10);      // 1024
std::cout << std::log(std::exp(5.0));  // 5（ln 是 exp 的反函数）
std::cout << std::log2(1024);    // 10
std::cout << std::log10(1000);   // 3
std::cout << std::log1p(1e-16);  // 1e-16，比 log(1 + 1e-16) 精确
```

!!! question "`log1p` 和 `expm1` 为什么存在"

    当 $x$ 很小时，直接计算 `log(1 + x)` 会因 **浮点精度损失** 导致结果不准（`1 + 1e-16` 可能直接被舍入成 `1`，`log(1)` 就是 `0`）。`log1p` / `expm1` 内部用专门的高精度算法处理小量，避免这种 **灾难性抵消（Catastrophic Cancellation）**

!!! warning "`log` 是自然对数，不是以 10 为底"

    这是最常见的误解——C++ 中 `log(x)` 是 $\ln x$（自然对数），以 10 为底的是 `log10(x)`。没有直接以任意底数 $b$ 求对数的函数，需要自己换算：

    ```cpp linenums="1"
    // log_b(x) = ln(x) / ln(b)
    double logBase(double x, double b) {
        return std::log(x) / std::log(b);
    }
    ```

### 1.2 幂与开方

| 函数 | 含义 | 数学表达 |
|---|---|---|
| `pow(base, exp)` | 幂 | $base^{exp}$ |
| `sqrt(x)` | 平方根 | $\sqrt{x}$ |
| `cbrt(x)` | 立方根 | $\sqrt[3]{x}$ |
| `hypot(x, y)` | 直角三角形斜边 | $\sqrt{x^2+y^2}$ |

```cpp linenums="1"
std::cout << std::pow(2, 10);    // 1024（注意返回 double）
std::cout << std::sqrt(16.0);    // 4
std::cout << std::cbrt(27.0);    // 3（C++11）
std::cout << std::hypot(3, 4);   // 5
```

!!! tip "`hypot` 比手动算更安全"

    `sqrt(x*x + y*y)` 在 $x$、$y$ 很大时，`x*x` 可能 **溢出** 成 `inf`，即使结果本身在 `double` 范围内。`hypot` 内部做了缩放处理，能避免中间溢出；它还会做比朴素公式更高的精度处理

!!! warning "`pow` 的常见坑"

    - `pow(x, 2)` 通常比 `x * x` **慢**（`pow` 要处理任意实数指数），求平方直接用乘法
    - `pow` 的返回值 **永远是浮点**，即使参数都是整数：`pow(2, 3)` 得到 `8.0` 而非 `8`
    - 整数幂建议自己写快速幂，或至少用乘法

### 1.3 三角函数

!!! danger "所有三角函数都以弧度（radian）为单位"

    C++ 没有内置的角度（degree）版本。度弧度转换需要自己写：

    ```cpp linenums="1"
    constexpr double PI = 3.14159265358979323846;
    double toRadians(double deg) { return deg * PI / 180.0; }
    double toDegrees(double rad) { return rad * 180.0 / PI; }
    ```

| 函数 | 含义 | 定义域 | 值域 |
|---|---|---|---|
| `sin(x)` | 正弦 | $(-\infty, +\infty)$ | $[-1, 1]$ |
| `cos(x)` | 余弦 | $(-\infty, +\infty)$ | $[-1, 1]$ |
| `tan(x)` | 正切 | $x \ne \frac{\pi}{2} + k\pi$ | $(-\infty, +\infty)$ |
| `asin(x)` | 反正弦 | $[-1, 1]$ | $[-\frac{\pi}{2}, \frac{\pi}{2}]$ |
| `acos(x)` | 反余弦 | $[-1, 1]$ | $[0, \pi]$ |
| `atan(x)` | 反正切 | $(-\infty, +\infty)$ | $(-\frac{\pi}{2}, \frac{\pi}{2})$ |
| `atan2(y, x)` | 四象限反正切 | — | $(-\pi, \pi]$ |

```cpp linenums="1"
std::cout << std::sin(0.0);            // 0
std::cout << std::cos(0.0);            // 1
std::cout << std::tan(PI / 4);         // ≈ 1

std::cout << std::asin(1.0);           // π/2 ≈ 1.5708
std::cout << std::acos(1.0);           // 0
std::cout << std::atan(1.0);           // π/4 ≈ 0.7854
```

##### 1.3.1 `atan2`：四象限反正切

`atan(y / x)` 只能返回 $(-\frac{\pi}{2}, \frac{\pi}{2})$，无法区分"第一象限"和"第三象限"（因为 `y/x` 相同）。`atan2(y, x)` 接收两个参数，能正确判断 **整个圆周** 上的角度：

```cpp linenums="1"
std::cout << std::atan2(1, 1);     // π/4   （第一象限，45°）
std::cout << std::atan2(1, -1);    // 3π/4  （第二象限，135°）
std::cout << std::atan2(-1, -1);   // -3π/4 （第三象限，-135°）
std::cout << std::atan2(-1, 1);    // -π/4  （第四象限，-45°）

// 等价换算：
// atan2(y, x) 返回值范围 (-π, π]
```

!!! tip "`atan2` 的典型用途"

    - **求两点连线与 x 轴的夹角**：`atan2(dy, dx)`
    - **求向量朝向**：游戏里常用来计算角色面向角度
    - **直角坐标转极坐标**：`r = hypot(x, y)`，`theta = atan2(y, x)`

    ```cpp linenums="1"
    // 计算从 (x1,y1) 指向 (x2,y2) 的角度
    double angle = std::atan2(y2 - y1, x2 - x1);
    ```

### 1.4 双曲函数

| 函数 | 含义 | 数学表达 |
|---|---|---|
| `sinh(x)` | 双曲正弦 | $\frac{e^x - e^{-x}}{2}$ |
| `cosh(x)` | 双曲余弦 | $\frac{e^x + e^{-x}}{2}$ |
| `tanh(x)` | 双曲正切 | $\frac{e^x - e^{-x}}{e^x + e^{-x}}$ |
| `asinh(x)` | 反双曲正弦 | $\ln(x + \sqrt{x^2+1})$ |
| `acosh(x)` | 反双曲余弦 | 定义域 $x \ge 1$ |
| `atanh(x)` | 反双曲正切 | 定义域 $(-1, 1)$ |

```cpp linenums="1"
std::cout << std::tanh(0.0);     // 0
std::cout << std::tanh(1.0);     // ≈ 0.7616
std::cout << std::cosh(0.0);     // 1
```

!!! tip "双曲正切在神经网络中的应用"

    `tanh` 是经典的 **激活函数**，输出范围 $(-1, 1)$，常用于隐藏层。它的导数形式也很优雅：$\tanh'(x) = 1 - \tanh^2(x)$

### 1.5 取整函数

| 函数 | 含义 | 示例 |
|---|---|---|
| `ceil(x)` | 向上取整 | `ceil(2.1)` → 3 |
| `floor(x)` | 向下取整 | `floor(2.9)` → 2 |
| `trunc(x)` | 向零取整（截断） | `trunc(-2.9)` → -2 |
| `round(x)` | 四舍五入（远离零） | `round(2.5)` → 3 |
| `nearbyint(x)` | 按当前舍入模式取整 | 默认就近 |
| `rint(x)` | 类似 nearbyint，可能触发异常标志 | — |
| `lround(x)` / `llround(x)` | 四舍五入并返回 `long` / `long long` | `lround(2.5)` → 3L |

!!! question "`round` 的四舍五入是哪种"

    C++ 的 `round` 遵循 **四舍五入、远离零**（round half away from zero）：
    
    ```cpp linenums="1"
    std::round(2.5);    // 3
    std::round(-2.5);   // -3（远离零）
    std::round(2.4);    // 2
    std::round(-2.4);   // -2
    ```
    
    注意这和"银行家舍入（round half to even）"不同——`rint` / `nearbyint` 在默认模式下对 `.5` 采用 **就近偶数** 规则：
    
    ```cpp linenums="1"
    std::nearbyint(2.5);   // 2（就近偶数）
    std::nearbyint(3.5);   // 4（就近偶数）
    ```

```cpp linenums="1"
#include <cmath>
#include <iostream>

std::cout << std::ceil(2.1);    // 3
std::cout << std::floor(2.9);   // 2
std::cout << std::trunc(-2.9);  // -2（向零）
std::cout << std::round(-2.5);  // -3
std::cout << std::lround(2.5);  // 3（返回 long）
```

### 1.6 余数与差值

| 函数 | 含义 | 特点 |
|---|---|---|
| `fmod(x, y)` | 浮点取余 | 结果符号跟随 **被除数** $x$ |
| `remainder(x, y)` | IEEE 余数 | 结果符号跟随 **最近整数**，更符合数学定义 |
| `remquo(x, y, &q)` | 同时返回余数和商 | 商至少 3 位有效 |
| `fdim(x, y)` | 正差值 | $\max(x - y, 0)$，常用于距离计算 |

```cpp linenums="1"
std::cout << std::fmod(5.3, 2.0);        // 1.3
std::cout << std::remainder(5.3, 2.0);   // -0.7（就近取整后算差）

std::cout << std::fdim(5.0, 3.0);        // 2（5 - 3）
std::cout << std::fdim(3.0, 5.0);        // 0（负值截断为 0）
```

!!! tip "`fmod` vs `remainder`"

    - `fmod(5.3, 2)` = 1.3：余数 = $5.3 - 2 \times \text{trunc}(5.3/2) = 5.3 - 2 \times 2$
    - `remainder(5.3, 2)` = -0.7：余数 = $5.3 - 2 \times \text{round}(5.3/2) = 5.3 - 2 \times 3$
    
    `remainder` 的结果绝对值 **不超过** $|y|/2$，在数值算法中更常用

### 1.7 绝对值

| 函数 | 适用类型 | 头文件 |
|---|---|---|
| `std::abs(x)` | 整型 / 浮点（C++11 起统一） | `<cstdlib>` / `<cmath>` |
| `std::fabs(x)` | 仅浮点 | `<cmath>` |

```cpp linenums="1"
#include <cmath>
#include <cstdlib>
#include <iostream>

std::cout << std::abs(-5);        // 5（int，来自 <cstdlib>）
std::cout << std::abs(-5.3);      // 5.3（double，来自 <cmath>）
std::cout << std::fabs(-5.3);     // 5.3（浮点专用）
```

!!! warning "`abs` 的历史遗留问题"

    - 在 C 语言里，`abs` 只用于整数，浮点要用 `fabs`
    - C++11 用 `<cmath>` + `std::abs` 后，重载覆盖了浮点类型，可以统一用 `std::abs`
    - 但如果漏写 `std::` 或包含了错误的头文件，可能调用到 **只处理整数** 的 C 版本 `abs`，导致 `abs(-5.3)` 返回 `5`（被截断）。**始终写 `std::abs` 并包含 `<cmath>`**

### 1.8 浮点分解与组合

这些函数用于 **拆解和重组浮点数**，常见于数值库和底层实现：

| 函数 | 功能 |
|---|---|
| `frexp(x, &exp)` | 拆成 $x = m \times 2^{exp}$，其中 $m \in [0.5, 1)$ |
| `ldexp(m, exp)` | 反向组合：$m \times 2^{exp}$（是 `frexp` 的逆运算） |
| `modf(x, &intpart)` | 拆成整数部分和小数部分 |
| `scalbn(x, n)` | 计算 $x \times 2^n$（比 `ldexp` 更基础） |
| `ilogb(x)` | 提取浮点指数的整数部分 |
| `logb(x)` | 提取浮点指数（浮点形式） |
| `copysign(x, y)` | 把 `y` 的符号赋给 `x` 的绝对值 |

```cpp linenums="1"
// frexp / ldexp：拆解和重组浮点数
int exp;
double mantissa = std::frexp(8.0, &exp);
std::cout << mantissa << " * 2^" << exp;   // 0.5 * 2^4 = 8
std::cout << std::ldexp(mantissa, exp);    // 8（还原）

// modf：分离整数和小数部分
double intPart;
double fracPart = std::modf(3.75, &intPart);
std::cout << intPart << " + " << fracPart;  // 3 + 0.75

// copysign：借用符号
std::cout << std::copysign(3.0, -1.0);     // -3
```

### 1.9 浮点分类与判断

判断浮点数的 **特殊状态**（`NaN`、`inf`）时，绝不能直接用 `==`：

```cpp linenums="1"
double x = 0.0 / 0.0;   // NaN
// if (x == x) {}       // ✗ NaN 与任何值比较都是 false，包括自己！
```

正确的判断函数：

| 函数 | 作用 |
|---|---|
| `std::isnan(x)` | 是否是 NaN（Not a Number） |
| `std::isinf(x)` | 是否是无穷大 |
| `std::isfinite(x)` | 是否是有限值（非 NaN、非 inf） |
| `std::isnormal(x)` | 是否是规格化浮点数 |
| `std::signbit(x)` | 符号位是否为负（能区分 `-0.0`） |
| `std::fpclassify(x)` | 返回分类（`FP_NAN`/`FP_INFINITE`/`FP_NORMAL`/…） |

```cpp linenums="1"
#include <cmath>
#include <iostream>

double nan = std::nan("");
double inf = std::infinity();

std::cout << std::isnan(nan);      // true
std::cout << std::isinf(inf);      // true
std::cout << std::isfinite(1.0);   // true
std::cout << std::signbit(-0.0);   // true（-0.0 的符号位为负）
```

!!! tip "为什么不能用 `==` 判断 NaN"

    这是 IEEE 754 的规定：`NaN == NaN` 返回 `false`（NaN 不等于它自己）。所以判断 NaN 必须用 `isnan()`。同理，比较浮点数是否相等本身就危险，应该用"差值小于 epsilon"的方式：

    ```cpp linenums="1"
    bool almostEqual(double a, double b, double eps = 1e-9) {
        return std::fabs(a - b) < eps;
    }
    ```

### 1.10 融合乘加 `fma`（C++11）

```cpp linenums="1"
double r = std::fma(a, b, c);   // 计算 a*b + c，且只有一次舍入
```

- 数学上等价于 $a \times b + c$，但 **只有一次舍入**（普通写法会先算 `a*b` 再 `+c`，两次舍入）
- 硬件有 FMA 指令时（现代 CPU 普遍支持）速度更快、精度更高
- 数值计算密集型代码（如矩阵运算、物理仿真）值得使用

### 1.11 数学常量（C++20 `<numbers>`）

C++20 之前只能用 M_PI 宏（非标准）或自己定义。C++20 引入了 `<numbers>`：

```cpp linenums="1"
#include <numbers>

double pi = std::numbers::pi;              // π ≈ 3.14159
double e  = std::numbers::e;               // e ≈ 2.71828
double phi = std::numbers::phi;            // 黄金比 ≈ 1.61803
double sqrt2 = std::numbers::sqrt2;        // √2 ≈ 1.41421
double ln2 = std::numbers::ln2;            // ln(2) ≈ 0.69315
double ln10 = std::numbers::ln10;          // ln(10)
double log2e = std::numbers::log2e;        // log2(e)
double egamma = std::numbers::egamma;      // 欧拉-马歇罗尼常数
```

```cpp linenums="1"
// 每个常量都有 float / double / long double 版本
std::numbers::pi_v<float>;      // float 版本
std::numbers::pi;               // double 版本（默认）
std::numbers::pi_v<long double>;// long double 版本
```

!!! tip "C++20 之前的替代方案"

    ```cpp linenums="1"
    // 方案 1：非标准的 M_PI（需定义 _USE_MATH_DEFINES，可移植性差）
    #define _USE_MATH_DEFINES
    #include <cmath>
    double pi = M_PI;
    
    // 方案 2：自己定义（推荐，可移植）
    constexpr double PI = 3.14159265358979323846;
    
    // 方案 3：用 acos 算（不推荐，精度依赖实现）
    const double pi = std::acos(-1.0);
    ```

### 1.12 特殊数学函数（C++17）

C++17 新增了一批 **特殊函数**，用于科学计算：

| 类别 | 函数 |
|---|---|
| 贝塞尔函数 | `cyl_bessel_i`、`cyl_bessel_j`、`cyl_bessel_k`、`sph_bessel` |
| 勒让德多项式 | `legendre`、`assoc_legendre` |
| 拉盖尔多项式 | `laguerre`、`assoc_laguerre` |
| 埃尔米特多项式 | `hermite` |
| 其他 | `beta`、`riemann_zeta`、`comp_ellint_1/2/3`、`expint` |

```cpp linenums="1"
#include <cmath>

double z = std::riemann_zeta(2.0);   // π²/6 ≈ 1.6449
double b = std::beta(2.0, 3.0);      // B(2,3) = 1/12
double l = std::legendre(2, 0.5);    // 勒让德多项式 P₂(0.5)
```
