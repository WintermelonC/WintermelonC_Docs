# 0 Introduction

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

```cpp linenums="1" title="第一个 C++ 程序"
// 头文件
# include <iostream>
// 遇到下面不认识的关键字，都默认是 std 里面的
// 不然就要写成 std::cout std::endl
using namespace std;

int main()
{
    // << 是 inserter operator
    cout << "Hello World! I am " << 18 << " today!" << endl;
    return 0;
}
```

```cpp linenums="1" title="C++ 的读入"
# include <iostream>
using namespace std;

int main()
{
    int number;
    // >> extractor operator
    cin >> number;
    cout << "Hello World! I am " << number << " today!" << endl;
    return 0;
}
```
