# 6 Composition

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Definition

Composition（组合） 是一种面向对象编程的设计原则，用于通过将一个类的对象作为另一个类的成员变量来实现类之间的关系。它是一种 "has-a"（拥有）关系，与继承（"is-a" 关系）相对。通过这种方式，一个类可以复用另一个类的功能，而不需要继承。它强调对象之间的协作关系

```cpp linenums="1"
#include <iostream>
#include <string>

// 组成部分类
class Engine {
public:
    void start() {
        std::cout << "Engine started" << std::endl;
    }
};

// 使用组合的类
class Car {
private:
    Engine engine; // Car 拥有一个 Engine 对象
public:
    void start() {
        engine.start(); // 使用 Engine 的功能
        std::cout << "Car is running" << std::endl;
    }
};

int main() {
    Car car;
    car.start();
    return 0;
}
```

包含方式：

1. Fully（完全包含）：子对象（如 Address）的生命周期由父对象（如 Employee）管理。当父对象销毁时，子对象也会被销毁
2. By reference（引用包含）：父对象通过指针或引用持有子对象，子对象可被多个父对象共享。子对象的生命周期独立于父对象

<div class="grid" markdown>

```cpp linenums="1"
class Employee {
    Address address; // 完全包含（值语义）
};
```

```cpp linenums="1"
class Employee {
    HealthPlan* healthPlan; // 引用包含（共享）
};
```

</div>

embedded objects（嵌入式对象）：指作为类成员的其他对象（非指针/引用），其生命周期与包含它的对象绑定

初始化规则：

1. 默认初始化：若未显式初始化，且该成员有默认构造函数，则编译器会自动调用它
2. 显式初始化：通过构造函数的初始化列表（Initialization List）传递参数

初始化列表特性：

1. 高效性：直接调用成员的构造函数，避免先默认构造再赋值的开销
2. 顺序性：初始化顺序由成员在类中的声明顺序决定，与初始化列表中的顺序无关

析构行为：当父对象销毁时，所有嵌入式对象的析构函数会自动调用（与构造顺序相反）

---

一般来说，我们都将嵌入式对象定义为 `private`

## 2 Clock Display

=== "number_display.h"

    ```cpp linenums="1"
    #ifndef NUMBER_DISPLAY_H
    #define NUMBER_DISPLAY_H
    
    #include <string>
    
    using namespace std;
    
    class NumberDisplay
    {
    public:
        NumberDisplay(int lim);
        void setValue(int val);
        int getValue() const;
        string toString() const;
        bool dida();
    
    private:
        int limit;
        int value = 0;
    };
    
    #endif
    ```

=== "number_display.cpp"

    ```cpp linenums="1"
    #include "numberdisplay.h"
    #include <string>
    
    using namespace std;
    
    NumberDisplay::NumberDisplay(int lim) : limit(lim) {};
    
    void NumberDisplay::setValue(int val)
    {
        value = val;
    }
    
    int NumberDisplay::getValue() const
    {
        return value;
    }
    
    string NumberDisplay::toString() const
    {
        if (value < 10) {
            return "0" + to_string(value);
        } else {
            return to_string(value);
        }
    }
    
    bool NumberDisplay::dida()
    {
        value++;
        if (value == limit) {
            value = 0;
            return true;
        } else {
            return false;
        }
    }
    ```

=== "clock.h"

    ```cpp linenums="1"
    #ifndef CLOCK_H
    #define CLOCK_H
    
    #include <string>
    #include "numberdisplay.h"
    
    using namespace std;
    
    class Clock
    {
    public:
        Clock(int h, int m, int s);
        string toString() const;
        void dida();
    
    private:
        // 为什么这样初始化 NumberDisplay 对象，见下文
        NumberDisplay hour = 24;
        NumberDisplay minute = 60;
        NumberDisplay second = 60;
    };
    
    #endif
    ```

=== "clock.cpp"

    ```cpp linenums="1"
    #include "clock.h"
    #include <string>
    
    using namespace std;
    
    Clock::Clock(int h, int m, int s) 
    {
        hour.setValue(h);
        minute.setValue(m);
        second.setValue(s);
    }
    
    string Clock::toString() const
    {
        return hour.toString() + ":" + minute.toString() + ":" + second.toString();
    }
    
    void Clock::dida()
    {
        if (second.dida()) {
            if (minute.dida()) {
                if (hour.dida()) {
                    hour.setValue(0);
                }
            }
        }
    }
    ```

在文件 `clock.h` 中，这样初始化 `NumberDisplay` 对象：

```cpp linenums="1"
private:
    NumberDisplay hour = 24;
    NumberDisplay minute = 60;
    NumberDisplay second = 60;
```

`NumberDisplay hour = 24` 是一种拷贝初始化的方式，而 `NumberDisplay hour(24)` 是一种直接初始化的方式

在类定义中，成员变量的初始化只能使用以下两种方式：

1. 非静态数据成员初始化器（NSDMI）
      1. `NumberDisplay hour = 24`
      2. `NumberDisplay hour{24}`：直接列表初始化，也叫大括号初始化。如果嵌入式对象有多个需要初始化的值，可使用此方法，`Embedded object{a1, a2, a3}`
