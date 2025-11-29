# 9 Synchronize and Locks

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 synchronized

`synchronized` 块是 Java 中用于实现线程同步的一种机制，它提供了一种方式来控制多个线程对共享资源的并发访问。它的核心思想是：确保在同一时刻，只有一个线程可以执行某个特定的代码段，从而避免数据的不一致性问题

```java linenums="1"
synchronized(lockObject) {
    // 需要同步的代码块
}
```

`lockObject`：锁对象。这是 `synchronized` 块的核心。线程在进入同步块之前必须先获得这个对象的监视器锁（也称为内部锁或互斥锁）。可以是任何 Java 对象

所有同步块如果使用同一个锁对象，那么它们就是互斥的。如果使用不同的锁对象，则不会互斥

```java linenums="1"
// this 锁：对象实例锁
public class MyClass {
    public void myMethod() {
        synchronized(this) {
            // 访问或修改实例变量
        }
    }
}

// Class 对象锁：类锁
public class MyClass {
    public static void staticMethod() {
        synchronized(MyClass.class) {
            // 访问或修改静态变量
        }
    }
}

// 自定义对象锁
public class MyClass {
    private final Object lock = new Object();

    public void myMethod() {
        synchronized(lock) {
            // 同步代码
        }
    }
}
```

!!! tip "`synchronized` 方法"

    `synchronized` 方法实际上是 `synchronized` 块的一种简写形式

    ```java linenums="1"
    public synchronized void myMethod() {
        // 方法体
    }

    // 等价于

    public void myMethod() {
        synchronized(this) {
            // 方法体
        }
    }
    ```

!!! tip "`synchronized` 块抛异常"

    在 `synchronized` 块中抛出异常时，锁会被自动释放，避免死锁

    ```java linenums="1"
    synchronized(lock) {
        try {
            counter++;
            if (counter == 3) {
                throw new RuntimeException("故意抛出的异常");
            }
            System.out.println("Counter: " + counter);
        } catch (RuntimeException e) {
            System.out.println("捕获异常，锁已释放: " + e.getMessage());
            // 可以在这里进行恢复操作
        }
    }
    ```

## 2 `wait()` and `notify()`

`wait()` 和 `notify()` 是用于线程间通信的重要方法，它们必须在 `synchronized` 块或方法中使用

```java linenums="1"
synchronized(lock) {
    try {
        lock.wait();    // 释放锁，进入等待状态
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
    
    lock.notify();      // 唤醒一个等待线程
    lock.notifyAll();   // 唤醒所有等待线程
}
```

`wait()` 方法的行为：

1. 释放锁，其他线程可以获取这个锁
2. 线程进入 WAITING 状态
3. 等待被 `notify()` 唤醒
4. 被唤醒后需要重新获取锁（可能会等待其他线程释放），继续执行后续代码

!!! tip "InterruptedException"

    当一个线程正在调用 `wait()` 方法而处于 WAITING 或 TIMED_WAITING 状态时，如果另一个线程调用了该等待线程的 `interrupt()` 方法，那么 `wait()` 方法就会被中断，并抛出 `InterruptedException` 异常，同时 Java 会自动清除该线程的中断状态（即中断标志位会被重置为 `false`）

    `InterruptedException` 是一种协作式的中断策略。它不是强制终止线程，而是给线程一个信号，让线程自己决定如何响应中断。捕获这个异常后，开发者可以编写代码来处理中断请求

    如果在 `catch` 块写上 `Thread.currentThread().interrupt()`，作用是手动地将中断状态重新设置为 `true`，这样外层代码块就可以通过检查 `Thread.currentThread().isInterrupted()` 来得知该线程已经被请求中断，从而可以做出正确的响应（例如停止任务）

??? example "producer and consumer"

    ```java linenums="1"
    public class ProducerConsumerExample {
        private final Object lock = new Object();
        private String message;
        private boolean messageReady = false;
        
        // 生产者线程
        public void produce(String newMessage) throws InterruptedException {
            synchronized(lock) {
                // 等待消费者消费之前的消息
                while (messageReady) {
                    lock.wait();  // 释放锁，等待消费者通知
                }
                
                // 生产新消息
                message = newMessage;
                messageReady = true;
                System.out.println("生产: " + message);
                
                // 通知消费者
                lock.notify();
            }
        }
        
        // 消费者线程
        public String consume() throws InterruptedException {
            synchronized(lock) {
                // 等待生产者生产消息
                while (!messageReady) {
                    lock.wait();  // 释放锁，等待生产者通知
                }
                
                // 消费消息
                String consumedMessage = message;
                messageReady = false;
                System.out.println("消费: " + consumedMessage);
                
                // 通知生产者
                lock.notify();
                
                return consumedMessage;
            }
        }
    }
    ```

