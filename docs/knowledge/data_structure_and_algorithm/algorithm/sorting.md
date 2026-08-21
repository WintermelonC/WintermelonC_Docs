# 排序

## 1 堆排序

### 1.1 堆

堆是一种完全二叉树，且满足堆序性质：

1. 大顶堆（Max-Heap）：每个节点的值都 ≥ 其子节点的值。根节点是最大值
2. 小顶堆（Min-Heap）：每个节点的值都 ≤ 其子节点的值。根节点是最小值

由于是完全二叉树，可以用数组紧凑存储（索引从 0 开始）：

1. 父节点：`(i - 1) / 2`
2. 左子节点：`2 * i + 1`
3. 右子节点：`2 * i + 2`

#### 1.1.1 Heapify 下沉

给定一个节点，假设它的左右子树都已经是合法的堆，将该节点向下沉到正确位置，使整棵子树满足堆序

```cpp linenums="1"
// 对下标 i 的节点执行下沉（大顶堆）
void heapify(std::vector<int>& arr, int n, int i) {
    int largest = i;           // 假设当前节点最大
    int left   = 2 * i + 1;    // 左子
    int right  = 2 * i + 2;    // 右子

    // 找三者中最大的
    if (left  < n && arr[left]  > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;

    // 如果最大的不是当前节点，交换后继续下沉
    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);  // 递归下沉
    }
}
```

时间复杂度：$O(\log N)$

#### 1.1.2 建堆

从最后一个非叶子节点开始，自底向上对每个节点执行 `heapify`

```cpp linenums="1"
void buildHeap(std::vector<int>& arr) {
    int n = arr.size();
    // 从最后一个非叶子节点开始，自底向上
    for (int i = n / 2 - 1; i >= 0; --i)
        heapify(arr, n, i);
}
```

时间复杂度：$O(N)$

### 1.2 堆排序算法

堆排序 = 建堆 + 反复取堆顶。升序用大顶堆，降序用小顶堆

1. 建堆：将数组构建为大顶堆，此时最大值在 `arr[0]`
2. 交换 + 重建：将 `arr[0]`（最大值）与数组末尾元素交换，最大值归位。将堆的大小减 1，对新的堆顶执行 `heapify` 恢复堆序
3. 重复：直到堆大小为 1

时间复杂度：$O(N\log N)$

```cpp linenums="1"
void heapSort(std::vector<int>& arr) {
    int n = arr.size();

    // 第一步：建堆 O(N)
    for (int i = n / 2 - 1; i >= 0; --i)
        heapify(arr, n, i);

    // 第二步：逐个将堆顶（最大值）放到尾部 O(N log N)
    for (int i = n - 1; i > 0; --i) {
        std::swap(arr[0], arr[i]);  // 最大值归位
        heapify(arr, i, 0);         // 对剩余部分重建堆
    }
}
```

## 2 快速排序

快速排序的核心是 **分区（Partition）** 操作：

1. **选取基准（Pivot）**：从数组中挑一个元素作为基准
2. **分区**：重新排列数组，使得所有 **小于** 基准的元素都放到基准左边，所有 **大于等于** 基准的元素都放到基准右边。分区结束后，基准就位于它最终的正确位置
3. **递归**：对基准左右两个子数组分别重复上述过程

递归终止条件是子数组长度为 0 或 1，此时天然有序

**Lomuto 分区**（更直观）：

用最后一个元素作基准，维护一个指针 `i` 表示"小于基准区域"的边界：

```cpp linenums="1"
// Lomuto 分区：返回基准最终位置
int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];     // 选最后一个元素作基准
    int i = low;               // i 指向小于基准区域的末尾

    for (int j = low; j < high; ++j) {
        if (arr[j] < pivot) {
            std::swap(arr[i], arr[j]);
            ++i;               // 小于基准区域扩大
        }
    }
    std::swap(arr[i], arr[high]);  // 把基准放到正确位置
    return i;
}
```

**Hoare 分区**（效率更高）：

用双指针从两端向中间扫描，交换逆序元素：

```cpp linenums="1"
// Hoare 分区：双指针相遇
int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[low];      // 选第一个元素作基准
    int i = low - 1;
    int j = high + 1;

    while (true) {
        do { ++i; } while (arr[i] < pivot);   // 从左找 ≥ pivot 的
        do { --j; } while (arr[j] > pivot);   // 从右找 ≤ pivot 的
        if (i >= j) return j;                 // 指针相遇
        std::swap(arr[i], arr[j]);            // 交换逆序对
    }
}
```

