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

!!! example "Algorithm 1"

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
    2. progress：不满足。如果 `turn = i`，但 Pi 不在剩余区（不请求进入），而 Pj 想进入，Pj 必须等待 Pi 进入一次并把 `turn` 改为 `j`。如果 Pi 永远不再请求进入（比如结束或卡在剩余区），Pj 就永远无法进入
    3. bounded waiting：满足。任何一个进程最多等待另一个进程完成一次临界区访问，等待次数是有界的（最多 1 次）

!!! example "Algorithm 2"

    ```c linenums="1"
    boolean flag[2];
    flag[0] = flag[1] = 0;
    ```

    <div class="grid" markdown>
    <div markdown>

    Process Pi:

    ```c linenums="1"
    do {
        flag[i] = true;  // 标记自己正在尝试进入临界区
        while (flag[j]);  // 循环等待，直到对方不再尝试进入
        critical section;  // 进入临界区
        flag[i] = false;  // 离开后清除标记
        remainder section;  // 执行非临界区代码
    } while (1);
    ```
    
    </div>
    <div markdown>

    Process Pj:

    ```c linenums="1"
    do {
        flag[j] = true;
        while (flag[i]);
        critical section;
        flag[j] = false;
        remainder section;
    } while (1);
    ```

    </div>
    </div>

    1. mutual exclusion：满足。每次进入临界区之前，都会检查对方的 `flag` 是否为 `true`，两个进程不会同时进入临界区
    2. progress：不满足。如果 Pi 执行了 `flag[i] = true`，Pj 执行了 `flag[j] = true`，那么两个进程都会卡在 `while` 循环当中
    3. bounded waiting：不满足。Pi 退出 CS 后立即又想进入，执行 `flag[i] = true`，此时 P1 可能还没进入 CS（还在执行 remainder 或刚要检查 `flag[i]`）。如果 Pi 总是能抢先设置 `flag[i] = true` 并检查 `flag[j]` 为 `false`，那么 Pj 可能饥饿

!!! example "Algorithm 3"

    ```c linenums="1"
    boolean flag[2];
    flag[0] = flag[1] = 0;
    ```

    <div class="grid" markdown>
    <div markdown>

    Process Pi:

    ```c linenums="1"
    do {
        while (flag[j]);
        flag[i] = true;
        critical section;
        flag[i] = false;
        remainder section;
    } while (1);
    ```
    
    </div>
    <div markdown>

    Process Pj:

    ```c linenums="1"
    do {
        while (flag[i]);
        flag[j] = true;
        critical section;
        flag[j] = false;
        remainder section;
    } while (1);
    ```

    </div>
    </div>

    mutual exclusion：不满足。Pi 和 Pj 可以将 `while` 循环执行完，然后才设置自己的 `flag` 为 `true`，同时进入 CS

### 2.3 Peterson's Solution

两个共享变量：

1. `turn`：明确指定当前有权进入临界区的进程
2. `flag[2]`：每个进程通过设置自身的 `flag` 为 `true` 来表达其进入临界区的意愿

假设基础硬件指令（`LOAD` 和 `STORE`）被假定为原子性（执行过程中不可中断）

```c linenums="1"
while (true) {
    flag[i] = true;
    turn = j;
    while (flag[j] && turn == j);
    critical section;
    flag[i] = false;
    remainder section;    
}
```

1. mutual exclusion：由于 `turn == i` `turn == j` 永远都会有一个成立，另一个不成立，所以不可能出现两个进程同时进入 CS
2. progress：由于 `turn == i` `turn == j` 永远都会有一个成立，另一个不成立，所以当没有进程在 CS 中时，想进入 CS 的那个进程总可以进去
3. bounded waiting：假设 Pi 卡在 `while` 循环当中，Pj 退出临界区时，它会设置 `flag[j] = false`，这就会使得 Pi 离开 `while` 循环，不会无限等待

## 3 Synchronization Hardware

计算机系统中实现同步的硬件支持方式

