# 6 Process Synchronization

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Background

<!-- TODO: 少一部分内容 -->

producer-consumer 模型的实现：

```c linenums="1" title="producer"
while (true) {
    while (count == BUFFER_SIZE);
    buffer[in] = nextProduced;
    in = (in + 1) % BUFFER_SIZE;
    count++;
}
```

```c linenums="1" title="consumer"
while (true) {
    while (count == 0);
    nextConsumed = buffer[out];
    out = (out + 1) % BUFFER_SIZE;
    count--;
}
```

## 2 The Critical Section Problem

### 2.1 Race Condition

!!! example "示例"

    `count++` 可能被实现为

    ```c linenums="1"
    reg1 = count;
    reg1 = reg1 + 1;
    count = reg1
    ```

    `count--` 可能被实现为

    ```c linenums="1"
    reg2 = count;
    reg2 = reg2 - 1;
    count = reg2
    ```

    一个生产者线程执行 `count++`，一个消费者线程执行 `count--`。但由于两个线程的指令交错执行，可能导致错误（假设初始值 `count = 5`），例如

    1. 生产者读取 `count` (5) 并计算新值 (6)，但尚未写回
    2. 在生产者写回之前，消费者读取了 `count` 的值，此时它仍然是 5。消费者计算新值 (4)
    3. 生产者将其计算的结果 (6) 写回 count
    4. 消费者将其计算的结果 (4) 写回 count，覆盖了生产者刚刚写入的值

    那么 `count` 最后的值可能有三种情况：4、5 或 6

当满足以下两个条件时，就会发生竞态条件：

1. 并发访问：多个线程或进程同时访问同一个内存位置（变量、数据结构等）
2. 至少包含写操作：这些并发访问中，至少有一个是写操作（修改数据），而不仅仅是读操作

### 2.2 Critical Section Problem

critical section（临界区）：指代进程中访问共享资源（例如全局变量、公共文件、硬件设备）的那段代码

critical section problem：当多个进程或线程需要共享资源（如数据、设备）时，如何确保不会有两个以上的进程同时进入其临界区

为了解决这个问题，需要设计一个协议，任何进程在进入临界区前都必须遵守这个协议。这个协议将进程访问临界区的代码划分为四个部分：

1. entry section：进程在进入临界区之前必须执行的代码。这是请求许可的区域。进程在这里等待，直到获准进入临界区。通常包含实现同步机制的代码（如获取锁）
2. critical section：进程实际访问共享资源的代码段。这是需要互斥访问的部分，即一次最多只能有一个进程在此段代码中执行
3. exit section：进程在离开临界区时执行的代码。这是释放访问权的区域。通常用于通知其他进程临界区已空闲（如释放锁）
4. remainder section：进程中不涉及共享资源访问的其余代码部分

任何解决临界区问题的方案都必须满足 3 个核心条件：

1. **mutual exclusion**（互斥）：这是最根本的要求。它保证了任何时候最多只有一个进程能够处于其临界区中，从而确保对共享资源的访问是串行化的，防止了数据不一致（即解决了之前提到的竞态条件问题）
2. **progress**（进展）：这个要求保证了系统的活性。它意味着：选择哪个进程进入临界区的决策必须在有限的进程中做出（不能依赖超出这些进程之外的因素），这个选择不能无限期拖延。如果没有进程在临界区，并且有进程想进去，那么其中一个必须能够被允许进入。这防止了系统死锁或停滞在无人能进入临界区的状态
3. **bounded waiting**（有限等待）：这个要求防止了进程饥饿。它确保任何一个进程在请求进入临界区后，只需要等待有限的时间（即被其他进程插队的次数是有限的），之后它一定能获得进入权限。这保证了所有进程都有公平的机会访问共享资源，避免了某个进程因为某种原因永远无法进入其临界区

以及 2 个系统假设：

1. 每个进程以非零速度执行：意味着进程最终都会完成其计算，不会完全停止。这排除了因进程自身故障导致的问题，让我们专注于并发控制逻辑
2. 不假设进程的相对速度：这是一个非常重要的现实假设。在真实的多处理器或分时系统中，我们无法预知哪个进程运行得更快，调度器何时切换进程。因此，一个正确的解决方案不能依赖于任何特定的时间安排或执行速度假设。它必须在任何可能的指令交错执行情况下都能正常工作

> 一个正确的临界区解决方案必须同时满足互斥、进展和有限等待这 3 个条件，并且必须在不依赖进程相对执行速度的前提下做到这一点

!!! example "双进程互斥算法"

    ```c linenums="1"
    int turn;
    turn = 0;
    ```

    <div class="grid" markdown>
    <div markdown>

    Process Pi:

    ```c linenums="1"
    do {
        while (turn != i);
        critical section;
        turn = j;
        remainder section;
    } while (1);
    ```
    
    </div>
    <div markdown>

    Process Pj:

    ```c linenums="1"
    do {
        while (turn != j);
        critical section;
        turn = i;
        remainder section;
    } while (1);
    ```

    </div>
    </div>

    1. mutual exclusion：满足。`turn` 的值只能是 `i` 或 `j`，两个进程不会同时进入临界区
    2. progress：满足。如果某个进程想进入临界区，而另一个进程不在临界区中，则它可以进入
    3. bounded waiting：满足。任何一个进程最多等待另一个进程完成一次临界区访问，等待次数是有界的（最多 1 次）

## 3 Remainder Section

## 4 Synchronization Hardware

## 5 Semaphores

## 6 Classic Problems of Synchronization

## 7 Monitors

## 8 Synchronization Examples

## 9 Atomic Transactions