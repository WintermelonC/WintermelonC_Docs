# 9 Copy and Move

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Copy

### 1.1 Copy Constructor

**拷贝构造函数**

- 用一个已有对象初始化一个新对象
- 函数签名：`T(const T& other)`

调用时机：

1. 对象初始化时传递另一个对象
2. 函数 **按值传参** 或 **返回对象**（某些情况下可能被优化为移动语义）

```cpp linenums="1"
MyClass obj1;
MyClass obj2(obj1); // 调用拷贝构造函数
```

默认行为：如果未显式定义，编译器会生成一个 **默认拷贝构造函数**，执行 **成员逐个拷贝（浅拷贝）**

```cpp linenums="1"
class MyString {
public:
    char* data;
    size_t size;

    // 拷贝构造函数（深拷贝）
    MyString(const MyString& other) {
        size = other.size;
        data = new char[size]; // 分配新内存
        std::copy(other.data, other.data + size, data); // 复制数据
    }
};
```

**编译器优化拷贝**（Copy Elision）

现代 C++ 编译器（如 GCC、Clang）会在保证程序行为正确的前提下，自动优化掉不必要的拷贝操作（例如 返回值优化 RVO/NRVO）

程序员职责：

1. 即使编译器可能优化，仍需按 “最坏情况”（无优化）编写代码，确保逻辑正确
2. 主动识别可优化场景

```cpp linenums="1"
Person copy_func( char *who ) {
    Person local( who );  // 局部对象
    local.print();
    return local;         // 可能调用拷贝构造函数（若未优化）
}
Person nocopy_func( char *who ) {
    return Person( who ); // 直接构造返回值
}
```

| 场景 | `copy_func` | `nocopy_func` |
| :--: | :--: | :--: |
| 对象创建方式 | 先构造局部对象，再返回 | 直接构造返回值 |
| 是否依赖优化 | 是（NRVO） | 否（RVO 必然优化）|
| 代码可靠性 | 需考虑未优化时的拷贝开销	| 始终高效 |

!!! tip "拷贝构造函数的设计原则"

    1. 何时不需要自定义拷贝构造函数：无指针成员的简单类
    2. 何时需要显式定义拷贝构造函数：类包含指针或动态资源时。必须自定义拷贝构造函数实现 深拷贝，避免多个对象共享同一资源（如内存、文件句柄）
    3. 如何禁止拷贝：将拷贝构造函数声明为 `private`。适用于不可复制的类（如单例、线程池）。调用拷贝操作会直接触发编译错误

        - 更优做法：使用 `= delete` 显式删除（更清晰）

### 1.2 Copy Assignment Operator

**拷贝赋值运算符**

- 将一个对象的值赋给另一个已存在的对象
- 函数签名：`T& operator=(const T& other)`

调用时机：

```cpp linenums="1"
MyClass obj1;
MyClass obj2;
obj2 = obj1; // 调用拷贝赋值运算符
```

默认行为：如果未显式定义，编译器会生成一个 **默认拷贝赋值运算符**，执行 **成员逐个赋值（浅拷贝）**

```cpp linenums="1"
class MyString {
public:
    // 拷贝赋值运算符（深拷贝）
    MyString& operator=(const MyString& other) {
        if (this == &other) return *this; // 防止自赋值

        delete[] data; // 释放旧内存
        size = other.size;
        data = new char[size]; // 分配新内存
        std::copy(other.data, other.data + size, data); // 复制数据

        return *this; // 返回当前对象
    }
};
```

### 1.3 Shallow Copy vs Deep Copy

**浅拷贝 vs 深拷贝**

| 特性 | Shallow Copy | Deep Copy |
| :--: | :--: | :--: |
| 拷贝方式 | 直接复制指针（共享内存） | 复制指针指向的数据（独立内存）|
| 默认行为 | 编译器默认生成 | 需要手动实现 |
| 适用场景 | 无动态内存管理的简单类 | 涉及动态内存或资源的类 |
| 风险 | 双重释放（Double Free） | 无内存共享问题 |

```cpp linenums="1"
// 浅拷贝（默认行为）
class ShallowCopy {
public:
    int* ptr;
    ShallowCopy(int val) { ptr = new int(val); }
    ~ShallowCopy() { delete ptr; }
};

ShallowCopy a(10);
ShallowCopy b = a; // 浅拷贝，a.ptr 和 b.ptr 指向同一块内存
// 析构时会导致双重释放（UB）！

// 深拷贝（手动实现）
class DeepCopy {
public:
    int* ptr;
    DeepCopy(int val) { ptr = new int(val); }
    DeepCopy(const DeepCopy& other) { ptr = new int(*other.ptr); } // 深拷贝构造函数
    ~DeepCopy() { delete ptr; }
};

DeepCopy c(20);
DeepCopy d = c; // 深拷贝，c.ptr 和 d.ptr 指向不同内存
// 析构时安全
```

### 1.4 禁止拷贝

- 某些类（如单例、文件句柄类）**不应允许拷贝**，否则可能导致资源泄漏或逻辑错误
- 使用 `= delete` 显式禁止拷贝构造函数和拷贝赋值运算符

```cpp linenums="1"
class NonCopyable {
public:
    NonCopyable() = default;
    NonCopyable(const NonCopyable&) = delete;            // 禁止拷贝构造
    NonCopyable& operator=(const NonCopyable&) = delete; // 禁止拷贝赋值
};
```

## 2 函数参数和返回值类型

参数传递（Way in）

| 方式 | 示例 | 特点 |
| :--: | :--: | :--: |
| 按值传递 | `void f(Student i);` | 触发拷贝构造，适合需要独立副本的小对象（但可能有性能开销）|
| 指针传递 | `void f(Student *p);` | 避免拷贝，但需处理 `nullptr`；若无需修改对象，应加 `const`（如 `const Student*`）|
| 引用传递 | `void f(Student& i);` | 避免拷贝，直接操作原对象；若无需修改，用 `const Student&` 更安全 |

建议：

1. 优先使用 `const` 引用（`const T&`），除非需要修改原对象或传递简单类型（如 `int`）
2. 按值传递仅用于需要副本的场景（如函数内需修改参数但不影响外部）

返回值设计（Way out）

| 方式 | 示例 | 注意事项 |
| :--: | :--: | :--: |
| 返回值（副本） | `Student f();` | 可能触发拷贝，但编译器会优化（RVO/NRVO）；适合返回新构造的对象 |
| 返回指针 | `Student* f();` | 需明确指针生命周期（如指向堆对象、静态变量或全局变量），避免悬空指针 |
| 返回引用 | `Student& f();` | 必须确保引用对象在函数外有效（如返回成员变量或静态对象） |

建议：

1. 优先返回 **值类型**（依赖编译器优化）
2. 返回指针/引用时，必须 **明确所有权和生命周期**（易引发内存问题）

!!! tip "建议"

    1. **需要存储对象时**：按值传入（触发拷贝）
    2. **仅需读取对象时**：使用 `const` 指针或引用传入
    3. **需要修改对象时**：使用指针或引用传入
    4. **返回函数内创建的对象时**：直接返回值（依赖编译器优化）
    5. **返回传入的对象时**：仅返回其指针或引用
    6. **绝对不要**：在函数内 `new` 对象并返回其裸指针