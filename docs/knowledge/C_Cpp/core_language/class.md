# Class

## 构造函数

构造函数不是给对象赋值，而是建立对象不变式的过程。对象不变式是指在对象的整个生命周期中，始终为真的条件。简单说，就是对象有效的状态。只要对象存在，它就必须满足这些条件，否则这个对象就处于错误或未定义的状态

初始化顺序：

1. 虚基类（若有）
2. 普通基类（按声明顺序）
3. 成员变量（按类内声明顺序）
4. 构造函数体执行

```cpp linenums="1"
class S {
    const int c;
    int& ref;
    std::string name;
public:
    S(int v, int& r, std::string n)
        : c(v), ref(r), name(std::move(n)) {}
};
```

为什么必须用初始化列表：

1. `const` 成员必须初始化，不能后赋值
2. 引用成员必须绑定，不能后改绑
3. 对象成员（如 `std::string`）用初始化列表更高效：直接构造，避免默认构造 + 赋值

分类：

1. 默认构造函数：无参数或参数全有默认值
2. 带参构造函数：
3. 拷贝构造函数：`T(const T&)`。从同类型左值构造新对象
4. 移动构造函数：`T(T&&)`。从右值搬资源，减少拷贝成本
5. 转换构造函数：单参数构造函数可用于隐式转换，通常要加 `explicit` 防止意外

```cpp linenums="1"
struct A {
    // explicit 禁止了隐式转换
    // 必须显式地写出构造函数调用，代码意图更清晰
    explicit A(int v) {} // 阻止 int -> A 的隐式转换
};
```

如果不写，编译器可能隐式生成特殊成员函数：

1. 默认构造
2. 析构
3. 拷贝构造
4. 拷贝赋值
5. 移动构造
6. 移动赋值

但一旦声明了某些函数，其他函数的自动生成可能被抑制：

1. Rule of 0：优先让类型不自己管理裸资源，交给 RAII 类型（`std::string`, `std::vector`, `std::unique_ptr`）
2. Rule of 3：若自定义析构/拷贝构造/拷贝赋值之一，通常三者都要考虑
3. Rule of 5：C++11 后再加移动构造/移动赋值

在基类构造函数里调用虚函数，不会动态分派到派生类版本。因为派生部分尚未构造完成。因此不要在构造/析构期间依赖多态行为完成核心逻辑

构造函数抛异常时，对象未构造完成，不会调用该对象析构函数；但已完成构造的成员/基类会被正确析构

移动构造建议尽量 `noexcept`，标准容器（如 `vector`）扩容时会更倾向移动而非拷贝，性能和异常安全更好

## 析构函数

析构函数的核心不是删除对象，而是在对象生命周期结束时做资源回收与收尾，也就是 RAII 的后半部分。如果构造函数负责建立对象不变式，析构函数就负责安全地拆除不变式并释放资源

对象生命周期结束时自动调用：

1. 栈对象离开作用域
2. 临时对象表达式结束
3. `delete` 动态对象
4. 容器销毁其元素

和构造相反，析构顺序是逆序：

1. 先执行当前类析构函数体
2. 再按成员声明逆序析构成员
3. 再按继承逆序析构基类（先派生后基类）

当类直接管理资源时，通常要自定义析构函数，例如：

1. 裸指针持有堆内存
2. 文件句柄、socket、mutex、数据库连接
3. 任何需要显式 close/release 的系统资源

如果成员本身就是 RAII 类型（string/vector/unique_ptr 等），通常不需要手写析构函数，遵循 Rule of 0 更好

### 虚析构函数

如果一个类会被当作多态基类使用（即可能用 `Base*` 指向 `Derived`，并通过基类指针 `delete`），基类析构函数必须是 `virtual`

```cpp linenums="1"
// 错误做法
class Base { public: ~Base() {} };
class Derived : public Base { public: ~Derived() { /* 释放派生资源 */}};
Base p = new Derived();
delete p;  // 未定义行为，常见是只调用 Base 析构

// 正确做法
class Base {
public:
    virtual ~Base() = default;
};
```

只要类里有任何虚函数，通常就应把析构函数也设为 `virtual`

#### 纯虚析构函数

可以把析构函数声明为纯虚，使类成为抽象类：

```cpp linenums="1"
class Interface {
public:
    virtual ~Interface() = 0;
};
```

纯虚析构函数仍然必须提供定义（哪怕是空定义），因为销毁派生对象时基类析构阶段一定会用到它

---

析构函数应尽量不抛异常，实践上可视为必须不抛。因为若栈展开（异常传播）过程中析构函数再抛异常，会触发 terminate，程序直接终止

1. 析构函数内部吞掉异常并记录日志
2. 将可能失败的收尾动作做成显式 close/commit 接口，让调用方在正常流程处理错误
3. 在语义上保持析构 `noexcept`（C++11 后析构默认是 `noexcept(true)`，除非被成员/基类影响）

## 友元

友元的本质是：某个函数或类虽然不是当前类的成员，但被当前类授权访问其 private 和 protected 成员。它是一个精确授权机制，不是继承关系，也不是成员关系

需要友元的场景：

1. 运算符重载（尤其是输入输出流、对称二元运算符）
2. 两个类需要高效协作，但不想暴露大量 public 接口
3. 工厂函数、测试辅助函数需要访问内部状态

友元函数：在类里声明某个普通函数为 friend

```cpp linenums="1"
class Box {
private:
    int value = 0;

public:
    explicit Box(int v) : value(v) {}

    friend int getValue(const Box& b);
};

int getValue(const Box& b) {
    return b.value;  // 可访问 private
}
```

友元类：把整个类授权给另一个类

```cpp linenums="1"
class A {
private:
    int secret = 42;
    friend class B;
};

class B {
public:
    int read(const A& a) { return a.secret; }
};
```

友元成员函数：只授权某个类的某个成员函数，而不是整个类

```cpp linenums="1"
class A;  // 前置声明

class B {
public:
    int readA(const A& a);
};

class A {
private:
    int secret = 7;
    friend int B::readA(const A& a);  // 仅授权这个函数
};

int B::readA(const A& a) {
    return a.secret;
}
```

1. 友元不是成员：被声明为 friend 的函数，仍然是普通函数，不属于类作用域
2. 友元关系不传递
3. 友元关系不继承
4. 友元关系不对称
5. friend 声明位置不影响语义：写在 public/private/protected 都一样（只是阅读习惯问题）
