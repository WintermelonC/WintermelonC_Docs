# Lambda

一个完整的 Lambda 表达式由以下部分组成：

```cpp linenums="1"
[capture_list] (parameters) mutable noexcept -> return_type {
    // function body
}
```

1. `[capture_list]` (捕获列表)：决定 Lambda 内部能够使用其外部作用域中的哪些局部变量
2. `(parameters)` (参数列表)：正如普通函数的参数列表。如果不需要传参，圆括号 `()` 可以省略
3. `mutable` (可选)：默认情况下，按值捕获的变量在 Lambda 内部是只读的。加上 `mutable` 后，可以修改按值捕获进入内部的副本（改的依然是副本，不会影响外部的原变量）
4. `-> return_type` (返回类型，可选)：多数情况下编译器能自动推导返回类型，通常省略
5. `{ body }` (函数体)：具体的执行逻辑

!!! question "Lambda 的底层实现原理是什么"

    不是闭包函数，而是一个隐式生成的重载了 `operator()` 的匿名类对象（仿函数 Functor）

    1. 当编译器遇到一个 Lambda 表达式时，会在背后为你偷偷生成一个独一无二的类
    2. Lambda 的参数列表，会被转化为该类 `operator()` 成员函数的参数列表
    3. Lambda 的捕获列表，会被转化为该类的私有成员变量，并在对象实例化时通过内部生成的构造函数进行初始化
    4. 默认情况下，生成的 `operator()` 是被 `const` 修饰的（这就是为什么按值捕获的变量默认不能修改）。如果加了 `mutable` 关键字，其实就是去掉了 `operator()` 的 `const` 限定符

捕获列表：

1. `[]`：不捕获任何外部变量。此时 Lambda 可以隐式转换为普通的函数指针（只有不捕获任何变量的 Lambda 才能转化）
2. `[=]`：按值 (Value) 捕获当前作用域的所有局部变量
3. `[&]`：按引用 (Reference) 捕获当前作用域的所有局部变量
4. `[x, &y]`：按值捕获 x，按引用捕获 y

!!! tip "悬空引用陷阱"

    如果你把一个 Lambda 作为函数的返回值，或者把它扔进一个异步线程去执行，并且你使用了引用捕获 `[&]`

    当这个 Lambda 稍后被真正执行时，外部函数早已经运行结束了，局部的那些原变量都已经被销毁。此时 Lambda 内部的引用全是悬空引用，一旦访问程序就会崩溃

    工程规范中极度不建议使用隐式的 `[=]` 或 `[&]`，必须明确写出 `[x, &y]` 以明确生命周期

!!! tip "关于 `this` 指针的捕获"

    如果 Lambda 定义在一个类的成员函数内部，它需要读写该类的成员变量

    使用 `[this]` 或 `[=]`：都是按值捕获了 `this` 指针。如果在闭包对象存活期间，当前的类对象本身被销毁了，那 Lambda 里的 `this` 就成了野指针

    C++17 引入了 `[*this]`：这会按值拷贝一整个当前对象进入 Lambda 内部。虽然有拷贝开销，但极其安全，常用于多线程回调，不必担心原对象被销毁

泛型 Lambda (Generic Lambda) - C++14：在 C++14 之前，Lambda 的参数必须写死具体类型。C++14 允许在参数列表中使用 `auto`，让编译器像函数模板一样去推导类型

```cpp linenums="1"
auto add = [](auto a, auto b) { return a + b; };
std::cout << add(1, 2) << add(1.5, 2.5); // int 和 double 均可
```

广义捕获 / 初始化捕获 (Init-capture) - C++14：C++11 时，只能捕获当前作用域已有的变量。C++14 允许你在捕获列表里直接声明并初始化一个新变量

应用场景：移动捕获 (Move Capture)。如果你有一个不可拷贝的对象（比如 `std::unique_ptr`），在 C++11 时你无法把它捕获（因为按值必拷贝，按引用可能会生命周期不足）。C++14 提供了完美的方案

```cpp linenums="1"
std::unique_ptr<int> p = std::make_unique<int>(10);
// 把外部的 p 直接 move 进 lambda 内部的私有 ptr 中
auto lambda = [ptr = std::move(p)]() {
    std::cout << *ptr;
};
```

模板 Lambda - C++20：虽然 C++14 有了 `auto`，但有时 `auto` 过于宽松。比如我想写一个泛型 Lambda，但我要求两个参数类型必须完全相同，C++14 怎么写都不对味。C++20 终于允许给 Lambda 加上真正的模板头：

```cpp linenums="1"
auto max_func = []<typename T>(T a, T b) {
    return a > b ? a : b;
};
```
