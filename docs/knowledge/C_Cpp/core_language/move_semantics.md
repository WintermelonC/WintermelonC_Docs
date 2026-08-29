# 移动语义

移动语义是 C++11 引入的核心特性之一，它解决了一个长期存在的性能问题：**不必要的深拷贝**。通过"窃取"临时对象或即将销毁对象的资源，移动语义把很多原本 $O(N)$ 的拷贝操作变成了 $O(1)$ 的指针转移

看一个管理动态内存的类：

```cpp linenums="1"
class MyString {
    char* data;
    size_t len;
public:
    MyString(const char* s) {
        len = strlen(s);
        data = new char[len + 1];
        strcpy(data, s);
    }
    // 拷贝构造：深拷贝
    MyString(const MyString& other) {
        len = other.len;
        data = new char[len + 1];      // 重新分配内存
        strcpy(data, other.data);      // 逐字符复制
    }
    ~MyString() { delete[] data; }
};
```

问题场景：函数返回一个 `MyString`，或 `std::vector` 扩容时，都会创建临时对象然后拷贝。如果字符串很长，深拷贝的代价极高——而那个临时对象 **马上就要销毁了**，何必再复制一遍它的数据？直接把指针"抢过来"不就行了？

移动语义正是干这件事：**资源转移，而非资源复制**

移动语义建立在 **值类别（Value Category）** 之上：

| 类别 | 定义 | 例子 |
|---|---|---|
| **左值（lvalue）** | 有名字、可取地址、生命周期持久 | 变量 `x`、`*p`、`arr[i]` |
| **右值（rvalue）** | 临时对象、字面量，即将销毁 | `42`、`"hello"`、`a + b`、函数返回的临时对象 |

细分（C++11 起）：

- **prvalue**（纯右值）：字面量、临时对象
- **xvalue**（将亡值）：`std::move` 转换的结果、返回右值引用的函数
- **glvalue**：左值 + 将亡值（可定位的对象）

简单记法：**"能取地址的就是左值，其余是右值"**（有少量例外，但对理解移动语义够用）

普通引用 `T&` 只能绑定左值；**右值引用 `T&&`** 只能绑定右值（临时对象）：

```cpp linenums="1"
int a = 10;
int& lref = a;        // ✓ 左值引用绑定左值
// int& lref2 = 10;   // ✗ 左值引用不能绑定右值

int&& rref = 10;      // ✓ 右值引用绑定右值
// int&& rref2 = a;   // ✗ 右值引用不能绑定左值
```

利用右值引用可以 **区分** 参数是左值还是右值，从而对临时对象走"移动"而非"拷贝"

## 1 移动构造函数与移动赋值运算符

### 1.1 移动构造函数

```cpp linenums="1"
class MyString {
    char* data;
    size_t len;
public:
    MyString(const char* s) {
        len = strlen(s);
        data = new char[len + 1];
        strcpy(data, s);
    }

    // 拷贝构造：深拷贝
    MyString(const MyString& other) {
        len = other.len;
        data = new char[len + 1];
        strcpy(data, other.data);
    }

    // 移动构造：窃取资源
    MyString(MyString&& other) noexcept {
        data = other.data;      // 直接接管指针
        len  = other.len;
        other.data = nullptr;   // 源对象置空，防止双重释放
        other.len  = 0;
    }

    ~MyString() { delete[] data; }
};
```

移动构造只做三件事：**接管指针 → 拷贝长度 → 把源对象置空**。全程没有内存分配和字符复制，$O(1)$

### 1.2 移动赋值运算符

```cpp linenums="1"
MyString& operator=(MyString&& other) noexcept {
    if (this != &other) {
        delete[] data;          // 先释放自己的旧资源
        data = other.data;      // 接管
        len  = other.len;
        other.data = nullptr;   // 源对象置空
        other.len  = 0;
    }
    return *this;
}
```

!!! warning "移动操作要标记 `noexcept`"

    移动构造/赋值应尽量声明为 `noexcept`。因为 `std::vector` 扩容时，只有元素的移动构造函数是 `noexcept` 的，才会用移动而不是拷贝（否则扩容时若移动抛异常，已移动一半的元素无法安全回退）。标记 `noexcept` 能显著提升容器性能

## 2 `std::move`：把左值"转换"成右值