## 3 JUC 显式锁

JUC 显式锁是 `java.util.concurrent.locks` 包下提供的一套高级、灵活的线程同步工具。与 `synchronized`（内部锁）的隐式加锁和解锁不同，显式锁需要开发者手动调用 `lock()` 和 `unlock()` 方法，因此被称为显式锁

!!! tip "可重入性"

    一个已经持有锁的线程可以再次成功获取该锁而不会被自己阻塞。锁内部会维护一个计数器，每次重入加一，每次释放减一，直到计数器为零时才真正释放锁

!!! tip "公平锁 vs 非公平锁"

    - 公平锁：锁会按照线程请求的先后顺序（FIFO）来分配，可以防止线程饿死，但通常会带来额外的性能开销，降低吞吐量
    - 非公平锁：当锁被释放时，任何正在等待的线程（包括刚到达的线程）都有机会获取锁，可能导致等待时间最长的线程饿死，但通常吞吐量更高

!!! tip "悲观锁 vs 乐观锁"

    - 悲观锁：总是假设最坏的情况，认为数据在被访问时总会发生冲突。因此，在每次对数据进行操作之前，都会先加锁，以阻止其他线程的访问，直到操作完成并释放锁。
    - 乐观锁：总是假设最好的情况，认为数据在被访问时一般不会发生冲突。因此，它不会在操作前加锁，而是在提交更新时去检查数据在此期间是否被其他线程修改过

!!! tip "自旋锁"

    自旋锁是一种线程同步机制。当一个线程尝试获取一个已经被占用的锁时，该线程并不会被挂起（进入阻塞状态），而是会执行一个忙循环（自旋），不断地检查锁是否已经被释放

    从 JDK 1.6 开始，JVM 对 `synchronized` 锁进行了大量优化，其中就包括自适应自旋锁

    `java.util.concurrent.atomic` 包下的原子类是自旋思想的典型应用，它们底层依赖于一个名为 CAS（compare and set）的无锁操作

最常用的类是 `ReentrantLock`，使用 `ReentrantLock` 时，必须在 `finally` 块中释放锁，以确保即使在受保护的代码块中发生异常，锁也一定会被释放。否则，可能会导致死锁

```java linenums="1"
class Counter {
    // 默认非公平锁
    // new ReentrantLock(true) 会创建公平锁
    private final Lock lock = new ReentrantLock();
    private int count = 0;

    public void increment() {
        lock.lock(); // 1. 获取锁
        try {
            // 2. 访问受保护的资源
            count++;
        } finally {
            lock.unlock(); // 3. 在 finally 块中释放锁，确保总是被执行
        }
    }

    public int getCount() {
        return count;
    }
}
```

`ReadWriteLock`（读写锁）是 `java.util.concurrent.locks` 包下的一个接口。它不是一个具体的锁，而是一个维护了一对相关锁的接口，一个用于只读操作，另一个用于写入操作。它最常见的实现类是 `ReentrantReadWriteLock`

1. 读锁：如果没有任何线程持有写锁，那么任意数量的线程都可以同时持有读锁
2. 写锁：如果没有任何线程持有读锁或写锁，那么只有一个线程可以持有写锁。一旦写锁被持有，其他任何线程（无论是想读还是想写）都必须等待

> “读-读”可以共存，“读-写”和“写-写”都必须互斥

```java linenums="1"
public class ThreadSafeCache<K, V> {
    private final Map<K, V> map = new HashMap<>();
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final Lock readLock = rwLock.readLock();
    private final Lock writeLock = rwLock.writeLock();

    // 读取操作，使用读锁
    public V get(K key) {
        readLock.lock(); // 获取读锁，其他读线程可以进入，写线程被阻塞
        try {
            System.out.println(Thread.currentThread().getName() + " 正在读取...");
            // 模拟耗时
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            return map.get(key);
        } finally {
            readLock.unlock(); // 必须在 finally 中释放读锁
        }
    }

    // 写入操作，使用写锁
    public V put(K key, V value) {
        writeLock.lock(); // 获取写锁，其他所有线程（读和写）都被阻塞
        try {
            System.out.println(Thread.currentThread().getName() + " 正在写入...");
            // 模拟耗时
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            return map.put(key, value);
        } finally {
            writeLock.unlock(); // 必须在 finally 中释放写锁
        }
    }
}
```

