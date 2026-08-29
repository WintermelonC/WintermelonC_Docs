# 算法库

## 1 `std::sort`

默认按升序对给定范围内的元素进行排序，时间复杂度通常为 $O(N\log N)$

```cpp linenums="1"
// 排序 vector
std::vector<int> vec = {5, 2, 8, 1, 9};
std::sort(vec.begin(), vec.end()); 
// 结果: 1, 2, 5, 8, 9

// 排序普通数组
int arr[] = {5, 2, 8, 1, 9};
int n = sizeof(arr) / sizeof(arr[0]);
std::sort(arr, arr + n);
```

如果需要降序排序，可以传入第三个参数：比较函数。标准库提供了 `std::greater<T>()` 用于降序比较

```cpp linenums="1"
std::vector<int> vec = {5, 2, 8, 1, 9};
std::sort(vec.begin(), vec.end(), std::greater<int>());
// 结果: 9, 8, 5, 2, 1
```

如果你要对自定义结构体排序，或者需要特殊的排序逻辑，可以传入自定义的比较函数（函数指针、函数对象或 Lambda 表达式）。比较函数接收两个参数 `(a, b)`，当 `a` 应该排在 `b` 的前面时，返回 `true`

```cpp linenums="1"
struct Person {
    std::string name;
    int age;
};

std::vector<Person> people = {
    {"Alice", 30},
    {"Bob", 25},
    {"Charlie", 35}
};

// 按年龄降序排序
std::sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
    return a.age > b.age; // 如果 a 的年龄大于 b，a 排前面
});

bool compareAge(const Person& a, const Person& b) {
    return a.age > b.age;
}

// 调用
std::sort(people.begin(), people.end(), compareAge);
```

限制：`std::sort` 要求提供的是随机访问迭代器。因此，它可以用于 `std::vector`、`std::deque` 和普通数组。它不能用于 `std::list` 或 `std::forward_list`（因为它们只有双向或单向迭代器）。如果你需要对链表排序，可以使用它们自带的成员函数

### 1.1 底层实现

使用 introsort（内省排序）

1. 核心：quicksort（快速排序）。选择一个枢轴（Pivot），将小于枢轴的元素放左边，大于枢轴的放右边，然后递归处理两边。但在最坏情况下，其时间复杂度会退化为 $O(N^2)$
2. 兜底保障：heapsort（堆排序）。在执行快速排序时，`std::sort` 会跟踪当前的递归深度。如果在快速排序的递归过程中，递归深度超过了一个动态计算的阈值（通常是 $2\log_2 N$ 次），算法会立即停止该区间的快速排序的分治，转而在该子区间上使用堆排序。因为堆排序的最坏时间复杂度始终是 $O(N\log N)$
3. 优化：insertion sort（插入排序）。在数据量很小的情况下，或者序列已经基本有序时，插入排序的效率极高，其时间复杂度趋近于 $O(N)$。当区间长度小于某个阈值（例如 16 个元素）时，快速排序会直接返回而不做完全排序。这样经过一轮限制深度的快速排序后，整个序列虽然没有完全有序，但已经宏观有序（即任何一个元素距离它的最终位置都不远）。最后，`std::sort` 会对整个大序列统一执行一次插入排序

=== "std::sort"

    ```cpp linenums="1"
    template <class RandomAccessIterator>
    inline void sort(RandomAccessIterator first, RandomAccessIterator last) {
        if (first != last) {
            // 1. 调用内省式排序（Introsort）
            // std::__lg 快速计算 log2(N)，确定最大递归深度限制（通常是 2 * log2(N)）
            __introsort_loop(first, last, std::__lg(last - first) * 2);
            
            // 2. 此时整个序列已经“宏观有序”，调用最终的插入排序完成微调
            __final_insertion_sort(first, last);
        }
    }
    ```

