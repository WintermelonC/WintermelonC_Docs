# 5 Inside Class

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Overloaded Constructors

**重载构造函数**

重载构造函数 是指在一个类中定义多个构造函数，这些构造函数具有相同的名称（类名），但参数列表不同。通过重载构造函数，可以根据不同的初始化需求创建对象

1. 构造函数名称相同：构造函数的名称必须与类名相同
2. 参数列表不同：通过参数的数量、类型或顺序来区分不同的构造函数
3. 不能有返回值：构造函数没有返回值

```cpp linenums="1"
#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    // 无参构造函数
    Person() {
        name = "Unknown";
        age = 0;
        std::cout << "Default constructor called" << std::endl;
    }

    // 带一个参数的构造函数
    Person(std::string n) {
        name = n;
        age = 0;
        std::cout << "Constructor with name called" << std::endl;
    }

    // 带两个参数的构造函数
    Person(std::string n, int a) {
        name = n;
        age = a;
        std::cout << "Constructor with name and age called" << std::endl;
    }

    // 打印信息
    void display() {
        std::cout << "Name: " << name << ", Age: " << age << std::endl;
    }
};

int main() {
    Person p1;                     // 调用无参构造函数
    Person p2("Alice");            // 调用带一个参数的构造函数
    Person p3("Bob", 25);          // 调用带两个参数的构造函数

    p1.display();
    p2.display();
    p3.display();

    return 0;
}
```

```cpp linenums="1" title="output"
Default constructor called
Constructor with name called
Constructor with name and age called
Name: Unknown, Age: 0
Name: Alice, Age: 0
Name: Bob, Age: 25
```

### 1.1 Delegating Constructors

**代理构造函数**

重载构造函数与代理构造函数结合可以减少重载构造函数中的代码重复

```cpp linenums="1"
#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    // 主构造函数
    Person(std::string n, int a) : name(n), age(a) {}

    // 代理构造函数
    Person() : Person("Unknown", 0) {}
    Person(std::string n) : Person(n, 0) {}

    void display() {
        std::cout << "Name: " << name << ", Age: " << age << std::endl;
    }
};

int main() {
    Person p1;                     // 调用无参构造函数
    Person p2("Alice");            // 调用带一个参数的构造函数
    Person p3("Bob", 25);          // 调用带两个参数的构造函数

    p1.display();
    p2.display();
    p3.display();

    return 0;
}
```

```cpp linenums="1" title="output"
Name: Unknown, Age: 0
Name: Alice, Age: 0
Name: Bob, Age: 25
```

!!! tip "代理构造函数与初始化列表的执行顺序"

    执行顺序：目标构造函数（target constructor）的初始化列表 → 目标构造函数的主体 → 当前构造函数的初始化列表 → 当前构造函数的主体

    ```cpp linenums="1"
    #include <iostream>
    #include <string>
    
    class Person {
    private:
        std::string name;
        int age;
    
    public:
        // 主构造函数
        Person(std::string n, int a) : name(n), age(a) {
            std::cout << "Target constructor executed: name = " << name << ", age = " << age << std::endl;
        }
    
        // 代理构造函数
        Person() : Person("Unknown", 0) {
            std::cout << "Delegating constructor executed (no parameters)" << std::endl;
        }
    
        // 代理构造函数 + 初始化列表
        Person(std::string n) : Person(n, 0), age(18) {
            // age = 18 会覆盖目标构造函数中 age = 0 的值
            std::cout << "Delegating constructor executed (with name): name = " << name << ", age = " << age << std::endl;
        }
    };
    
    int main() {
        Person p1;               // 调用无参代理构造函数
        Person p2("Alice");      // 调用带一个参数的代理构造函数
        return 0;
    }
    ```
    
    ```cpp linenums="1" title="output"
    Target constructor executed: name = Unknown, age = 0
    Delegating constructor executed (no parameters)
    Target constructor executed: name = Alice, age = 0
    Delegating constructor executed (with name): name = Alice, age = 18
    ```

## 2 Default Arguments

**默认参数**

默认参数是指在函数声明或定义时为某些参数指定默认值。如果调用函数时未提供这些参数的值，则会使用默认值

默认参数的值可以在函数声明或定义中指定，但只能在一个地方指定（通常在声明中）

