# 2 Grouping Objects

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    1. 本文档仅涉及部分内容，仅可用于复习重点知识
    2. Homework 的部分答案由 AI 生成

## 1 STL

Standard Template Library

是 ISO 标准 C++ 库的一部分，保存了 C++ 的数据结构和算法

- STL 的内容从广义上讲分为容器、迭代器、算法三个主要部分
- STL 的一个基本理念就是将数据和操作分离
- STL 中的所有组件都由模板构成，其元素可以是任意类型

## 2 Container

Container（容器）：容器就是放东西的东西

All Sequential Containers（顺序容器）:

1. vector：动态数组
2. deque：双端队列
3. list：双向链表
4. forward_list：单向链表
5. array：固定大小数组
6. string：字符数组

!!! tip "选择 Sequential Containers"

    1. 优先选择 vector
    2. 如果程序包含大量小元素并且空间开销很重要，不要使用 list 和 forward_list
    3. 如果程序需要随机访问元素，使用 vector 或 deque
    4. 如果程序需要在中间插入元素，使用 list 或 forward_list
    5. 如果程序需要在前后插入元素，使用 deque

## 3 `vector`

使用前包含头文件 `<vector>`

### 3.1 `vector` 的创建和初始化

```cpp linenums="1"
# include <iostream>
# include <vector>
using namespace std;

int main()
{
    vector<int> vec1; // 创建一个空的 vector
    vector<int> vec2(10); // 创建一个包含 10 个元素的 vector，元素值为默认值 0
    vector<int> vec3(10, 5); // 创建一个包含 10 个元素的 vector，元素值为 5
    vector<int> vec4 = {1, 2, 3, 4, 5}; // 使用初始化列表初始化

    return 0;
}
```

### 3.2 `vector` 的比较

使用 `==` `!=` `>` `<` `>=` `<=` 比较 `vector`

- `==` 运算符：当且仅当两个向量的大小相同，并且对应位置的所有元素都相等时，`==` 才返回 `true`
- `!=` 运算符：这是等于运算符的逻辑否定。如果两个向量不相等（即大小不同或至少有一个对应位置的元素不同），则 `!=` 返回 `true`
- `>` `<` `>=` `<=`：通过元素的字典序（lexicographical compare，即类似于字符串或词典中的顺序）来进行比较的
      - 具体来说，当两个容器（例如 `std::vector`）使用这些运算符进行比较时，会从头到尾依次比较对应位置上的元素，直到找到一对不同的元素为止。如果所有对应位置的元素都相同，则较短的容器被视为“小于”较长的容器

### 3.3 元素的访问和修改

可以使用下标运算符 `[]` 或 `at()` 成员函数访问和修改 vector 中的元素

```cpp linenums="1"
# include <iostream>
# include <vector>
using namespace std;

int main()
{
    vector<int> vec = {1, 2, 3, 4, 5};

    // 访问元素
    cout << "First element: " << vec[0] << endl; // 输出: 1
    cout << "Second element: " << vec.at(1) << endl; // 输出: 2

    // 修改元素
    vec[0] = 10;
    vec.at(1) = 20;

    cout << "Modified vector: ";
    for (int i : vec)
    {
        cout << i << " ";
    }
    cout << endl; // 输出: 10 20 3 4 5

    return 0;
}
```

### 3.4 迭代器遍历元素

可以使用迭代器遍历 `vector` 中的元素

```cpp linenums="1"
# include <iostream>
# include <vector>
using namespace std;

int main()
{
    vector<int> vec = {1, 2, 3, 4, 5};

    // 使用迭代器遍历元素
    cout << "Vector elements: ";
    for (vector<int>::iterator it = vec.begin(); it != vec.end(); ++it)
    {
        cout << *it << " ";
    }
    cout << endl; // 输出: 1 2 3 4 5

    return 0;
}
```

### 3.5 `vector` 的方法