`StampedLock` 可以看作是 `ReadWriteLock` 的一个性能优化版本，但它提供了三种锁模式，并且引入了一个全新的概念，乐观读

`StampedLock` 的所有锁定方法都会返回一个 `long` 类型的票据（stamp）。这个票据代表了锁在某个时间点的状态。解锁或转换锁时，你必须提供这个票据。如果票据为 0，表示获取锁失败

三种锁模式：

1. 写锁：通过 `writeLock()` 获取。这是一个独占锁，与 `ReadWriteLock` 的写锁行为完全相同。返回一个票据，用于 `unlockWrite(stamp)` 解锁
2. 悲观读锁：通过 `readLock()` 获取。这是一个共享锁，与 `ReadWriteLock` 的读锁行为类似。在持有悲观读锁期间，不允许有线程获取写锁。返回一个票据，用于 `unlockRead(stamp)` 解锁
3. 乐观读：通过 `tryOptimisticRead()` 获取。它不是一个真正的锁，不会阻塞任何线程。它只是返回一个非 0 的票据，表示“我猜现在没有写锁”。线程可以在不加锁的情况下，直接读取共享变量。读取完共享变量后，必须调用 `validate(stamp)` 来检查在你读取期间，是否有写操作发生

    1. 如果 `validate(stamp)` 返回 `true`，说明没有写操作介入，你读取的数据是一致的，可以安全使用
    2. 如果 `validate(stamp)` 返回 `false`，说明在你读取的过程中，有写锁被获取过，你读取的数据可能是脏数据。此时，你需要升级锁，通常是升级到悲观读锁，然后重新读取数据

```java linenums="1"
class Point {
    private double x, y;
    private final StampedLock sl = new StampedLock();

    // 写入方法，使用写锁
    void move(double deltaX, double deltaY) {
        long stamp = sl.writeLock(); // 获取写锁，阻塞其他所有锁
        try {
            x += deltaX;
            y += deltaY;
        } finally {
            sl.unlockWrite(stamp); // 使用票据解锁
        }
    }

    // 读取方法，结合了乐观读和悲观读
    double distanceFromOrigin() {
        // 1. 尝试乐观读
        long stamp = sl.tryOptimisticRead();
        // 读取 x 和 y 到局部变量
        double currentX = x;
        double currentY = y;

        // 2. 检查在读取期间是否有写操作介入
        if (!sl.validate(stamp)) {
            // 3. 如果校验失败，说明乐观读假设失败，升级为悲观读锁
            System.out.println("乐观读失败，升级为悲观读锁...");
            stamp = sl.readLock(); // 获取悲观读锁
            try {
                // 重新读取
                currentX = x;
                currentY = y;
            } finally {
                sl.unlockRead(stamp); // 释放悲观读锁
            }
        }
        
        // 使用读取到的值进行计算
        return Math.sqrt(currentX * currentX + currentY * currentY);
    }
}
```

### 3.1 CLH

!!! tip "cache ping-pong"

    缓存乒乓：当多个不同的 CPU 核心频繁地、交替地修改同一个缓存行内的数据时，就会发生缓存乒乓

    1. 核心 A 读取某个变量 X，包含 X 的缓存行被加载到核心 A 的缓存中
    2. 核心 B 也读取变量 X，该缓存行也被加载到核心 B 的缓存中
    3. 核心 A 修改变量 X。根据缓存一致性协议，核心 B 中对应的缓存行被置为无效
    4. 核心 B 现在也想修改变量 X。但它发现自己的缓存行已无效，于是它必须重新从主内存（或核心 A 的缓存）获取最新的数据。这个操作会导致核心 A 的缓存行被置为无效
    5. 核心 A 又要修改 X，再次重复步骤 3 和 4 的过程

    这个缓存行就像一个乒乓球一样，在核心 A 和核心 B 的缓存之间来回传递（实际上是不断地失效和重新加载），导致大量的总线流量和延迟，严重降低了 CPU 的性能，抵消了使用缓存带来的好处

CLH 锁是一种基于隐式链表队列的、可扩展、公平的自旋锁算法。它的设计目标之一就是解决传统自旋锁导致的缓存乒乓问题

CLH 锁巧妙地将线程的等待与一个队列结构结合起来，让每个尝试获取锁的线程都在不同的内存位置上自旋，从而避免了对同一个共享变量的激烈竞争

所有等待锁的线程会形成一个先进先出（FIFO）的队列。每个线程都拥有自己的一个节点对象，节点中通常包含一个布尔标志位（例如 `locked`），每个线程不直接在锁本身上自旋，而是在其前驱节点的 `locked` 标志位上自旋

