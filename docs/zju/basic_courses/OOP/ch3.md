# 3 Defining Class

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    1. 本文档仅涉及部分内容，仅可用于复习重点知识

## 1 `struct` 结构体

### 1.1 定义和变量声明

```cpp linenums="1"
// 与 C 类似
struct Person {
    // 成员变量
    string name;
    int age;
};

// 声明变量时，可省略 struct
Person person1;
```

### 1.2 成员函数

可以在结构体内部声明成员函数，并在结构体外部定义这些成员函数

```cpp linenums="1"
# include <iostream>
using namespace std;

struct Point {
    int x;
    int y;

    // 构造函数声明
    Point(int xVal, int yVal);

    // 成员函数声明
    void display();
};

// 构造函数定义
Point::Point(int xVal, int yVal) : x(xVal), y(yVal) {}

// 成员函数定义
void Point::display()
{
    cout << "Point: (" << x << ", " << y << ")" << endl;
}

int main()
{
    Point p(10, 20);
    p.display(); // 输出: Point: (10, 20)
    return 0;
}
```

#### 1.2.1 `::` 符号

`::` 符号在 C++ 中称为作用域解析运算符（Scope Resolution Operator），用于指定标识符的作用域。它可以用于访问类或结构体的成员、命名空间中的成员以及全局变量等

```cpp linenums="1"
// 当在类或结构体外部定义成员函数时，需要使用 :: 符号来指定成员函数所属的类或结构体
Point::Point(int xVal, int yVal) : x(xVal), y(yVal) {}
```

```cpp linenums="1" title="访问全局变量"
# include <iostream>
using namespace std;

int value = 10; // 全局变量

int main()
{
    int value = 20; // 局部变量
    cout << "Local value: " << value << endl; // 输出: Local value: 20
    cout << "Global value: " << ::value << endl; // 使用 :: 符号访问全局变量，输出: Global value: 10
    return 0;
}
```

#### 1.2.2 构造函数

```cpp linenums="1"
struct Person {
    string name;
    int age;

    // 构造函数
    Person(string n, int a) : name(n), age(a) {}

    // 成员函数
    void printInfo() const {
        cout << "Name: " << name << ", Age: " << age << endl;
    }
};
```

构造函数用于在创建结构体对象时初始化成员变量。构造函数是一种特殊的成员函数，其名称与结构体名称相同，没有返回类型。构造函数可以有参数，也可以没有参数

**默认构造函数** 是指在没有参数或所有参数都有默认值的情况下调用的构造函数

如果类中没有声明任何构造函数，编译器会提供一个隐式的默认构造函数，称为 **自动默认构造函数**

<div class="grid" markdown>

```cpp linenums="1" title="默认构造函数"
# include <iostream>
using namespace std;

struct Point {
    int x;
    int y;

    // 默认构造函数可以是无参的
    Point() {
        x = 0;
        y = 0;
    }

    // 默认构造函数也可以是所有参数都有默认值的
    Point(int xx = 0, int yy = 0) : x(xx), y(yy) {}
};

int main()
{
    Point p1; // 调用默认构造函数
    cout << "Point: (" << p1.x << ", " << p1.y << ")" << endl; // 输出: Point: (0, 0)
    return 0;
}
```

```cpp linenums="1" title="带参数的构造函数"
# include <iostream>
using namespace std;

struct Point {
    int x;
    int y;

    // 带参数的构造函数
    Point(int xVal, int yVal) {
        x = xVal;
        y = yVal;
    }
};

int main()
{
    Point p1(10, 20); // 调用带参数的构造函数
    cout << "Point: (" << p1.x << ", " << p1.y << ")" << endl; // 输出: Point: (10, 20)
    return 0;
}
```

</div>

##### 初始化列表

构造函数可以使用初始化列表来初始化成员变量，这种方式通常更高效

```cpp linenums="1"
# include <iostream>
using namespace std;

struct Point {
    int x;
    int y;

    // 使用初始化列表的构造函数
    Point(int xVal, int yVal) : x(xVal), y(yVal) {}
};
```