=== "__introsort_loop"

    ```cpp linenums="1"
    // 设定一个小数据量的阈值，通常为 16
    const int __stl_threshold = 16; 
    
    template <class RandomAccessIterator, class Size>
    void __introsort_loop(RandomAccessIterator first, 
                          RandomAccessIterator last, 
                          Size depth_limit) {
        // 当区间大小大于阈值 16 时，才进行快速排序
        while (last - first > __stl_threshold) {
            // 如果递归深度降为 0，说明快排正在恶化，立刻切换为堆排序！
            if (depth_limit == 0) {
                // partial_sort 底层就是堆排序 (Heap Sort)
                std::partial_sort(first, last, last);
                return; // 堆排完成后直接返回
            }
            --depth_limit;
            
            // 进行快速排序的分割（Partition）
            // 使用三数取中法（这部分通过 __median 取首、中、尾的中位数作为枢轴）
            RandomAccessIterator cut = __unguarded_partition(
                first, last, 
                T(__median(*first, *(first + (last - first)/2), *(last - 1)))
            );
            
            // 递归处理右半部分（或者左半部分）
            __introsort_loop(cut, last, depth_limit);
            
            // 【尾递归优化】：不递归左半部分，而是更新 last，继续走 while 循环
            last = cut; 
        }
    }
    ```

=== "__final_insertion_sort"

    ```cpp linenums="1"
    template <class RandomAccessIterator>
    void __final_insertion_sort(RandomAccessIterator first, RandomAccessIterator last) {
        // 如果整体长度大于 16
        if (last - first > __stl_threshold) {
            // 对前 16 个元素进行一次标准的插入排序
            // 这样可以确保前面有一段是有序的，后续的 __unguarded_linear_insert 就不需要做边界检查了
            __insertion_sort(first, first + __stl_threshold);
            
            // 对剩余的元素进行“无边界检查”的快速插入操作
            __unguarded_insertion_sort(first + __stl_threshold, last);
        } else {
            // 如果整体长度本来就不超过 16，直接一把插入排序搞定
            __insertion_sort(first, last);
        }
    }
    ```

=== "__unguarded_partition"

    ```cpp linenums="1"
    template <class RandomAccessIterator, class T>
    RandomAccessIterator __unguarded_partition(RandomAccessIterator first, 
                                               RandomAccessIterator last, 
                                               T pivot) {
        while (true) {
            // 从左向右找大于等于 pivot 的元素
            while (*first < pivot) ++first;
            // 从右向左找小于等于 pivot 的元素
            --last;
            while (pivot < *last) --last;
            
            // 如果左右指针相遇或交错，分割完成
            if (!(first < last)) return first;
            
            // 否则交换这两个元素，然后继续
            std::iter_swap(first, last);
            ++first;
        }
    }
    ```

## 2 `std::find`

`std::find` 在给定范围 `[first, last)` 内线性搜索第一个等于给定值的元素，找到则返回指向该元素的迭代器，否则返回 `last`。时间复杂度为 $O(N)$

```cpp linenums="1"
#include <algorithm>
#include <vector>
#include <iostream>

std::vector<int> vec = {5, 2, 8, 1, 9};

// 查找值为 8 的元素
auto it = std::find(vec.begin(), vec.end(), 8);

if (it != vec.end()) {
    std::cout << "找到了: " << *it << "\n";  // 输出: 找到了: 8
    std::cout << "索引: " << std::distance(vec.begin(), it) << "\n"; // 索引: 2
} else {
    std::cout << "未找到\n";
}
```

对于自定义类型，需要提供 `operator==`，因为 `std::find` 内部使用 `==` 进行比较

```cpp linenums="1"
struct Person {
    std::string name;
    int age;

    // 必须定义 operator==
    bool operator==(const Person& other) const {
        return name == other.name && age == other.age;
    }
};

std::vector<Person> people = {{"Alice", 30}, {"Bob", 25}, {"Charlie", 35}};

// 查找一个特定的 Person
Person target{"Bob", 25};
auto it = std::find(people.begin(), people.end(), target);
// 找到了 "Bob"
```

### 2.1 `std::find_if`

如果只想按名字查找，用 `std::find_if`，配合 Lambda

```cpp linenums="1"
auto it = std::find_if(people.begin(), people.end(), [](const Person& p) {
    return p.name == "Bob";
});
// 找到了 Bob（不关心 age）
```

### 2.2 底层实现

`std::find` 的实现非常直接——纯线性扫描：

```cpp linenums="1"
template <class InputIterator, class T>
InputIterator find(InputIterator first, InputIterator last, const T& value) {
    while (first != last) {
        if (*first == value) {  // 使用 operator== 比较
            return first;
        }
        ++first;
    }
    return last;  // 未找到
}
```

