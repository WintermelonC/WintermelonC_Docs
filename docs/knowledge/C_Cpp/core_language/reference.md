# Reference

```cpp linenums="1"
int x = 42;
int& lref = x;        // 左值引用
int&& rref = 42;      // 右值引用

// 编译器底层实现（概念上）：
// int* const lref = &x;     // 左值引用 = 常量指针
// int* const rref = &temp;  // 右值引用也类似
```

左值引用常见实现是保存被引用对象地址，然后每次使用时做一次间接访问

右值引用底层表示通常和左值引用一样，也是一个地址/别名机制。真正不同点是类型系统规则：它只能绑定到右值（或被强制转成右值的对象），从而触发移动构造、移动赋值等重载。到了运行期，CPU 并不知道这是左值引用还是右值引用，运行期只是在访问某个地址。所谓可移动本质是编译器在重载决议阶段选中了移动语义函数，不是对象里多了某种右值标记位

## 移动语义

传统拷贝语义会复制资源，代价高。很多临时对象马上就销毁了，如果还深拷贝一次就浪费。移动语义的目标就是把资源所有权从旧对象转给新对象，避免昂贵复制

移动语义的关键组件：

1. 移动构造函数
2. `std::move`

### `std::move`

它不移动任何东西，只是一个类型转换函数，将左值转换为右值引用，从而启用移动语义

```cpp linenums="1"
// 标准库的典型实现
template<typename T>
typename std::remove_reference<T>::type&& move(T&& arg) noexcept {
    return static_cast<typename std::remove_reference<T>::type&&>(arg);
}

// 简化理解版本
template<typename T>
T&& move(T& arg) {
    return static_cast<T&&>(arg);
}
```

不必要的 `std::move`

```cpp linenums="1"
// 错误：阻止了返回值优化
std::vector<int> bad() {
    std::vector<int> v = {1, 2, 3};
    return std::move(v);  // 多余，反而可能阻止RVO
}

// 正确：让编译器自动优化
std::vector<int> good() {
    std::vector<int> v = {1, 2, 3};
    return v;  // 编译器会使用RVO或移动
}
```

const 对象不能移动，会退化为拷贝

```cpp linenums="1"
const std::string const_str = "Immutable";
std::string str2 = std::move(const_str);  // 实际是拷贝
```

## 转发引用/万能引用

引用折叠规则：

1. T& &   -> T&
2. T& &&  -> T&
3. T&& &  -> T&
4. T&& && -> T&&

万能引用（转发引用）：

```cpp linenums="1"
template<typename T>
void forward_ref(T&& param) {  // T&& 是万能引用，不是右值引用
    // 根据传入参数类型，T 被推导为不同形式
}

int x = 42;
forward_ref(x);      // 传入左值：T = int&, param 类型 = int&
forward_ref(42);     // 传入右值：T = int,  param 类型 = int&&
```

## 完美转发

完美转发的目标是在中间函数里把参数原样传给目标函数，不丢失参数的值类别和值修饰

完美转发依赖两件事同时成立：

1. 形参写成 `T&&`，且 `T` 是模板推导得到的类型（这叫转发引用，旧称万能引用）
2. 转发时用 `std::forward<T>(arg)`：有条件转发；如果 `T` 是左值引用就返回左值，否则返回右值（按原样转发）

```cpp linenums="1"
#include <utility>
#include <iostream>

void f(int& x)  { std::cout << "lvalue\n"; }
void f(int&& x) { std::cout << "rvalue\n"; }

template<typename T>
void wrapper(T&& arg) {
    f(std::forward<T>(arg));
}

int main() {
    int a = 10;
    wrapper(a);   // 打印 lvalue
    wrapper(20);  // 打印 rvalue
}
```

在函数体内，命名变量 arg 永远是左值表达式。也就是说，哪怕 arg 的类型是 `int&&`，直接写 `f(arg)`，也会走左值重载。`std::forward<T>(arg)` 的作用就是按 T 的推导结果恢复它原本应该的值类别

工厂函数：

```cpp linenums="1"
#include <memory>
#include <utility>

template<typename T, typename... Args>
std::unique_ptr<T> make_obj(Args&&... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}
```