单处理器解决方案：禁用中断。在进入临界区前禁用中断，退出时重新启用。这会确保当前进程在执行临界区代码时不会被时钟中断或其他中断抢占

局限性：

1. 在多处理器系统中无效，因为其他 CPU 仍可同时访问共享内存
2. 影响系统响应性和实时性
3. 不适合作为通用的同步机制

现代硬件解决方案：原子指令

> Atomic：这些指令在执行过程中不可被中断，要么完全执行，要么完全不执行

两种主要类型：

1. TestAndSet（测试并设置）：检查内存值并同时设置新值
2. CompareAndSwap（交换）：原子地交换两个内存位置的内容

优势：

1. 适用于多处理器系统
2. 提供了构建更高级同步原语的基础
3. 比禁用中断更加高效和可扩展

### 3.1 TestAndSet Instruction

```c linenums="1"
boolean TestAndSet(boolean *target) {
    boolean rv = *target;
    *target = true;
    return rv;
}
```

返回值意义：

- 返回 `FALSE`：表示该锁之前未被占用，当前进程成功获得锁
- 返回 `TRUE`：表示锁已被占用，当前进程需要等待

!!! tip "实现互斥锁"

    ```c linenums="1"
    while (true) {
        while (TestAndSet(&lock));
        critical section;
        lock = false;
        remainder section;
    }
    ```

    1. 初始化共享变量 `lock = FALSE` 表示锁未被占用
    2. 获取锁：进程调用 `TestAndSet(&lock)`，如果返回 `FALSE`，说明锁原本是空闲的，现在已被设置为 `TRUE`，进程进入临界区；如果返回 `TRUE`：说明锁已被占用，进程在 `while` 循环中忙等待（自旋）
    3. 释放锁：进程退出临界区时，将 `lock` 设为 `FALSE`，允许其他等待的进程获得锁

### 3.2 CompareAndSwap Instruction

```c linenums="1"
int compare_and_swap(int *value, int expected, int new_value) {
    int temp = *value;
    if (*value == expected) {
        *value = new_value;
    }
    return temp;
}
```

参数：

1. `value`：指向要修改的内存位置
2. `expected`：期望的旧值
3. `new_value`：要设置的新值

只有在当前值与期望值匹配时才进行更新，总是返回内存位置的原始值，无论是否发生交换

!!! tip "实现自旋锁"

    ```c linenums="1"
    while (true) {
        while (compare_amd_swap(&lock, 0, 1) != 0);
        critical section;
        lock = 0;
        remainder section;
    }
    ```

    1. 获取锁 `compare_and_swap(&lock, 0, 1)`：如果 `lock` 当前为 `0`，将其设为 `1` 并返回 `0`，进程进入临界区；如果 `lock` 当前为 `1`，返回 `1`，进程继续忙等待
    2. 释放锁：将 `lock` 设为 `0`

!!! tip "实现有限等待"

    ```c linenums="1"
    while (true) {
        waiting[i] = true;  // 标记自己在等待
        key = 1;
        while (waiting[i] && key == 1) {
            key = compare_and_swap(&lock, 0, 1);  // 尝试获取锁
        }
        waiting[i] = false;  // 清除等待标记，进入临界区
        
        /* 临界区 */
        
        j = (i + 1) % n;  // 从下一个进程开始查找
        while ((j != i) && !waiting[j]) {  // 寻找下一个等待的进程
            j = (j + 1) % n;
        }
        if (j == i) {  // 没有其他进程等待
            lock = 0;  // 直接释放锁
        } else {  // 有进程在等待
            waiting[j] = false;  // 唤醒进程 j，让它获得锁
        }
        
        /* 剩余区 */
    }
    ```

    1. `lock`：全局锁
    2. `waiting[n]`：布尔数组，记录每个进程是否在等待
    3. `n`：进程总数
    4. `i`：当前进程 ID

### 3.3 Mutex Locks

之前讨论的 Peterson 算法、TestAndSet、CAS 等底层同步原语对应用程序开发者来说过于复杂，需要更简单、易用的同步工具