`std::move` 的名字有误导性——**它本身不移动任何东西**，只是一个类型转换：把左值强制转换为右值引用（xvalue），从而让编译器选择移动版本的函数：

```cpp linenums="1"
std::string a = "hello world, this is a very long string";

std::string b = a;               // 拷贝：a 内容不变
std::string c = std::move(a);    // 移动：a 被"掏空"（资源转移给 c）

// 此后 a 处于"有效但未指定"状态，通常为空
```

```cpp linenums="1"
// std::move 的简化实现：本质上就是 static_cast
template <typename T>
constexpr std::remove_reference_t<T>&& move(T&& t) noexcept {
    return static_cast<std::remove_reference_t<T>&&>(t);
}
```

!!! danger "不要对即将继续使用的对象用 move"

    `std::move(a)` 之后，`a` 的资源已经被移走，继续使用 `a`（除非重新赋值）是危险的。`std::move` 应只用于"这个对象我之后不用了"的场景，或对临时对象

移动后，源对象处于 **"有效但未指定（valid but unspecified）"状态**：

- 仍然可以安全地 **析构** 和 **重新赋值**
- 但它的具体内容未定义（通常为空，但标准不保证）
- 不应再依赖它的原值

```cpp linenums="1"
std::string a = "abc";
std::string b = std::move(a);

a = "new";        // ✓ 合法，重新赋值
std::cout << a;   // ✓ 输出 new
// std::cout << a.size();  // 若没重新赋值，结果是未指定的
```

## 3 完美转发 `std::forward`

[Perfect Forwarding](./perfect_forwarding.md){:target="_blank"}

移动语义常与 **模板** 结合。当模板函数把参数转发给另一个函数时，我们希望 **保留参数原本的左值/右值属性**，这时需要 `std::forward`：

```cpp linenums="1"
#include <utility>

void process(std::string& s)       { std::cout << "左值\n"; }
void process(std::string&& s)      { std::cout << "右值\n"; }

template <typename T>
void wrapper(T&& arg) {
    // std::forward<T>：T 是左值引用则转成左值，是右值引用则转成右值
    process(std::forward<T>(arg));
}

std::string s = "hi";
wrapper(s);             // 输出：左值（s 是左值）
wrapper(std::string("hi"));  // 输出：右值（临时对象）
wrapper(std::move(s));  // 输出：右值
```

关键区分：

| 工具 | 作用 |
|---|---|
| `std::move` | **无条件** 把参数转成右值 |
| `std::forward<T>` | **有条件** 转发：保持参数的原始值类别 |

`T&&` 在模板中的特殊含义（万能引用/转发引用）：当 `T` 被推导为 `std::string&` 时，`T&&` 折叠成 `std::string&`（左值引用）；`T` 推导为 `std::string` 时，`T&&` 是右值引用。这就是完美转发的基础

## 4 三五法则（Rule of Five）

C++11 起，如果一个类需要自定义 **析构、拷贝构造、拷贝赋值** 中的任何一个，通常也需要同时考虑 **移动构造** 和 **移动赋值**：

| 成员 | 何时需要自定义 |
|---|---|
| 析构函数 | 管理资源（堆内存、文件句柄） |
| 拷贝构造函数 | 深拷贝 |
| 拷贝赋值运算符 | 深拷贝 + 释放旧资源 |
| **移动构造函数** | 资源转移（C++11） |
| **移动赋值运算符** | 资源转移 + 释放旧资源（C++11） |

```cpp linenums="1"
class Buffer {
    int* ptr;
    size_t sz;
public:
    Buffer(size_t n) : ptr(new int[n]), sz(n) {}

    ~Buffer() { delete[] ptr; }                      // 1 析构
    Buffer(const Buffer& o)                          // 2 拷贝构造
        : ptr(new int[o.sz]), sz(o.sz) {}
    Buffer& operator=(const Buffer& o) {             // 3 拷贝赋值
        if (this != &o) {
            delete[] ptr;
            ptr = new int[o.sz];
            sz = o.sz;
        }
        return *this;
    }
    Buffer(Buffer&& o) noexcept                      // 4 移动构造
        : ptr(o.ptr), sz(o.sz) {
        o.ptr = nullptr;
        o.sz = 0;
    }
    Buffer& operator=(Buffer&& o) noexcept {         // 5 移动赋值
        if (this != &o) {
            delete[] ptr;
            ptr = o.ptr;
            sz = o.sz;
            o.ptr = nullptr;
            o.sz = 0;
        }
        return *this;
    }
};
```