2. 构造函数初始化列表：`Clock() : hour(24) {}`：如果嵌入式对象有多个需要初始化的值，可使用此方法

使用推荐：初始化列表 > 直接列表初始化 > 拷贝初始化

!!! question "嵌入式对象的初始化可以在所在类的构造函数体内进行吗"

    可以是可以，但是实际上：

    1. 先调用嵌入式对象的默认构造函数（如果有的话）
    2. 然后执行函数体内的赋值操作

    ==这种方法并不推荐==，因为它会导致不必要的效率损失（首先默认构造，然后是赋值），而且对于那些没有默认构造函数的类型来说，这样的做法根本不可行

如果在类中没有为嵌入式对象提供参数以初始化

1. 如果该嵌入式对象的类有默认构造函数，编译器会自动调用这个默认构造函数来初始化该成员对象
2. 如果嵌入式对象的类没有默认构造函数，且初始化列表中未显式调用其其他构造函数，则会导致 **编译错误**

初始化顺序：

1. 嵌入式对象的构造函数先于它所在类的构造函数
2. 不同嵌入式对象的初始化顺序仅与成员变量在类中的声明顺序有关，与初始化列表中的顺序无关

## 3 Namespace

**命名空间**

`namespace` 是 C++ 提供的一种机制，用于组织代码并避免命名冲突。它允许将标识符（如变量、函数、类等）分组到一个逻辑命名空间中，从而避免全局命名空间中的冲突

### 3.1 定义命名空间

```cpp linenums="1"
namespace MyNamespace {
    int value = 42;

    void display() {
        std::cout << "Value: " << value << std::endl;
    }
}

namespace supercalifragilistic {
    void f();
}
// 为命名空间创建一个别名 alias
namespace short = supercalifragilistic;
short::f();
```

在 C++17 中，可以使用嵌套命名空间的简化语法：

```cpp linenums="1"
namespace A::B::C {
    void func() {
        std::cout << "Inside A::B::C" << std::endl;
    }
}
A::B::C::func();
```

### 3.2 使用命名空间

1.通过作用域解析运算符 `::` 访问命名空间中的成员

```cpp linenums="1"
#include <iostream>

int main() {
    std::cout << MyNamespace::value << std::endl;
    MyNamespace::display();
    return 0;
}
```

2.使用 `using` 声明

```cpp linenums="1"
using MyNamespace::value;
std::cout << value << std::endl; // 不需要加命名空间前缀
```

3.使用 `using namespace` 指令

```cpp linenums="1"
using namespace MyNamespace;
std::cout << value << std::endl;
display();
```

### 3.3 特性

1.可以嵌套

```cpp linenums="1"
namespace Outer {
    namespace Inner {
        void func() {
            std::cout << "Inside Inner namespace" << std::endl;
        }
    }
}
Outer::Inner::func();
```

2.可以分段定义：命名空间可以在多个地方定义（包括不同的文件），所有定义会合并到同一个命名空间中

```cpp linenums="1"
namespace MyNamespace {
    void func1() {
        std::cout << "Function 1" << std::endl;
    }
}

namespace MyNamespace {
    void func2() {
        std::cout << "Function 2" << std::endl;
    }
}

MyNamespace::func1();
MyNamespace::func2();
```

3.匿名命名空间：匿名命名空间中的成员只能在定义它的文件中访问，类似于 `static` 的作用

```cpp linenums="1"
namespace {
    int secret = 42;

    void displaySecret() {
        std::cout << "Secret: " << secret << std::endl;
    }
}
```

4.标准命名空间 C++ 标准库中的所有内容都定义在 `std` 命名空间中，例如 `std::cout`、`std::vector` 等

### 3.4 应用

1.避免命名冲突：当多个库或模块中定义了相同名称的标识符时，可以通过命名空间加以区分

```cpp linenums="1"
namespace LibraryA {
    void print() {
        std::cout << "Library A" << std::endl;
    }
}

namespace LibraryB {
    void print() {
        std::cout << "Library B" << std::endl;
    }
}

LibraryA::print();
LibraryB::print();
```

2.组织代码：命名空间可以用来将相关的类、函数和变量分组，便于代码的组织和管理

3.与类结合：命名空间可以与类结合使用，进一步细化代码的逻辑结构

```cpp linenums="1"
namespace Geometry {
    class Point {
    public:
        int x, y;
        Point(int x, int y) : x(x), y(y) {}
    };
}
Geometry::Point p(1, 2);
```

### 3.5 注意事项

1. 避免滥用 `using namespace`：
      1. 在全局作用域中使用 `using namespace` 可能导致命名冲突，尤其是 `using namespace std;`
      2. 推荐在局部作用域中使用 `using` 声明
2. 匿名命名空间的作用域：匿名命名空间的成员只能在定义它的文件中访问，适合用于实现文件私有的功能
3. 命名空间的嵌套：嵌套命名空间可能导致代码可读性下降，建议合理使用

!!! tip "`namespace` 与宏的对比"

    - 宏（`#define`）在 C 中常用于避免命名冲突，但宏没有作用域，可能导致全局污染
    - 命名空间是 C++ 提供的更安全、更灵活的替代方案
