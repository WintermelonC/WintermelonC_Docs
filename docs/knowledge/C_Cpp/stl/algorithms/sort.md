# sort

## 1 `std::sort`

```cpp linenums="1"
#include <algorithm>
#include <vector>
#include <iostream>

int main() {
    std::vector<int> vec = {5, 2, 8, 1, 9};
    
    // 升序排序（默认）
    std::sort(vec.begin(), vec.end());
    // 结果: {1, 2, 5, 8, 9}
    
    // 降序排序
    std::sort(vec.begin(), vec.end(), std::greater<int>());
    // 结果: {9, 8, 5, 2, 1}
    
    // 使用自定义比较函数
    std::sort(vec.begin(), vec.end(), [](int a, int b) {
        return a > b;  // 降序
    });
    
    return 0;
}
```

现代 C++ 的 `std::sort` 通常使用 Intro Sort（内省排序），它是三种排序算法的混合：

1. Quick Sort（快速排序）：主要算法。平均 $O(n \log n)$，最坏 $O(n^2)$
2. Heap Sort（堆排序）：后备算法。始终 $O(n \log n)$
3. Insertion Sort（插入排序）：小数组优化。$O(n^2)$，但对小数组很快

```cpp linenums="1"
// 伪代码表示
void introSort(begin, end, depthLimit) {
    while (end - begin > threshold) {  // 阈值通常为16
        if (depthLimit == 0) {
            // 递归深度过大，改用堆排序
            heapSort(begin, end);
            return;
        }
        depthLimit--;
        
        // 快速排序分区
        auto pivot = partition(begin, end);
        
        // 递归排序较小的部分
        introSort(begin, pivot, depthLimit);
        begin = pivot + 1;  // 循环处理较大的部分
    }
    
    // 小数组使用插入排序
    insertionSort(begin, end);
}
```

### 1.1 快速排序

选择一个基准值（`pivot`），将数组分成两部分：左边都比基准小，右边都比基准大，然后递归处理左右两部分

```cpp linenums="1"
// 1. 分区函数 - 这是快排的核心
int partition(vector<int>& arr, int low, int high) {
    // 选择最右边的元素作为基准
    int pivot = arr[high];
    
    // i 指向小于基准的区域的最后一个位置
    int i = low - 1;
    
    // 遍历数组，将小于基准的元素放到左边
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);  // 把小于基准的元素换到左边
        }
    }
    
    // 把基准放到正确的位置（中间）
    swap(arr[i + 1], arr[high]);
    return i + 1;  // 返回基准的位置
}

// 2. 递归排序
void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        // 获取分区点
        int pi = partition(arr, low, high);
        
        // 递归排序左右两部分
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
```

### 1.2 堆排序

将数组构建成最大堆，然后不断取出堆顶（最大值）放到数组末尾

```cpp linenums="1"
// 1. 维护堆的性质（下沉操作）
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;        // 假设当前节点最大
    int left = 2 * i + 1;   // 左子节点
    int right = 2 * i + 2;  // 右子节点
    
    // 找出当前节点、左子、右子中的最大值
    if (left < n && arr[left] > arr[largest])
        largest = left;
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    // 如果最大值不是当前节点，交换并继续调整
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);  // 递归调整子树
    }
}

// 2. 堆排序主函数
void heapSort(vector<int>& arr) {
    int n = arr.size();
    
    // 第一步：构建最大堆（从最后一个非叶子节点开始）
    // 最后一个非叶子节点 = n/2 - 1
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // 第二步：逐个取出堆顶元素
    for (int i = n - 1; i > 0; i--) {
        // 将堆顶（最大值）放到数组末尾
        swap(arr[0], arr[i]);
        
        // 调整剩余部分为堆
        heapify(arr, i, 0);
    }
}
```

```cpp linenums="1"
#include <iostream>
#include <vector>
#include <algorithm>

// 使用STL的堆排序
template<typename T>
void heapSortSTL(std::vector<T>& arr) {
    if (arr.empty()) return;
    
    // 第一步：建堆 O(n)
    std::make_heap(arr.begin(), arr.end());
    
    // 第二步：逐个弹出堆顶 O(n log n)
    std::sort_heap(arr.begin(), arr.end());
}

int main() {
    std::vector<int> arr = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    
    heapSortSTL(arr);
    
    for (int n : arr) std::cout << n << " ";
    
    return 0;
}
```

### 1.3 插入排序

将数组分为已排序和未排序两部分，每次从未排序部分取一个元素，插入到已排序部分的正确位置

```cpp linenums="1"
void insertionSort(vector<int>& arr) {
    int n = arr.size();
    
    // 从第二个元素开始（第一个元素认为是已排序的）
    for (int i = 1; i < n; i++) {
        int key = arr[i];  // 当前要插入的元素
        int j = i - 1;     // 已排序部分的最后一个位置
        
        // 将大于key的元素向后移动
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];  // 元素后移
            j--;
        }
        
        // 将key插入到正确位置
        arr[j + 1] = key;
    }
}
```