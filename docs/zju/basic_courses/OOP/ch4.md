# 4 Inside Object

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    1. 本文档仅涉及部分内容，仅可用于复习重点知识
    2. Homework 的部分答案由 AI 生成

## 1 访问权限

在 C++ 中，类的成员（包括成员变量和成员函数）可以有三种访问权限：`public`、`protected` 和 `private`。这些访问权限控制了类的成员在类的外部和派生类中的可见性和可访问性

- `public` 访问权限：公有成员可以在类的外部和派生类中访问
- `protected` 访问权限：受保护成员只能在类的内部和派生类中访问，不能在类的外部访问
- `private` 访问权限：私有成员只能在类的内部访问，不能在类的外部和派生类中访问
      1. 类成员的缺省访问权限是 `private`
      2. 在结构体（struct）中，默认的访问权限是 `public`

### 1.1 `public`

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

### 1.2 `protected`

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

### 1.3 `private`

<div class="annotate" markdown>

- 说明: 私有成员只能在类的内部（边界是类，而不是对象 (1)）访问，不能在类的外部和派生类中访问
- 用途: 通常用于定义类的实现细节，使得这些成员只能在类的内部使用，不能在类的外部和派生类中直接访问

</div>

1. 意味着同一个类的不同对象可以互相访问私有变量

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

#### 1.3.1 友元

友元（friend）是一种特殊的关系，它允许一个函数或另一个类访问类的私有成员和受保护成员。友元可以是友元函数或友元类

友元通常用于以下情况：

1. 需要访问类的私有成员或受保护成员，但不希望将这些成员公开
2. 需要在两个类之间建立紧密的关系，使得一个类可以访问另一个类的私有成员或受保护成员

##### 友元函数

友元函数是一个函数，它被声明为一个类的友元，从而可以访问该类的私有成员和受保护成员

1. 类的成员函数
2. 全局函数

```cpp linenums="1"
class MyClass {
private:
    int privateVar;

public:
    MyClass() : privateVar(0) {}

    // 声明友元函数
    friend void accessPrivateMembers(MyClass& obj);
};

// 定义友元函数
void accessPrivateMembers(MyClass& obj) {
    obj.privateVar = 42; // 可以访问私有成员变量
}

int main() {
    MyClass obj;
    accessPrivateMembers(obj); // 调用友元函数
    return 0;
}
```

##### 友元类

友元类是一个类，它被声明为另一个类的友元，从而可以访问该类的私有成员和受保护成员

```cpp linenums="1"
class MyClass {
private:
    int privateVar;

public:
    MyClass() : privateVar(0) {}

    // 声明友元类
    friend class FriendClass;
};

class FriendClass {
public:
    void accessPrivateMembers(MyClass& obj) {
        obj.privateVar = 42; // 可以访问私有成员变量
    }
};

int main() {
    MyClass obj;
    FriendClass friendObj;
    friendObj.accessPrivateMembers(obj); // 调用友元类的方法
    return 0;
}
```

## 2 作用域

### 2.1 Local Object

局部对象（Local Object）是指在函数或代码块内部定义的对象。局部对象的生命周期从它们的定义点开始，到包含它们的代码块结束时结束。当代码块结束时，局部对象会被自动销毁，析构函数会被调用

```cpp linenums="1"
#include <iostream>

class MyClass {
public:
    MyClass() {
        std::cout << "构造函数被调用" << std::endl;
    }

    ~MyClass() {
        std::cout << "析构函数被调用" << std::endl;
    }
};

void function() {
    MyClass localObj; // 定义局部对象
    std::cout << "函数内部" << std::endl;
} // localObj 在这里被销毁

int main() {
    function();
    std::cout << "函数外部" << std::endl;
    return 0;
}

/* 
 * 输出结果：
 * 
 * 构造函数被调用
 * 函数内部
 * 析构函数被调用
 * 函数外部 
 */
```

#### 2.1.1 Field

**字段**

- **定义**：字段是定义在类中，但在构造函数和方法之外的变量
- **用途**：用于存储对象的状态信息，这些信息在对象的整个生命周期中保持不变
- **作用域**：字段的作用域是整个类，这意味着它们可以在类的任何构造函数或方法中被访问和使用
- **生命周期**：字段的生命周期与对象的生命周期相同，即只要对象存在，字段就存在

```cpp linenums="1"
class MyClass {
public:
    int field; // 字段

    MyClass() : field(0) {} // 构造函数

    void displayField() {
        std::cout << "Field: " << field << std::endl;
    }
};

int main() {
    MyClass obj;
    obj.displayField(); // 访问字段
    return 0;
}
```

#### 2.1.2 Parameters

**参数**

- **定义**：参数是传递给方法或构造函数的值
- **用途**：用于在方法或构造函数中接收外部传递的值
- **作用域**：参数的作用域仅限于定义它们的方法或构造函数内部
- **生命周期**：参数的生命周期通常与方法或构造函数的执行周期相同

