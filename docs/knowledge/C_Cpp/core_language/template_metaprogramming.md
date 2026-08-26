# Template Metaprogramming

模板元编程（TMP，Template Metaprogramming）是 **利用模板在编译期进行计算** 的技术。它把编译器当成一个"解释器"，让程序的一部分逻辑在编译阶段就执行完毕，而不是等到运行期

- 普通程序：代码 → 编译 → **运行时** 计算
- 元编程：代码 → **编译时** 计算（模板展开）→ 运行时代码里只留下结果

一个最经典的例子——**编译期计算阶乘**：

```cpp linenums="1"
// 递归模板：N! = N * (N-1)!
template <int N>
struct Factorial {
    static const int value = N * Factorial<N - 1>::value;
};

// 特化：递归终止条件（0! = 1）
template <>
struct Factorial<0> {
    static const int value = 1;
};

int main() {
    int x = Factorial<5>::value;   // 120
    // 编译器在编译期就展开为字面量 120，运行时零开销
}
```

这段代码揭示了 TMP 的 **三大支柱**：

| 机制 | 作用 | 类比 |
|---|---|---|
| **递归模板** | 循环/递归 | 函数的递归调用 |
| **模板特化** | 终止条件/分支 | `if` 语句 |
| **模板参数** | 输入 | 函数参数 |

> 有趣的历史：模板的图灵完备性是 1994 年 Erwin Unruh 意外发现的——他写了一个在 **编译错误信息里打印素数** 的程序，证明模板能在编译期完成任意计算

## 1 值计算：整型与枚举

模板元编程主要处理两类"值"：**整型常量** 和 **类型**

### 1.1 用 `static const` 或 `enum` 承载结果

```cpp linenums="1"
template <int N>
struct Fibonacci {
    // enum 是早期做法（不占内存，且旧编译器支持好）
    enum { value = Fibonacci<N - 1>::value + Fibonacci<N - 2>::value };
};

template <>
struct Fibonacci<0> { enum { value = 0 }; };

template <>
struct Fibonacci<1> { enum { value = 1 }; };

int x = Fibonacci<10>::value;   // 55
```

### 1.2 现代写法：继承 `std::integral_constant`

```cpp linenums="1"
#include <type_traits>

template <int N>
struct Factorial : std::integral_constant<int, N * Factorial<N - 1>::value> {};

template <>
struct Factorial<0> : std::integral_constant<int, 1> {};

// std::integral_constant<int, V> 自带：
//   static constexpr int value = V;
//   operator int()  → 可隐式转换
//   operator()      → 可像函数一样调用
```

## 2 类型计算：Type Traits

元编程不只算数字，更常 **操纵类型**——在编译期"传入类型、产出类型"：

```cpp linenums="1"
// 移除 const：通用版本原样返回
template <typename T>
struct RemoveConst {
    using type = T;
};

// 特化：匹配 const T，去掉 const
template <typename T>
struct RemoveConst<const T> {
    using type = T;
};

RemoveConst<const int>::type  x;   // x 是 int
RemoveConst<double>::type     y;  // y 是 double
```

标准库 `<type_traits>` 提供了大量现成的类型运算：

| Trait | 作用 |
|---|---|
| `std::remove_const<T>` / `remove_reference<T>` | 移除 const / 引用 |
| `std::decay<T>` | 类型退化（数组→指针、函数→函数指针等） |
| `std::conditional<B, T, F>` | 编译期 `if`：B 为真取 T，否则取 F |
| `std::is_integral<T>` / `is_pointer<T>` | 类型判断，产出 `true_type`/`false_type` |
| `std::enable_if<B, T>` | 条件启用重载（见下） |

```cpp linenums="1"
std::conditional<true, int, double>::type a;    // int
std::conditional<false, int, double>::type b;   // double
```

## 3 SFINAE：替换失败不是错误

**SFINAE**（Substitution Failure Is Not An Error）是模板元编程最重要的规则之一：

> 模板参数推导过程中，如果某个候选模板的"替换"失败了，编译器 **不会报错**，而是静默地把它从候选集里移除，继续尝试其他候选