---

结构体可以包含多个构造函数，以支持不同的初始化方式，但存在一定的顺序

1. 默认成员初始化
2. 构造函数初始化列表
3. 构造函数体内的赋值

```cpp linenums="1"
struct Point {
    int x = 1; // 默认成员初始化
    int y = 2; // 默认成员初始化

    // 构造函数初始化列表
    Point(int xVal, int yVal) : x(xVal), y(yVal)
    {
        // 构造函数体内的赋值
        x = x + 1;
        y = y + 1;
    }
};

int main()
{
    Point p(10, 20);
    cout << "Point: (" << p.x << ", " << p.y << ")" << endl; // 输出: Point: (11, 21)
    return 0;
}
```

#### 1.2.3 `this` 指针

`this` 指针是 C++ 中的一个特殊指针，指向调用成员函数的对象本身。在结构体（`struct`）和类（`class`）的成员函数中，可以使用 `this` 指针访问对象的成员变量和成员函数

- `this` 指针是一个隐含的指针，存在于每个非静态成员函数中
- `this` 指针的类型是指向类或结构体类型的常量指针（`const ClassName*` 或 `const StructName*`）
- 在成员函数中，可以使用 `this` 指针访问对象的成员变量和成员函数

```cpp linenums="1"
#include <iostream>
using namespace std;

struct Point {
    int x;
    int y;

    // 构造函数
    Point(int xVal, int yVal) : x(xVal), y(yVal) {}

    // 成员函数，使用 this 指针访问成员变量
    void display()
    {
        cout << "Point: (" << this -> x << ", " << this -> y << ")" << endl;
    }
};

int main()
{
    Point p(10, 20);
    p.display(); // 输出: Point: (10, 20)
    return 0;
}
```

```cpp linenums="1" title="实现方法链"
# include <iostream>
using namespace std;

struct Point {
    int x;
    int y;

    // 构造函数
    Point(int xVal, int yVal) : x(xVal), y(yVal) {}

    // 成员函数，使用 this 指针返回对象本身
    Point& setX(int xVal) {
        this -> x = xVal;
        return *this;
    }

    Point& setY(int yVal) {
        this -> y = yVal;
        return *this;
    }

    void display() {
        cout << "Point: (" << this->x << ", " << this->y << ")" << endl;
    }
};

int main()
{
    Point p(10, 20);
    p.setX(30).setY(40).display(); // 输出: Point: (30, 40)
    return 0;
}
```

## 2 `class` 类

`class` 是 C++ 中用于定义对象和封装数据及其操作的关键字。类是面向对象编程的核心概念，它可以包含成员变量（数据成员）和成员函数（方法）

### 2.1 `.h` 文件

`.h` 文件（头文件）用于声明函数、类、结构体、变量等，而 `.cpp` 文件（源文件）用于定义这些声明。头文件的主要作用是提供接口，使得不同的源文件可以共享声明，从而实现代码的模块化和重用

1. **声明函数和变量**: 头文件中声明的函数和变量可以在多个源文件中使用
2. **定义类和结构体**: 头文件中定义的类和结构体可以在多个源文件中使用
3. **提供接口**: 头文件提供了模块的接口，使得其他模块可以使用这些接口而不需要知道其具体实现

!!! tip "使用 `.h`"

    1. 一个 `.h` 文件里放一个 `class` 声明
    2. 一个 `.h` 文件对应一个同名的 `.cpp` 文件
    3. `.h` 文件应该包含头文件保护

#### 2.1.1 `#include`

1. `#include <>`：用于包含标准库头文件或系统头文件
      - 编译器首先在标准库或系统的头文件目录中搜索指定的头文件。如果未找到，编译器可能会在其他预定义的目录中继续搜索
2. `#include ""`：用于包含用户自定义的头文件
      - 编译器首先在当前源文件所在的目录中搜索指定的头文件。如果未找到，编译器会在标准库或系统的头文件目录中继续搜索
      - `#include "utils/helper.h"`

#### 2.1.2 头文件保护

