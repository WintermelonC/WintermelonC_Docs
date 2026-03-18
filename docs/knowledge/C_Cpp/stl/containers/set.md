# set

## 有序集合

`std::set`，最常用的集合容器，元素会自动按升序排序，每个元素都是唯一的

1. 基于红黑树实现
2. 插入、删除、查找时间复杂度：$O(\log n)$
3. 元素自动排序
4. 元素唯一

```cpp linenums="1"
#include <iostream>
#include <set>

int main() {
    std::set<int> mySet;
    
    // 插入元素
    mySet.insert(5);
    mySet.insert(2);
    mySet.insert(8);
    mySet.insert(2);  // 重复插入无效
    
    // 遍历（会按顺序输出：2, 5, 8）
    for (int num : mySet) {
        std::cout << num << " ";
    }
    
    // 查找元素
    if (mySet.find(5) != mySet.end()) {
        std::cout << "\n找到 5" << std::endl;
    }
    
    return 0;
}
```

| 方法 | 作用 | 返回值 |
| -- | -- | -- |
| `std::pair<iterator, bool> insert(const T& value)` | 插入元素 | `bool` 表示是否插入成功 |
| `template <class InputIterator> void insert(InputIterator first, InputIterator last)` | 插入迭代器范围内的所有元素 | |
| `void insert(std::initializer_list<T> list)` | 插入初始化列表 | |
| `std::pair<iterator, bool> emplace(Args&&... args)` | 就地构造元素 | |
| `iterator erase(const_iterator pos)` | 删除指定位置的元素 | 返回下一个元素的迭代器 |
| `size_type erase(const T& value)` | 删除指定值的元素 | 返回删除的元素个数（0 或 1） |
| `iterator erase(const_iterator first, const_iterator last)` | 删除迭代器范围内的所有元素 | 返回最后一个被删元素的下一个迭代器 |
| `void clear()` | 清空集合中的所有元素 | |
| `iterator find(const T& value)` | 查找指定值的元素 | 找到返回迭代器，否则返回 `end()` |
| `size_type count(const T& value) const` | 统计指定值的元素个数 | 对于 set 返回 0 或 1 |
| `bool contains(const T& value) const` | 判断集合是否包含指定值 | |
| `bool empty() const` | 判断集合是否为空 | 空返回 true |
| `size_type size() const` | 返回集合中元素的个数 | |

## 无序集合

`std::unordered_set`，C++ 11 引入的哈希集合，元素无序存储

1. 基于哈希表实现
2. 插入、删除、查找平均时间复杂度：$O(1)$
3. 最坏情况时间复杂度：$O(n)$
4. 元素无序
5. 元素唯一

```cpp linenums="1"
#include <iostream>
#include <unordered_set>

int main() {
    std::unordered_set<int> mySet;
    
    mySet.insert(5);
    mySet.insert(2);
    mySet.insert(8);
    
    // 遍历（顺序不确定）
    for (int num : mySet) {
        std::cout << num << " ";
    }
    
    return 0;
}
```