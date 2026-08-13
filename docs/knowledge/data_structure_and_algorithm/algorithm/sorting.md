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