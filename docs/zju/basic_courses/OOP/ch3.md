# 3 Defining Class

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    1. 本文档仅涉及部分内容，仅可用于复习重点知识
    2. Homework 的部分答案由 AI 生成

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

构造函数用于在创建结构体对象时初始化成员变量。构造函数是一种特殊的成员函数，其名称与结构体名称相同，没有返回类型。构造函数可以有参数，也可以没有参数（默认构造函数）

<div class="grid" markdown>

```cpp linenums="1" title="默认构造函数"
# include <iostream>
using namespace std;

struct Point {
    int x;
    int y;

    // 默认构造函数
    Point() {
        x = 0;
        y = 0;
    }
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

1. `#include`：用于包含标准库头文件或系统头文件
      - 编译器首先在标准库或系统的头文件目录中搜索指定的头文件。如果未找到，编译器可能会在其他预定义的目录中继续搜索
2. `#include`：用于包含用户自定义的头文件
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

#### 2.2.1 访问权限

在 C++ 中，类的成员（包括成员变量和成员函数）可以有三种访问权限：`public`、`protected` 和 `private`。这些访问权限控制了类的成员在类的外部和派生类中的可见性和可访问性

- `public` 访问权限：公有成员可以在类的外部和派生类中访问
- `protected` 访问权限：受保护成员只能在类的内部和派生类中访问，不能在类的外部访问
- `private` 访问权限：私有成员只能在类的内部访问，不能在类的外部和派生类中访问
      - 类成员的缺省访问权限是 `private`
      - 在结构体（struct）中，默认的访问权限是 `public`

##### `public`

- 说明: 公有成员可以在类的外部和派生类中访问
- 用途: 通常用于定义类的接口，使得类的用户可以访问和使用这些成员

```cpp linenums="1"
class MyClass {
public:
    int publicVar;

    void publicMethod()
    {
        // 公有成员函数
    }
};

int main()
{
    MyClass obj;
    obj.publicVar = 10; // 可以在类的外部访问公有成员变量
    obj.publicMethod(); // 可以在类的外部调用公有成员函数
    return 0;
}
```

##### `protected`

- 说明: 受保护成员只能在类的内部和派生类中访问，不能在类的外部访问
- 用途: 通常用于定义类的实现细节，使得派生类可以访问和使用这些成员，但类的用户不能直接访问

```cpp linenums="1"
class Base {
protected:
    int protectedVar;

    void protectedMethod()
    {
        // 受保护成员函数
    }
};

class Derived : public Base {
public:
    void accessProtectedMembers()
    {
        protectedVar = 20; // 可以在派生类中访问受保护成员变量
        protectedMethod(); // 可以在派生类中调用受保护成员函数
    }
};

int main()
{
    Derived obj;
    obj.accessProtectedMembers();
    // obj.protectedVar = 10; // 错误：不能在类的外部访问受保护成员变量
    // obj.protectedMethod(); // 错误：不能在类的外部调用受保护成员函数
    return 0;
}
```

##### `private`

- 说明: 私有成员只能在类的内部访问，不能在类的外部和派生类中访问
- 用途: 通常用于定义类的实现细节，使得这些成员只能在类的内部使用，不能在类的外部和派生类中直接访问

```cpp linenums="1"
class MyClass {
private:
    int privateVar;

    void privateMethod()
    {
        // 私有成员函数
    }

public:
    void accessPrivateMembers()
    {
        privateVar = 30; // 可以在类的内部访问私有成员变量
        privateMethod(); // 可以在类的内部调用私有成员函数
    }
};

int main()
{
    MyClass obj;
    obj.accessPrivateMembers();
    // obj.privateVar = 10; // 错误：不能在类的外部访问私有成员变量
    // obj.privateMethod(); // 错误：不能在类的外部调用私有成员函数
    return 0;
}
```