!!! tip "零法则（Rule of Zero）"

    现代 C++ 更推荐 **零法则**：尽量不自己管理资源，用 `std::string`、`std::vector`、`std::unique_ptr` 等 RAII 类型做成员。这样编译器生成的默认拷贝/移动行为就足够正确，你完全不用手写那五个函数

## 5 编译器优化：RVO / NRVO

RVO 和 NRVO 是编译器的 **返回值优化（Return Value Optimization）**，统称 **Copy Elision（拷贝消除）**。它们的目标一致：**消除函数返回对象时不必要的拷贝/移动**，让对象直接在调用方的内存中构造

看一个会打印构造过程的类：

```cpp linenums="1"
struct Widget {
    Widget()                       { std::cout << "默认构造\n"; }
    Widget(const Widget&)          { std::cout << "拷贝构造\n"; }
    Widget(Widget&&) noexcept      { std::cout << "移动构造\n"; }
};
```

早期 C++（无优化）下，`Widget w = makeWidget();` 可能发生 **两次拷贝**：

```text
makeWidget() 内部构造临时对象 → 第一次拷贝：临时对象复制到"返回值暂存区"
→ 第二次拷贝：暂存区复制到 w
```

一个 `Widget` 对象居然要被复制两遍，非常浪费。RVO/NRVO 就是来消除这些拷贝的

**RVO（Return Value Optimization）** 优化的是"直接返回临时对象"的情况：

```cpp linenums="1"
Widget makeWidget() {
    return Widget();   // 返回一个无名的临时对象（prvalue）
}

int main() {
    Widget w = makeWidget();
    // 有 RVO：只输出一次 "默认构造"
    // 无 RVO：可能输出 默认构造 + 移动/拷贝
}
```

优化后，`Widget()` 这个临时对象 **直接在 `w` 的内存位置上构造**，既没有拷贝也没有移动——对象从头到尾只有一个

**NRVO（Named Return Value Optimization）** 优化的是"返回有名字的局部变量"的情况：

```cpp linenums="1"
Widget makeWidget() {
    Widget w;      // 具名局部变量
    return w;      // 返回它
}

int main() {
    Widget x = makeWidget();
    // 有 NRVO：只输出一次 "默认构造"
    // 无 NRVO：输出 默认构造 + 移动构造（移动是兜底）
}
```

NRVO 下，局部变量 `w` 被编译器 **直接分配在调用方的返回位置** 上，函数里对 `w` 的所有操作都作用在最终的 `x` 上，返回时无需搬运

| 维度 | RVO | NRVO |
|---|---|---|
| 返回对象 | **无名临时对象** `return Widget();` | **具名局部变量** `Widget w; return w;` |
| 变量名 | 无 | 有（Named） |
| C++17 起 | **强制**（Guaranteed Copy Elision） | **非强制**（但主流编译器都做） |
| 实现难度 | 简单 | 复杂（变量可能被多次赋值、出现在分支中） |

C++17 引入 **Guaranteed Copy Elision**：当返回的是 **纯右值（prvalue）** 时，编译器 **必须** 消除拷贝/移动，这是标准层面的强制要求，不是优化开关：

```cpp linenums="1"
Widget makeWidget() {
    return Widget();   // C++17：连移动构造都保证不发生
}

Widget w = makeWidget();   // 只调用一次默认构造
```

这甚至改变了语言规则：C++17 下，`return Widget();` 不再要求 `Widget` 有 **可访问** 的拷贝/移动构造函数。所以 C++17 后，不可拷贝、不可移动的类型也能这样返回：

```cpp linenums="1"
struct NonCopyable {
    NonCopyable() = default;
    NonCopyable(const NonCopyable&) = delete;   // 不可拷贝
    NonCopyable(NonCopyable&&) = delete;        // 也不可移动
};

NonCopyable make() {
    return NonCopyable();   // ✓ C++17 合法（guaranteed elision）
}
```

而 **NRVO 至今仍是"可选优化"**，标准不强制。不过 GCC、Clang、MSVC 在开启优化（`-O1` 及以上）时都会执行 NRVO

