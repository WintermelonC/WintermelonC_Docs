# Template

[OOP - Template](../../../zju/basic_courses/OOP/ch11.md){:target="_blank"}

模板本身不是真正的类或函数，而是编译器生成类或函数的“图纸”。 只有当模板被实际使用了，编译器才会根据传入的具体类型去生成真正的代码

1. 隐式实例化：使用时由编译器自动生成（最常用）
2. 显式实例化：在代码中明确告诉编译器为某个类型生成代码（如 `template class MyVector<int>;`），常用于优化编译时间或解决链接问题

由于针对每一种不同的类型都会生成一份独立的代码，如果滥用模板或类型组合过多，会导致最终的编译产物（可执行文件）体积急剧变大

可变参数模板：允许模板接收任意数量、任意类型的参数

```cpp linenums="1"
// 递归的基础终点函数
void print() {} 

// 展开参数包的标准（递归）写法
template <typename T, typename... Args>
void print(T first, Args... rest) {
    std::cout << first << " ";
    print(rest...); // 递归调用，把剩下的包传下去
}
```

!!! question "为什么模板的声明和实现通常都要放在头文件（`.h`/`.hpp`）中"

    如果像普通类一样，把模板的声明放在 `.h` 文件，实现放在 `.cpp` 文件里

    1. 在编译 `main.cpp` 时（哪怕 `main.cpp` 里遇到了如 `MyVector<int>`），编译器因为只看到了头文件里的声明，它会假设“具体的实现在其他编译单元里”，于是暂时通过编译，并在目标文件（`.obj`/`.o`）里留下一个待解析的符号
    2. 在编译模板的 `.cpp` 文件时，因为没有任何地方调用过这个模板的具体类型，编译器不会去主动实例化（比如生成 `<int>` 或 `<double>` 版本的代码）
    3. 在最后链接阶段，链接器在全局符号表里找不到 `MyVector<int>` 的实际机器码，从而报出经典的 “LNK2019：无法解析的外部符号 (Unresolved External Symbol)” 错误

    解决方案：将声明和实现都写在同一个头文件中（通常推荐使用 `.hpp` 后缀以示区分）

偏特化：部分指定的模板参数，或者对参数进行了某种限制（如限制为指针、限制为数组）

```cpp linenums="1"
// 偏特化：要求 T 必须是指针类型，且具体是什么指针依然用 T 表示
template <typename T> 
class Compare<T*> { ... }; 
```

!!! question "类模板和函数模板在特化上的区别"

    - 类模板：既支持全特化，也支持偏特化
    - 函数模板：只支持全特化，绝对不支持偏特化。如果你想对函数模板进行类似“偏特化”的操作，C++ 的正确处理方式是直接重载 (Overloading) 这个函数或者使用 SFINAE（如 `std::enable_if`）

## 1 SFINE

替换失败不是错误

当编译器尝试为函数调用或类模板实例化推导模板参数时，它会将推导出的具体类型替换（Substitute）到模板的签名（参数列表、返回类型等）中。如果在这个替换过程中产生了一个无效的类型或表达式（即如果我们直接写出这样的代码会导致编译错误），编译器不会报错（Is Not An Error）。相反，编译器会默默地将这个模板从候选者列表中剔除。只有当所有的候选者都被剔除，或者存在歧义时，编译器才会真正报错

SFINAE 最常见的应用是通过 `<type_traits>` 库中的 `std::enable_if` 来根据类型特征（如是否为整数、是否为指针等）启用或禁用某些重载

```cpp linenums="1"
#include <iostream>
#include <type_traits>

// 只有当 T 是整数类型时，这个模板才有效
template <typename T>
typename std::enable_if<std::is_integral<T>::value, void>::type
printType(T t) {
    std::cout << t << " is an integral type." << std::endl;
}

// 只有当 T 是浮点类型时，这个模板才有效
template <typename T>
typename std::enable_if<std::is_floating_point<T>::value, void>::type
printType(T t) {
    std::cout << t << " is a floating point type." << std::endl;
}

int main() {
    printType(42);      // 调用第一个版本
    printType(3.14);    // 调用第二个版本
    // printType("Hello"); // 编译错误！替换失败且没有其他候选版本
    return 0;
}
```

随着现代 C++ 的发展，我们有了更优雅的替代方案：

```cpp linenums="1" title="C++14"
template <typename T>
std::enable_if_t<std::is_integral<T>::value, void> printType(T t) { ... }
```

```cpp linenums="1" title="C++17"
template <typename T>
void printType(T t) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "integral\n";
    } else if constexpr (std::is_floating_point_v<T>) {
        std::cout << "floating point\n";
    }
}
```

C++20 的 concepts（概念），concepts 直接在语言层面上支持了对模板参数的约束

```cpp linenums="1" title="C++20"
void printType(std::integral auto t) {
    std::cout << "integral\n";
}

void printType(std::floating_point auto t) {
    std::cout << "floating point\n";
}
```

## 2 底层细节

C++ 编译器在处理模板时，采用的是极为严格的“两阶段”编译检查机制：

1. 第一阶段（定义时检查）：当编译器第一次看到模板定义时，即使还没确切知道 `T` 是什么，它也会进行基本的语法检查。它会检查那些不依赖于模板参数的名字和语法错误（例如有没有漏掉分号，普通的变量名拼写是否正确）
2. 第二阶段（实例化时检查）：当真正用到该模板（例如传入了 `int`）时，编译器会进行第二轮检查。这时候它会检查那些依赖于模板参数的名字（Dependent Names）。此时，如果 `T` 类型不支持你所写的操作（比如对 `int` 调用了不存在的方法 `t.run()`），就会在这一步报出经典的、往往长篇大论的模板编译错误

假设你有 `A.cpp` 和 `B.cpp`，都在包含头文件后使用了 `std::vector<int>`。那么 `A.o` 和 `B.o` 各自都会包含一份 `std::vector<int>` 的机器码

如果是普通函数，这违背了单一原则（ODR），链接器会报错（重定义）。但对于模板，编译器会在生成的符号上打上一种特殊的标记（在 ELF 格式中常称为 Weak Symbol，在现代工具链中称为 COMDAT group 机制）。链接器 (Linker) 在看到多个一模一样的 COMDAT 符号时，不会报错，而是默默挑选其中一份保留，将其他的丢弃掉，从而合并相同的实例化代码，避免最终由于重复而在二进制文件中占据多份空间