互斥锁将复杂的硬件同步指令封装成简单的 `acquire()` 和 `release()` 接口，开发者无需关心底层硬件实现细节

```c linenums="1"
// 简化的自旋锁实现
typedef struct {
    int locked;  // 0=未锁定, 1=已锁定
} mutex_lock;

void acquire(mutex_lock *lock) {
    while (compare_and_swap(&lock->locked, 0, 1) != 0); // 忙等待
}

void release(mutex_lock *lock) {
    lock->locked = 0;
}
```

关键特性：

1. 原子操作：`acquire()` 和 `release()` 必须不可中断
2. 忙等待（自旋）：进程在等待锁时持续检查锁状态，消耗 CPU 周期
3. spin lock（自旋锁）得名：因为进程在等待时像在旋转

```c linenums="1"
while (true) {
    acquire lock;
    critical section;
    release lock;
    remainder section;
}
```

## 4 Semaphores

**信号量**：一种同步工具，比互斥锁更高级的同步机制，整型信号量 S 表示可用资源的数量

操作语义（这两个操作必须不可中断）：

1. `wait()` / `P()`：如果 S 大于 0，立即减少 S 并继续执行；如果 S 小于等于 0，忙等待直到 S 大于 0
2. `signal()` / `V()`：增加 S 的值，表示释放一个资源

```c linenums="1"
wait(S) {
    while (S <= 0); // 空操作
    S--;
}

signal(S) {
    S++;
}
```

1. counting semaphore：其值是一个可以取任何非负整数的计数器。它用于控制对多个相同资源实例的访问。信号量的值表示当前可用资源的数量
2. binary semaphore：其值被限制为只能是 0 或 1。它主要用于提供互斥，即确保在任何时候只有一个线程或进程可以进入临界区。因此，它常被称为 mutex locks

```c linenums="1"
semaphore S;
wait(S);
critical section;
signal(S);
```

信号量本身是一个共享资源，对其值的操作必须是原子的。也就是说，必须保证没有两个进程能同时执行同一信号量的 `wait()` 和 `signal()`，否则会导致信号量状态错误（即竞态条件）

解决方案：将 `wait` 和 `signal` 操作内部的代码本身置于一个临界区中。这就把信号量的实现问题转化为了一个临界区问题

!!! tip "semaphore implementation with busy waiting"

    ```c linenums="1" hl_lines="13"
    struct semaphore {
        struct spinlock lock;
        int count;
    };
        
    void V(struct semaphore *s) {
        acquire(&s->lock);
        s->count += 1;
        release(&s->lock);
    }

    void P(struct semaphore *s) {
        while(s->count == 0);
        acquire(&s->lock);
        s->count -= 1;
        release(&s->lock);
    }
    ```

    > 如果生产者很少活动，消费者会在第 13 行空转。这非常浪费资源

    如果使用像自旋锁这样的机制来实现保护 `wait` 和 `signal` 操作的临界区，那么当一个进程在等待进入这个临界区时，它可能会在循环中忙等待，消耗 CPU 资源

    busy waiting 适用场景：

    1. 实现代码很短：如果 `wait` 和 `signal` 内部的代码执行得非常快，忙等待的时间会很短
    2. 临界区很少被占用：如果冲突很少发生，进程很少需要等待，那么忙等待的问题就不显著

    缺点：对于通用的应用程序，进程可能在临界区内花费相当长的时间。在这种情况下，忙等待会变得非常低效，因为它会浪费大量的 CPU 周期
    
    因此，信号量的实现通常不会使用纯粹的忙等待

每个信号量都有一个关联的 waiting queue。每个信号量包含两个数据项：

1. value：一个整数，表示可用资源的数量

    1. `value >= 0`：表示当前可用资源的个数
    2. `value < 0`：其绝对值表示正在等待该信号量的进程数量

2. 等待队列指针：指向一个队列，该队列中存放了所有因等待此信号量而阻塞的进程的 PCB

两种关键操作：

