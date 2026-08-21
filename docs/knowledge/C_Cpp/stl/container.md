# Container

[OOP - Container](../../../zju/basic_courses/OOP/ch2.md){:target="_blank"}

1. 顺序容器：按照元素存入的相对位置来组织数据

    1. `std::vector`：动态数组。支持快速的随机访问，在尾部插入/删除速度快，但在中间或头部操作较慢
    2. `std::deque`：双端队列。支持快速的随机访问，且在头部和尾部插入/删除都很快
    3. `std::list`：双向链表。不支持随机访问，但在任意位置插入和删除速度都很快
    4. `std::forward_list` (C++11)：单向链表。比 `list` 更节省内存，只支持单向遍历
    5. `std::array` (C++11)：固定大小数组。大小在编译时确定，内存分配在栈上（如果作为局部变量），支持快速随机访问

2. 关联容器：元素按关键字（Key）自动排序（底层通常由红黑树实现），查找、插入和删除的平均时间复杂度为 $O(\log n)$

    1. `std::set`：集合。元素唯一且按升序自动排序
    2. `std::map`：映射/字典。存储键值对（Key-Value），键唯一且按键排序
    3. `std::multiset`：多重集合。允许存在重复元素的 `set`
    4. `std::multimap`：多重映射。允许存在多个相同键的键值对的 `map`

3. 无序关联容器：C++11 引入，底层通常通过哈希表（Hash Table）实现，元素没有特定顺序。查找、插入和删除的平均时间复杂度为 $O(1)$

    1. `std::unordered_set`：无序集合。键唯一，不排序
    2. `std::unordered_map`：无序映射。键值对，键唯一，不排序
    3. `std::unordered_multiset`：无序多重集合。允许重复元素的 `unordered_set`
    4. `std::unordered_multimap`：无序多重映射。允许重复键的 `unordered_map`

4. 容器适配器：不是真正的新容器，而是基于上述现有容器包装出来的接口，以提供特定的行为

    1. `std::stack`：栈。后进先出（LIFO），默认基于 `deque` 实现
    2. `std::queue`：队列。先进先出（FIFO），默认基于 `deque` 实现
    3. `std::priority_queue`：优先队列。元素出队的顺序由优先级决定（默认底层是大顶堆，基于 `vector` 实现）

## 1 `std::vector`

`vector` 在内存中是一段连续的线性空间，和普通数组 `[]` 相同。在标准库的具体实现中，`vector` 内部通常由三个迭代器（本质是裸指针）来控制：

1. `_M_start`：指向已分配内存的起始位置
2. `_M_finish`：指向当前最后一个实际元素的下一个位置（对应 `size()`）
3. `_M_end_of_storage`：指向已分配内存的末尾（对应 `capacity()`）

!!! tip "`size()` 和 `capacity()` 的区别"

    - `size()`：容器中实际有多少个元素
    - `capacity()`：容器目前在不重新分配内存的情况下，最多能容纳多少个元素

当不断向 `vector` 添加元素，直到 `size() == capacity()` 时，再添加新元素就会触发扩容（Reallocation）。扩容并非在原内存后无缝拼接（因为原内存后面的物理空间可能已被其他程序占用），而是分为以下三步：

1. 开辟新空间：向操作系统申请一块更大的连续内存空间
2. 拷贝/移动原数据：将旧内存空间里的数据拷贝（或利用 `noexcept` 的移动构造函数移动）到新空间中
3. 释放旧空间：销毁旧内存的元素，并将旧内存交还给操作系统

!!! question "扩容因子为什么是 1.5 倍或 2 倍"

    采用按倍数扩容（成几何级数增长）而不是每次固定增加 n 个字节，是为了保证在尾部插入元素的均摊时间复杂度能够达到 $O(1)$。如果你每次只扩容增加 10 个容量，那每填满 10 个就要进行一次极度耗时的全量数据搬运，导致插入性能退化成 $O(N)$

!!! question "`reserve()` 和 `resize()` 的区别"

    - `reserve(n)`：只修改 capacity（容量）。它向系统申请足够容纳 n 个元素的内存，但不会构造任何新对象，size 保持不变。如果预先知道要存多少数据，强烈建议先 `reserve` 以避免多次引起性能骤降的扩容机制
    - `resize(n)`：修改 size（实际大小）。如果 n 大于当前的 size，不仅会扩容，还会调用元素的默认构造函数把新空间填满；如果 n 小于当前 size，则会销毁多余的元素

