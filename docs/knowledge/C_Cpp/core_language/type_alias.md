# Type Alias

typedef 和 using 都是类型别名工具，本质是给已有类型起新名字，不会创建新类型

现代 C++（C++ 11 之后）通常优先 using。using 语法更直观、支持模板别名，对于复杂类型可读性更好

```cpp linenums="1" title="模板别名"
// 不使用模板别名 - 每次都写完整的类型
std::vector<std::pair<std::string, int>> data1;
std::vector<std::pair<std::string, int>> data2;
std::vector<std::pair<std::string, int>>::iterator it;

// 使用模板别名 - 简化表达
template<typename T>
using StringPair = std::pair<std::string, T>;

template<typename T>
using VecOfPairs = std::vector<StringPair<T>>;

VecOfPairs<int> data1;  // std::vector<std::pair<std::string, int>>
VecOfPairs<double> data2;  // std::vector<std::pair<std::string, double>>
```

它们不会生成新类型