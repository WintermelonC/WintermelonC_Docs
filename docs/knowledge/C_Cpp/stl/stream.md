# Stream

[OOP - Stream](../../../zju/basic_courses/OOP/ch14.md){:target="_blank"}

!!! question "`std::cout`、`std::cerr` 和 `std::clog` 的区别"

    1. `cout` 是普通输出，自带缓冲区
    2. `cerr` 是专门用来输出错误信息的，不经过缓冲区直接输出到终端，保证程序崩溃前错误信息能立刻显示
    3. `clog` 用于输出相对不紧急的日志信息，经过缓冲区

!!! question "`std::endl` 和 `\n` 的区别是什么"

    1. `\n` 仅仅是输出一个换行符，将光标移动到下一行
    2. `std::endl` 不仅输出一个换行符，还会强制刷新缓冲区（flush），将缓冲区里的数据立刻输出到目标设备上。因此频繁使用 `endl` 可能会降低 I/O 性能

如果流进入了 fail 状态，后续所有的流操作都会被忽略。如果需要继续使用这个流，必须使用 `clear()` 函数清除错误标志位，并通常配合 `ignore()` 清空缓冲区里的残留错误字符

```cpp linenums="1"
if (std::cin.fail()) {
    std::cin.clear(); // 恢复 state 标志
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n'); // 清空缓冲区直到遇到换行符
}
```

字符串流 `<sstream>` 常用于字符串和其它类型的相互转换，以及按空格分割字符串

```cpp linenums="1" title="将句子按空格切分成单词"
#include <iostream>
#include <string>
#include <sstream>

int main() {
    std::string sentence = "Hello world C++ interview";
    std::istringstream iss(sentence);
    std::string word;
    while (iss >> word) { // 自动忽略空格进行读取
        std::cout << word << std::endl;
    }
    return 0;
}
```

!!! question "为什么重载 `<<` 和 `>>` 必须写成友元/全局函数，而不能是成员函数"

    如果重载为成员函数，调用的左操作数必须是对象本身（例如 `myObject << std::cout`），这违反了直觉和 C++ 使用习惯。重载为全局函数可以保证流对象在左边（例如 `std::cout << myObject`）。为了能访问类内部的私有成员，通常会在类声明内标记该全局函数为 `friend`（友元）

!!! question "`cin` 如何判断输入结束"

    1.遇到空白字符

    2.遇到文件结束符/输入流结束 (EOF)

    最常用的不断读取数据的写法：`while (std::cin >> x)`。`cin >> x` 表达式的返回值是 `cin` 对象本身的引用。在 C++11 之后，`std::istream` 类重载了 `explicit operator bool() const;`。当它被放在 `while(...)` 的条件判断中时，会隐式转换为布尔值：如果读取成功，内部的错误状态位仍然是正常的，转换为 `true`；如果遇到了 EOF（文件尾），`cin` 的状态标志位 `eofbit` 和 `failbit` 会被设置，此时转换为 `false`，循环结束

    3.类型不匹配导致的读取失败：`cin` 的 `failbit` 会被置为 `1`。如果没有调用 `cin.clear()` 清除错误状态，后续所有的 `cin` 操作都会直接失效

!!! question "如何复制一个文件"

    ```cpp linenums="1"
    ifs >> noskipws >> ofs.rdbuf();
    // 或
    ofs << ifs.rdbuf();
    ```