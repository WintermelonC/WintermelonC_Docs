# 4 Inside Object

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

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

==友元关系是单向的，且不具有传递性或继承性==

友元提高了程序的运行效率，但同时破坏了类的封装性和数据的隐藏性

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

引用是 C++ 中的一种变量类型，它是某个已存在变量的别名（alias）。==引用在定义时必须被初始化，并且一旦绑定到某个变量，就无法更改绑定==

特点：

1. 必须初始化：引用在定义时必须绑定到一个变量
2. 不可更改绑定：引用一旦绑定到某个变量，就无法再绑定到其他变量
3. 操作引用即操作原变量：对引用的操作会直接影响到它所绑定的变量

> 在函数参数列表或类成员变量中，可以声明引用而不立即初始化。初始化将由函数的调用者或类的构造函数来完成

```cpp linenums="1"
int a = 10;
int& ref = a; // ref 是 a 的引用

// 之后对 ref 的任何操作都会直接影响 a
```

!!! tip "引用与指针的区别"

    | 特性 | 引用 | 指针 |
    | :--: | :--: | :--: |
    | 是否必须初始化 | 必须初始化 | 可以不初始化 |
    | 是否可以更改绑定 | 不可以更改绑定 | 可以更改指向的地址 |
    | 是否可以为 `null` | 不可以为 `null` | 可以为 `null` |
    | 语法 | 使用 `&` 定义引用 | 使用 `*` 定义指针 | 
    | 操作复杂性 | 更简单，直接操作变量 | 需要解引用操作符 `*` |

引用的目标必须有明确的内存位置。引用必须绑定到一个具体的、已存在的对象，而不能绑定到一个临时值或表达式的结果

```cpp linenums="1"
void func(int &);  
func(i * 3);
// func(i * 3); 会引发警告或错误
// 因为 i * 3 是一个临时值，没有明确的内存位置，不能作为引用的目标
```

限制：

1. 没有引用的引用
2. 没有指向引用的指针：`int &*p`
3. 允许指针的引用：`void f(int *&p)`
4. 没有“引用数组”
      - 不能定义一个数组，其元素是引用

### 3.1 作为函数参数

引用常用于函数参数，避免值传递时的拷贝开销，同时允许函数直接修改传入的变量

```cpp linenums="1"
#include <iostream>
using namespace std;

void increment(int& num) {
    num++; // 修改引用会直接影响原变量
}

int main() {
    int a = 5;
    increment(a); // 传递 a 的引用
    cout << "a = " << a << endl; // 输出：a = 6
    return 0;
}
```

优点：

1. 避免了值传递时的拷贝开销
2. 可以 ==直接修改传入的变量==

### 3.2 作为函数返回值

函数可以返回一个引用，从而允许函数直接返回变量本身，而不是其副本

```cpp linenums="1"
#include <iostream>
using namespace std;

int& getValue(int& num) {
    return num; // 返回引用
}

int main() {
    int a = 10;
    int& ref = getValue(a); // ref 是 a 的引用
    ref = 20; // 修改 ref 会直接影响 a
    cout << "a = " << a << endl; // 输出：a = 20
    return 0;
}
```

注意：

1. 返回引用时，必须确保返回的变量在函数外部仍然有效
2. 不要返回局部变量的引用，因为局部变量在函数结束后会被销毁

### 3.3 常量引用

常量引用用于防止通过引用修改原变量，通常用于函数参数，特别是当传递大型对象时

```cpp linenums="1"
#include <iostream>
using namespace std;

void printValue(const int& num) {
    // num 是常量引用，不能修改
    cout << "Value: " << num << endl;
}

int main() {
    int a = 10;
    printValue(a); // 传递 a 的引用
    return 0;
}
```

优点：

1. 提高了代码的安全性，防止意外修改变量
2. 避免了值传递时的拷贝开销

### 3.4 引用与数组

引用不能直接绑定到数组，但可以通过函数参数传递数组的引用

```cpp linenums="1"
#include <iostream>
using namespace std;

void modifyArray(int (&arr)[5]) { // 引用数组
    arr[0] = 100; // 修改数组的第一个元素
}

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    modifyArray(arr); // 传递数组引用
    cout << "arr[0] = " << arr[0] << endl; // 输出：arr[0] = 100
    return 0;
}
```

