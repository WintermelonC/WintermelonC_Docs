# list

`std::list` 是双向链表容器，节点分散存储，擅长在已知位置做插入删除

list 插入一般不会让其他元素迭代器失效。删除某个节点时，仅指向被删节点的迭代器失效。这是 list 相对 vector 的一个重要稳定性优势

## splice

允许将元素从一个 list 直接转移到另一个 list，而不进行任何元素的拷贝或移动（仅仅是调整内部指针）。操作后源 list 中的元素消失，出现在目标 list 中。源 list 和目标 list 可以是同一个 list（用于重新排列元素）

```cpp linenums="1"
void splice(const_iterator pos, list& other);
void splice(const_iterator pos, list&& other);
```

将 `other` 中的所有元素转移到 `pos` 位置之前。操作后 `other` 变为空

```cpp linenums="1"
void splice(const_iterator pos, list& other, const_iterator it);
void splice(const_iterator pos, list&& other, const_iterator it);
```

将 `other` 中 `it` 指向的单个元素转移到 `pos` 位置之前

```cpp linenums="1"
void splice(const_iterator pos, list& other, 
            const_iterator first, const_iterator last);
void splice(const_iterator pos, list&& other,
            const_iterator first, const_iterator last);
```

将 `other` 中 `[first, last)` 范围内的元素转移到 `pos` 位置之前

## merge

用于将两个已排序的 list 合并成一个新的有序 list

```cpp linenums="1"
// 版本1：使用 operator< 比较
void merge(list& other);
void merge(list&& other);

// 版本2：使用自定义比较函数
template <class Compare>
void merge(list& other, Compare comp);
template <class Compare>
void merge(list&& other, Compare comp);
```

1. 两个 list 必须已经按相同规则排序
2. 只调整指针，不创建新节点
3. 操作后源 list 变为空
4. 稳定合并：相等元素的相对顺序保持不变

```cpp linenums="1"
#include <iostream>
#include <list>

void printList(const std::list<int>& lst, const std::string& name) {
    std::cout << name << ": ";
    for (int x : lst) std::cout << x << " ";
    std::cout << std::endl;
}

int main() {
    std::list<int> list1 = {1, 3, 5, 7};
    std::list<int> list2 = {2, 4, 6, 8};
    
    printList(list1, "list1");  // list1: 1 3 5 7
    printList(list2, "list2");  // list2: 2 4 6 8
    
    list1.merge(list2);
    
    printList(list1, "list1 after merge");  // list1: 1 2 3 4 5 6 7 8
    printList(list2, "list2 after merge");  // list2: (空)
    
    return 0;
}
```

## sort

`sort()` 用于对 list 进行排序。与通用算法 `std::sort()` 不同，list 有自己的 `sort()` 成员函数

```cpp linenums="1"
// 版本1：使用 operator< 比较
void sort();

// 版本2：使用自定义比较函数
template <class Compare>
void sort(Compare comp);
```

1. 稳定排序：相等元素的相对顺序保持不变
2. 归并排序实现：通常使用自底向上的归并排序
3. 不需要随机访问迭代器：适合 list 的结构特点
4. 时间复杂度：$O(N\log N)$

