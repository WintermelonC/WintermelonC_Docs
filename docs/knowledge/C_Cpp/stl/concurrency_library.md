# 并发支持库

## 1 线程 `std::thread`

`std::thread` 表示一个可执行线程，构造时传入可调用对象即启动线程

```cpp linenums="1"
#include <thread>
#include <iostream>

void worker(int id) {
    std::cout << "thread " << id << '\n';
}

int main() {
    std::thread t1(worker, 1);          // 启动线程，传参
    std::thread t2([] { std::cout << "lambda\n"; });

    t1.join();   // 阻塞等待线程结束
    t2.join();
}
```

关键成员与规则：

1. `join()`：等待线程结束。每个线程必须被 `join` 或 `detach`，否则析构时 `std::terminate`
2. `detach()`：分离线程，让它独立运行（不推荐，难以安全同步）
3. `joinable()`：判断线程是否可被 `join`
4. `get_id()`、`hardware_concurrency()`（返回可用 CPU 核心数）
5. 线程对象不可复制，只能移动

参数传递注意：默认按值拷贝，引用需要 `std::ref`

```cpp linenums="1"
int x = 0;
std::thread t([](int& v) { v = 42; }, std::ref(x));
```

`std::this_thread` 命名空间提供辅助函数：

```cpp linenums="1"
std::this_thread::sleep_for(std::chrono::milliseconds(100));
std::this_thread::sleep_until(deadline);
std::this_thread::yield();              // 主动让出 CPU
std::this_thread::get_id();
```

`thread_local` 关键字声明线程局部变量，每个线程持有独立副本

## 2 互斥量与锁

### 2.1 互斥量类型

| 类型 | 说明 |
| -- | -- |
| `std::mutex` | 基础互斥量，不可重入 |
| `std::recursive_mutex` | 可递归加锁（同一线程可重复 lock） |
| `std::timed_mutex` | 支持 try_lock_for / try_lock_until |
| `std::recursive_timed_mutex` | 递归 + 超时 |
| `std::shared_mutex` | 读写锁 (C++17)，多读者互斥写者 |

### 2.2 RAII 锁

永远不要手动调用 `lock()`/`unlock()`（异常不安全），应使用 RAII 包装：

```cpp linenums="1"
#include <mutex>

std::mutex mtx;
int counter = 0;

void increment() {
    std::lock_guard<std::mutex> lock(mtx);   // 构造加锁，析构解锁
    ++counter;
}
```

| 锁 | 特点 |
| -- | -- |
| `std::lock_guard` | 最轻量，构造时加锁，不可手动解锁 |
| `std::unique_lock` | 灵活，可延迟加锁、提前解锁、转移所有权 |
| `std::scoped_lock` | (C++17) 可同时锁多个互斥量，避免死锁 |
| `std::shared_lock` | 配合 `shared_mutex` 的读锁 |

`unique_lock` 的灵活用法：

```cpp linenums="1"
std::unique_lock<std::mutex> lock(mtx, std::defer_lock); // 延迟加锁
lock.lock();
// ... 临界区 ...
lock.unlock();        // 提前解锁
lock.lock();          // 重新加锁
```

`scoped_lock` 以固定顺序锁多个互斥量，避免死锁：

```cpp linenums="1"
std::mutex a, b;
void swap_both() {
    std::scoped_lock lock(a, b);   // 等价于 std::lock(a, b) + 两个 guard
}
```

读写锁示例：

```cpp linenums="1"
#include <shared_mutex>
std::shared_mutex rw;
void read()  { std::shared_lock lock(rw);  /* 多线程可同时读 */ }
void write() { std::unique_lock lock(rw);  /* 独占写 */ }
```

### 2.3 一次性初始化

```cpp linenums="1"
std::once_flag flag;
void init() { /* 只执行一次的初始化 */ }

std::call_once(flag, init);   // 保证多线程下 init 只执行一次
```

## 3 条件变量 `std::condition_variable`

条件变量用于等待某个条件成立，必须配合互斥量使用，是生产者-消费者模型的核心

```cpp linenums="1"
#include <mutex>
#include <condition_variable>
#include <queue>

std::mutex mtx;
std::condition_variable cv;
std::queue<int> q;
const int MAX = 10;

void producer() {
    for (int i = 0; ; ++i) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [] { return q.size() < MAX; }); // 队列满则等待
        q.push(i);
        lock.unlock();
        cv.notify_one();            // 唤醒一个消费者
    }
}

void consumer() {
    while (true) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [] { return !q.empty(); });     // 队列空则等待
        int v = q.front(); q.pop();
        lock.unlock();
        cv.notify_one();            // 唤醒一个生产者
    }
}
```

要点：

1. `wait(lock, pred)` 等价于 `while (!pred()) wait(lock);`，自动处理虚假唤醒
2. `notify_one()` 唤醒一个等待线程；`notify_all()` 唤醒全部
3. 必须在加锁状态下调用 `wait`；等待期间锁被自动释放，唤醒后重新获取
4. `condition_variable` 只支持 `unique_lock<std::mutex>`；`condition_variable_any` 支持任意可锁定类型（开销略大）

## 4 原子操作与内存序 `std::atomic`

原子类型保证操作不可分割，是无锁编程的基础，性能远高于互斥量

### 4.1 基本用法

