# 类型转换

C++ 中有多种类型转换方式：**隐式转换**、**C 风格转换**，以及 C++11 引入的 **四种命名转换运算符**（`static_cast`、`dynamic_cast`、`const_cast`、`reinterpret_cast`）。现代 C++ 强烈推荐使用后者，因为它们 **意图明确、更安全、更容易被搜索和审查**

| 转换 | 用途 | 运行期开销 | 安全性 |
|---|---|---|---|
| `static_cast` | 相关类型：数值、向上转型、`void*` | **无** | 编译期检查 |
| `dynamic_cast` | 多态向下转型 | **有**（RTTI 查询） | 安全（失败可检测） |
| `const_cast` | 增删 `const`/`volatile` | 无 | 危险（改真 const 是 UB） |
| `reinterpret_cast` | 位模式重解释 | 无 | **最危险** |

## 1 隐式类型转换（Implicit Conversion）

编译器在需要时 **自动** 进行的转换，无需显式写出

```cpp linenums="1"
int a = 10;
double b = a;          // ① int → double（整型转浮点）

char c = 'A';
int d = c;             // ② char → int（整型提升）

int e = 3;
int f = 2;
double g = e / f;      // ③ 注意：e/f 是整数除法得 1，再转成 1.0
double h = (double)e / f;   // ④ 先转 double，得 1.5

bool flag = 5;         // ⑤ int → bool（非 0 转 true）
```

常见陷阱：

```cpp linenums="1"
// 陷阱 1：有符号和无符号混用
unsigned int u = 10;
int i = -1;
if (i < u)   // ✗ 意外！i 会被转换成 unsigned，-1 变成巨大的正数
    std::cout << "i < u\n";   // 实际不会执行

// 陷阱 2：窄化转换（可能截断）
int x = 3.99;     // 3.99 → 3（截断，非四舍五入）

// 陷阱 3：整数除法
double r = 1 / 2;     // 结果是 0.0 而不是 0.5
```

## 2 C 风格强制转换

```cpp linenums="1"
int a = 10;
double b = (double)a;        // C 风格
int* p = (int*)0x12345678;   // 强制指针转换（危险）
```

**问题**：

1. **意图不明**：一个 `(Type)x` 可能是数值转换、也可能是危险的指针重解释，无法区分
2. **不安全**：几乎不检查，什么都能转
3. **难搜索**：代码里很难 grep 到所有 C 风格转换

**现代 C++ 应该完全避免 C 风格转换**，改用四种命名转换

## 3 `static_cast`：编译期检查的相关类型转换

最常用的转换，用于 **编译期就能确定合法** 的、类型相关的转换

适用场景：

```cpp linenums="1"
// ① 数值类型转换
double d = 3.14;
int i = static_cast<int>(d);      // 3

// ② 向上转型（派生类 → 基类），安全
Derived* pd = new Derived();
Base* pb = static_cast<Base*>(pd);   // 安全的向上转型

// ③ void* → T*（还原指针）
void* vp = &i;
int* pi = static_cast<int*>(vp);

// ④ 显式调用转换构造函数 / 转换运算符
std::string s = static_cast<std::string>("hello");
```

不能做的事：

```cpp linenums="1"
const int ci = 10;
// static_cast<int>(ci) 可以（拷贝值），但不能去掉 const 本身：
// int* p = static_cast<int*>(&ci);   // ✗ 编译错误！static_cast 不能移除 const

// 不相关类型的指针互转：
// char* cp = static_cast<char*>(pi);  // ✗ 编译错误（int* 和 char* 不相关）
```

!!! tip "static_cast 的本质"

    它在编译期做类型检查，运行期 **零开销**（不产生任何运行期检查代码）。能编译通过就说明转换在类型系统里是"合理"的

## 4 `dynamic_cast`：运行期检查的多态向下转型

专门用于 **多态类型**（含虚函数的类）的 **向下转型**（基类 → 派生类），在 **运行期** 检查转换是否安全

##### 4.1 指针版本：失败返回 `nullptr`

```cpp linenums="1"
class Base { public: virtual ~Base() {} };   // 必须有多态（虚函数）
class Derived : public Base {};
class Other : public Base {};

Base* pb = new Derived();

// 向下转型：运行期检查实际类型
Derived* pd = dynamic_cast<Derived*>(pb);   // ✓ 成功，pb 实际是 Derived
Other*   po = dynamic_cast<Other*>(pb);     // ✗ 失败，返回 nullptr

if (po == nullptr)
    std::cout << "pb 不是 Other 类型\n";
```

##### 4.2 引用版本：失败抛 `std::bad_cast`

```cpp linenums="1"
Base& rb = *pb;
try {
    Other& ro = dynamic_cast<Other&>(rb);   // 失败抛异常
} catch (const std::bad_cast& e) {
    std::cout << "转换失败：" << e.what() << '\n';
}
```

关键点：

| 要点 | 说明 |
|---|---|
| 前提 | 类必须有 **虚函数**（多态类型），否则编译错误 |
| 开销 | **有运行期开销**（依赖 RTTI 查 vtable 里的 type_info） |
| 失败行为 | 指针返回 `nullptr`；引用抛 `std::bad_cast` |
| 安全性 | 安全——失败不会得到错误类型的指针 |

## 5 `const_cast`：移除或添加 const

唯一能"去掉 const/volatile"的转换，**只能用于 const 修饰的增删**，不能做类型改变

```cpp linenums="1"
const int ci = 10;
const int* cpi = &ci;

// 去掉 const：让指针可以修改
int* pi = const_cast<int*>(cpi);
*pi = 20;   // 编译通过，但是……
```

!!! danger "危险：修改真正的 const 对象是未定义行为"

    ```cpp linenums="1"
    const int ci = 10;                 // ci 本身是 const
    int* pi = const_cast<int*>(&ci);
    *pi = 20;                          // ✗ 未定义行为！ci 可能被编译器放进只读段
    ```
    
    如果原对象 **真的** 是 const（如上），修改它会导致崩溃或不可预期结果。`const_cast` 主要用 于**接口兼容**——比如某个旧 API 没写 const，但你知道它实际上不会修改数据

合理用法示例：

```cpp linenums="1"
// 旧库函数没加 const，但实际不修改
void legacyPrint(char* str);   // 旧 API

const char* msg = "hello";
legacyPrint(const_cast<char*>(msg));   // 我们保证 legacyPrint 不会改它
```

## 6 `reinterpret_cast`：重新解释位模式（最危险）

把一段内存 **按另一种类型重新解释**，不做任何检查，是四种转换中最危险的

```cpp linenums="1"
// ① 指针和整数互转
int x = 42;
int* px = &x;
long addr = reinterpret_cast<long>(px);   // 指针 → 整数（地址值）
int* py = reinterpret_cast<int*>(addr);   // 整数 → 指针

// ② 不相关类型的指针互转（重新解释）
float f = 3.14f;
int bits = *reinterpret_cast<int*>(&f);   // 按 int 解释 float 的二进制位

// ③ 函数指针互转
void (*fp)() = reinterpret_cast<void(*)()>(&someFunc);
```

!!! danger "reinterpret_cast 的风险"

    - 几乎不检查，**结果高度依赖平台**（大小端、指针大小、对齐）
    - 违反 **严格别名规则（Strict Aliasing）** 会引发未定义行为
    - 只在底层代码（序列化、内存操作、硬件接口）使用，普通业务代码 **永远不该出现它**