为了防止头文件被多次包含导致的重复定义错误，通常使用头文件保护（include guard）。头文件保护使用预处理指令 `#ifndef`、`#define` 和 `#endif` 来确保头文件只被包含一次

```cpp linenums="1"
// example.h
#ifndef EXAMPLE_H
#define EXAMPLE_H

// 头文件内容

#endif // EXAMPLE_H
```

现代方式：

```cpp linenums="1"
#pragma once

// 头文件内容...
```

1. 优点
      1. 简洁：只需一行代码，不需要手动定义唯一的宏名
      2. 避免宏名冲突：传统方式需要确保 `#ifndef` 的宏名唯一（如 `MYPROJECT_FILENAME_H`），而 `#pragma once` 由编译器自动处理
      3. 编译速度可能更快：某些编译器（如 MSVC、GCC、Clang）可以优化 `#pragma once`，避免重复解析同一个文件
2. 缺点
      1. 非标准（但广泛支持）：#pragma once 不是 C++ 标准的一部分，但几乎所有现代编译器（GCC、Clang、MSVC）都支持它
      2. 某些边缘情况可能失效：如果同一个文件有多个不同路径（如符号链接或不同大小写路径），某些编译器可能无法正确识别它们是同一个文件。但这种情况在实际开发中很少见

#### 2.1.3 声明函数和变量

=== "math_function.h"

    ```cpp linenums="1"
    # ifndef MATH_FUNCTIONS_H
    # define MATH_FUNCTIONS_H
    
    // 函数声明
    int add(int a, int b);
    int subtract(int a, int b);
    
    # endif // MATH_FUNCTIONS_H
    ```

=== "math_function.cpp"

    ```cpp linenums="1"
    # include "math_functions.h"
    
    // 函数定义
    int add(int a, int b)
    {
        return a + b;
    }
    
    int subtract(int a, int b)
    {
        return a - b;
    }
    ```

=== "main.cpp"

    ```cpp linenums="1"
    # include <iostream>
    # include "math_functions.h"
    
    int main()
    {
        int x = 10;
        int y = 5;
        std::cout << "Add: " << add(x, y) << std::endl; // 输出: Add: 15
        std::cout << "Subtract: " << subtract(x, y) << std::endl; // 输出: Subtract: 5
        return 0;
    }
    ```

#### 2.1.4 定义类和结构体

=== "point.h"

    ```cpp linenums="1"
    # ifndef POINT_H
    # define POINT_H
    
    class Point {
    private:
        int x;
        int y;
    
    public:
        Point(int xVal, int yVal);
        void display() const;
    };
    
    # endif // POINT_H
    ```

=== "point.cpp"

    ```cpp linenums="1"
    // point.cpp
    # include <iostream>
    # include "point.h"
    
    Point::Point(int xVal, int yVal) : x(xVal), y(yVal) {}
    
    void Point::display() const
    {
        std::cout << "Point: (" << x << ", " << y << ")" << std::endl;
    }
    ```

### 2.2 `class` 的定义

```cpp linenums="1"
class ClassName {
public:
    // 公有成员
    Type1 member1;
    Type2 member2;

    // 构造函数
    ClassName();

    // 成员函数
    void memberFunction();

private:
    // 私有成员
    Type3 member3;
};
```

### 2.3 析构函数

析构函数（destructor）是类的一种特殊成员函数，==当对象的生命周期结束时自动调用==，用于执行清理操作，例如释放资源、关闭文件等。析构函数的名称与类名相同，但前面加上波浪号（~），==且没有返回类型和参数==

析构函数通常用于执行以下操作：

- 释放动态分配的内存
- 关闭文件或网络连接
- 释放其他系统资源

例如，如果类中有一个指向动态分配内存的指针，可以在析构函数中释放这块内存：

```cpp linenums="1"
class MyClass {
private:
    int* data;
public:
    // 构造函数
    MyClass() {
        data = new int[100]; // 动态分配内存
    }

    // 析构函数
    ~MyClass() {
        delete[] data; // 释放内存
    }
};
```