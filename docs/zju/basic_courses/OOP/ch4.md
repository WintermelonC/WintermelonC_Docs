# 4 Inside Object 1

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

1. 两个基本含义
      1. 静态存储
         - 在程序的生命周期内，静态变量只分配一次内存，并且在整个程序运行期间都存在。这意味着它们的值在函数调用之间保持不变
      2. 受限访问
         - 静态关键字可以用于限制变量或函数的访问范围。例如，在 C++ 中，静态成员变量或函数只能在类内部访问
2. 在固定地址一次性分配
      1. 名称的可见性
         - 静态变量在程序启动时分配内存，并且在整个程序运行期间保持不变
      2. 内部链接
         - 在 C++ 中，静态变量或函数具有内部链接，这意味着它们只在定义它们的文件内可见，不会与其他文件中的同名变量或函数冲突
3. 在 C++ 中，建议仅在函数和类内部使用 static 关键字。不要使用 static 来限制访问，因为 C++ 提供了其他更合适的访问控制机制（如 private 和 protected）

#### 2.3.1 静态全局函数

> 不推荐使用

静态全局函数是一种特殊的函数，它的作用域仅限于定义它的文件。这意味着它不能被其他文件访问，从而实现了封装和信息隐藏

- 作用域：静态全局函数只能在定义它的文件中使用，其他文件无法访问

```cpp linenums="1"
#include <iostream>

// 静态全局函数
static void printMessage() {
    std::cout << "Hello, World!" << std::endl;
}

int main() {
    printMessage();  // 此函数只能在当前文件中使用
    return 0;
}
```

#### 2.3.2 静态全局变量

> 不推荐使用

静态全局变量是一种特殊的变量，==它的作用域仅限于定义它的文件==。这意味着它不能被其他文件访问，从而实现了封装和信息隐藏

- **作用域**：静态全局变量只能在定义它的文件中使用，其他文件无法访问
- **生命周期**：静态全局变量在程序开始时初始化，并在程序结束时销毁。它们在整个程序运行期间都存在

```cpp linenums="1"
#include <iostream>

// 静态全局变量
static int counter = 0;

void incrementCounter() {
    counter++;
}

void printCounter() {
    std::cout << "Counter: " << counter << std::endl;
}

int main() {
    incrementCounter();
    printCounter();
    return 0;
}
```

#### 2.3.3 静态局部变量

静态局部变量是一种特殊的局部变量，它在函数或代码块中定义，但其生命周期贯穿整个程序运行期间。静态局部变量在第一次调用时初始化，并在程序结束时销毁

- **作用域**：静态局部变量的作用域仅限于定义它的函数或代码块，但其生命周期贯穿整个程序运行期间
- **生命周期**：静态局部变量在第一次调用时初始化，并在程序结束时销毁。它们在整个程序运行期间都存在
- **初始化**：静态局部变量只在第一次调用时初始化，后续调用不会重新初始化

```cpp linenums="1"
#include <iostream>

void incrementCounter() {
    // 静态局部变量
    static int counter = 0;
    counter++;
    std::cout << "Counter: " << counter << std::endl;
}

int main() {
    incrementCounter(); // 输出: Counter: 1
    incrementCounter(); // 输出: Counter: 2
    incrementCounter(); // 输出: Counter: 3
    return 0;
}
```

#### 2.3.4 静态成员变量

静态成员变量是属于类而不是类的某个对象的变量。==它们在所有对象之间共享==，并且在程序开始时初始化，在程序结束时销毁

1. **类范围内共享**：静态成员变量在所有类的对象之间共享
2. **生命周期**：静态成员变量在程序开始时初始化，并在程序结束时销毁
3. **类外定义**：静态成员变量必须在类外定义和初始化（在类中的只是声明，实际在内存里，静态成员变量的位置不和类在一起，因此执行 `sizeof(class)` 时，会发现没有静态成员变量的参与）

注意事项：

1. 访问权限：静态成员变量可以是 public、protected 或 private。访问权限决定了它们在类外部的可见性
2. 初始化顺序：静态成员变量的初始化顺序在不同的编译单元之间是未定义的，这可能会导致一些难以发现的错误。应尽量避免在静态初始化期间依赖其他编译单元中的静态变量