| 方法 | 功能 | 返回值 |
| -- | -- | -- |
| `void push_back(const T& value)` | 在 `vector` 的末尾添加一个元素 | |
| `void pop_back()` | 删除 `vector` 的最后一个元素 | |
| `size_t size() const` | 获取 `vector` 中元素的数量 | |
| `size_t capacity() const` | 获取 `vector` 的容量 | |
| `bool empty() const` | 检查 `vector` 是否为空 | 如果 `vector` 为空，返回 `true`，否则返回 `false` |
| `void clear()` | 清空 `vector` 中的所有元素 | |
| `T& at(size_t pos)` | 访问 `vector` 中指定位置的元素 | 如果 `pos` 超出范围，则抛出 `std::out_of_range` 异常 |
| `iterator begin()` | 返回指向 `vector` 起始位置的迭代器 | |
| `iterator end()` | 返回指向 `vector` 最后一个元素之后的位置的迭代器 | |
| `void insert(iterator pos, const T& value)` | 在指定位置插入一个元素 | |
| `void erase(iterator pos)` | 删除指定位置的元素 | |
| `void swap(vector& other)` | 交换两个 `vector` 的内容 | |
| `T& front()` | 访问 `vector` 中的第一个元素 | |
| `T& back()` | 访问 `vector` 中的最后一个元素 | |
| `void resize(size_t count)` | 调整 `vector` 的大小 | |
| `void reserve(size_t new_cap)` | 请求将 `vector` 的容量增加到至少 `new_cap` | |

> `const T&`：是 C++ 中用于声明一个常量左值引用的语法形式，这里的 `T` 可以是任何数据类型

## 3 `list`

使用前包含头文件 `<list>`

### 3.1 创建和初始化

```cpp linenums="1"
# include <iostream>
# include <list>
using namespace std;

int main()
{
    list<int> lst1; // 创建一个空的 list
    list<int> lst2(10); // 创建一个包含 10 个元素的 list，元素值为默认值 0
    list<int> lst3(10, 5); // 创建一个包含 10 个元素的 list，元素值为 5
    list<int> lst4 = {1, 2, 3, 4, 5}; // 使用初始化列表初始化

    return 0;
}
```

### 3.2 `list` 的比较

使用 `==` `!=` `>` `<` `>=` `<=` 比较 `list`

### 3.3 元素的访问和修改

可以使用迭代器访问和修改 `list` 中的元素

```cpp linenums="1"
# include <iostream>
# include <list>
using namespace std;

int main()
{
    list<int> lst = {1, 2, 3, 4, 5};

    // 访问元素
    cout << "List elements: ";
    for (list<int>::iterator it = lst.begin(); it != lst.end(); ++it)
    {
        cout << *it << " ";
    }
    cout << endl; // 输出: 1 2 3 4 5

    // 修改元素
    list<int>::iterator it = lst.begin();
    *it = 10;
    ++it;
    *it = 20;

    cout << "Modified list: ";
    for (int i : lst)
    {
        cout << i << " ";
    }
    cout << endl; // 输出: 10 20 3 4 5

    return 0;
}
```

### 3.4 迭代器遍历元素

```cpp linenums="1"
# include <iostream>
# include <list>
using namespace std;

int main()
{
    list<int> lst = {1, 2, 3, 4, 5};

    // 使用迭代器遍历元素
    cout << "List elements: ";
    for (list<int>::iterator it = lst.begin(); it != lst.end(); ++it)
    {
        cout << *it << " ";
    }
    cout << endl; // 输出: 1 2 3 4 5

    return 0;
}
```

### 3.5 `list` 的方法

| 方法 | 功能 | 返回值 |
| -- | -- | -- |
| `void push_back(const T& value)` | 在 `list` 的末尾添加一个元素 | |
| `void push_front(const T& value)` | 在 `list` 的开头添加一个元素 | |
| `void pop_back()` | 删除 `list` 的最后一个元素 | |
| `void pop_front()` | 删除 `list` 的第一个元素 | |
| `size_t size() const` | 获取 `list` 中元素的数量 | |
| `bool empty() const` | 检查 `list` 是否为空 | 如果 `list` 为空，返回 `true`，否则返回 `false` |
| `void clear()` | 清空 `list` 中的所有元素 | |
| `iterator begin()` | 返回指向 `list` 起始位置的迭代器 | |
| `iterator end()` | 返回指向 `list` 最后一个元素之后的位置的迭代器 | |
| `T& front()` | 访问 `list` 中的第一个元素 | |
| `T& back()` | 访问 `list` 中的最后一个元素 | |
| `iterator insert(iterator pos, const T& value)` | 在指定位置插入一个元素 | 返回指向新插入元素的迭代器 |
| `iterator erase(iterator pos)` | 删除指定位置的元素 | 返回指向被删除元素之后的迭代器 |
| `void resize(size_t count)` | 调整 `list` 的大小 | |
| `void swap(list& other)` | 交换两个 `list` 的内容 | |
| `void sort()` | 对 `list` 中的元素进行排序 | |
| `void reverse()` | 反转 `list` 中元素的顺序 | |