!!! question "`push_back()` 和 `emplace_back()` 的区别"

    - `push_back()`：接收一个已经存在的对象，或者接收一个临时对象。它需要先调用构造函数生成这个对象，然后再调用拷贝/移动构造函数将对象放进 vector 的内存中
    - `emplace_back()`：利用 C++11 的可变参数模板和完美转发，直接将构造对象所需的参数传递给 `vector` 底层，在分配好的内存空间上直接原地调用构造函数

!!! question "如何真正释放 `vector` 占用的内存"

    当你调用 `v.clear()` 时，它只会调用所有已有元素的析构函数，将 size 变为 0，但 capacity 保持不变，底层的物理内存并未还给操作系统

    C++11 及以后可使用 `v.shrink_to_fit()`，请求容器降低其容量以匹配其大小

使用 `vector` 迭代器遍历时，如果同时进行了插入或删除操作，很容易导致程序崩溃

1. 插入元素导致的失效：如果插入导致了扩容，整个容器的数据都被搬迁到了新的物理地址。此时所有指向原 `vector` 的迭代器、指针、引用将全部失效；如果插入没有导致扩容，那么插入点之后的所有迭代器会失效（因为后面的元素都被整体向后挪动了一个位置）
2. 删除元素导致的失效：删除一个元素后，被删元素及其之后的所有元素的位置都会前移。因此，指向被删元素及后续元素的迭代器都会失效

## 2 `std::list` 和 `std::forward_list`

`std::list` 是一个双向循环链表。它的元素在物理内存中是非连续分配的。每次插入一个新元素，都会调用分配器在堆上动态分配一个链表节点的内存。不支持随机访问

由于 `list` 的节点是独立分配的，它们在内存中的绝对地址永远不会变，因此，插入元素不会导致任何迭代器失效。删除元素只有指向被删除元素的那个迭代器会失效

由于 `list` 的迭代器只是双向迭代器，而不是随机访问迭代器，所以它不能使用 `<algorithm>` 库里的某些算法（比如 `std::sort`）。为此，`list` 在类内部自己实现了一套专属的高效算法成员函数：

1. `list::sort()`：底层通常采用针对链表优化的归并排序 (Merge Sort)，复杂度为 $O(N\log N)$
2. `list::splice()`：链表独有的接合操作，它可以不经过任何数据的拷贝和分配，仅仅通过修改指针指向，就能将另一个 `list` 的一段数据（或整个 `list`）瞬间剪切拼接进入当前的 `list` 中
3. `list::unique()`：移除连续的重复元素。通常在使用前要先调用 `list::sort()`
4. `list::merge()`：合并两个已排序的列表，合并后依然有序，且参数列表会被清空
5. `list::reverse()`：将整个链表前后翻转

---

`std::forward_list` 是单向链表，每个节点只有一个 `next` 指针，内存开销比 `list` 减半

它没有 `size()` 方法。因为要获取单链表长度必须遍历 `O(N)`，C++ 标准委员会为了防止程序员误以为它是常数时间而掉进性能陷阱，干脆不提供这个方法（可用 `std::distance` 计算）

它只能往前走，迭代器是前向迭代器 (Forward Iterator)，不支持 `--it`

## 3 `std::set` 和 `std::unordered_set`

`std::set` 的底层实现通常是红黑树。元素在插入时会自动根据键值（默认使用 `std::less<T>`，即 `<` 运算符）进行排序。遍历 `set` 时，输出的数据天然是升序的

不能通过迭代器直接修改 `set` 中的元素值。因为一旦修改，就会破坏红黑树的有序结构

由于底层是红黑树，`std::set` 的增、删、查操作的时间复杂度严格保证为 $O(\log N)$

!!! tip "二分查找"

    - `s.lower_bound(key)`：返回指向首个大于等于 key 元素的迭代器
    - `s.upper_bound(key)`：返回指向首个大于 key 元素的迭代器

!!! question "`insert()` 的返回值是什么"

    当你调用 `s.insert(val)` 时，它的返回值不是 `void`，也不是简单的 `bool`，而是 `std::pair<iterator, bool>`
    
    1. `pair` 的 `first`（迭代器）：指向刚刚插入的元素（或原来就已经存在的那个元素）
    2. `pair` 的 `second`（布尔值）：表示是否插入成功。如果元素已存在，返回 `false`；如果原本没有且成功插入，返回 `true`

如果要在 `set` 里存自定义的结构体或类（比如 `struct Student`），因为 `set` 需要排序，你必须告诉它如何比较大小。有两种做法