```cpp linenums="1"
#include <atomic>

std::atomic<int> cnt{0};

void add() {
    cnt.fetch_add(1, std::memory_order_relaxed);
    // 等价于 cnt++; 或 cnt += 1;
}

bool old = cnt.exchange(5);          // 交换
bool ok = cnt.compare_exchange_strong(expected, desired); // CAS
```

`std::atomic` 支持整型、指针、布尔等，整型原子支持 `+=`、`fetch_add`、`fetch_sub`、`fetch_or` 等。`std::atomic_flag` 是最简单的原子布尔类型（自旋锁基础）

### 4.2 内存序 `memory_order`

C++ 内存模型定义了 6 种内存序，从弱到强：

| 内存序 | 语义 |
| -- | -- |
| `relaxed` | 仅保证原子性，无同步/顺序约束 |
| `consume` | 数据依赖排序（很少使用，编译器实现受限） |
| `acquire` | 后续读写不能重排到此操作之前 |
| `release` | 之前读写不能重排到此操作之后 |
| `acq_rel` | `acquire` + `release` |
| `seq_cst` | 顺序一致性，默认且最强，全序 |

典型使用：`release` 用于发布数据，`acquire` 用于读取数据：

```cpp linenums="1"
std::atomic<bool> ready{false};
int data = 0;

void producer() {
    data = 42;                                  // 普通写入
    ready.store(true, std::memory_order_release); // 发布
}

void consumer() {
    while (!ready.load(std::memory_order_acquire)) {} // 获取
    // 保证能看到 data == 42
}
```

> 实践建议：不确定时用默认 `seq_cst`；性能敏感场景用 `acquire`/`release`；只有单纯计数器用 `relaxed`

## 5 异步与 Future `std::async` / `std::future`

`<future>` 提供任务级并发，通过"未来值"传递结果，无需手动管理线程

### 5.1 `std::async`

```cpp linenums="1"
#include <future>

int compute(int x) { return x * x; }

int main() {
    std::future<int> fut = std::async(std::launch::async, compute, 10);
    // 主线程做其他事...
    int result = fut.get();   // 阻塞直到结果就绪；只能调用一次
}
```

`std::launch` 策略：

1. `std::launch::async`：强制新线程异步执行
2. `std::launch::deferred`：延迟到 `get()` 时在当前线程执行
3. `async` | `deferred`（默认）：由实现决定

### 5.2 `std::promise` 与 `std::future`

`promise` 在生产者端设置值，`future` 在消费者端读取：

```cpp linenums="1"
std::promise<int> prom;
std::future<int> fut = prom.get_future();

std::thread t([&prom] { prom.set_value(42); });   // 设置结果

int v = fut.get();   // 阻塞等待
t.join();
```

`promise` 还可以通过 `set_exception` 传递异常，由 `future::get()` 重新抛出

### 5.3 `std::packaged_task`

将可调用对象包装成异步任务，可直接传给线程：

```cpp linenums="1"
std::packaged_task<int(int)> task(compute);
std::future<int> fut = task.get_future();

std::thread t(std::move(task), 10);   // packaged_task 只可移动
t.detach();
int v = fut.get();
```

### 5.4 `std::shared_future`

普通 `future` 只能 `get()` 一次；`shared_future` 可被多个线程共享读取：

```cpp linenums="1"
std::shared_future<int> sf = fut.share();   // 或 std::async(...).share()
```

## 6 C++20 新特性

### 6.1 `std::jthread`

`jthread` 在析构时自动 `join`，并支持协作式取消：

```cpp linenums="1"
#include <thread>

std::jthread worker([](std::stop_token st) {
    while (!st.stop_requested()) {
        // 工作...
    }
});
// 作用域结束时自动 join，无需手动管理
```

可通过 `jthread::request_stop()` 发送停止请求，`std::stop_token` 检查是否被请求停止。相比 `thread` 更安全，避免了忘记 `join` 导致的崩溃

### 6.2 `std::latch`

等待一定次数后放行所有线程：

```cpp linenums="1"
#include <latch>

std::latch done(3);   // 需要 3 次 count_down

void worker() {
    // 准备工作...
    done.arrive_and_wait();   // 计数减一并等待
    // 所有线程就绪后继续
}
```

### 6.3 `std::barrier`

`latch` 只能使用一次，`barrier` 可重复使用，适合分阶段并行（如并行循环的每轮迭代之间同步）：

```cpp linenums="1"
#include <barrier>

std::barrier sync(4);
for (int phase = 0; phase < 10; ++phase) {
    // 并行工作...
    sync.arrive_and_wait();   // 等待本轮所有线程完成
}
```

### 6.4 信号量 `std::counting_semaphore` / `std::binary_semaphore`

```cpp linenums="1"
#include <semaphore>

std::counting_semaphore<10> sem(5);   // 最大计数 10，初始 5

sem.acquire();   // 计数减一（阻塞直到 >0）
// 使用资源...
sem.release();   // 计数加一
```

`binary_semaphore` 是最大计数为 1 的特化，相当于互斥量

### 6.5 其他

1. `std::atomic_ref<T>`：对非原子对象提供原子访问（C++20）
2. `std::atomic<std::shared_ptr>`（C++20）/ `std::atomic<std::weak_ptr>`
3. `std::atomic::wait` / `notify_one` / `notify_all`：原子类型的等待通知（C++20）