### 3.5 左值与右值

<div class="grid" markdown>
<div class="card" markdown>

左值是指程序中有明确地址的表达式，可以出现在赋值操作符的左侧

特点：

1. 左值是持久的，表示内存中的某个位置
2. 可以对左值进行赋值操作

例如：变量、数组元素、引用

</div>
<div class="card" markdown>

右值是指程序中没有明确地址的表达式，通常是临时值或字面量，不能出现在赋值操作符的左侧

特点：

1. 右值是短暂的，通常在表达式结束后就会被销毁
2. 右值只能出现在赋值操作符的右侧

例如：字面量、表达式的结果、临时对象

</div>
</div>

#### 3.5.1 左值引用与右值引用

<div class="grid cards" markdown>
<div class="card" markdown>

- 左值引用是绑定到左值的引用
- 用法：通过 `&` 定义

```cpp linenums="1"
int a = 10;
int& ref = a; // ref 是 a 的左值引用
ref = 20;     // 修改 ref 会直接影响 a
```

</div>
<div class="card" markdown>

- 右值引用是绑定到右值的引用
- 用法：通过 `&&` 定义
- 右值引用通常用于移动语义和避免不必要的拷贝
- 通过右值引用实现移动语义以及完美转发

```cpp linenums="1"
int&& rref = 10; // rref 是绑定到右值 10 的右值引用
rref = 20;       // 修改 rref
```
</div>
</div>

### 3.6 引用与右值

一般来说，引用只能引用左值，但存在一个叫右值引用的东东

- 右值通常用于临时计算结果
- 右值可以通过右值引用传递给函数

```cpp linenums="1"
void print(int&& rref) {
    std::cout << rref << std::endl;
}

int main() {
    print(10); // 传递右值
    return 0;
}
```

```cpp linenums="1"
const int& ref1 = 10; // 右值可以绑定到 const 左值引用
int&& ref2 = 10;      // 右值可以绑定到右值引用
```

## 4 Constant

`const` 是 C++ 中的关键字，用于定义常量或不可修改的变量。它可以用来修饰变量、函数参数、函数返回值、成员函数等，表示这些内容在程序运行期间不能被修改

- 在 C++ 中，const 变量默认具有内部链接（internal linkage），这意味着它们仅在定义它们的文件内可见
- 编译器通常会尝试优化 const 变量的存储，将其值保存在符号表中，而不是分配实际的内存空间
- 如果需要使 const 变量具有外部链接（external linkage），以便在其他文件中访问，可以使用 extern 关键字来强制分配存储空间

### 4.1 修饰变量

**修饰普通变量**

```cpp linenums="1"
const int a = 10; // a 是常量，不能被修改
a = 20;           // 错误：尝试修改 const 变量
```

**修饰指针**

| 声明 | 含义 |
| :--: | :--: |
| const int* p | 指针指向的值是常量，不能通过指针修改值，但可以改变指针指向的地址 |
| int* const p | 指针本身是常量，不能改变指针指向的地址，但可以通过指针修改值 |
| const int* const p | 指针本身和指针指向的值都是常量，既不能修改值，也不能改变指针指向的地址 |

| | `int i` | `const int ci = 3` |
| :--: | :--: | :--: |
| `int *ip` | `ip = &i` | ~~`ip = &ci`~~ 错误 |
| `const int *cip` | `cip = &i` | `cip = &ci` |

```cpp linenums="1"
int x = 10;
int y = 20;

// 指针本身是常量，即指针的值（地址）不能改变
int* const p1 = &x;
// p1 = &y; // 错误：p1 是常量指针，不能修改指向的地址
*p1 = 30; // 正确：可以修改指针指向的值

// 指针指向的值是常量，即指针指向的值不能改变
const int* p2 = &x;
p2 = &y; // 正确：可以修改指针指向的地址
// *p2 = 30; // 错误：不能修改指针指向的值

// 指针本身和指向的值都是常量
const int* const p3 = &x;
// p3 = &y; // 错误：不能修改指针指向的地址
// *p3 = 30; // 错误：不能修改指针指向的值
```

