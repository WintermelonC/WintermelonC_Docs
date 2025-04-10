# 7 Inheritance

!!! tip "说明"

    本文档正在更新中……

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
2. `protected` 继承：基类的 `public` 和 `protected` 成员在派生类中都变为 `protected`
3. `private` 继承：基类的 `public` 和 `protected` 成员在派生类中都变为 `private`

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