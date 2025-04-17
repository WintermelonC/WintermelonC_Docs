# 0 Introduction

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 `cout` 输出

```cpp linenums="1" title="第一个 C++ 程序"
// 头文件
# include <iostream>
// 遇到下面不认识的对象，都默认属于 std 命名空间
// 不然就要写成 std::cout std::endl
using namespace std;

int main()
{
    // << 是 inserter operator
    // 可以使用多个 << 连续输出多个数据
    cout << "Hello World! I am " << 18 << " today!" << endl;
    return 0;
}
```

- `cout` 是 C++ 标准库中的输出流对象，用于向标准输出设备（通常是屏幕）输出数据
      - `cout` 使用插入运算符 `<<` 将数据输出到标准输出设备
- `endl` 是 C++ 标准库中的一个操纵符，用于在输出流中插入一个换行符，并刷新输出缓冲区
      - 刷新输出缓冲区：意味着所有缓冲区中的数据都会立即输出到标准输出设备。这在需要确保所有输出都被立即显示时非常有用

!!! tip "`endl` 与 `\n` 的区别"

    `endl` 和 `\n` 都可以用于插入换行符，但它们有一个重要区别：`endl` 会刷新输出缓冲区，而 `\n` 不会

## 2 `cin` 输入

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

- `cin` 是 C++ 标准库中的输入流对象，用于从标准输入设备（通常是键盘）读取数据
      - `cin` 使用提取运算符 `>>` 从标准输入读取数据并存储到变量中
      - 可以使用多个 `>>` 运算符连续读取多个数据
      - `cin` 也可以用于读取字符串输入，但它只会读取第一个单词（即遇到空格或换行符时停止）

## 3 C++ 规则

详见[C/C++](../../../knowledge/C_Cpp/index.md){:target="_blank"}