```cpp linenums="1"
#include <iostream>

// 在函数声明中指定默认参数
void greet(std::string name = "Guest", int age = 18);

int main() {
    greet();                  // 使用默认参数
    greet("Alice");           // 使用部分默认参数
    greet("Bob", 25);         // 覆盖所有默认参数
    return 0;
}

// 在函数定义中实现
void greet(std::string name, int age) {
    std::cout << "Hello, " << name << "! You are " << age << " years old." << std::endl;
}
```

```cpp linenums="1" title="output"
Hello, Guest! You are 18 years old.
Hello, Alice! You are 18 years old.
Hello, Bob! You are 25 years old.
```

### 2.1 默认参数设置规则

1. 从右向左设置默认参数：默认参数必须从右向左连续设置，不能跳过中间参数
2. 只能在声明或定义中指定默认值：默认参数的值只能在函数声明或定义中指定，==不能同时在两处指定==
3. 默认参数的值必须是常量或可计算的表达式：默认参数的值可以是常量、全局变量、枚举值或常量表达式

### 2.2 注意事项

**1.避免与函数重载冲突**

如果默认参数的设置与函数重载的参数列表相似，可能会导致调用时的歧义

```cpp linenums="1"
void greet(std::string name = "Guest");
void greet(); // 错误：调用时无法区分
```

**2.默认参数的值是静态绑定的**

默认参数的值在编译时确定，不能在运行时动态改变

```cpp linenums="1"
int globalValue = 10;

void display(int value = globalValue) {
    std::cout << value << std::endl;
}

int main() {
    globalValue = 20;
    display(); // 输出：10，而不是 20
    return 0;
}
```

## 3 Inline Functions

**内联函数**

内联函数是一种特殊的函数，使用 inline 关键字声明，建议编译器在调用该函数时将其展开为函数体的代码，而不是通过常规的函数调用机制（如压栈和跳转）

```cpp linenums="1"
inline int add(int a, int b) {
    return a + b;
}

int result = add(3, 5); // 编译器可能将 add(3, 5) 替换为 3 + 5
```

特点：

1. 代码展开：编译器会将内联函数的调用替换为函数体的代码，从而避免函数调用的开销（如参数压栈、跳转等）
2. 适用于小型函数：内联函数适合代码量小、逻辑简单的函数（如一行或几行代码）。如果函数体过大，内联展开会导致代码膨胀，影响性能
3. 编译器的决定：inline 是对编译器的建议，编译器可能会忽略 inline 关键字，尤其是在函数体较大或递归时
4. 作用域规则：内联函数的定义必须在调用之前可见（通常放在头文件中）

优点：

1. 减少函数调用开销：避免了函数调用时的参数压栈、跳转和返回操作
2. 提高代码执行效率：通过代码展开，减少了函数调用的时间开销
3. 增强可读性：内联函数可以替代宏函数，==提供类型检查和调试支持==

缺点：

1. 代码膨胀：如果内联函数被频繁调用，代码展开会导致可执行文件体积增大
2. 编译时间增加：由于代码展开，编译器需要处理更多的代码，可能导致编译时间增加
3. **递归函数不能内联**：递归函数无法完全展开，因此不能作为内联函数

适用场景：

1. 小型函数：适用于代码量小、逻辑简单的函数，如数学运算、访问器（getter）等
2. 频繁调用的函数：适用于在性能关键的代码中频繁调用的函数
3. 替代宏函数：内联函数可以替代宏函数，提供更安全和可维护的代码

限制：

1. 递归函数不能内联：递归函数无法完全展开，因此编译器会忽略 inline
2. 函数体过大时可能被忽略：如果函数体过大，编译器可能会忽略 inline，以避免代码膨胀

==如果 inline 函数需要放在 .h 文件中，必须把 inline 函数的 **定义** 写在 .h 文件中==

!!! tip "内联函数与宏的区别"

    | 特性 | 内联函数 | 宏函数 |
    | :--: | :--: | :--: |
    | 定义方式 | 使用 inline 关键字 | 使用 #define 指令 |
    | 类型检查 | 有类型检查 | 无类型检查 |
    | 调试支持 | 支持调试 | 不支持调试 |
    | 作用域 | 遵循 C++ 的作用域规则 | 无作用域概念 |
    | 错误处理 | 遵循 C++ 语法规则，易排查错误 | 文本替换，易引发隐藏错误 |
    | 性能 | 编译器决定是否内联 | 始终文本替换，可能代码膨胀 |

    ```cpp linenums="1"
    // 宏函数
    #define SQUARE(x) ((x) * (x))
    
    // 内联函数
    inline int square(int x) {
        return x * x;
    }
    
    int main() {
        int result1 = SQUARE(1 + 2);
        int result2 = square(1 + 2);
        return 0;
    }
    ```

