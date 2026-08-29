# 完美转发

完美转发是 C++11 引入的技术，解决的是这样一个问题：**一个函数把它的参数转发给另一个函数时，如何完整保留参数的原始类型和值类别（左值/右值），不让信息丢失**

假设有两个重载函数：

```cpp linenums="1"
void process(int& x)  { std::cout << "左值版本\n"; }
void process(int&& x) { std::cout << "右值版本\n"; }
```

现在写一个转发函数：

```cpp linenums="1"
template <typename T>
void wrapper(T arg) {   // 按值传参
    process(arg);       // arg 是具名变量，永远是左值！
}

int a = 10;
wrapper(a);          // 期望：左值版本 ✓（碰巧对了）
wrapper(20);         // 期望：右值版本 ✗（实际调用左值版本！）
```

问题在于：**函数内部的具名参数 `arg` 永远是左值**。无论调用者传进来的是左值还是右值，到 `wrapper` 内部都变成左值，转发后右值信息丢失

## 1 万能引用（转发引用）`T&&`

要解决这个问题，首先得让 `wrapper` 能"记住"调用者传的是左值还是右值。这依赖 **万能引用（Universal Reference / Forwarding Reference）**：

```cpp linenums="1"
template <typename T>
void wrapper(T&& arg) {   // T&& 是万能引用，不是普通右值引用
    process(arg);
}
```

万能引用 `T&&` 可以同时绑定左值和右值：

```cpp linenums="1"
int a = 10;
wrapper(a);     // ✓ 传左值：T 被推导为 int&
wrapper(20);    // ✓ 传右值：T 被推导为 int
```

!!! warning "万能引用的前提"

    `T&&` 只有在 **模板类型推导**（或 `auto&&`）中才是万能引用。非推导场景下它就是普通的右值引用：
    
    ```cpp linenums="1"
    void f(int&& x);        // 普通右值引用，只能绑右值
    void g(std::vector<int>&& v);  // 也是普通右值引用（vector<int> 不是推导类型）
    ```

## 2 引用折叠（Reference Collapsing）

万能引用能同时接受左右值，靠的是 **引用折叠** 规则。当模板推导时出现"引用的引用"（C++ 语法本身不允许直接写 `T& &`，但推导过程中会产生），按以下规则折叠：

| 推导组合 | 折叠结果 |
|---|---|
| `T& &` | `T&` |
| `T& &&` | `T&` |
| `T&& &` | `T&` |
| `T&& &&` | `T&&` |

**记忆口诀**：只要有 **一个左值引用** 参与，结果就是左值引用；只有 **两个都是右值引用**，结果才是右值引用

结合推导看 `wrapper`：

| 调用方式 | `T` 推导为 | `T&&` 折叠为 | arg 类型 |
|---|---|---|---|
| `wrapper(a)`（a 是左值） | `int&` | `int& &&` → `int&` | 左值引用 |
| `wrapper(20)`（20 是右值） | `int` | `int&&` | 右值引用 |

所以万能引用能"记住"原始值类别——信息其实编码在了模板参数 `T` 里

## 3 `std::forward`：恢复原始值类别

有了万能引用，还差最后一步：把 `arg` 按它 **原本** 的值类别转出去。这就是 `std::forward<T>` 的作用：

```cpp linenums="1"
template <typename T>
void wrapper(T&& arg) {
    process(std::forward<T>(arg));   // 按 T 的推导结果恢复左值/右值
}
```

- 当 `T = int&` 时，`std::forward<int&>(arg)` 返回 `int&`（左值）→ 调用左值版本
- 当 `T = int` 时，`std::forward<int>(arg)` 返回 `int&&`（右值）→ 调用右值版本

```cpp linenums="1"
int a = 10;
wrapper(a);     // T = int&，forward 返回左值 → 左值版本 ✓
wrapper(20);    // T = int，forward 返回右值 → 右值版本 ✓
```

### 3.1 `std::forward` 的简化实现

```cpp linenums="1"
template <typename T>
T&& forward(std::remove_reference_t<T>& arg) noexcept {
    return static_cast<T&&>(arg);
}
```

它的精妙之处在于 `T` 携带了信息：

- `T = int&`：`static_cast<int& &&>(arg)` → 引用折叠成 `int&`，返回左值
- `T = int`：`static_cast<int&&>(arg)`，返回右值

### 3.2 `std::move` vs `std::forward`

| 工具 | 行为 |
|---|---|
| `std::move(x)` | **无条件** 把 `x` 转成右值 |
| `std::forward<T>(x)` | **有条件** 转发：`T` 是左值引用就保持左值，否则转成右值 |

```cpp linenums="1"
// std::move 简化实现：永远转右值
template <typename T>
std::remove_reference_t<T>&& move(T&& t) noexcept {
    return static_cast<std::remove_reference_t<T>&&>(t);
}
```

## 4 完整示例

```cpp linenums="1"
#include <iostream>
#include <utility>
#include <string>

void process(std::string& s)  { std::cout << "左值：" << s << '\n'; }
void process(std::string&& s) { std::cout << "右值：" << s << '\n'; }

template <typename T>
void wrapper(T&& arg) {
    process(std::forward<T>(arg));
}

int main() {
    std::string s = "hello";
    wrapper(s);                    // 左值：hello
    wrapper(std::string("temp"));  // 右值：temp
    wrapper(std::move(s));         // 右值：hello
}
```

## 5 变参完美转发

实际中常配合 **变参模板** 转发多个参数：

```cpp linenums="1"
template <typename Func, typename... Args>
auto invoke(Func&& f, Args&&... args) {
    return std::forward<Func>(f)(std::forward<Args>(args)...);
}
```

标准库正是这样实现 `std::make_unique`、`std::make_shared`、`std::vector::emplace_back` 等的：

```cpp linenums="1"
// make_unique 的核心：把参数完美转发给构造函数
template <typename T, typename... Args>
std::unique_ptr<T> make_unique(Args&&... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}
```

```cpp linenums="1"
struct Point {
    Point(int x, int y) : x(x), y(y) {}
    int x, y;
};

std::string name = "node";
auto p = std::make_unique<Point>(3, 4);              // 右值参数
auto v = std::make_unique<std::string>(name);        // 左值参数（拷贝）
auto w = std::make_unique<std::string>(std::move(name)); // 右值参数（移动）
```

## 6 常见陷阱

```cpp linenums="1"
// 陷阱 1：把 std::forward 误写成 std::move
template <typename T>
void wrapper(T&& arg) {
    process(std::move(arg));   // ✗ 总是按右值转发，左值被错误地"偷走"
}

// 陷阱 2：转发后再次使用参数（参数可能已被移动）
template <typename T>
void wrapper(T&& arg) {
    process(std::forward<T>(arg));   // arg 可能已被移动走
    use(arg);                        // ✗ 危险！arg 可能已处于被移动状态
}

// 陷阱 3：不传模板参数给 forward
template <typename T>
void wrapper(T&& arg) {
    process(std::forward(arg));   // ✗ 编译错误，forward 需要显式模板参数 T
}
```