## 3 `std::binary_search`

针对 **已排序** 的区间

| 函数 | 返回值 | 作用 |
|------|--------|------|
| `std::binary_search` | `bool` | 判断元素 **是否存在** |
| `std::lower_bound` | 迭代器 | 返回 **第一个 `>= value`** 的位置 |
| `std::upper_bound` | 迭代器 | 返回 **第一个 `> value`** 的位置 |
| `std::equal_range` | `pair<it, it>` | 返回 `[lower_bound, upper_bound)`，即等于 value 的区间 |

> 前提：区间必须是 **有序的**（通常升序），否则结果未定义

`std::binary_search`：判断是否存在

```cpp linenums="1"
#include <algorithm>
#include <vector>

std::vector<int> vec = {1, 3, 5, 7, 9};  // 已排序

if (std::binary_search(vec.begin(), vec.end(), 5)) {
    // 找到了 5
}

// 也可以用于普通数组
int arr[] = {1, 3, 5, 7, 9};
bool found = std::binary_search(arr, arr + 5, 3);
```

**时间复杂度**：$O(\log N)$

`std::lower_bound` / `std::upper_bound`：找位置

这两个函数是二分查找最常用的形式，返回 **迭代器**：

```cpp linenums="1"
std::vector<int> vec = {1, 2, 2, 2, 3, 4};

// lower_bound: 第一个 >= 2 的位置 → 指向下标 1
auto lower = std::lower_bound(vec.begin(), vec.end(), 2);

// upper_bound: 第一个 > 2 的位置 → 指向下标 4
auto upper = std::upper_bound(vec.begin(), vec.end(), 2);

// 等于 2 的元素个数 = upper - lower = 3
int count = upper - lower;  // 3
```

`std::equal_range`：一次拿到等于 value 的整个区间

```cpp linenums="1"
std::vector<int> vec = {1, 2, 2, 2, 3, 4};

auto range = std::equal_range(vec.begin(), vec.end(), 2);
// range.first  == lower_bound (第一个 >= 2)
// range.second == upper_bound (第一个 > 2)

int count = range.second - range.first;  // 3
```

### 3.1 自定义比较器

对于降序排列或自定义类型，可以传入第四个参数（与排序时使用相同的比较器）：

```cpp linenums="1"
// 降序数组：比较器必须与排序时一致
std::vector<int> vec = {9, 7, 5, 3, 1};  // 降序
auto it = std::lower_bound(vec.begin(), vec.end(), 5, std::greater<int>());

// 自定义结构体：按 age 查找
struct Person {
    std::string name;
    int age;
};

std::vector<Person> people = {
    {"Alice", 20}, {"Bob", 25}, {"Charlie", 30}
};

// 按 age 排序后，查找第一个 age >= 25 的人
auto it = std::lower_bound(people.begin(), people.end(), 25,
    [](const Person& p, int age) {
        return p.age < age;  // 注意：第一个参数是元素，第二个是查找值
    });
```

`lower_bound` 的比较器与 `sort` 的签名 **不同**：

```cpp linenums="1"
// sort 的比较器：两个参数都是元素
sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
    return a.age < b.age;
});

// lower_bound 的比较器：第一个是元素，第二个是查找值
lower_bound(people.begin(), people.end(), 25,
    [](const Person& p, int value) {
        return p.age < value;   // p 是元素，value 是查找的目标
    });
```

### 3.2 二分查找底层实现（以 lower_bound 为例）

```cpp linenums="1"
template <class ForwardIt, class T>
ForwardIt lower_bound(ForwardIt first, ForwardIt last, const T& value) {
    while (first != last) {
        auto mid = first + (last - first) / 2;  // 防止溢出

        if (*mid < value)
            first = mid + 1;   // 中间值太小，去右半区
        else
            last = mid;        // 中间值 >= value，答案在 [first, mid]
    }
    return first;  // 第一个 >= value 的位置
}
```

**要点**：

- 用 `first + (last - first) / 2` 而非 `(first + last) / 2`，避免迭代器相加（也避免整数溢出）
- `mid` 不满足条件时收缩左边界，否则收缩右边界