**字符串字面量**（string literals）

`char* s = "Hello, world!";`

1. 这实际上是一个 `const char *s`，但编译器在没有 `const` 的情况下也接受它
2. 字符串字面量通常存储在只读内存区域，这意味着它们的内容在程序运行期间不应被修改。不要尝试更改字符值（这是未定义行为，尝试修改字符串字面量的内容可能会导致程序崩溃或其他不可预测的行为）
3. 如果想更改字符串，将其放入数组中：`char s[] = "Hello, world!";`

### 4.2 修饰函数参数

**修饰常量参数**

```cpp linenums="1"
void printValue(const int value) {
    // value 是常量，不能被修改
    // value = 20; // 错误
    std::cout << value << std::endl;
}
```

**传递常量引用**

```cpp linenums="1"
void printValue(const int& value) {
    // value 是常量引用，不能通过引用修改原变量
    // value = 20; // 错误
    std::cout << value << std::endl;
}

int main() {
    int a = 10;
    printValue(a); // 传递变量
    printValue(20); // 传递右值
    return 0;
}
```

优点：

1. 避免了值传递时的拷贝开销
2. 防止函数修改传入的参数，提高代码安全性

### 4.3 修饰函数返回值

**返回常量值**

```cpp linenums="1"
const int getValue() {
    return 10;
}

int main() {
    int a = getValue();
    // getValue() = 20; // 错误：返回值是常量，不能被赋值
    a = 20;  // a 可以被修改
    return 0;
}
```

**返回常量引用**

```cpp linenums="1"
const int& getValue(const int& value) {
    return value;
}

int main() {
    int a = 10;
    const int& ref = getValue(a);
    // ref = 20; // 错误：返回值是常量引用，不能被修改
    return 0;
}
```

### 4.4 修饰成员变量

**常量成员变量**

```cpp linenums="1"
class MyClass {
private:
    const int value;

public:
    MyClass(int v) : value(v) {} // 必须通过构造函数初始化常量成员变量

    void printValue() const {
        std::cout << value << std::endl;
    }
};
```

### 4.5 修饰成员函数

**常量成员函数**

成员函数后面的 const 实际上修饰的是 this 指针，所以常量成员函数不能修改成员变量

```cpp linenums="1"
class MyClass {
private:
    int value;

public:
    MyClass(int v) : value(v) {}

    void printValue() const {
        // value = 20; // 错误：常量成员函数不能修改成员变量
        std::cout << value << std::endl;
    }
};
```

特点：

1. 常量成员函数不能修改类的成员变量（除非成员变量被声明为 mutable）
2. 常量成员函数可以被 const 对象调用

### 4.6 修饰类对象

**常量对象**

```cpp linenums="1"
class MyClass {
private:
    int value;

public:
    MyClass(int v) : value(v) {}

    void setValue(int v) {
        value = v;
    }

    void printValue() const {
        std::cout << value << std::endl;
    }
};

int main() {
    const MyClass obj(10); // 常量对象
    obj.printValue(); // 正确：可以调用常量成员函数
    // obj.setValue(20); // 错误：不能调用非常量成员函数
    return 0;
}
```

### 4.7 修饰静态成员变量

静态成员变量可以被 `const` 修饰，但必须在类外初始化

```cpp linenums="1"
class MyClass {
public:
    static const int value; // 静态常量成员变量
};

const int MyClass::value = 10; // 在类外初始化
```

---

### 4.8 总结

1. 传递对象与传递指针：
      - 在 C++ 中，传递整个对象（如结构体或类实例）可能会导致性能开销，尤其是当对象较大时。这是因为传递对象通常涉及复制整个对象的内容
      - 通过传递指针（或引用），可以避免这种开销，因为只传递对象的内存地址，而不是对象本身
2. 修改原始值的风险：
      - 传递指针时，函数内部可以通过指针修改原始对象的值。这在某些情况下是期望的行为，但在其他情况下可能会导致意外的副作用
      - 为了防止函数意外修改原始对象，可以使用 `const` 关键字来修饰指针。例如，`const MyClass* ptr` 表示 `ptr` 指向的对象是只读的，不能通过 `ptr` 修改