> Hoare 分区平均交换次数约为 Lomuto 的 1/3，但边界处理更复杂、递归区间划分方式不同，初学者建议先掌握 Lomuto

### 2.1 Lomuto

递归：

```cpp linenums="1"
#include <vector>
#include <algorithm>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low;
    for (int j = low; j < high; ++j) {
        if (arr[j] < pivot) {
            std::swap(arr[i], arr[j]);
            ++i;
        }
    }
    std::swap(arr[i], arr[high]);
    return i;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low >= high) return;          // 递归终止

    int p = partition(arr, low, high); // 分区，基准归位
    quickSort(arr, low, p - 1);        // 排左边
    quickSort(arr, p + 1, high);       // 排右边
}
```

迭代：

```cpp linenums="1"
#include <stack>

void quickSortIterative(std::vector<int>& arr, int low, int high) {
    std::stack<std::pair<int, int>> st;
    st.push({low, high});

    while (!st.empty()) {
        auto [l, r] = st.top();
        st.pop();
        if (l >= r) continue;

        int p = partition(arr, l, r);
        st.push({l, p - 1});   // 左区间
        st.push({p + 1, r});   // 右区间
    }
}
```

### 2.2 Hoare

递归：

```cpp linenums="1"
// Hoare 分区：双指针从两端向中间扫描
// 返回值 j 不是基准的最终位置，而是左右区间的分界点
// 分区后：arr[low..j] 中的元素都 <= arr[j+1..high] 中的元素
int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[low];      // 选第一个元素作基准
    int i = low - 1;           // 左指针（先自增再比较）
    int j = high + 1;          // 右指针（先自减再比较）

    while (true) {
        // 从左向右找第一个 >= pivot 的元素
        do { ++i; } while (arr[i] < pivot);
        // 从右向左找第一个 <= pivot 的元素
        do { --j; } while (arr[j] > pivot);
        if (i >= j) return j;          // 指针相遇或交错，分区完成
        std::swap(arr[i], arr[j]);     // 交换逆序对
    }
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low >= high) return;           // 区间长度 0 或 1，递归终止

    int p = partition(arr, low, high); // 分区，返回分界点 j
    quickSort(arr, low, p);            // 注意：左区间包含 p！
    quickSort(arr, p + 1, high);       // 右区间
}
```

迭代：

```cpp linenums="1"
#include <stack>

void quickSortIterative(std::vector<int>& arr, int low, int high) {
    std::stack<std::pair<int, int>> st;
    st.push({low, high});

    while (!st.empty()) {
        auto [l, r] = st.top();
        st.pop();
        if (l >= r) continue;

        int p = partition(arr, l, r);
        st.push({l, p});        // 左区间（包含 p）
        st.push({p + 1, r});    // 右区间
    }
}
```

### 2.3 复杂度分析

| 情况 | 时间复杂度 | 说明 |
|---|---|---|
| 最好情况 | $O(N\log N)$ | 每次分区都均匀分成两半 |
| 平均情况 | $O(N\log N)$ | 随机输入下期望性能 |
| 最坏情况 | $O(N^2)$ | 每次基准都是最大/最小元素（已排序/逆序数组） |

**最坏情况**：如果数组已经有序，Lomuto 分区每次选末尾元素作基准都是当前最大值，导致每次只把数组分成 `N-1` 和 `1` 两部分，递归深度退化为 $N$，总复杂度 $O(N^2)$

**空间复杂度**：主要来自递归调用栈的深度

- 平均 $O(\log N)$（每次对半分，递归深度 $\log N$）
- 最坏 $O(N)$（退化成链表状递归树）

**稳定性**：快速排序是 **不稳定** 排序。分区过程中相同元素的相对位置可能改变

### 2.4 三路快排

当数组含有大量重复元素时，普通快排仍会把它们反复比较。三路快排把数组分为 `<`、`=`、`>` 三部分，等于基准的部分直接跳过：

```cpp linenums="1"
void quickSort3Way(std::vector<int>& arr, int low, int high) {
    if (low >= high) return;

    int pivot = arr[low];
    int lt = low;       // arr[low..lt-1]  < pivot
    int gt = high;      // arr[gt+1..high] > pivot
    int i = low + 1;    // 当前扫描位置

    while (i <= gt) {
        if (arr[i] < pivot)
            std::swap(arr[lt++], arr[i++]);
        else if (arr[i] > pivot)
            std::swap(arr[i], arr[gt--]);
        else
            ++i;
    }

    quickSort3Way(arr, low, lt - 1);
    quickSort3Way(arr, gt + 1, high);
}
```

三路快排对含大量重复键的数据可达到 $O(N)$（接近线性）