!!! question "什么时候优化会失效"

    NRVO 在以下情况 **无法执行**（此时会退化为移动，移动不可用才拷贝）：
    
    ```cpp linenums="1"
    // 情况 1：多个候选变量（无法确定返回哪一个的地址）
    Widget make(bool flag) {
        Widget a, b;
        return flag ? a : b;   // 无法 NRVO，但会移动
    
        // 情况 2：返回的是参数（不是局部变量）
        Widget make2(Widget w) {
            return w;           // 参数不算局部变量，无法 NRVO
        }
    }
    ```

!!! question "为什么返回时不要写 `std::move`"

    这是最常见的一个误区：
    
    ```cpp linenums="1"
    Widget bad() {
        Widget w;
        return std::move(w);   // ✗ 坏习惯！
    }
    
    Widget good() {
        Widget w;
        return w;              // ✓ 正确
    }
    ```
    
    原因：
    
    1. `std::move(w)` 返回的是 `Widget&&`（xvalue），**不再是纯右值**，直接 **破坏了 NRVO** 的条件
    2. 不写 `std::move`：编译器优先做 NRVO（零开销）；即使做不了 NRVO，标准规定 `return` 局部变量时会 **自动尝试移动**（implicit move）
    3. 写了 `std::move`：编译器只能老老实实调用移动构造（如果类型没有移动构造，还会退化成拷贝，甚至编译错误）
    
    结论：**返回局部变量时永远不要加 `std::move`**，它只会帮倒忙

| 机制 | 何时生效 | 效果 |
|---|---|---|
| RVO（C++17 强制） | 返回 prvalue | 零拷贝零移动 |
| NRVO（编译器优化） | 返回具名局部变量 | 零拷贝零移动 |
| 隐式移动（implicit move） | RVO/NRVO 都不适用时 | 移动而非拷贝 |
| `std::move` | 仅当你确实想把左值"变成"右值 | 手动触发移动 |

优先级：**RVO/NRVO > 隐式移动 > 拷贝**。移动语义是"兜底方案"，RVO/NRVO 是"最优方案"

!!! tip "实验验证"

    ```cpp linenums="1"
    struct Widget {
        Widget()                  { std::cout << "默认构造\n"; }
        Widget(const Widget&)     { std::cout << "拷贝构造\n"; }
        Widget(Widget&&) noexcept { std::cout << "移动构造\n"; }
    };
    
    Widget makeRVO()   { return Widget(); }        // RVO
    Widget makeNRVO()  { Widget w; return w; }     // NRVO
    Widget makeMove()  { Widget w; return std::move(w); }  // 强制移动
    
    int main() {
        std::cout << "--- RVO ---\n";
        Widget a = makeRVO();      // 默认构造
        std::cout << "--- NRVO ---\n";
        Widget b = makeNRVO();     // 默认构造
        std::cout << "--- move ---\n";
        Widget c = makeMove();     // 默认构造 + 移动构造
    }
    ```
    
    典型输出（开启优化）：
    
    ```text
    --- RVO ---
    默认构造
    --- NRVO ---
    默认构造
    --- move ---
    默认构造
    移动构造
    ```
    
    可以看到：RVO 和 NRVO 都只构造了一次对象，而 `std::move` 反而多了一次移动

## 6 典型应用场景

1. **容器扩容**：`std::vector` 扩容时移动元素而不是拷贝
2. **函数返回值**：返回大对象/容器时自动移动
3. **`std::unique_ptr`**：独占所有权，只能移动不能拷贝（移动语义的直接体现）
4. **`std::thread`、`std::lock_guard`** 等不可拷贝但可移动的类型
5. **避免临时对象拷贝**：`v.push_back(std::move(s))`、`emplace_back`

## 7 常见陷阱

```cpp linenums="1"
// 陷阱 1：对 const 对象 move 无效（还是拷贝）
const std::string a = "hi";
std::string b = std::move(a);   // 调用的是拷贝构造！const 右值不能绑定到 T&&

// 陷阱 2：move 后继续用
std::string c = "data";
std::string d = std::move(c);
std::cout << c;   // 未定义内容，通常是空，但不要依赖

// 陷阱 3：返回值不需要显式 move（会阻碍 RVO）
std::string bad() {
    std::string s = "x";
    return std::move(s);   // ✗ 多此一举，反而阻止了 NRVO 优化
}
std::string good() {
    std::string s = "x";
    return s;              // ✓ 编译器自动优化/移动
}
```