3. `const` 的使用：
      - 在函数参数中使用 `const` 可以增加代码的安全性和可读性。它明确表示函数不会修改传入的对象

## 5 动态分配内存

动态内存分配允许程序在运行时根据需要分配和释放内存，而不是在编译时确定内存大小。C++ 提供了 `new` 和 `delete` **操作符** 来管理动态内存

> `new` 和 `delete` 是操作符，不是函数

1. 堆（Heap）：动态分配的内存来自堆
2. 优点：灵活性高，可以根据程序运行时的需求分配内存
3. 缺点：需要手动管理内存，可能导致内存泄漏或悬空指针

### 5.1 使用 `new` 分配内存

**分配单个变量**

```cpp linenums="1"
int* ptr = new int; // 分配一个 int 类型的内存
*ptr = 42;          // 给动态分配的内存赋值
std::cout << *ptr << std::endl; // 输出：42
```

**分配数组**

```cpp linenums="1"
int* arr = new int[5]; // 分配一个包含 5 个 int 元素的数组
for (int i = 0; i < 5; ++i) {
    arr[i] = i * 10; // 初始化数组
}
for (int i = 0; i < 5; ++i) {
    std::cout << arr[i] << " "; // 输出：0 10 20 30 40
}
```

**分配对象**

```cpp linenums="1"
class MyClass {
public:
    MyClass() { std::cout << "Constructor called" << std::endl; }
    ~MyClass() { std::cout << "Destructor called" << std::endl; }
};

MyClass* obj = new MyClass(); // 动态分配一个对象
```

### 5.2 使用 `delete` 释放内存

**释放单个变量**

```cpp linenums="1"
delete ptr; // 释放动态分配的单个变量
ptr = nullptr; // 避免悬空指针
```

**释放数组**

```cpp linenums="1"
delete[] arr; // 释放动态分配的数组
arr = nullptr; // 避免悬空指针
```

**释放对象**

先调用析构函数，再释放内存

```cpp linenums="1"
delete obj; // 调用对象的析构函数并释放内存
obj = nullptr; // 避免悬空指针
```

### 5.3 常见问题

**内存泄漏**

如果动态分配的内存没有被释放，就会导致内存泄漏

```cpp linenums="1"
int* leak = new int(42);
// 没有调用 delete，导致内存泄漏
```

**悬空指针**

释放内存后，指针仍然指向已释放的内存，称为悬空指针

```cpp linenums="1"
int* dangling = new int(42);
delete dangling; // 释放内存
// dangling 仍然指向已释放的内存
```

**使用未初始化的指针**

```cpp linenums="1"
int* uninitialized;
*uninitialized = 42; // 未初始化的指针，可能导致未定义行为
```

!!! tip "`new` and `delete`"

    1. 不要使用 `delete` 去释放 `new` 没有分配的内存
    2. 不要使用两次 `delete` 去释放同一个内存
    3. 使用 `delete[]` 和 `new[]` 去操作数组
    4. 如果 `new` 给单个对象分配内存，使用 `delete` 释放内存
    5. `delete` 一个空指针是安全的

## Homework

???+ question "PTA 4.4"

    假设 A 是一个类的名字，下面程序片段，类 A 会调用析构函数几次？

    ```cpp linenums="1"
    int main() {
        A * p = new A[2];
        A * p2 = new A;
        A a;
        delete [] p;
    }
    ```

    A.1<br/>
    B.2<br/>
    C.3<br/>
    D.4

    ??? success "答案"

        C

        ---

        1. `A *p = new A[2];`
              1. 动态分配了一个包含 2 个 A 对象的数组，会调用 2 次构造函数（默认构造函数 A()）
              2. 析构时需要 delete[] p 来释放，这会调用 2 次析构函数
        2. `A *p2 = new A;`
              1. 动态分配了 1 个 A 对象，调用 1 次构造函数（默认构造函数 A()）
              2. 但程序中没有 delete p2;，所以 不会调用析构函数（内存泄漏）
        3. `A a;`
              1. 在栈上创建 1 个 A 对象，调用 1 次构造函数（默认构造函数 A()）
              2. 对象 a 在 main 函数结束时自动析构，调用 1 次析构函数