```cpp linenums="1" title="重载 < 运算符"
struct Student {
    string name;
    int age;
    // 必须加上 const，且参数用 const 引用
    bool operator<(const Student& other) const {
        return age < other.age; // 按照年龄升序排列
    }
};
set<Student> s;
```

```cpp linenums="1" title="提供自定义的仿函数"
struct Cmp {
    bool operator()(const int& a, const int& b) const {
        return a > b; // 改为降序排列
    }
};
set<int, Cmp> s; // 在模板参数中指定
```

---

`std::unordered_set` 的底层实现通常是哈希表。元素无序，与插入顺序也无关

## 4 `std::map` 和 `std::unordered_map`

`std::map` 底层通常是红黑树。存储的是 `std::pair<const Key, Value>`，由于红黑树是根据 Key 来建立和维护平衡的，所以 Key 是不允许被修改的，否则会破坏树的结构。Key 唯一，且按 Key 的从小到大自动排序（默认使用 `std::less<Key>`）

增、删、查操作的时间复杂度严格保证为 $O(\log N)$

`map[key]`：

1. 访问存在的 Key：返回对应 Value 的引用，可以修改它
2. 访问不存在的 Key：由于 `[]` 返回的是引用，如果发现 Key 不存在，map 会立刻帮你插入一个拥有该 Key，且 Value 为默认构造值的新节点，然后再返回这个新 Value 的引用

!!! question "为什么在 `const` 成员函数中，不能使用 `map[key]` 来查找元素"

    因为 `[]` 运算符有可能修改 map 本身（即插入新节点），所以标准库干脆没有给它提供 `const` 版本的重载。在只读场景下，必须使用 `find()` 或 `at()`

`map.at(key)`：与 `[]` 类似，但它是安全/只读友好的。如果 Key 不存在，它不会创建新元素，而是直接抛出 `std::out_of_range` 异常。它提供 `const` 和非 `const` 版本

`map.insert()`：如果我们不想意外覆盖原有的值，或者不想意外创建新节点，应该使用 `insert()`。返回一个 `std::pair<iterator, bool>`。如果 Key 已经存在，插入操作会直接失败（`bool` 为 `false`），原来的 Value 不会被覆盖

由于 `map` 是有序的，它非常适合用来做范围查询：

- `m.lower_bound(key)`：返回第一个键值 ≥ key 的元素的迭代器
- `m.upper_bound(key)`：返回第一个键值 > key 的元素的迭代器

`m.emplace()`：类似于 `insert`，但它不会先构造 `std::pair` 再拷贝进去，而是在红黑树找到对应位置后直接原地构造键值对，省去了一次拷贝或移动

`m.insert_or_assign()` (C++17)：完美解决了 `insert` 和 `[]` 的短板。如果 Key 不存在，它就插入（性能优于 `[]` 因为不用先默认构造再赋值）；如果 Key 已存在，它会覆盖掉旧的 Value（而 `insert` 是拒绝覆盖的）

---

`std::unordered_map` 的底层实现通常是哈希表。元素无序

## 5 `std::stack`

`std::stack` 不是“原生”容器：它没有自己独立的数据结构，而是在现有容器（默认是 `std::deque`）之上套了一层壳（Wrapper），强行限制外部只能以后进先出（LIFO, Last In First Out）的方式来操作元素

```cpp linenums="1"
// Container：底层真正干活的那个容器，默认是 std::deque
// 也可以显式指定为 std::vector<T> 或 std::list<T>
// 只要该容器提供了 stack 要求的三个核心函数：
// push_back()、pop_back()、back()
template <class T, class Container = std::deque<T>>
class stack;

std::stack<int> s1;                       // 默认：deque 实现
std::stack<int, std::vector<int>> s2;     // 换成 vector 实现
std::stack<int, std::list<int>> s3;       // 换成 list 实现
```

栈区别于 vector/deque 的地方：没有迭代器，没有 `[]`，不能遍历，不能随机访问。只有：`push()`, `pop()`, `top()`, `empty()`, `size()`

!!! question "pop() 为什么不返回被弹出的元素？"

    1. 异常安全性：想象一下，如果 `pop()` 要返回栈顶元素，它内部必须做两件事：先把栈顶元素拷贝一份给调用方，然后再从底层容器中真正删除这个元素。如果这个拷贝构造过程跑了一半抛出了异常，但是底层的元素已经被删掉了，那么这个元素就永久丢失了！C++ 标准委员会的设计原则是：绝不以牺牲数据安全为代价来换取接口便利性。因此，他们强制要求你先用 `top()` 安全地获取引用（拷贝由调用方在自己的安全范围内完成），然后再调用 `pop()`
    2. 性能考量：如果调用方并不关心被弹出的元素内容，强制返回会白白造成一次拷贝构造的浪费。把 `top()` 和 `pop()` 拆开，程序员可以灵活选择是否拷贝