1. block / sleep：一个系统调用。当一个进程执行 wait 操作（或 P 操作）试图获取信号量时，如果信号量的值小于或等于 0（表示没有可用资源），系统不会让它忙等，而是会调用 block 操作。该操作会将当前进程的 PCB 从就绪队列移出，放入该信号量的等待队列，从而让出 CPU
2. wakeup：一个系统调用。当一个进程执行 signal 操作（或 V 操作）释放信号量时，它会增加信号量的值。如果发现等待队列中有进程在等待，它就会调用 wakeup 操作。该操作会从等待队列中取出一个进程的 PCB，并将其放回就绪队列，使其有机会再次被调度执行

!!! tip "sleep and wakeup"

    ```c linenums="1"
    void V(struct semaphore *s) {
        acquire(&s->lock);          // 获取信号量锁
        s->count += 1;              // 增加计数器
        wakeup(s);                  // 唤醒等待的进程
        release(&s->lock);          // 释放锁
    }
    
    void P(struct semaphore *s) {
        while (s->count == 0) {     // 如果计数为0，进入循环
            sleep(s);               // 进程睡眠，等待被唤醒
        }
        acquire(&s->lock);          // 获取锁
        s->count -= 1;              // 减少计数器
        release(&s->lock);          // 释放锁
    }
    ```

    当 `P()` 发现 `count == 0` 时，进程会进入睡眠状态，并加入到与信号量关联的等待队列中。通过 sleep 操作主动放弃 CPU，减少了开销

    但如果 P 在进入 while 循环之后，V 执行了 wakeup，P 才执行 sleep，那么进程可能永远不会被唤醒了。这就是 lost wake-up problem（丢失唤醒问题）

    !!! question "提前 acquire 操作？"

        ```c linenums="1"
        void V(struct semaphore *s) {
            acquire(&s->lock);
            s->count += 1;
            wakeup(s);
            release(&s->lock);
        }
        
        void P(struct semaphore *s) {
            acquire(&s->lock);
            while (s->count == 0) {
                sleep(s);
            }
            s->count -= 1;
            release(&s->lock);
        }
        ```

        防止了丢失唤醒，但出现了 deadlock。进程 sleep 后，它仍然拿着这个锁

    !!! tip "pass the condition lock to sleep"

        ```c linenums="1"
        void V(struct semaphore *s) {
            acquire(&s->lock);
            s->count += 1;
            wakeup(s);
            release(&s->lock);
        }
        
        void P(struct semaphore *s) {
            acquire(&s->lock);
            while (s->count == 0) {
                sleep(s, &s->lock);
            }
            s->count -= 1;
            release(&s->lock);
        }
        ```

        `sleep(s, &s->lock)` 可以在调用进程被标记为已睡眠并加入到等待队列后，自动释放该锁

        这样既避免了丢失唤醒，又避免了死锁

no busy waiting 的 semaphore 实现：

```c linenums="1"
wait(S) {
    value--;
    if (value < 0) {
        block();
    }
}

signal(S) {
    value++;
    if (value <= 0) {
        wakeup(P);
    }
}
```

## 5 Classic Problems of Synchronization

### 5.1 Deadlock and Starvation

死锁：指两个或更多的进程，每个都在等待对方释放资源，导致所有进程都无法继续执行的情况

假设 S 和 Q 是两个信号量，初始值均为 1

<div class="grid" markdown>

```c linenums="1" title="P1"
P(S)
P(Q)
...
V(Q)
V(S)
```

```c linenums="1" title="P2"
P(Q)
P(S)
...
V(S)
V(Q)
```

</div>

若 P1 持有 S 的锁，P2 持有 Q 的锁；而 P1 申请 Q 的锁，P2 申请 S 的锁，两个进程都会因无法获得对方占有的资源而无限等待，形成死锁

饥饿：指一个进程由于某种原因（如调度策略不公平、优先级低等）长期得不到它所需的资源，无法继续执行

### 5.2 Bounded-Buffer Problem

### 5.3 Readers and Writers Problem

### 5.4 Dining Philosophers Problem

## 6 Monitors

## 7 Synchronization Examples

## 8 Atomic Transactions