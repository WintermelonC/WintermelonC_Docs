# 继承与多态

[C++ Inheritance](../../../zju/basic_courses/OOP/ch7.md){:target="_blank"}<br/>
[c++ Polymorphism](../../../zju/basic_courses/OOP/ch8.md){:target="_blank"}

## 1 函数重写、隐藏与 `override`

### 1.1 隐藏（Name Hiding）

派生类中只要定义了**同名函数**（不看参数），就会隐藏基类中 **所有** 同名的重载版本：

```cpp linenums="1"
class Base {
public:
    void f()        { cout << "f()\n"; }
    void f(int x)   { cout << "f(int)\n"; }
};

class Derived : public Base {
public:
    void f() { cout << "Derived f()\n"; }   // 隐藏了 Base 的 f(int)
};

int main() {
    Derived d;
    d.f();       // ✓ 调用 Derived::f()
    // d.f(1);   // ✗ 编译错误！Base::f(int) 被隐藏了
}
```

若想保留基类的重载版本，使用 `using` 声明：

```cpp linenums="1"
class Derived : public Base {
public:
    using Base::f;   // 把 Base 的 f 都引入进来
    void f() { cout << "Derived f()\n"; }
};
// 现在 d.f(1) 可以调用了
```

### 1.2 `override` 与 `final`

```cpp linenums="1"
class Base {
public:
    virtual void f() {}
    virtual void g() const {}
};

class Derived : public Base {
public:
    void f() override {}      // ✓ 正确重写
    // void g() override {}   // ✗ 编译错误！签名不匹配（少了 const）
};

class FinalClass final {};    // 不能被继承的类
// class X : public FinalClass {};  // ✗ 编译错误
```

- `override`：显式声明"我在重写虚函数"，编译器会检查签名是否匹配，防止笔误
- `final`：修饰函数表示"禁止再重写"，修饰类表示"禁止被继承"

## 2 虚函数与多态

当一个类含有虚函数时，编译器会为它做两件事：

1. 为该类生成一张 **虚函数表（vtable）**—— 一个存放虚函数地址的数组
2. 让该类的每个对象内部多一个隐藏指针 **vptr**，指向所属类的 vtable

调用虚函数时，编译器把 `p->f()` 编译成一次 **间接跳转**：

```cpp linenums="1"
p->f();   // 大致等价于：(*p->vptr[n])(p)
```

先通过 `vptr` 找到 vtable，再取出第 `n` 个槽位的函数地址并调用。因此实际执行的是 **对象真实类型** 对应的版本，这就是多态的运行时基础

### 2.1 存储位置

| 内容 | 存储位置 | 数量 | 何时生成 |
|---|---|---|---|
| **vtable** | 只读数据段（`.rodata` / `.rdata`） | **每个多态类一张**，该类的所有对象共享 | 编译期生成 |
| **vptr** | **对象内部**（堆/栈/数据段，取决于对象本身在哪） | **每个对象一个** | 构造函数中设置 |

#### 2.1.1 vtable 存在只读数据段

vtable 由编译器在编译期确定，内容不可变（函数地址是编译期已知的），所以被放入 **只读数据段**。同一类的所有对象共享同一张 vtable，这正是为什么虚函数机制几乎不增加对象内存 —— 只多了 **一个 vptr**（64 位下 8 字节）

```mermaid
graph LR
    subgraph "只读数据段 .rodata"
        V[Dog 的 vtable]
    end
    subgraph "对象（堆/栈）"
        O1["对象 d1<br/>vptr →"] 
        O2["对象 d2<br/>vptr →"]
    end
    O1 --> V
    O2 --> V
```

#### 2.1.2 vptr 存在对象内部

vptr 是对象数据的一部分，对象在哪它就在哪：

- 对象在栈上 → vptr 在栈上
- 对象在堆上（`new`）→ vptr 在堆上
- 对象是全局变量 → vptr 在数据段

