# 7 Inheritance

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Reusing

1. Reusing The Implementation（复用实现）：组合
2. Reusing The Interface（复用接口）：继承

## 2 Inheritance

继承是面向对象编程中的一种机制，用于从已有类（基类或父类）创建新类（派生类或子类）。派生类可以复用基类的成员（属性和方法），并可以扩展或重写基类的功能。继承表示一种 "is-a" 关系

继承的内容：派生类会继承基类的所有成员

1. 私有成员变量（虽然继承但不可直接访问）
2. 公有成员函数（可直接使用）
3. 私有成员函数（继承但不可直接调用）
4. 受保护成员（可在派生类中访问）
5. 静态成员（被所有派生类共享）

!!! tip "私有成员变量"

    - 基类的私有成员变量确实存在于派生类对象的内存布局中
    - 但派生类无法直接访问这些私有变量（这是封装性的体现）
    - 必须通过基类提供的公有或受保护成员函数来间接访问
    - 如果派生类定义了同名变量，这将是完全独立的新变量，不会覆盖基类的变量

不被继承的内容：

1. 构造函数
2. 析构函数
3. 赋值运算符
      1. 当派生类没有显式定义赋值运算符时：编译器会为派生类生成一个合成赋值运算符，这个合成版本会自动调用基类的赋值运算符
      2. 当派生类显式定义赋值运算符时：不会自动调用基类赋值运算符，必须手动调用基类版本，否则基类部分不会被正确赋值

### 2.1 定义继承

```cpp linenums="1"
class Base {
public:
    void baseFunction() {
        std::cout << "Base function" << std::endl;
    }
};

class Derived : public Base { // Derived 继承自 Base
public:
    void derivedFunction() {
        std::cout << "Derived function" << std::endl;
    }
};

int main() {
    Derived obj;
    obj.baseFunction();    // 调用基类方法
    obj.derivedFunction(); // 调用派生类方法
    return 0;
}
```

### 2.2 访问控制

继承可以通过以下三种方式指定访问权限：

1. `public` 继承：基类的 `public` 成员在派生类中仍然是 `public`，`protected` 成员在派生类中仍然是 `protected`
      -  对 struct 来说，`public` 是默认继承方式
2. `protected` 继承：基类的 `public` 和 `protected` 成员在派生类中都变为 `protected`
3. `private` 继承：基类的 `public` 和 `protected` 成员在派生类中都变为 `private`
      -  对 class 来说，`private` 是默认继承方式

```cpp linenums="1"
class Base {
public:
    int publicVar;
protected:
    int protectedVar;
private:
    int privateVar;
};

class PublicDerived : public Base {
    // publicVar -> public
    // protectedVar -> protected
    // privateVar -> 无法访问
};

class ProtectedDerived : protected Base {
    // publicVar -> protected
    // protectedVar -> protected
    // privateVar -> 无法访问
};

class PrivateDerived : private Base {
    // publicVar -> private
    // protectedVar -> private
    // privateVar -> 无法访问
};
```

### 2.3 特性

#### 2.3.1 构造函数与析构函数

- 构造函数：派生类的构造函数不会继承基类的构造函数，但可以通过初始化列表调用基类的构造函数

透传（forwarding）：派生类的构造函数需要将参数传递给基类的构造函数

```cpp linenums="1"
#include <iostream>
#include <string>

class Base {
public:
    Base(int x) {
        std::cout << "Base Constructor: x = " << x << std::endl;
    }
};

class Derived : public Base {
public:
    // 使用初始化列表调用基类的构造函数
    Derived(int x, const std::string& name) : Base(x), derivedName(name) {
        std::cout << "Derived Constructor: name = " << derivedName << std::endl;
    }

private:
    std::string derivedName;
};

int main() {
    Derived obj(42, "Example");
    return 0;
}
```

```cpp linenums="1" title="输出"
Base Constructor: x = 42
Derived Constructor: name = Example
```

- 析构函数：基类的析构函数应声明为 `virtual`，以确保派生类对象被正确销毁

```cpp linenums="1"
class Base {
public:
    Base() { std::cout << "Base Constructor" << std::endl; }
    virtual ~Base() { std::cout << "Base Destructor" << std::endl; }
};

class Derived : public Base {
public:
    Derived() { std::cout << "Derived Constructor" << std::endl; }
    ~Derived() { std::cout << "Derived Destructor" << std::endl; }
};

int main() {
    Base* obj = new Derived();
    delete obj; // 确保调用 Derived 和 Base 的析构函数
    return 0;
}
```