获取锁：

1. 线程创建一个自己的新节点 `myNode`，并将其 `locked` 标志位设置为 `true`（表示自己需要锁，或者说还没轮到自己）
2. 线程通过原子操作（如 `getAndSet`）将全局的 `tail` 指针指向自己的 `myNode`，并获取到旧的 `tail` 值，这个旧值就是它的前驱节点 `predecessor`
3. 如果 `predecessor` 为 `null`，说明队列之前是空的，线程立即获得锁
4. 如果 `predecessor` 不为 `null`，线程就在 `predecessor.locked` 这个标志上自旋等待

释放锁：

1. 持有锁的线程找到自己的节点 `myNode`
2. 将 `myNode.locked` 标志位设置为 `false`
3. 这个操作会通知正在 `myNode.locked` 上自旋的后继线程：“你可以停止自旋了，现在轮到你了”。后继线程随即获得锁

> 每个节点只盯着自己前面的那个节点，如果前面的节点释放了锁，那自己就可以获得锁了

### 3.2 AQS

AQS 核心组件：

1. `state` 变量：`state` 是一个受保护的 `volatile int` 变量。它的具体含义由子类决定：

    1. 在 `ReentrantLock` 中，`state` 表示锁的重入次数。`state = 0` 表示锁未被持有，`state > 0` 表示锁已被持有，其值等于持有线程重入的次数
    2. 在 `Semaphore` 中，`state` 表示剩余的许可数量
    3. 在 `CountDownLatch` 中，`state` 表示还需要倒数的计数值

2. FIFO 队列 (CLH 变体)：当一个线程尝试获取同步状态失败时，AQS 会将该线程和其等待状态封装成一个 `Node` 对象，并将其加入到队列的尾部

    1. `Node` 结构：每个 `Node` 包含对前一个节点和后一个节点的引用，从而形成一个双向链表。它还包含请求锁的线程以及一个等待状态 (`waitStatus`)
    2. CLH 变体：与纯粹的 CLH 锁（每个节点只在前驱节点上自旋）不同，AQS 的队列是双向的，这使得处理取消和超时等情况更加方便
    3. 阻塞与唤醒：当一个节点的前驱节点是头节点（head）时，它会尝试获取锁。如果失败，它会通过 `LockSupport.park(this)` 来挂起自己，进入阻塞状态。当锁被释放时，头节点会唤醒它的后继节点 (`LockSupport.unpark(nextNode.thread)`)

以 `ReentrantLock` 为例 AQS 工作流程：

1. `lock()` 方法调用 `acquire(1)`

    1. `acquire(1)` 首先调用子类（`ReentrantLock` 的 `Sync` 内部类）实现的 `tryAcquire(1)`

        1. 如果 `state` 为 0（锁空闲），则用 CAS 将 `state` 设置为 1，并将锁的持有者设置为当前线程，返回 `true`
        2. 如果 `state > 0` 且持有者是当前线程（重入），则将 `state` 加 1，返回 `true`
        3. 否则，返回 `false`

    2. 如果 `tryAcquire` 返回 `true`：`acquire` 方法结束，线程成功获取锁
    3. 如果 `tryAcquire` 返回 `false`：AQS 框架将当前线程封装成一个 `Node`。将该 `Node` 加入到等待队列的尾部。通过 `LockSupport.park()` 阻塞当前线程

2. 当持有锁的线程调用 `unlock()`

    1. `unlock()` 调用 `release(1)`。`release(1)` 调用子类实现的 `tryRelease(1)`

        1. `tryRelease` 将 `state` 减 1。如果 `state` 变为 0，则清空锁的持有者

    2. 如果 `tryRelease` 成功（`state` 变为 0），AQS 框架会唤醒等待队列中的头节点的后继节点
    3. 被唤醒的线程会再次尝试 `tryAcquire`，如果成功，它就成为新的锁持有者

### 3.3 CAS and Atomic

在 Java 中，通过 `java.util.concurrent.atomic` 包下的一系列原子类来使用 CAS。这些类将 CAS 操作封装成了易于使用的方法

`AtomicInteger`, `AtomicLong`, `AtomicBoolean` 用于基本数据类型；`AtomicReference` 用于对象引用

```java linenums="1"
// 如果当前值等于 expectedValue，就原子地将值设置为 newValue 并返回 true
// 如果当前值不等于 expectedValue，则什么也不做，并返回 false
boolean compareAndSet(expectedValue, newValue)
```