至于 vptr 在对象内的 **具体偏移**，标准不规定，是 ABI 的实现细节。实践上（GCC/Clang/MSVC）单继承时通常放在对象内存的 **最开头**（偏移 0），这样取 vptr 最快：

```text
对象内存布局（单继承，常见实现）：
┌──────────────────────┐
│ vptr  (8 字节)        │ ← 偏移 0
├──────────────────────┤
│ 基类数据成员           │
├──────────────────────┤
│ 派生类数据成员         │
└──────────────────────┘
```

!!! tip "RTTI 信息也挂在 vtable 附近"

    在实践中（Itanium ABI / MSVC），vtable 的槽位数组之前还存有 `type_info` 指针（RTTI 的运行时类型信息）。所以 `typeid(*p)`、`dynamic_cast` 能工作，正是靠 vptr → vtable → type_info 这条链。

!!! tip "虚函数调用的开销"

    ```cpp linenums="1"
    Animal* p = new Dog();
    p->move();
    ```
    
    非虚调用：`call Animal::move`（直接跳转，可内联优化）
    
    虚调用：`mov rax, [p]` → 取 vptr；`mov rax, [rax + 8*n]` → 取第 n 个槽位；`call rax` → 间接调用。
    
    代价主要是 **一次间接寻址 + 难以内联**（除非编译器能静态证明对象的真实类型，如 `devirtualization` 优化）。这也是为什么"无关继承的类不要随便加 virtual"

### 2.2 构造/析构函数中调用虚函数的行为

这是最容易踩坑的地方，核心规则只有一句：**在构造函数和析构函数（及其调用的其他函数）中调用虚函数，不会发生动态绑定，调用的是"当前正在构造/析构的那个类"的版本**

#### 2.2.1 构造函数中的虚调用

```cpp linenums="1"
class Base {
public:
    Base() { f(); }                       // ① 构造中调用虚函数
    virtual void f() { cout << "Base::f\n"; }
};

class Derived : public Base {
public:
    Derived() {}                          // ②
    void f() override { cout << "Derived::f\n"; }
};

int main() {
    Derived d;
    // 输出：Base::f（不是 Derived::f！）
}
```

输出是 `Base::f` 而不是 `Derived::f`。**原因**：

构造 `Derived d` 时，执行顺序是"先基类后派生类"：

1. 进入 `Base::Base()` 时，`Derived` 的成员 **还没初始化**，此刻对象在语义上"只是"一个 `Base`。编译器把 vptr 设置为 **Base 的 vtable**
2. 因此 `Base()` 里调用的 `f()` 通过 vptr 绑定到 `Base::f`
3. `Base()` 结束后，vptr 才被改成 **Derived 的 vtable**，之后虚调用才会绑定到 `Derived` 版本

如果这里真的动态绑定到 `Derived::f`，就会在派生类成员尚未构造时访问它们 → **未定义行为**。所以标准强制构造/析构中的虚调用是静态绑定的，这本质是一种安全保护

#### 2.2.2 析构函数中的虚调用

对称地，析构顺序是"先派生类后基类"：

```cpp linenums="1"
class Base {
public:
    virtual ~Base() { f(); }             // 析构中调用虚函数
    virtual void f() { cout << "Base::f\n"; }
};

class Derived : public Base {
public:
    ~Derived() {}
    void f() override { cout << "Derived::f\n"; }
};

int main() {
    Derived d;
    // 析构时输出：Base::f
}
```

当 `~Derived()` 执行完、进入 `~Base()` 时，`Derived` 的部分 **已经析构完了**，此时 vptr 已被重新设回 **Base 的 vtable**，所以 `f()` 绑定到 `Base::f`

