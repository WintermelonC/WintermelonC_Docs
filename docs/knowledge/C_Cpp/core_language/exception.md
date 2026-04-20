# Exception

[OOP - Exception](../../../zju/basic_courses/OOP/ch12.md){:target="_blank"}

!!! tip "栈展开"

    当异常被 `throw` 抛出，且在当前作用域没有找到匹配的 `catch` 块时，程序会退出当前作用域，去调用者的作用域中寻找 `catch`。在这个层层退出的过程中，局部非静态对象的析构函数会被自动调用，释放它们占用的资源。这个过程就叫做栈展开

    栈展开机制完美契合了 RAII 和智能指针。如果发生异常，函数提前终止，智能指针依然会随着栈展开被析构，从而保证内存不泄漏。如果是裸指针（`new` 出去还没 `delete`），就会发生内存泄漏

```text linenums="1"
exception (基类，定义在 <exception>)
├── logic_error (逻辑错误，程序代码本身的 bug，理论上在运行前就可以发现)
│   ├── domain_error      // 定义域错误
│   ├── invalid_argument  // 无效参数
│   ├── length_error      // 长度超出范围
│   ├── out_of_range      // 超出范围（如 vector::at）
│   └── future_error      // 异步操作错误
├── runtime_error (运行时错误，只有在程序运行时才能检测到的错误)
│   ├── range_error       // 范围错误
│   ├── overflow_error    // 算术上溢
│   ├── underflow_error   // 算术下溢
│   └── system_error      // 系统调用错误
└── bad_alloc             // new 失败（<new>）
    bad_cast               // dynamic_cast 失败（<typeinfo>）
    bad_typeid             // typeid 失败
    bad_exception          // 意外异常处理
```

!!! question "析构函数可以抛出异常吗"

    不能（C++11 起，析构函数默认自带 `noexcept` 属性）

    如果在栈展开的过程中（此时正处于处理之前的那个异常的过程中），被析构的对象的析构函数又抛出了一个新的异常，C++ 运行时将不知道该处理哪一个异常，会导致调用 `std::terminate()`，立刻让程序崩溃结束

!!! question "构造函数可以抛出异常吗"

    可以，而且推荐在初始化失败时这样做

    构造函数没有返回值，无法通过返回错误码来告知调用方“对象创建失败”。抛出异常是中断构造并报错的最佳方式

    如果构造函数在执行了一半时抛出异常，这个对象本身就不会被视为完全构造好，因此它的析构函数永远不会被调用。但是，在抛出异常之前已经构造好的成员变量（如已经初始化的智能指针等）会正常执行栈展开被析构

!!! question "为什么 `catch` 异常时强烈建议使用“常量引用 `(const T&)`”"

    ```cpp linenums="1"
    // 反面教材：按值捕获
    catch (std::exception e) { cout << e.what(); } 
    
    // 正确做法：按常量引用捕获
    catch (const std::exception& e) { cout << e.what(); }
    ```

    如果你抛出了一个子类异常（比如 `std::out_of_range`），但是你用基类 `std::exception` 按值捕获。此时发生拷贝构造，子类对象特有的部分会被“切掉（Object Slicing）”，导致调用的 `what()` 变成基类的版本，而非子类重载的版本（多态失效）

    使用引用捕获可以避免拷贝开销，并且能够正确地发生运行时的多态调用

!!! question "C++11 关键字 `noexcept` 的作用是什么"

    告诉编译器这个函数保证不会抛出异常

    一旦违反承诺（抛出了异常并且逃逸出了该函数），程序会直接调用 `std::terminate()` 暴力崩溃，连 `catch` 的机会都不给

    性能优化的核心价值：特别是对于移动构造函数 (Move Constructor) 和移动赋值运算符。标准库容器（如 `std::vector`）在扩容的时候，如果元素的移动构造函数被标记为 `noexcept`，`vector` 就会放心地将老元素 “移动” 到新内存空间；如果没有标记，为了保证“强异常安全性”，`vector` 会退化回去使用 “拷贝” 构造来搬运元素（因为拷贝如果发生异常，老数据还健在；而移动一半发生异常，老数据已经被破坏了）

!!! tip "异常安全的三个等级"

    评价一个函数在发生异常时，对程序状态的破坏程度：

    1. 基本保证 (Basic Guarantee)：如果发生异常，程序内部没有资源泄漏（靠 RAII），对象处于有效的但未知的状态
    2. 强保证 (Strong Guarantee)：如果发生异常，程序状态回滚（Rollback） 到调用该函数之前的状态。常见的做法是 "Copy and Swap" (拷贝并交换) 惯用法
    3. 不抛异常保证 (Nothrow Guarantee)：函数承诺绝不抛出异常。基本数据类型的操作、指针操作一般都具有此保证（对应 `noexcept`）

!!! tip "重新抛出异常（Re-throwing）"

    如果在一个 `catch` 块中只想记录日志，然后把异常原封不动传给更上层处理，应该只写 `throw;`

    ```cpp linenums="1"
    catch (const std::exception& e) {
        log_error(e.what());
        throw;   // 正确：原样传出，保留原始异常类型
        // throw e; // 错误：会抛出新拷贝的异常（且若原本是子类，此时会被“切割”成捕获的基类）
    }
    ```