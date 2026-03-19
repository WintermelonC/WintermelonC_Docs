# vector

一旦扩容，之前指向元素的迭代器、指针、引用通常都会失效。插入/删除也可能导致失效（特别是插入点及其后元素）。因此执行可能改结构的操作后，不要继续用旧迭代器，必要时重新获取

`front()/back()` 在空 vector 上调用是未定义行为

`clear()` 清空元素但通常不释放容量

在已知数据规模时，可使用 `reserve` 降低扩容成本

## emplace_back

`emplace_back()` 是 C++ 11 引入的一个非常重要的容器操作函数，主要用于在容器尾部直接构造元素，避免不必要的拷贝或移动操作

```cpp linenums="1"
#include <vector>
#include <string>

std::vector<std::string> vec;
vec.emplace_back("Hello, World!");  // 直接在vector中构造string对象
```

- `push_back()`：先构造一个临时对象，然后将该对象拷贝或移动到容器中
- `emplace_back()`：直接在容器的内存空间中构造对象，零拷贝

```cpp linenums="1"
class Person {
public:
    Person(std::string n, int a) : name(n), age(a) {}
private:
    std::string name;
    int age;
};

std::vector<Person> people;

// push_back - 需要构造临时对象
people.push_back(Person("Alice", 25));
people.push_back({"Bob", 30});  // C++11起可以使用初始化列表

// emplace_back - 直接传递构造函数参数
people.emplace_back("Charlie", 35);  // 更高效！
```

`emplace_back()` 支持多种容器

```cpp linenums="1"
// vector
std::vector<std::pair<int, std::string>> v;
v.emplace_back(1, "one");  // 直接构造pair

// deque
std::deque<std::vector<int>> d;
d.emplace_back(5, 10);  // 构造包含5个10的vector

// list
std::list<std::complex<double>> l;
l.emplace_back(3.0, 4.0);  // 构造复数(3.0, 4.0)
```