!!! tip "虚析构函数"

    在 C++ 中，如果一个类可能被继承（即作为基类），并且会通过 **基类指针** 或 **基类引用** 来管理派生类对象，那么它的析构函数必须声明为 `virtual`。否则，可能会导致派生类的析构函数不被调用，从而引发资源泄漏或未定义行为

    ```cpp linenums="1"
    class Base {
    public:
        Base() { std::cout << "Base Constructor\n"; }
        ~Base() { std::cout << "Base Destructor\n"; }  // 非虚析构函数
    };
    
    class Derived : public Base {
    public:
        Derived() { std::cout << "Derived Constructor\n"; }
        ~Derived() { std::cout << "Derived Destructor\n"; }
    };
    
    int main() {
        Base* ptr = new Derived();  // 基类指针指向派生类对象
        delete ptr;  // 仅调用 Base::~Base()，Derived::~Derived() 不会被调用！
        return 0;
    }
    ```

    - 由于 `Base::~Base()` 不是 `virtual`，`delete ptr` 只会调用基类的析构函数，而不会调用 `Derived::~Derived()`
    - 如果 `Derived` 类中有动态分配的内存（如 `new` 分配的堆内存），这些资源不会被释放，导致内存泄漏

    `virtual` 的作用：

    - 当基类析构函数是 `virtual` 时，`delete ptr` 会先调用 `Derived::~Derived()`，再调用 `Base::~Base()`，确保派生类的资源被正确释放
    - 如果没有 `virtual`，C++ 只会根据指针的静态类型（`Base*`）调用 `Base::~Base()`，而不会调用派生类的析构函数
    - 多态销毁：虚析构函数使得通过基类指针删除派生类对象时，能正确调用完整的析构链（派生类 → 基类）

#### 2.3.2 成员的覆盖与隐藏

- 覆盖（Override）：派生类可以重写基类的 `virtual` 函数
- 隐藏（Hiding）：如果派生类定义了与基类同名的非虚函数，基类的同名函数会被隐藏

```cpp linenums="1"
class Base {
public:
    virtual void func() {
        std::cout << "Base func" << std::endl;
    }
};

class Derived : public Base {
public:
    void func() override { // 重写基类的虚函数
        std::cout << "Derived func" << std::endl;
    }
};
```

### 2.4 类型

**1.单继承**：一个派生类只继承自一个基类

**2.多继承**：一个派生类可以继承自多个基类

多继承可能导致二义性问题和菱形继承问题

```cpp linenums="1"
class A {
public:
    void funcA() { std::cout << "A" << std::endl; }
};

class B {
public:
    void funcB() { std::cout << "B" << std::endl; }
};

class C : public A, public B {
    // C 同时继承 A 和 B
};
```

**菱形继承问题**：当一个类通过多个路径继承自同一个基类时，会导致基类的成员被多次继承

```cpp linenums="1"
class A {
public:
    void func() { std::cout << "A" << std::endl; }
};

class B : public A {};
class C : public A {};
class D : public B, public C {}; // D 中有两份 A 的拷贝
```

解决方法：使用虚拟继承

```cpp linenums="1"
class A {
public:
    void func() { std::cout << "A" << std::endl; }
};

class B : virtual public A {};
class C : virtual public A {};
class D : public B, public C {}; // D 中只有一份 A 的拷贝
```

### 2.5 `using` 声明

1.引入基类的构造函数：在派生类中，可以通过 `using` 声明引入基类的构造函数，使得派生类能够直接使用基类的构造函数

如果派生类定义了自己的构造函数，则不会覆盖基类的构造函数

```cpp linenums="1"
class Base {
public:
    Base(int x) { std::cout << "Base Constructor: " << x << std::endl; }
};

class Derived : public Base {
public:
    using Base::Base; // 引入基类的构造函数
};

int main() {
    Derived d(42); // 调用 Base 的构造函数
    return 0;
}
```

如果基类的构造函数带有默认参数，当派生类使用 `using` 声明继承基类构造函数时，不会继承默认参数值本身，而是会生成对应的多个重载构造函数，相当于为每个可能的参数组合创建单独的重载版本

```cpp linenums="1"
class A {
public:
    A(int a=3, double b=2.4) {}  // 一个带有两个默认参数的构造函数
};

class B : public A {
public:
    using A::A;  // 继承A的构造函数
    // 实际上会生成:
    // B(int, double)
    // B(int)
    // B()
};
```

!!! tip "默认参数构造函数的本质"

    一个带有默认参数的构造函数实际上相当于多个重载的构造函数

    ```cpp linenums="1"
    class A {
    public:
        A(int a=3, double b=2.4) {}  // 一个带有两个默认参数的构造函数
    };
    
    // 实际上等同于三个构造函数
    A(int, double);  // 需要两个参数
    A(int);         // 只需要一个int参数，b使用默认值
    A();            // 无参，a和b都使用默认值
    ```

2.改变基类成员的访问权限：通过 `using` 声明，可以改变基类成员在派生类中的访问权限

- 仅改变派生类中成员的访问权限，不影响基类中的权限
- 常用于将基类的 protected 或 private 成员提升为 public

