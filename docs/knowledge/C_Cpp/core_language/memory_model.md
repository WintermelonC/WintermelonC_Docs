# Memory Model

内存主要分为五大区：

1. Stack（栈区）：存放局部变量、函数参数、返回地址等。由编译器自动分配和释放，函数执行完后立即销毁。空间较小，分配效率极高。极易发生栈溢出（Stack Overflow）
2. Heap（堆区）：存放由程序员动态申请的内存。由程序员手动控制分配和释放。如果不释放就会造成内存泄漏，程序结束后操作系统才会强制回收。空间非常大，但分配速度较慢，频繁分配容易产生大量内存碎片
3. Global/Static Segment（全局/静态存储区）：存放全局变量、用 `static` 修饰的静态变量。通常还细分为 .data 段（存放已经初始化的非零全局/静态变量）和 .bss 段（存放未初始化或初始化为 0 的全局/静态变量，BSS 段在程序加载时会自动清零）
4. Read-Only / Constant Segment - .rodata（常量区）：存放常量字符串、受 `const` 修饰且在编译期就能确定的只读变量。内存在程序运行期间不允许修改，强行修改会导致“段错误”
5. Text Segment - .text（代码区）：存放函数体的二进制机器指令

!!! question "堆和栈的区别"

    1. 管理方式：栈自动管理；堆手动管理
    2. 空间大小：栈很小（MB 级别）；堆很大（GB 级别，受限于虚拟内存）
    3. 生长方向：栈向低地址扩展（向下生长）；堆向高地址扩展（向上生长）
    4. 分配效率：栈在底层直接移动寄存器指针，速度极快；堆需要调用系统 API（如 brk 或 mmap）并搜索空闲内存块，速度慢
    5. 连续性与碎片：栈空间是完全连续的；堆频繁 new/delete 会导致大量的内存碎片，降低内存利用率

!!! question "`new`/`delete` 与 `malloc`/`free` 的区别"

    1. 属性不同：`new`/`delete` 是 C++ 的关键字（操作符），受编译器支持且可以被重载；`malloc`/`free` 是 C 语言的库函数，需要引入头文件 `<cstdlib>`
    2. 构造与析构：`new` 在分配内存后会自动调用该类的构造函数，`delete` 会先调用对象的析构函数再释放内存。而 `malloc`/`free` 只是冷冰冰地划出一块原始内存，完全不管对象的初始化和销毁
    3. 返回类型安全：`new` 操作成功后返回的是对象类型的指针，类型安全；`malloc` 成功后返回 `void*`，必须由程序员显式强转为对应类型的指针
    4. 失败时的处理：内存不足时，`new` 默认抛出 `std::bad_alloc` 异常；`malloc` 会返回 `NULL` 空指针

!!! tip "内存对齐（Memory Alignment）"

    既然有了基本数据类型，为什么结构体的大小往往比内部元素大小的总和要大？

    物理硬件的限制。CPU 访问内存时并不是按字节逐个读取的，而是按字（Word，比如 32 位机器一次读 4 字节，64 位一次读 8 字节）成块读取的。如果一个 int 放到了不对齐的地址里，CPU 可能需要读两次内存然后再进行高低位拼凑，极大地损耗性能。甚至某些硬件平台不支持非对齐访问，会直接抛出硬件异常

    对齐规则：

    1. 结构体的第一个成员放在偏移量为 0 的位置
    2. 之后每个成员放在其自身类型大小的整数倍的偏移地址处（如果有内部子结构体，要看子结构体里最大成员的大小）
    3. 整个结构体的总大小必须是其最大基本数据类型成员大小的整数倍，不足的在末尾填充字节（Padding）

    可以通过添加 `#pragma pack(n)` 宏来强制改变编译器的对齐字节数，或者在 C++11 后使用 `alignas(n)`

## 1 并发内存模型

