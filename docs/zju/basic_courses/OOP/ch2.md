# 2 Grouping Objects

!!! tip "说明"

    此文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

Container（容器）：容器就是放东西的东西

All Sequential Containers（顺序容器）:

1. vector：动态数组
2. deque：双端队列
3. list：双向链表
4. forward_list：单向链表
5. array：固定大小数组
6. string：字符数组

## 2.1 vector

```cpp linenums="1"
# include <vector>
// vector 的定义
vector<int> x;
vector<string> notes;
// 拷贝构造函数
// 使用现有的 vector 对象 x 来初始化另一个 vector 对象 y
// y 的内容与 x 完全相同
vector<int> y(x);
```

### 2.1.1 vector 方法

```cpp linenums="1"
# include <iostream>
# include <vector>

using namespace std;

int main() 
{
    // Declare a vector of ints (no need to worry about size)
    vector<int> x;
    // Add elements
    for (int a = 0; a < 1000; a++) {
        x.push_back(a);        
    }
    // 迭代器
    vector<int>::iterator p;
    for (p = x.begin(); p < x.end(); p++) {
        cout << *p << " ";
    }
    return 0;
}
```

1. `v.size()`：获取 v 中成员的数量
2. `v.empty()`：判断 v 是否为空
3. `v.swap(x2)`：交换
4. `I.begin()`：第一个元素的位置
5. `I.end()`：最后一个元素的位置
6. `v.at(index)`：`v[index]`，但会进行边界判断
7. `v.front()`：访问第一个元素，返回引用
8. `v.back()`：访问最后一个元素，返回引用
9. `v.push_back(e)`
10. `v.pop_back()`
11. `v.insert(pos, e)`
12. `v.erase(pos)`
12. `v.clear()`
13. `v.find(first, last, item)`

## 2.2 list

1. `x.front()`：返回列表中第一个元素的引用
2. `x.back()`：返回列表中最后一个元素的引用
3. `x.push_back(item)`：在列表末尾添加一个元素
4. `x.push_front(item)`：在列表开头添加一个元素
5. `x.pop_back()`：删除列表末尾的元素
6. `x.pop_front()`：删除列表开头的元素
7. `x.erase(pos1, pos2)`：删除范围 `[pos1, pos2)` 内的元素

```cpp linenums="1"
# include <iostream>
# include <list>
# include <string>

using namespace std;

int main() 
{
    // Declare a list of strings
    list<string> s;
    s.push_back("hello");
    s.push_back("world");
    s.push_front("tide");
    s.push_front("crimson");
    s.push_front("alabama");

    // list 迭代器，不能相互比较
    list<string>::iterator p;
    for (p = s.begin(); p != s.end(); p++) {
        cout << *p << " ";
    }
    cout << endl;
}
```

```cpp linenums="1" title="维护一个有序列表"
# include <iostream>
# include <list>
# include <string>

using namespace std;

int main() 
{
    list<string> s;
    string t;
    list<string>::iterator p;
    for (int a = 0; a < 5; a++) {
        cout << "enter a string : ";
        cin >> t;
        p = s.begin();
        while (p != s.end() && *p < t) {
            p++;
        }
        s.insert(p, t);
    }
    for (p = s.begin(); p != s.end(); p++) {
        cout << *p << " ";
    }
    cout << endl;
}
```

!!! tip "选择 Sequential Containers"

    1. 优先选择 vector
    2. 如果程序包含大量小元素并且空间开销很重要，不要使用 list 和 forward_list
    3. 如果程序需要随机访问元素，使用 vector 或 deque
    4. 如果程序需要在中间插入元素，使用 list 或 forward_list
    5. 如果程序需要在前后插入元素，使用 deque

## 2.3 map

```cpp linenums="1"
# include <map>
# include <string>

map<string, float> price;
price["snapple"] = 0.75;
price["coke"] = 0.50;
string item;
double total = 0;
while ( cin >> item ) {
    total += price[item];
}

map<long, int> root;
root[4] = 2;
root[1000000] = 1000;
long l;
cin >> l;
// .count(item) 检查 key item 是否存在于 map 中 
if (root.count(l)) {
    cout << root[l];
} else {
    cout << "Not perfect square";
}
```

```cpp linenums="1"
// Create a map of three (string, int) pairs
std::map<std::string, int> m{{"CPU", 10}, {"GPU", 15}, {"RAM", 20}};
print_map("1) Initial map: ", m);

m["CPU"] = 25; // update an existing value
m["SSD"] = 30; // insert a new value
print_map("2) Updated map: ", m);

// Using operator[] with non-existent key always performs an insert
std::cout << "3) m[UPS] = " << m["UPS"] << '\n';
print_map("4) Updated map: ", m);

m.erase("GPU");
print_map("5) After erase: ", m);

m.clear();
std::cout << std::boolalpha << "6) Map is empty: " << m.empty() << '\n';
```

## 2.4 iterator

```cpp linenums="1"
list<int>::iterator li;
list<int> L;
li = L.begin();
li = L.end();
```

- `++li`
- `*li = 10`