# Smart Pointer

C++ 中的智能指针（Smart Pointers）是 C++11 标准引入的重要特性，主要用于自动、安全地管理动态分配的内存。它们包含在 `<memory>` 头文件中

智能指针的核心思想是 RAII（Resource Acquisition Is Initialization，资源获取即初始化）：将动态分配的内存封装在一个局部对象中，利用局部对象在离开作用域时自动调用析构函数的特性，来实现内存的自动释放。这能有效防止内存泄漏（Memory Leak）和悬垂指针（Dangling Pointer）

## 1 `std::unique_ptr`

`std::unique_ptr` 是一种独占性的智能指针。这意味着在任何时刻，一个对象只能被一个 `unique_ptr` 所拥有

1. 不可拷贝：你不能直接将一个 `unique_ptr` 赋值或拷贝给另一个 `unique_ptr`（拷贝构造函数和拷贝赋值运算符被禁用）
2. 可移动：可以使用 `std::move` 将所有权从一个 `unique_ptr` 转移给另一个。转移后，原来的指针变为空（`nullptr`）

推荐使用 `std::make_unique`（C++14 引入）来创建

```cpp linenums="1"
#include <iostream>
#include <memory>

class MyClass {
public:
    MyClass() { std::cout << "MyClass Constructor\n"; }
    ~MyClass() { std::cout << "MyClass Destructor\n"; }
    void doSomething() { std::cout << "Doing something...\n"; }
};

int main() {
    {
        // 推荐：使用 make_unique 创建 unique_ptr
        std::unique_ptr<MyClass> ptr1 = std::make_unique<MyClass>();
        ptr1->doSomething();

        // std::unique_ptr<MyClass> ptr2 = ptr1; // 错误：无法拷贝！

        // 正确：通过 std::move 转移所有权
        std::unique_ptr<MyClass> ptr3 = std::move(ptr1);
        if (!ptr1) {
            std::cout << "ptr1 is now null.\n";
        }
        ptr3->doSomething();
    } // 这里离开作用域，ptr3 被销毁，MyClass的析构函数自动被调用
    return 0;
}
```

## 2 `std::shared_ptr`

`std::shared_ptr` 允许多个智能指针共享同一个对象的所有权

1. 内部包含一个引用计数器（Reference Count）
2. 每次对 `shared_ptr` 进行拷贝或赋值操作时，引用计数加 1
3. 每次有 `shared_ptr` 被销毁（离开作用域）或重新赋值时，引用计数减 1
4. 当引用计数降为 0 时，对象才会被自动销毁

推荐使用 `std::make_shared` 来创建。它不仅使得代码更简洁，还能将对象实例和控制块（包含引用计数等信息）合并为一次内存分配，性能更好且能防止某些极端情况下的内存泄漏

!!! tip "`make_shared` 一次分配"

    当你使用 `shared_ptr` 管理一个对象时，底层其实需要维护两块信息：

    1. 对象实例本身：也就是你真正想使用的数据（比如一个 `int`，或者一个 `MyClass` 对象）
    2. 控制块（Control Block）：它是 `shared_ptr` 用来实现共享和计数的东西。控制块里包含：

        1. 强引用计数（有多少个 `shared_ptr` 指向对象）
        2. 弱引用计数（有多少个 `weak_ptr` 观察对象）
        3. 自定义删除器（如果有的话）等其他信息

    如果你这样写代码：

    ```cpp linenums="1"
    std::shared_ptr<MyClass> ptr(new MyClass());
    ```

    实际上发生了两步：

    1. `new MyClass()` 在堆内存中开辟了一块空间，用来存放 `MyClass` 对象。这是第一次内存分配
    2. `shared_ptr` 的构造函数收到这个裸指针后，为了管理它，又在堆内存中单独开辟了另一块空间，用来存放“控制块”。这是第二次内存分配

    两者的内存布局时分散的

    如果你这样写代码：

    ```cpp linenums="1"
    auto ptr = std::make_shared<MyClass>();
    ```

    `std::make_shared` 会在底层进行优化。它会先计算好“对象的大小”加上“控制块的大小”，然后向系统申请一整块足够大的连续内存，把控制块和对象挨着放在一起。两者的内存布局时连续的

    1. 性能更高（省时间）：在堆上分配内存（调用 `new` 或 `malloc`）是一个相对耗时的操作系统操作。把两次分配减为一次分配，直接减少了一半的内存分配开销
    2. 内存更连续，缓存命中率高（省空间、速度快）：控制块和对象在内存中是挨着的。当 CPU 读取 `shared_ptr` 的控制块检查引用计数时，利用局部性原理，对象本身大概率也会被顺便加载到 CPU 的高速缓存（Cache）中，后续访问对象数据的速度会非常快
    3. 异常安全（防止内存泄漏）：在早期的 C++11/14 中，如果写一个函数：`func(std::shared_ptr<T>(new T()), doSomethingElse());`。如果 `new T()` 成功了，但在构造 `shared_ptr` 之前，`doSomethingElse()` 抛出了异常，那么 `new T()` 申请的内存就会泄漏，因为没有指针接管它。而 `make_shared` 把分配和接管做成了一个不可分割的整体动作，消除了这个风险

