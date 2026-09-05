# Lambda

Lambda 表达式（C++11 引入）是一种 **匿名函数对象**，可以在代码中就地定义一个"函数"。它最强大的能力是 **捕获（capture）外部作用域的变量**，形成一个 **闭包（Closure）**——即"函数 + 它所引用的环境"的组合

```cpp linenums="1"
[capture_list] (parameters) mutable noexcept -> return_type {
    // function body
}
```

## 1 捕获列表

捕获列表决定了 Lambda 内部能使用哪些 **外部变量**。这是 Lambda 区别于普通函数的核心

| 捕获方式 | 含义 | 备注 |
|---|---|---|
| `[]` | 不捕获任何外部变量 | 可转换为普通函数指针 |
| `[x]` | 按值捕获 x | 拷贝一份，修改不影响外部 |
| `[&x]` | 按引用捕获 x | 共享同一变量，修改会影响外部 |
| `[=]` | 按值捕获所有用到的变量 | 隐式，不推荐 |
| `[&]` | 按引用捕获所有用到的变量 | 隐式，不推荐 |
| `[x, &y]` | x 按值、y 按引用 | 显式混合，推荐 |
| `[this]` | 捕获 this 指针 | 访问类成员 |
| `[=, &x]` | 默认按值，x 例外按引用 | — |
| `[&, x]` | 默认按引用，x 例外按值 | — |

**重要：捕获发生在"定义 Lambda 时"，而不是"调用时"**：

```cpp linenums="1"
int x = 1;
auto f = [x] { return x; };   // 定义时捕获，x 拷贝为 1
x = 999;                      // 之后改 x 不影响 lambda
std::cout << f();             // 仍是 1（不是 999）
```

!!! tip "关于 `this` 指针的捕获"

    如果 Lambda 定义在一个类的成员函数内部，它需要读写该类的成员变量

    使用 `[this]` 或 `[=]`：都是按值捕获了 `this` 指针。如果在闭包对象存活期间，当前的类对象本身被销毁了，那 Lambda 里的 `this` 就成了野指针

    C++17 引入了 `[*this]`：这会按值拷贝一整个当前对象进入 Lambda 内部。虽然有拷贝开销，但极其安全，常用于多线程回调，不必担心原对象被销毁

## 2 底层原理：匿名仿函数类

Lambda 的本质 **不是函数，而是一个重载了 `operator()` 的匿名类对象（仿函数 Functor）**：

```cpp linenums="1"
// 你写的：
auto add = [captured](int a) { return captured + a; };

// 编译器大致生成：
class __Lambda_1 {
    int captured;               // 捕获的变量变成私有成员
public:
    __Lambda_1(int c) : captured(c) {}
    auto operator()(int a) const {   // 参数列表变成 operator() 的参数
        return captured + a;         // 函数体原样搬入
    }
};
```

几个关键推论：

1.**按值捕获的变量默认只读**：因为生成的 `operator()` 是 `const` 的

2.**加 `mutable` 就是去掉 `operator()` 的 `const`**

```cpp linenums="1"
int x = 10;
auto f = [x]() mutable { x++; return x; };  // 可以改副本
// 但改的是 lambda 内部的副本，外部 x 不变
f(); f();   // 11, 12
std::cout << x;   // 10，外部不受影响
```

3.**每个 Lambda 都是独一无二的类型**：即使两个 Lambda 长得一样，类型也不同，这就是为什么要用 `auto` 接收：

```cpp linenums="1"
auto f1 = [](int x) { return x; };
auto f2 = [](int x) { return x; };
// f1 和 f2 是不同类型！不能互相赋值
```

## 3 常见使用场景

##### 3.1 作为算法参数（最常用）

```cpp linenums="1"
std::vector<int> v = {3, 1, 4, 1, 5};

// 自定义排序规则
std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; });

// 条件查找
auto it = std::find_if(v.begin(), v.end(), [](int x) { return x > 3; });

// 批量操作
std::for_each(v.begin(), v.end(), [](int& x) { x *= 2; });
```

##### 3.2 回调注册

```cpp linenums="1"
std::function<void()> onComplete = [&] { /* 任务完成后的回调 */ };
```

##### 3.3 一次性逻辑（就地定义，无需单独写函数）

```cpp linenums="1"
auto result = std::async([] {
    // 直接在后台线程执行的逻辑
    return compute();
});
```

## 4 与函数指针、仿函数的关系

| 可调用对象 | 能否捕获外部变量 | 特点 |
|---|---|---|
| 普通函数 | ✗ | 全局，不能带状态 |
| 函数指针 | ✗ | 只能指向函数 |
| 仿函数（函数对象） | ✓（通过成员变量） | 需单独定义类，啰嗦 |
| **Lambda** | ✓ | 就地定义，简洁，本质就是仿函数的语法糖 |

```cpp linenums="1"
// 三者的等价写法：判断 x 是否大于 n

// ① 函数指针（无法携带 n）
bool greaterThan5(int x) { return x > 5; }

// ② 仿函数（要单独写一个类）
struct GreaterThan {
    int n;
    bool operator()(int x) const { return x > n; }
};

// ③ Lambda（最简洁，就地捕获 n）
int n = 5;
auto pred = [n](int x) { return x > n; };
```

## 5 悬空引用的经典陷阱

```cpp linenums="1"
// ✗ 危险：返回一个引用捕获局部变量的 lambda
std::function<int()> makeCounter() {
    int count = 0;
    return [&count] { return ++count; };   // count 已销毁，悬空引用！
}

// ✓ 安全：按值捕获
std::function<int()> makeCounterSafe() {
    auto count = std::make_shared<int>(0);
    return [count] { return ++(*count); };  // 共享资源，生命周期安全
}
```

```cpp linenums="1"
// ✗ 危险：异步线程里引用捕获
void asyncTask() {
    int data = 42;
    std::thread t([&data] {
        std::cout << data;   // 可能主函数已返回，data 已销毁
    });
    t.detach();
}
```

**原则**：Lambda 生命周期 **可能超过** 外部变量生命周期时，绝不能用引用捕获

## 6 返回值类型推导的坑

```cpp linenums="1"
// ✗ 编译错误：两个 return 类型不一致，无法推导
auto f = [](bool flag) {
    if (flag) return 1;        // int
    else      return 2.5;      // double → 推导失败
};

// ✓ 显式指定返回类型
auto g = [](bool flag) -> double {
    if (flag) return 1;        // int 转 double
    else      return 2.5;
};
```

## 7 版本演进

| 版本 | 新特性 |
|---|---|
| C++11 | Lambda 诞生、捕获列表 |
| C++14 | 泛型 Lambda（`auto` 参数）、广义捕获（`[x = expr]`）、移动捕获 |
| C++17 | `constexpr` Lambda、`[*this]` 捕获 |
| C++20 | 模板 Lambda（`[]<typename T>(T a, T b)`）、概念约束 |