```java linenums="1"
public class CasCounter {
    // 使用 AtomicInteger 存储计数值
    private AtomicInteger value = new AtomicInteger(0);

    public int getValue() {
        return value.get();
    }

    public void increment() {
        // 使用一个循环来不断尝试更新
        while (true) {
            int currentValue = value.get(); // 1. 获取当前值 (A)
            int nextValue = currentValue + 1; // 2. 计算新值 (B)
            
            // 3. 使用 CAS 尝试更新
            // 如果在 1 和 3 之间没有其他线程修改 value，那么 CAS 会成功，循环结束
            // 如果有其他线程修改了 value，那么 currentValue 就不再是最新值，CAS 会失败
            // CAS 失败后，循环会继续，获取最新的值再次尝试，这就是“自旋”
            if (value.compareAndSet(currentValue, nextValue)) {
                return; // 更新成功，退出
            }
        }
    }
}
```

!!! tip "ABA 问题"

    一个线程 T1 读取内存值 V 为 A。此时 T1 被挂起。另一个线程 T2 将 V 的值从 A 改为 B，然后又改回 A。之后 T1 恢复执行，它进行 CAS 操作时发现 V 的值仍然是 A，于是操作成功。但实际上，这个值 A 已经不是原来的那个 A 了，状态已经发生过变化。在某些业务场景下，这可能会导致问题

## 4 Condition

`Condition` 是 `java.util.concurrent.locks` 包下的一个接口，它通常被称为条件变量或条件队列。它提供了一种比传统的 `Object.wait()` / `notify()` / `notifyAll()` 更强大、更灵活的线程间协作机制

`Condition` 必须与一个 `Lock`（通常是 `ReentrantLock`）关联使用，通过调用 `lock.newCondition()` 来创建一个实例。一个 `Lock` 可以关联多个 `Condition` 对象。这允许我们将线程分组到不同的等待队列中，并可以有选择性地唤醒特定条件的线程，从而实现更精细的控制

1. `await()`：原子地释放与该 `Condition` 关联的 `Lock`，并进入等待状态，直到被其他线程唤醒或中断。当线程被唤醒后，它必须重新获取那个 `Lock`，然后才能从 `await()` 方法返回。`await()` 的调用必须在持有锁的代码块中，并且通常放在一个 `while` 循环里，以防止虚假唤醒
2. `signal()`：唤醒一个正在该 `Condition` 上等待的线程。被唤醒的线程会尝试重新获取锁。调用 `signal()` 的线程必须持有与该 `Condition` 关联的 `Lock`
3. `signalAll()`：唤醒所有正在该 `Condition` 上等待的线程。同样，调用者必须持有锁

??? example "producer and consumer"

    ```java linenums="1"
    class BoundedBuffer {
        private final Lock lock = new ReentrantLock();
        // 条件1: 队列不满
        private final Condition notFull = lock.newCondition();
        // 条件2: 队列不空
        private final Condition notEmpty = lock.newCondition();
    
        private final Queue<Object> queue = new LinkedList<>();
        private final int capacity;
    
        public BoundedBuffer(int capacity) {
            this.capacity = capacity;
        }
    
        // 生产者方法
        public void put(Object item) throws InterruptedException {
            lock.lock(); // 获取锁
            try {
                // 使用 while 防止虚假唤醒
                while (queue.size() == capacity) {
                    System.out.println("队列已满，生产者 " + Thread.currentThread().getName() + " 等待...");
                    notFull.await(); // 队列满了，生产者在 notFull 条件上等待
                }
                queue.add(item);
                System.out.println("生产者 " + Thread.currentThread().getName() + " 生产了 " + item);
                
                // 生产了一个物品，队列肯定不空了，唤醒一个在 notEmpty 上等待的消费者
                notEmpty.signal();
            } finally {
                lock.unlock(); // 释放锁
            }
        }
    
        // 消费者方法
        public Object take() throws InterruptedException {
            lock.lock(); // 获取锁
            try {
                while (queue.size() == 0) {
                    System.out.println("队列为空，消费者 " + Thread.currentThread().getName() + " 等待...");
                    notEmpty.await(); // 队列空了，消费者在 notEmpty 条件上等待
                }
                Object item = queue.poll();
                System.out.println("消费者 " + Thread.currentThread().getName() + " 消费了 " + item);
    
                // 消费了一个物品，队列肯定不满了，唤醒一个在 notFull 上等待的生产者
                notFull.signal();
                return item;
            } finally {
                lock.unlock(); // 释放锁
            }
        }
    }
    ```