这让我们能 **在编译期根据类型特性选择不同的重载**：

```cpp linenums="1"
// 仅当 T 是整型时，这个重载才参与匹配
template <typename T>
typename std::enable_if<std::is_integral<T>::value, T>::type
add(T a, T b) { return a + b; }     // 整型：直接加

// 仅当 T 是浮点型时参与匹配
template <typename T>
typename std::enable_if<std::is_floating_point<T>::value, T>::type
add(T a, T b) { return a + b + 0.5; }  // 浮点：额外逻辑

add(1, 2);     // 调用整型版本
add(1.0, 2.0); // 调用浮点版本
```

### 3.1 `std::enable_if` 的几种用法

```cpp linenums="1"
// ① 用作返回类型
template <typename T>
typename std::enable_if<std::is_integral<T>::value, void>::type
f(T t) { /* ... */ }

// ② 用作额外的模板参数（默认参数）
template <typename T,
          typename std::enable_if<std::is_integral<T>::value, int>::type = 0>
void f(T t) { /* ... */ }

// ③ C++14 起可用 _t 后缀简化
template <typename T>
std::enable_if_t<std::is_integral_v<T>, void> f(T t) { /* ... */ }
```

## 4 变参模板：处理任意多个参数

C++11 的变参模板让元编程可以 **递归地拆解参数包**：

```cpp linenums="1"
// 递归出口：没有参数
void printAll() {}

// 打印第一个参数，再递归处理剩余
template <typename T, typename... Args>
void printAll(T first, Args... rest) {
    std::cout << first << ' ';
    printAll(rest...);
}

printAll(1, 2.5, "hello", 'c');   // 1 2.5 hello c
```

编译期求和：

```cpp linenums="1"
template <typename... Args>
struct Sum;

template <typename T, typename... Rest>
struct Sum<T, Rest...> {
    static const int value = T::value + Sum<Rest...>::value;
};

template <>
struct Sum<> {
    static const int value = 0;
};
```

## 5 现代 C++ 的简化：`constexpr` 与 `if constexpr`

模板元编程曾经晦涩难懂，现代 C++ 提供了更直白的工具

### 5.1 `constexpr` 函数

C++11/14/17 的 `constexpr` 函数允许用 **普通函数语法** 做编译期计算，不必再写递归模板：

```cpp linenums="1"
constexpr int factorial(int n) {
    int result = 1;
    for (int i = 1; i <= n; ++i)   // C++14 起允许循环
        result *= i;
    return result;
}

int arr[factorial(5)];   // 编译期算出 120，用作数组大小
static_assert(factorial(5) == 120);
```

### 5.2 `if constexpr`（C++17）

`if constexpr` 在编译期做分支，被舍弃的分支 **不会被实例化**，大大简化了 SFINAE：

```cpp linenums="1"
template <typename T>
auto getValue(T t) {
    if constexpr (std::is_pointer_v<T>) {
        return *t;          // T 是指针时，只有这分支被编译
    } else {
        return t;
    }
}

int x = 5;
getValue(&x);   // 返回 5（解引用）
getValue(x);    // 返回 5（原样）
```

!!! tip "`if constexpr` vs 普通 `if`"

    普通 `if` 的两个分支 **都会** 被编译（只是运行期只执行一个）；`if constexpr` 只会实例化**满足条件的那个分支**，因此可以在不同分支里写"对某些类型根本编译不过"的代码。

## 6 完整实例：编译期判断类型并分发

综合运用上述机制：

```cpp linenums="1"
#include <type_traits>
#include <iostream>

// 通用版本
template <typename T>
void process(T value) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "整数：" << value << '\n';
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "浮点：" << value << '\n';
    } else if constexpr (std::is_pointer_v<T>) {
        std::cout << "指针指向：" << *value << '\n';
    } else {
        std::cout << "其他类型\n";
    }
}

int main() {
    process(42);        // 整数：42
    process(3.14);      // 浮点：3.14
    int x = 7;
    process(&x);        // 指针指向：7
}
```
