# 6 Composition

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    1. 本文档仅涉及部分内容，仅可用于复习重点知识
    2. Homework 的部分答案由 AI 生成

## 6.1 Definition

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

## 6.2 Clock Display

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
    
    #include "numberdisplay.h"
    #include <string>
    
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

`NumberDisplay hour = 24;` 是一种拷贝初始化的方式，而 `NumberDisplay hour(24);` 是一种直接初始化的方式

在类定义中，成员变量的初始化只能使用以下两种方式：

1. 非静态数据成员初始化器（NSDMI）：`NumberDisplay hour = 24;`
2. 构造函数初始化列表：`Clock() : hour(24) {}`

## 6.3 Namespace