```cpp linenums="1"
class Base {
protected:
    void func() { std::cout << "Base func" << std::endl; }
};

class Derived : public Base {
public:
    using Base::func; // 将 func 的访问权限从 protected 改为 public
};

int main() {
    Derived d;
    d.func(); // 现在可以访问 func
    return 0;
}
```

3.解决函数隐藏问题：在派生类中，如果定义了与基类同名的函数，基类的同名函数会被隐藏。通过 `using` 声明，可以显式引入基类的同名函数，解决隐藏问题（name hiding 问题）

- 通过 using 声明，可以同时保留基类和派生类的同名函数
- 避免了函数隐藏导致的访问问题

```cpp linenums="1"
class Base {
public:
    void func(int x) { std::cout << "Base func: " << x << std::endl; }
};

class Derived : public Base {
public:
    using Base::func; // 引入基类的 func
    void func() { std::cout << "Derived func" << std::endl; }
};

int main() {
    Derived d;
    d.func();    // 调用派生类的 func
    d.func(42);  // 调用基类的 func
    return 0;
}
```

4.引入基类的类型定义：`using` 声明可以用来引入基类的类型定义，方便在派生类中使用

```cpp linenums="1"
class Base {
public:
    using ValueType = int; // 基类中的类型定义
};

class Derived : public Base {
public:
    using Base::ValueType; // 引入基类的类型定义
    ValueType value;
};
```

## Homework

???+ question "PTA 7.4"

    For the code segment below, in the main(), 

    1. the output at //1 is
    2. the output at //2 is
    3. the output at //3 is
    4. the output at //4 is

    ```cpp linenums="1"
    class A{
        int i;
    public:
        A(int ii=0):i(ii) { cout << 1; }
        A(const A& a) {
            i = a.i;
            cout << 2;     
        }
        void print() const { cout << 3 << i; }
    };
    
    class B : public A {
        int i;
        A a;
    public:
        B(int ii = 0) : i(ii) { cout << 4; }
        B(const B& b) {
            i = b.i;
            cout << 5;
        }
        void print() const {
            A::print();
            a.print();
            cout << 6 << i;    
        }
    };
    
    int main()
    {
        B b(2);        //1
        b.print();    //2
        B c(b);        //3
        c.print();    //4
    }
    ```

    ??? success "答案"

        114<br>
        303062<br>
        115<br>
        303062

        ---

        **//1**

        构造 b：

        1. 基类 A 的初始化：
              - 没有显式调用 A 的构造函数，使用 A 的默认构造函数 A(int ii = 0)，ii 默认为 0
              - A::i 初始化为 0，输出 1
        2. 成员 a 的初始化：
              - A a 使用 A 的默认构造函数，a.i 初始化为 0，输出 1
        3. B 的构造函数体：
              - i 初始化为 2，输出 4
        
        输出：1（A 的构造） 1（a 的构造） 4（B 的构造体）
        
        //1 的输出：114

        ---

        **//2**

        b.print()：

        1. A::print()：
              - A 的 i 是 0（因为基类 A 的 i 在构造时被初始化为 0）
              - 输出 3 和 i 的值 0，即 30
        2. a.print()：
              - a 的 i 是 0（因为 a 的 i 在构造时被初始化为 0）
              - 输出 3 和 i 的值 0，即 30
        3. cout << 6 << i：
              - B 的 i 是 2（构造函数中初始化为 2）
              - 输出 6 和 2，即 62
        
        组合输出：30 30 62
        
        //2 的输出：303062

        ---
        
        **//3**

        拷贝构造 c 从 b：

        1. 基类 A 的初始化：
              - 没有显式调用 A 的拷贝构造函数，使用 A 的默认构造函数 A(int ii = 0)
              - A::i 初始化为 0，输出 1
        2. 成员 a 的初始化：
              - A a 使用 A 的默认构造函数，a.i 初始化为 0，输出 1
        3. B 的拷贝构造函数体：
              - i 初始化为 b.i（即 2），输出 5
        
        输出：1（A 的默认构造） 1（a 的默认构造） 5（B 的拷贝构造体）
        
        //3 的输出：115

        ---

        **//4**

        c.print()：

        1. A::print()：
              - A 的 i 是 0（因为基类 A 的 i 在拷贝构造时被默认初始化为 0）
              - 输出 3 和 i 的值 0，即 30
        2. a.print()：
              - a 的 i 是 0（因为 a 的 i 在拷贝构造时被默认初始化为 0）
              - 输出 3 和 i 的值 0，即 30
        3. cout << 6 << i：
              - B 的 i 是 2（拷贝构造函数中从 b.i 复制为 2）
              - 输出 6 和 2，即 62
        
        组合输出：30 30 62
        
        //4 的输出：303062