```cpp linenums="1"
#include <iostream>
#include <memory>

int main() {
    std::shared_ptr<int> ptr1 = std::make_shared<int>(100);
    std::cout << "Count (ptr1): " << ptr1.use_count() << "\n"; // 输出: 1

    {
        std::shared_ptr<int> ptr2 = ptr1; // 发生拷贝，共享所有权
        std::cout << "Count (ptr1): " << ptr1.use_count() << "\n"; // 输出: 2
        *ptr2 = 200;
    } // ptr2 离开作用域被销毁，引用计数减1

    std::cout << "Count (ptr1): " << ptr1.use_count() << "\n"; // 输出: 1
    std::cout << "Value: " << *ptr1 << "\n"; // 输出: 200

    return 0; // ptr1 被销毁，引用计数降为0，释放内存
}
```

!!! tip "自定义删除器"

    智能指针默认使用 `delete` 释放资源，但有时我们管理的不一定是普通内存（例如文件句柄 `FILE*`、网络套接字）。此时可以传入自定义删除器：

    ```cpp linenums="1"
    // unique_ptr 的删除器是模板类型的一部分，需要明确指定
    std::unique_ptr<FILE, decltype(&fclose)> filePtr(fopen("test.txt", "r"), &fclose);
    
    // shared_ptr 的删除器不需要写在模板参数里，更灵活
    std::shared_ptr<FILE> filePtr2(fopen("test.txt", "r"), fclose);
    ```

!!! question "`shared_ptr` 是线程安全的吗"

    1. 控制块的引用计数是线程安全的：底层通常使用原子操作（`std::atomic`）实现计数的增减，因此多个线程同时拷贝、析构同一个 `shared_ptr` 是安全的
    2. 指针指向的对象的读写不是线程安全的：多个线程通过 `shared_ptr` 并发修改其指向的底层对象时，如果没有加锁同步，会引发数据竞争（Data Race）。此外，对同一个 `shared_ptr` 实例本身进行并发读写操作（如一个线程赋值，另一个线程读取）也是不安全的，需要加锁

## 3 `std::weak_ptr`

`std::weak_ptr` 是为了配合 `shared_ptr` 而设计的。它提供对象的“非拥有”（观察者）访问权

1. 不增加引用计数：将一个 `shared_ptr` 赋值给 `weak_ptr` 不会改变对象的生命周期
2. 不能直接访问：`weak_ptr` 没有重载 `*` 和 `->` 操作符。要想访问对象，必须先通过 `lock()` 方法尝试将其提升为一个有效的 `shared_ptr`
3. 核心作用：解决 `shared_ptr` 带来的循环引用（Circular Reference）问题

!!! tip "循环引用"

    如果对象 A 包含指向对象 B 的 `shared_ptr`，而对象 B 也包含指向对象 A 的 `shared_ptr`，那么它们的引用计数永远不会降为 0，从而导致内存泄漏。此时应将其中一个指针改为 `weak_ptr` 来打破循环

    ```cpp linenums="1"
    #include <iostream>
    #include <memory>
    
    struct Node {
        std::shared_ptr<Node> next;
        // 如果这里使用 std::shared_ptr<Node> prev; 会导致循环引用
        std::weak_ptr<Node> prev; // 使用 weak_ptr 打破循环
        
        ~Node() { std::cout << "Node Destroyed\n"; }
    };
    
    int main() {
        auto node1 = std::make_shared<Node>();
        auto node2 = std::make_shared<Node>();
    
        node1->next = node2;
        node2->prev = node1;
    
        // 检查 prev 的对象是否还有效
        if (auto shared_prev = node2->prev.lock()) {
            std::cout << "prev node is still alive.\n";
        }
    
        return 0; 
        // 正常退出，node1 和 node2 均被正确释放（输出两次 "Node Destroyed"）
    }
    ```

!!! tip "`lock()`"

    要想使用被 `weak_ptr` 指向的对象的方法，你必须先使用 `lock()` 方法。`lock()` 的作用是：检查观察的对象是否还存活

    1. 如果对象还存活：它会返回一个有效的 `std::shared_ptr`（同时会临时将引用计数加 1，保证在你使用期间对象绝对不会被其他地方销毁）
    2. 如果对象已经销毁：它会返回一个空的 `std::shared_ptr`

---

!!! question "`std::auto_ptr` 为什么被 C++11 废弃最终在 C++17 移除"

    `auto_ptr` 是早期的独占式智能指针。它的拷贝操作具有破坏性（会隐式地转移所有权）

    `auto_ptr<int> p2 = p1;` 编译能通过，但赋值后，`p1` 会莫名其妙变成空指针。如果把 `auto_ptr` 放进 STL 容器（如 `vector`）并调用算法（如 `sort` 内部会产生拷贝），会导致严重崩溃危险

    C++11 引入右值引用和移动语义后，用 `unique_ptr` 的 `std::move` 明确区分了拷贝和转移的概念，从而完美替代了它