### 3.1 inline 与成员函数

在 C++ 中，==在类内部定义的成员函数默认是 inline 的==。这意味着编译器会将这些函数视为内联函数，并尝试在调用点展开它们的代码，而不是通过常规的函数调用机制

1. 类内部定义的成员函数：如果函数的定义直接写在类的内部（而不是类外部），编译器会将其视为 inline 函数
2. 类外部定义的成员函数：如果函数的定义写在类外部，则不会默认是 inline，需要显式使用 inline 关键字

## 4 Inline Variable

inline variable 是 C++ 17 引入的一种特性，用于解决全局变量或静态成员变量在多文件中定义和使用时的重复定义问题

- 核心特性：inline 变量可以在多个翻译单元中定义，但只会有一个实例（即全局唯一，具有“外部链接”）
- 主要用途：避免全局变量或静态成员变量的重复定义错误

!!! question "为什么需要 inline variable"

    在 C++ 中，全局变量或静态成员变量如果在头文件中定义并被多个翻译单元（源文件）包含，会导致 **重复定义错误**

    === "header.h"
        
        ```cpp linenums="1"
        #ifndef HEADER_H
        #define HEADER_H
        
        const int globalValue = 42; // 定义全局变量
        
        #endif
        ```

    === "file1.cpp"

        ```cpp linenums="1"
        #include "header.h"
        ```

    === "file2.cpp"

        ```cpp linenums="1"
        #include "header.h"
        ```

    编译时会报错 `multiple definition of 'globalValue'`

```cpp linenums="1"
inline int globalVar = 42;
```

inline 变量必须在定义时初始化

使用 inline 后，类的静态成员变量可以直接在类内定义并初始化

```cpp linenums="1"
class MyClass {
public:
    inline static int staticVar = 10; // 静态成员变量的 inline 定义
};
```

!!! tip "When to use inline variable"

    1. 在头文件中定义全局常量时
    2. 当静态类成员需要在类定义中直接初始化时
    3. 需要在多个文件中保持变量单一定义时
    4. 需要简化配置值或设置项的管理时

!!! tip "When not to use inline variable"

    1. 避免对大型对象或占用大量内存的变量使用内联变量，可能导致不必要的内存消耗
    2. 不要用于需要在每个翻译单元有独立实例的变量
    3. 谨慎对待运行时可能被修改的变量，可能导致意外副作用

## 5 Weak

1. inline 通常用于建议编译器内联展开函数（优化调用开销），属于编译期行为
2. weak 用于声明弱符号，允许链接时存在同名符号的其他定义（强符号会覆盖弱符号），属于链接期行为

| 方面 | inline | weak |
| :-: | - | - |
| 主要用途 | 通过建议编译器内联展开来优化函数调用 | 允许符号被覆盖，避免链接冲突 |
| 适用对象 | 主要用于函数（尤其是小型或高频调用的函数） | 可用于函数、变量或对象（常见于动态链接或插件系统） |
| 符号管理 | 编译器可能在多个翻译单元中生成函数的多个副本，并在链接时去重 | 允许多个弱符号共存，链接器优先选择非弱符号（强符号） |
| 链接器行为 | 如果同一内联函数在多个翻译单元中定义，不会引发链接错误 | 如果存在多个弱符号，不会引发链接错误；若有非弱符号，则优先选择它 |
| 优化重点 | 专注于减少函数调用开销以提升性能 | 提供后备实现或可选符号（如插件或动态库） |
| 使用场景 | 最适合小型简单函数、模板函数或类成员函数 | 常用于默认实现、模块化插件或单例模式 |

```cpp linenums="1"
// 将函数定义为弱符号作为后备实现
__attribute__((weak)) void printMessage() {
    std::cout << "Default message" << std::endl;
}
```

1. 如果程序中没有其他 `printMessage()` 的实现，则使用这个弱符号版本
2. 如果在其他翻译单元（源文件）中提供了非弱符号（强符号）版本的 `printMessage()`，则优先使用强符号版本
3. 适用于模块化应用程序中的可选功能或后备实现