# 2 Grouping Objects

!!! tip "说明"

    此文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 2.1 STL

Standard Template Library

是 ISO 标准 C++ 库的一部分，保存了 C++ 的数据结构和算法

- STL 的内容从广义上讲分为容器、迭代器、算法三个主要部分
- STL 的一个基本理念就是将数据和操作分离
- STL 中的所有组件都由模板构成，其元素可以是任意类型

---

Container（容器）：容器就是放东西的东西

All Sequential Containers（顺序容器）:

1. vector：动态数组
2. deque：双端队列
3. list：双向链表
4. forward_list：单向链表
5. array：固定大小数组
6. string：字符数组

## 2.2 vector

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

### 2.2.1 vector 方法

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

## 2.3 list

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

## 2.4 map

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

## 2.5 iterator

```cpp linenums="1"
list<int>::iterator li;
list<int> L;
li = L.begin();
li = L.end();
```

- `++li`
- `*li = 10`

## Homework

<!-- 此节内容在 2025/3/11 后上传至 Github -->

<!-- ???+ question "PTA 2.2"

    设有定义 vector<string> v(10); 执行下列哪条语句时会调用构造函数?

    A.v[0] += "abc";<br/>
    B.v[0] = "2018";<br/>
    C.v.push_back("ZUCC");<br/>
    D.cout << (v[1] == "def"); <br/>

    ??? success "答案"

        C

        ---

        在给出的选项中，只有涉及到新增元素的操作会调用`string`类的构造函数。具体分析如下：
        
        A. `v[0] += "abc";` 这条语句是对`v[0]`这个已有的`string`对象进行操作（追加字符串），并不会调用构造函数
        
        B. `v[0] = "2018";` 这是赋值操作，将字面量"2018"赋值给`v[0]`。这里不会调用构造函数，而是使用了赋值运算符
        
        C. `v.push_back("ZUCC");` 这条语句是在`vector<string>`末尾添加一个新的元素。由于传入的是一个C风格字符串常量，编译器首先需要创建一个`std::string`对象来作为参数传递给`push_back`函数，因此这一步会调用`std::string`的构造函数来从"C风格字符串"构造出一个`std::string`对象
        
        D. `cout << (v[1] == "def");` 这是一个比较操作，并且是与字符串字面量进行比较。这里不会调用构造函数，因为这是两个字符串内容的比较
        
        所以，正确答案是 C. `v.push_back("ZUCC");` 这个选项会在内部触发`std::string`构造函数的调用，用于将提供的C风格字符串转换为`std::string`对象。请注意，这里的描述基于常见的C++实现细节，在不同的编译器或标准库实现下可能会有些许差异。但总体而言，涉及向容器中添加新元素时，如果这些新元素是从C风格字符串创建的话，则通常会涉及到字符串构造函数的调用

???+ question "PTA 2.3"

    设有如下代码段:

    ```cpp linenums="1"
    std::map<char *, int> m;
    const int MAX_SIZE = 100;
    int main() {
        char str[MAX_SIZE];
        for (int i = 0; i < 10; i++) {
            std::cin >> str;
            m[str] = i;
        }
        std::cout << m.size() << std::endl;
    }
    ```

    读入10个字符串，则输出的 `m.size()` 为

    A. 0<br/>
    B. 1<br/>
    C. 10

    ??? success "答案"

        B

        ---

        该程序最后的输出是 1，这是因为 map 使用 char* 作为键，而 char* 是指针类型。每次输入一个字符串时，str 数组的地址是相同的，因此 map 中的键实际上是相同的地址

        在每次循环中，m[str] = i; 会更新相同地址的值，因此 map 中始终只有一个元素。最后，map 的大小为 1

???+ question "PTA 2.5"

    下列创建vector容器对象的方法中，错误的是

    A.vector<int> v(10);<br/>
    B.vector<int> v(10, 1);<br/>
    C.vector<int> v{10, 1};<br/>
    D.vector<int> v = (10, 1);<br/>

    ??? success "答案"

        D

        ---
        
        A. `vector<int> v(10);` 这行代码创建了一个包含10个元素的`vector<int>`，所有元素都初始化为默认值，即0。这是正确的使用方式
        
        B. `vector<int> v(10, 1);` 这里创建了一个包含10个元素的`vector<int>`，所有元素都被初始化为1。第一个参数指定了元素的数量，第二个参数指定了每个元素的初始值。这也是正确的使用方式
        
        C. `vector<int> v{10, 1};` 使用了C++11引入的列表初始化语法，创建了一个含有两个整数（10和1）的`vector<int>`。这种方式也是完全合法的
        
        D. `vector<int> v = (10, 1);` 这种写法是错误的。这里的`(10, 1)`使用的是逗号运算符，它会先计算`10`然后计算`1`，最终结果是`1`，因此这行代码尝试用一个整数`1`来初始化一个`vector<int>`，这显然是不正确的。正确的做法应该类似于前面提到的方式，如使用列表初始化或提供元素数量与初始值等
        
        因此，选项 D 是错误的创建`vector<int>`容器对象的方法

???+ question "PTA 2.6"

    下列选项中，哪一项不是迭代器。

    A.输入迭代器<br/>
    B.前向迭代器<br/>
    C.双向迭代器<br/>
    D.删除迭代器

    ??? success "答案"

        D

        ---

        在C++的标准模板库（STL）中，迭代器分为以下几种主要类型：
        
        - **输入迭代器（Input Iterator）**：允许单次遍历元素的只读访问
        - **输出迭代器（Output Iterator）**：允许单次遍历元素的只写访问
        - **前向迭代器（Forward Iterator）**：支持输入迭代器和输出迭代器的所有操作，并且可以多次遍历同一个元素。它以单步方式前进
        - **双向迭代器（Bidirectional Iterator）**：扩展了前向迭代器的功能，增加了逆向遍历的能力，即可以通过递减操作符 `--` 向后移动
        - **随机访问迭代器（Random Access Iterator）**：提供了对元素的随机访问能力，支持全部的指针算术运算
        
        因此，“删除迭代器”并不是上述标准分类中的任何一种，故正确答案为 D。实际上，在STL中并没有所谓的“删除迭代器”。删除操作通常是通过算法（如 `std::remove` 和容器的方法）结合迭代器来实现的，而不是由特定类型的迭代器直接负责 -->