```cpp linenums="1"
#include <iostream>

class MyClass {
public:
    // 静态成员变量声明
    static int staticVar;

    static void printStaticVar() {
        std::cout << "Static Variable: " << staticVar << std::endl;
    }
};

// 静态成员变量定义和初始化
int MyClass::staticVar = 0;

int main() {
    // 访问和修改静态成员变量
    MyClass::printStaticVar(); // 输出: Static Variable: 0
    MyClass::staticVar = 5;  // 可以直接通过类名来访问静态成员变量
    MyClass::printStaticVar(); // 输出: Static Variable: 5

    MyClass obj1, obj2;
    obj1.staticVar = 10;
    obj2.printStaticVar(); // 输出: Static Variable: 10

    return 0;
}
```

#### 2.3.5 静态成员函数

静态成员函数是属于类而不是类的某个对象的函数。它们可以在没有对象实例的情况下调用，==并且只能访问静态成员变量和其他静态成员函数==

1. **类范围内共享**：静态成员函数属于类，而不是类的某个对象
2. **无需对象实例**：静态成员函数可以在没有对象实例的情况下调用
3. **访问限制**：静态成员函数只能访问静态成员变量和其他静态成员函数，不能访问非静态成员变量和非静态成员函数

注意事项：

1. **访问权限**：静态成员函数可以是 public、protected 或 private。访问权限决定了它们在类外部的可见性
2. **不能访问非静态成员**：静态成员函数不能访问类的非静态成员变量和非静态成员函数，==因为它们没有 this 指针==

```cpp linenums="1"
#include <iostream>

class MyClass {
public:
    // 静态成员函数声明
    static void printMessage();

    // 静态成员变量声明
    static int staticVar;
};

// 静态成员函数定义
void MyClass::printMessage() {
    std::cout << "Hello from static member function!" << std::endl;
}

// 静态成员变量定义和初始化
int MyClass::staticVar = 0;

int main() {
    // 调用静态成员函数
    MyClass::printMessage(); // 输出: Hello from static member function!

    // 访问和修改静态成员变量
    MyClass::staticVar = 5;
    std::cout << "Static Variable: " << MyClass::staticVar << std::endl; // 输出: Static Variable: 5

    return 0;
}
```

### 2.4 总结

| types of variables | scope | lifetime | init.time |
|:---:|:---:|:---:|:---:|
| local variable | in {} | in {} | at the definition line |
| global variable | global | global | at the definition line, before main() |
| static local variable | in {} | global | the 1st time executed |
| static global variable | in file | global | as global variable |
| member variable | in class | as the object| at the creation of that object |
| static member variable | in class | global | at the definition line, before main() |

---

1. **栈（Stack）**：
      - 栈用于存储局部变量和函数调用信息（如返回地址、参数等）。当你在一个函数中声明一个局部变量时，它就会被分配到栈上
      - 栈上的变量具有自动存储期限，意味着它们在声明的代码块开始时被创建，在代码块结束时被销毁
      - 由于栈的大小通常限制于系统或编译器设置，因此不适合用来存储需要大量空间的数据
2. **堆（Heap）**：
      - 堆用于动态内存分配，即程序运行期间根据需求进行内存分配的地方
      - 使用 `new` 或 `malloc()` 等操作符/函数可以在堆上分配内存，并使用 `delete` 或 `free()` 来释放这些内存
      - 堆上的数据可以由整个程序访问（只要指针能够引用），并且直到显式释放或程序结束才会被销毁。这使得堆非常适合用来存储那些需要在整个程序执行过程中持续存在的数据
3. **全局变量区/静态存储区（Static Storage）**：
      - 这里存放的是全局变量、静态局部变量和静态全局变量
        - 全局变量是在任何函数之外声明的变量，它们的生命周期从程序开始到程序结束
        - 静态局部变量是在函数内部用 `static` 关键字声明的变量，它们在函数调用之间保持值不变
        - 静态全局变量是指在文件作用域内使用 `static` 关键字声明的变量，它的作用范围仅限于声明它的文件
      - 所有在全局变量区的变量都具有静态存储期限，这意味着它们在程序的整个执行期间都存在

除了上述提到的三个主要区域外，还有一个常量区，用于存放常量数据（如字符串字面量）

## 3 引用

**Reference**

引用就是别名（alias）

引用只能接收左值

### 左值与右值

## 4 Constant

成员函数后面的 const 实际修饰的是 this 指针

## 5 动态分配内存