---

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

!!! tip "陷阱"

    ```cpp linenums="1"
    list<int> L;
    list<int>::iterator li;
    li = L.begin();
    
    L.erase(li);
    ++li;  // 错误

    li = L.erase(li);  // 正确，li 指向被删除元素之后的位置
    ```

## 4 `map`

使用前包含头文件 `<map>`

### 4.1 创建和初始化

```cpp linenums="1"
# include <iostream>
# include <map>
using namespace std;

int main()
{
    map<int, string> map1; // 创建一个空的 map
    map<int, string> map2 = {{1, "one"}, {2, "two"}, {3, "three"}}; // 使用初始化列表初始化

    return 0;
}
```

`map` 不允许有重复的键

### 4.2 元素的访问和修改

可以使用下标运算符 `[]` 或 `at()` 成员函数访问和修改 map 中的元素

```cpp linenums="1"
# include <iostream>
# include <map>
using namespace std;

int main()
{
    map<int, string> map1 = {{1, "one"}, {2, "two"}, {3, "three"}};

    // 访问元素
    cout << "Key 1: " << map1[1] << endl; // 输出: one
    cout << "Key 2: " << map1.at(2) << endl; // 输出: two

    // 修改元素
    map1[1] = "ONE";
    map1.at(2) = "TWO";

    cout << "Modified map: ";
    for (const auto& pair : map1)
    {
        // 通过迭代器访问元素的 key 和 value
        cout << "{" << pair.first << ", " << pair.second << "} ";
    }
    cout << endl; // 输出: {1, ONE} {2, TWO} {3, three}

    return 0;
}
```

!!! tip "陷阱"

    ```cpp linenums="1"
    # include <iostream>
    # include <map>

    using namespace std;

    int main()
    {
        map<string, int> map1 = {{"one", 1}};

        // 它会自动添加一个新的键值对，键为 "two"，值为该类型的默认值，对于 int 来说是 0
        // 所以这个 if 语句的条件判断一定是 false
        if (map1["two"] == 1) {
            ...
        }
    }
    ```

### 4.3 迭代器遍历元素

```cpp linenums="1"
# include <iostream>
# include <map>
using namespace std;

int main()
{
    map<int, string> map1 = {{1, "one"}, {2, "two"}, {3, "three"}};

    // 使用迭代器遍历元素
    cout << "Map elements: ";
    for (map<int, string>::iterator it = map1.begin(); it != map1.end(); ++it)
    {
        cout << "{" << it->first << ", " << it->second << "} ";
    }
    cout << endl; // 输出: {1, one} {2, two} {3, three}

    return 0;
}
```

### 4.4 `map` 的方法

| 方法 | 功能 | 返回值 |
| -- | -- | -- |
| `void insert(const pair<const Key, T>& value)` | 插入一个键值对 | |
| `iterator erase(const_iterator position)` | 删除指定位置的元素 | 返回一个迭代器，它指向被删除元素之后的元素。如果被删除的是最后一个元素，则返回 `end()` 迭代器 |
| `size_type erase(const key_type& key)` | 删除指定键的元素 | 返回删除的元素数量，如果该键对应的元素存在，则返回 1；如果不存在，则返回 0 |
| `size_type count(const key_type& key) const` | 检查是否存在以指定键 `key` 作为键的元素 | 返回匹配的元素数量，如果该键对应的元素存在，则返回 1；如果不存在，则返回 0 |
| `iterator find(const Key& key)` | 查找指定键的元素 | 返回指向找到的元素的迭代器，如果未找到则返回 `end()` |
| `size_t size() const` | 获取 `map` 中元素的数量 | |
| `bool empty() const` | 检查 `map` 是否为空 | 如果 `map` 为空，返回 `true`，否则返回 `false` |
| `void clear()` | 清空 `map` 中的所有元素 | |
| `T& at(const Key& key)` | 访问指定键的元素 | 如果键不存在则抛出 `std::out_of_range` 异常 |
| `iterator begin()` | 返回指向 `map` 起始位置的迭代器 | |
| `iterator end()` | 返回指向 `map` 最后一个元素之后的位置的迭代器 | |
| `void swap(map& other)` | 交换两个 `map` 的内容 | |