!!! tip "vptr 在构造/析构期间的动态变化"

    以构造一个三层继承对象 `C → B → A` 为例：
    
    | 阶段 | 正在执行的构造函数 | vptr 指向 |
    |---|---|---|
    | 1 | `A::A()` | A 的 vtable |
    | 2 | `B::B()` | B 的 vtable |
    | 3 | `C::C()` | C 的 vtable |
    
    析构时完全倒过来：
    
    | 阶段 | 正在执行的析构函数 | vptr 指向 |
    |---|---|---|
    | 1 | `C::~C()` | C 的 vtable |
    | 2 | `B::~B()` | B 的 vtable |
    | 3 | `A::~A()` | A 的 vtable |
    
    所以"在哪个类的构造/析构里，就调用哪个类的虚函数版本"

!!! tip "最危险的坑：构造中调用纯虚函数"

    ```cpp linenums="1"
    class Base {
    public:
        Base() { f(); }          // 危险！
        virtual void f() = 0;    // 纯虚函数
    };
    
    class Derived : public Base {
    public:
        void f() override {}
    };
    
    int main() {
        Derived d;   // 未定义行为，通常直接崩溃
    }
    ```
    
    此时 vtable 中 `f` 的槽位是纯虚函数的占位符（如 `__cxa_pure_virtual`），调用它会导致程序终止。**永远不要在构造函数/析构函数（直接或间接）调用纯虚函数**

### 2.3 多继承下的 vtable

多继承时，每个"带虚函数的基类子对象"都有自己独立的 vptr 和 vtable：

```cpp linenums="1"
class Base1 {
public:
    virtual void f1() { cout << "Base1::f1" << endl; }
    virtual void f2() { cout << "Base1::f2" << endl; }
};

class Base2 {
public:
    virtual void g1() { cout << "Base2::g1" << endl; }
    virtual void g2() { cout << "Base2::g2" << endl; }
};

class Derived : public Base1, public Base2 {
public:
    virtual void f1() override { cout << "Derived::f1" << endl; }   // 覆盖 Base1::f1
    virtual void g1() override { cout << "Derived::g1" << endl; }   // 覆盖 Base2::g1
    virtual void h1() { cout << "Derived::h1" << endl; }            // 新增
};
```

```text
Derived 对象:
+---------------------------+  ← 对象起始地址 (假设为 0x1000)
| vptr1 (指向 Base1 相关的虚函数表) |  ← 8 字节
+---------------------------+
| Base1 的其他成员变量       |
+---------------------------+
| vptr2 (指向 Base2 相关的虚函数表) |  ← 8 字节，位置在 0x1000 + sizeof(Base1部分)
+---------------------------+
| Base2 的其他成员变量       |
+---------------------------+
| Derived 自己的成员变量     |
+---------------------------+
```

```text
vtable1 内容:
[0] -> Derived::f1()   (覆盖 Base1::f1)
[1] -> Base1::f2()     (未覆盖)
[2] -> Derived::h1()   (Derived 新增的虚函数，放在第一个基类的表中)
[3] -> 特殊调整函数     (称为 "thunk"，用于 this 指针调整)

vtable2 内容:
[0] -> Derived::g1()   (覆盖 Base2::g1)
[1] -> Base2::g2()     (未覆盖)
[2] -> 特殊调整函数     (thunk，用于 this 指针调整)
```

#### 2.3.1 this 指针调整

当通过 `Base2*` 指针调用 `g1()` 时：

```cpp linenums="1"
Derived d;
Base2* p = &d;  // 发生了指针偏移！p 指向 Derived 对象内部的 Base2 子对象
p->g1();        // 调用 Derived::g1()
```

问题：`Derived::g1()` 函数期望收到的 `this` 指针是整个 `Derived` 对象的起始地址（即指向 `vptr1` 的位置），但 `p` 指向的是 `Base2` 子对象的起始地址（即 `vptr2` 的位置）

解决方法：编译器在 `Base2` 的虚函数表中插入了一个 "thunk"（调整桩）

`p->g1()` 调用流程:

1. 从 `p` 指向的位置读取 `vptr2`
2. 从 `vtable2` 的 `[0]` 位置取出函数地址 (实际是 thunk)
3. 调用 thunk
4. thunk 内部执行：`this = this - offset` (调整到 `Derived` 对象的起始地址)
5. thunk 跳转到真正的 `Derived::g1(this)`

## 3 纯虚函数与抽象类

```cpp linenums="1"
class Shape {                       // 抽象类
public:
    virtual double area() const = 0;   // 纯虚函数
    virtual ~Shape() {}
};

class Circle : public Shape {
    double r;
public:
    double area() const override { return 3.14 * r * r; }
};

// Shape s;   // ✗ 抽象类不能实例化
Circle c;     // ✓ 实现了所有纯虚函数才能实例化
```

- 纯虚函数用 `= 0` 声明，没有函数体
- 含纯虚函数的类是 **抽象类**，不能创建对象
- 派生类必须实现所有纯虚函数，否则它也是抽象类

## 4 虚析构函数

```cpp linenums="1"
class Base {
public:
    ~Base() { cout << "Base 析构\n"; }
};

class Derived : public Base {
    int* data = new int[100];
public:
    ~Derived() { delete[] data; cout << "Derived 析构\n"; }
};

int main() {
    Base* p = new Derived();
    delete p;   // 只调用了 ~Base()，Derived 的 data 泄漏！
}
```

**问题**：通过基类指针 `delete` 派生类对象时，若基类析构函数不是虚函数，只会调用基类析构，派生类的析构（和资源释放）不会执行 → **内存泄漏**

**解决**：把基类析构函数声明为 `virtual`：

```cpp linenums="1"
class Base {
public:
    virtual ~Base() { cout << "Base 析构\n"; }   // 虚析构
};
// 现在 delete p 会先调用 ~Derived()，再调用 ~Base()
```

!!! danger "经验法则"

    只要一个类 **设计为被继承**（含虚函数或会被多态使用），就应把析构函数声明为 `virtual`。反过来，若类 **不含任何虚函数**、也不作为基类，则不必加 virtual（省一个 vptr 的开销）

## 5 多重继承与菱形继承

### 5.1 多重继承

```cpp linenums="1"
class Flyable { public: void fly(); };
class Swimmable { public: void swim(); };

class Duck : public Flyable, public Swimmable {
    // 同时继承两个基类
};
```

多重继承会导致 **菱形继承（钻石问题）**：

```mermaid
graph TD
    A((Animal)) --> B((Bird))
    A --> C((Fish))
    B --> D((Penguin?))
    C --> D
```

```cpp linenums="1"
class Animal { public: int age; };
class Bird  : public Animal {};
class Fish  : public Animal {};
class Duck  : public Bird, public Fish {};
// Duck 对象里有两份 age：Bird::age 和 Fish::age，产生二义性
```

### 5.2 虚继承解决菱形问题

```cpp linenums="1"
class Animal { public: int age; };
class Bird  : virtual public Animal {};   // 虚继承
class Fish  : virtual public Animal {};
class Duck  : public Bird, public Fish {};
// Duck 对象里只有一份 Animal 子对象
```

虚继承让共同基类在最终派生类中只保留一份，消除二义性，但会增加实现复杂度和运行时开销（虚基类通过指针访问）

## 6 继承中的其他注意点

1. **友元关系不继承**：基类的友元不会自动成为派生类的友元
2. **静态成员共享**：基类的 `static` 成员在整个继承层次中只有一份，所有派生类共享
3. **构造函数、析构函数、赋值运算符、友元函数都不被继承**（但派生类构造时仍会调用基类构造）
4. **类型转换**：派生类对象可隐式转换为基类引用/指针（向上转型），反之（向下转型）需 `static_cast` / `dynamic_cast`（多态时）

```cpp linenums="1"
Derived d;
Base& b = d;              // ✓ 向上转型（隐式）
Derived* pd = dynamic_cast<Derived*>(&b);  // 向下转型需显式转换
```