!!! question "stack 为什么默认用 deque 而不是 vector？"

    1. vector 的短板：vector 在 push_back 满了之后需要整块扩容搬家（拷贝旧数据到新内存），虽然均摊是 O(1)，但单次扩容的延迟极高（尖刺感很强）。另外，vector 从来不释放多余的内存（capacity 只增不减），如果栈经历过一次高峰期（元素极多）后又长期处于低位，vector 依然霸占着巨量内存不肯归还
    2. deque 的优势：deque（双端队列）底层是分段连续的（由多个固定大小的块通过中控器映射组成）。它扩容时，只需要申请一个新的块然后修改中控指针，不需要搬运旧元素的内存，扩容导致的单次延迟极低，内存的使用也更加平滑和节约

## 6 `std::priority_queue`

它提供 **常数时间获取最大（或最小）元素** 的能力，插入和删除的代价是 $O(\log N)$

```cpp linenums="1" title="priority_queue 的模板声明"
template <
    class T,                           // 元素类型
    class Container = std::vector<T>,  // 底层容器，默认 vector
    class Compare   = std::less<T>     // 比较器，默认 less（大顶堆）
>
class priority_queue;
```

优先队列底层是一个 **二叉堆**（通常是完全二叉树，用数组存储）。默认 `std::less<T>` 形成的是 **大顶堆**

它只提供了 5 个核心接口，没有迭代器，不能遍历：

| 成员函数 | 作用 | 复杂度 |
|---|---|---|
| `push(x)` | 插入元素，然后调整堆 | $O(\log N)$ |
| `pop()` | 移除堆顶元素，然后调整堆 | $O(\log N)$ |
| `top()` | 返回堆顶元素的 **常量引用** | $O(1)$ |
| `empty()` | 判断是否为空 | $O(1)$ |
| `size()` | 返回元素个数 | $O(1)$ |

```cpp linenums="1"
#include <queue>
#include <iostream>

std::priority_queue<int> pq;    // 默认大顶堆
pq.push(3);
pq.push(5);
pq.push(1);

std::cout << pq.top();   // 输出 5
pq.pop();
std::cout << pq.top();   // 输出 3
```

想得到"最小元素在堆顶"，只需把比较器换成 `std::greater<T>`：

```cpp linenums="1"
std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;
min_pq.push(3);
min_pq.push(5);
min_pq.push(1);
std::cout << min_pq.top();   // 输出 1
```

### 6.1 自定义类型的比较

如果元素是自定义结构体，和 `set` 类似，有两种方式告诉它如何比较：

**方式一：重载 `<` 运算符**

```cpp linenums="1"
struct Student {
    string name;
    int score;
    // priority_queue 默认用 less，即调用 operator<
    bool operator<(const Student& other) const {
        return score < other.score;   // 分数高者优先（大顶堆）
    }
};
std::priority_queue<Student> pq;
```

**方式二：自定义仿函数（更灵活，推荐）**

```cpp linenums="1"
struct Cmp {
    bool operator()(const Student& a, const Student& b) const {
        return a.score > b.score;   // 分数低者优先（小顶堆）
    }
};
std::priority_queue<Student, std::vector<Student>, Cmp> pq;
```

### 6.2 底层堆操作原理

`priority_queue` 内部实际上调用了 `<algorithm>` 中的堆算法，它和这些算法等价：

| priority_queue 操作 | 内部等价的算法 |
|---|---|
| 用一组数据构造 | `std::make_heap` |
| `push(x)` | `container.push_back(x)` + `std::push_heap` |
| `pop()` | `std::pop_heap` + `container.pop_back()` |

`push_heap` 采用 **上滤（sift up）**：新元素放到数组末尾，然后不断与父节点比较并交换，直到满足堆性质。
`pop_heap` 采用 **下滤（sift down）**：堆顶与末尾元素交换，移除末尾，然后堆顶元素不断与较大的子节点交换下沉。

!!! question 为什么底层容器用 `vector`

    二叉堆要求元素在内存中 **连续存储**（这样父节点索引 `i` 与子节点 `2i+1`、`2i+2` 的映射才高效），而 `vector` 正是连续内存 + 尾部插入快的最佳选择。`deque` 虽也支持随机访问，但分段连续、索引映射效率略低；`list` 则完全不支持随机访问，无法实现堆。所以标准库把 `vector` 定为默认底层容器