```cpp linenums="1"
class MyClass {
public:
    void setValue(int value) { // 参数 value
        std::cout << "Value: " << value << std::endl;
    }
};

int main() {
    MyClass obj;
    obj.setValue(42); // 传递参数
    return 0;
}
```

#### 2.1.3 Local Variables

**局部变量**

- **定义**：局部变量是在方法或代码块内部定义的变量
- **用途**：用于在方法或代码块内部存储临时数据
- **作用域**：局部变量的作用域仅限于定义它们的代码块内部
- **生命周期**：局部变量的生命周期通常与代码块的执行周期相同

```cpp linenums="1"
class MyClass {
public:
    void display() {
        int localVar = 10; // 局部变量
        std::cout << "Local Variable: " << localVar << std::endl;
    }
};

int main() {
    MyClass obj;
    obj.display(); // 调用方法，使用局部变量
    return 0;
}
```

---

<div class="grid" markdown>

```cpp linenums="1"
#include <iostream>
using namespace std;

class ScopeTest {
private:
    int privateField; // 私有字段

public:
    ScopeTest() : privateField(0) {
        cout << "(1) Constructor called. privateField initialized to 0." << endl;
    }

	~ScopeTest() {
		cout << "(2) Destructor called. privateField is " << privateField << endl;
	}

    void methodWithParameters(int formalParam) { // 形式参数
        cout << "(3) Method called with formalParam: " << formalParam << endl;

        int localVar = 10; // 局部变量
        cout << "(4) Local variable localVar: " << localVar << endl;

        privateField = privateField + formalParam; // 修改私有字段
        cout << "(5) privateField updated to: " << privateField << endl;
    }

    void printPrivateField() {
        cout << "(6) Current value of privateField: " << privateField << endl;
    }
};

int main() {
    ScopeTest testObj;

    // 调用方法并传递实际参数
    testObj.methodWithParameters(5);

    // 打印私有字段的值，观察其生命周期
    testObj.printPrivateField();

    // 再次调用方法，观察形式参数和局部变量的生命周期
    testObj.methodWithParameters(8);

    // 再次打印私有字段的值
    testObj.printPrivateField();

    return 0;
}
```

```cpp linenums="1" title="输出结果"
(1) Constructor called. privateField initialized to 0.
(3) Method called with formalParam: 5
(4) Local variable localVar: 10
(5) privateField updated to: 5
(6) Current value of privateField: 5
(3) Method called with formalParam: 8
(4) Local variable localVar: 10
(5) privateField updated to: 13
(6) Current value of privateField: 13
(2) Destructor called. privateField is 13
```

</div>

### 2.2 Global Object

全局对象是指在所有函数之外定义的对象。全局对象在程序启动时创建，并在程序结束时销毁

- **生命周期**：全局对象在程序启动时创建，并在程序结束时销毁。它们的生命周期贯穿整个程序运行过程
- **作用域**：全局对象在定义它们的文件中是可见的。如果需要在多个文件中访问全局对象，可以使用 `extern` 关键字

```cpp linenums="1"
#include <iostream>

int globalVar = 10; // 全局变量

void printGlobalVar() {
    std::cout << "Global variable: " << globalVar << std::endl;
}

int main() {
    printGlobalVar(); // 输出: Global variable: 10
    return 0;
}
```

!!! example "在多个文件中使用全局变量"

    <div class="grid" markdown>
    
    === "global.h"
    
    ```cpp linenums="1"
    // global.h
    #ifndef GLOBAL_H
    #define GLOBAL_H
    
    extern int globalVar; // 声明全局变量
    
    void printGlobalVar();
    
    #endif // GLOBAL_H
    ```
    
    === "global.cpp"
    
    ```cpp linenums="1"
    // global.cpp
    #include "global.h"
    #include <iostream>
    
    int globalVar = 10; // 定义全局变量
    
    void printGlobalVar() {
        std::cout << "Global variable: " << globalVar << std::endl;
    }
    ```
    
    === "main.cpp"
    
    ```cpp linenums="1"
    // main.cpp
    #include "global.h"
    
    int main() {
        printGlobalVar(); // 输出: Global variable: 10
        return 0;
    }
    ```
    
    </div>

#### 2.2.1 静态初始化依赖

1. 非局部静态对象
      1. 非局部静态对象包括
         1. 在全局或命名空间范围内定义的对象
         2. 在类中声明为静态的对象
         3. 在文件范围内定义为静态的对象
      2. 这些对象的生命周期从程序启动时开始，到程序结束时结束
2. 文件内的构造顺序
      - 在同一个文件中，静态对象的初始化顺序是确定的，按照它们在文件中的定义顺序进行初始化
3. 文件之间的构造顺序
      1. 不同文件中的静态对象的初始化顺序是未指定的，==编译器不保证它们的初始化顺序==
      2. 这可能导致问题，特别是当一个文件中的静态对象依赖于另一个文件中的静态对象时

解决方案：

1. 直接避免非局部静态依赖
2. 将静态对象定义按正确顺序放在单个文件中

### 2.3 Static



#### 静态（普通）函数

#### 静态全局变量

#### 静态局部变量

#### 静态成员变量

#### 静态成员函数