## 5 iterator

迭代器是用于遍历容器（如 `vector`, `list`, `map` 等）中的元素的对象

迭代器的类型：

- 输入迭代器（Input Iterator）：允许单次遍历元素的只读访问
- 输出迭代器（Output Iterator）：允许单次遍历元素的只写访问
- 前向迭代器（Forward Iterator）：支持输入迭代器和输出迭代器的所有操作，并且可以多次遍历同一个元素。它以单步方式前进
- 双向迭代器（Bidirectional Iterator）：扩展了前向迭代器的功能，增加了逆向遍历的能力，即可以通过递减操作符 `--` 向后移动
- 随机访问迭代器（Random Access Iterator）：提供了对元素的随机访问能力，支持全部的指针算术运算

常见的迭代器操作：

- 获取迭代器: 使用容器的 `begin()` 和 `end()` 成员函数获取指向容器起始位置和末尾位置的迭代器
- 遍历容器: 使用迭代器遍历容器中的元素
- 访问元素: 使用解引用运算符 `*` 访问迭代器指向的元素
- 移动迭代器: 使用递增运算符 `++` 和递减运算符 `--` 移动迭代器

## 6 `for-each` 循环

`for-each` 循环（也称为范围 `for` 循环）是 C++ 11 引入的一种简化遍历容器中元素的语法。它可以用于遍历数组、`vector`、`list`、`map` 等容器中的元素

```cpp linenums="1" title="遍历 list"
# include <iostream>
# include <map>
using namespace std;

int main()
{
    map<int, string> map1 = {{1, "one"}, {2, "two"}, {3, "three"}};

    // 使用 for-each 循环遍历 map
    cout << "Map elements: ";
    for (const auto& pair : map1)
    {
        cout << "{" << pair.first << ", " << pair.second << "} ";
    }
    cout << endl; // 输出: {1, one} {2, two} {3, three}

    return 0;
}
```

- 优点：
      1. 降低错误发生率，提高代码可读性
      2. 易于实现
      3. 无需定义迭代器
- 缺点：
      1. 无法直接访问对应的元素索引
      2. 无法反向遍历元素
      3. 不允许用户在遍历每个元素时跳过任何元素

> `auto` 关键字用于让编译器自动推导变量的类型

## 7 `typedef` 和 `using`

### 7.1 `typedef`

`typedef` 是 C++ 中用于为现有类型定义新的类型别名的关键字。它可以使代码更简洁、更易读，特别是在处理复杂类型时

```cpp linenums="1"
# include <iostream>
# include <vector>
using namespace std;

typedef vector<pair<int, string>> IntStringPairVector;

int main()
{
    IntStringPairVector vec = {{1, "one"}, {2, "two"}, {3, "three"}};
    for (const auto& pair : vec)
    {
        cout << "{" << pair.first << ", " << pair.second << "} ";
    }
    cout << endl; // 输出: {1, one} {2, two} {3, three}
    return 0;
}
```

### 7.2 `using`

`using` 是 C++ 中用于定义类型别名和引入命名空间的关键字。它在 C++ 11 中引入，并在某些情况下可以替代 `typedef`，使代码更简洁、更易读。

```cpp linenums="1"
# include <iostream>
# include <vector>
using namespace std;

using IntStringPairVector = vector<pair<int, string>>;

int main()
{
    IntStringPairVector vec = {{1, "one"}, {2, "two"}, {3, "three"}};
    for (const auto& pair : vec)
    {
        cout << "{" << pair.first << ", " << pair.second << "} ";
    }
    cout << endl; // 输出: {1, one} {2, two} {3, three}
    return 0;
}
```

## Homework

<!-- 此节内容在 2025/3/11 后上传至 Github -->

???+ question "PTA 2.2"

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