C++11 引入了官方的多线程并确立了并发内存模型（Concurrent Memory Model）。并发内存模型的作用是约束编译器优化、CPU 指令乱序执行（Out-of-Order Execution）和 CPU 缓存不一致带来的多线程可见性问题，允许程序员在性能与严格的同步约束之间做出平衡

!!! tip "先行发生（Happens-Before）"

    C++ 并发模型的核心是建立可见性和执行顺序的关系，最基础的概念是 Happens-Before：如果操作 A happens-before 操作 B，那么操作 A 产生的影响（修改的内存状态）必定对操作 B 可见，且执行顺序上 A 先于 B。对多线程而言，这就是确保跨线程数据完整性的准则

C++11 提供了 6 种内存序标志（属于 `std::memory_order` 枚举），它们被归类为三种主要的内存模型：

!!! tip "顺序一致性模型 (Sequential Consistency)"

    1. 标志：`std::memory_order_seq_cst`
    2. 说明：这是 `std::atomic` 所有操作的默认选项。它是最严格的内存模型
    3. 特性：除了保证单个原子的操作外，还保证所有线程看到的所有 `seq_cst` 标记的原子操作是完全相同的顺序。这就好像所有的原子操作都在一个单一的全局队列里排队执行
    4. 代价：性能开销最大。通常需要 CPU 插入全屏障指令（Memory Barrier/Fence），阻止任何前后的指令乱序，并强制清空/刷新 CPU 缓存

!!! tip "获取-释放模型 (Acquire-Release)"

    这是应用最广的高性能同步模型，用于在不同线程间同步特定的后继和前置操作

    标志：

    1. `memory_order_acquire`（获取操作，用于读：`Load`）
    2. `memory_order_release`（释放操作，用于写：`Store`）
    3. `memory_order_acq_rel`（获取和释放，用于读改写：`Read-Modify-Write`）
    4. `memory_order_consume`（数据依赖同步，由于标准与编译器实现极不完善，C++17 已建议尽量避免使用）

    特性：

    1. 在线程 A 中对共享变量进行 release 写操作，在线程 B 中对同一变量进行 acquire 读操作
    2. Release 屏障：在 release 操作之前的所有的内存读写（无论是否是原子变量），绝不会被重排到 release 之后
    3. Acquire 屏障：在 acquire 操作之后的所有的内存读写，绝不会被重排到 acquire 之前

    结论：一旦线程 B acquire 读到了线程 A release 写入的值，那么线程 A 在 release 前产生的所有数据变更，均对线程 B 可见

    ```cpp linenums="1"
    std::atomic<bool> ready{false};
    int data = 0;
    
    // Thread 1
    void producer() {
        data = 42; // 普通写入
        ready.store(true, std::memory_order_release); // 释放操作：保证 data = 42 必须在这之前执行并刷新到主存
    }
    
    // Thread 2
    void consumer() {
        // 获取操作：如果读到 true，保证能看到前面 release 时的内存状态
        while (!ready.load(std::memory_order_acquire)) {
            // 自旋等待
        }
        assert(data == 42); // 绝对安全，不会发生 Data Race 或读到旧值
    }
    ```

!!! tip "松散模型 (Relaxed)"

    1. 标志：`std::memory_order_relaxed`
    2. 特性：最宽松的模型。它只保证当前原子变量本身操作的原子性，不提供任何跨线程的同步和内存屏障。编译器和 CPU 可以对其前后的任意指令进行随意重排序
    3. 适用场景：线程间没有数据依赖关系，例如记录事件调用次数的单纯计数器
    4. 代价：性能最高，因为在多数 CPU 架构下只需编译为一条普通的机器原生原子指令

    ```cpp linenums="1"
    std::atomic<int> counter{0};
    
    void increment() {
        for (int i = 0; i < 1000; ++i) {
            // 只需保证累加操作不丢失，不需要和其他变量做可见性同步
            counter.fetch_add(1, std::memory_order_relaxed); 
        }
    }
    ```