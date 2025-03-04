# 1 Using Objects

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    1. 本文档仅涉及部分内容，仅可用于复习重点知识
    2. Homework 的部分答案由 AI 生成

## 1 Object

在 C++ 中，"object"（对象）是一个核心概念，指的是类（class）或结构体（struct）的实例。简而言之，对象是数据和可在这些数据上操作的函数（方法）的封装体。通过这种封装，C++ 实现了面向对象编程（OOP）中的关键特性：封装、继承和多态

## 2 `string`

`string` 是 C++ 标准库中的一个类，用于表示和操作字符串，使用前添加头文件 `<string>`

### 2.1 `string` 的创建和初始化

```cpp linenums="1"
# include <iostream>
# include <string>
using namespace std;

int main()
{
    string str1; // 创建一个字符串，并初始化为空字符串
    string str2 = "Hello, World!"; // 使用字符串字面值初始化
    string str3("Hello, C++!"); // 使用构造函数初始化
    string str4(str2); // 使用另一个字符串初始化

    cout << str2 << endl; // 输出: Hello, World!
    cout << str3 << endl; // 输出: Hello, C++!
    cout << str4 << endl; // 输出: Hello, World!

    return 0;
}
```

### 2.2 `string` 的输入和输出

```cpp linenums="1"
# include <iostream>
# include <string>
using namespace std;

int main()
{
    string name;
    cout << "Enter your name: ";
    cin >> name; // 读取单个单词
    cout << "Hello, " << name << "!" << endl;

    cin.ignore(); // 忽略剩余的输入缓冲区内容
    cout << "Enter your full name: ";
    getline(cin, name); // 读取整行字符串
    cout << "Hello, " << name << "!" << endl;

    return 0;
}
```

#### `getline()`

`getline()` 是 C++ 标准库中用于从输入流读取字符串的一个非常有用的函数，特别是当你需要读取包含空格的整行文本时

- `std::istream& getline(std::istream& is, std::string& str);`
      - 从输入流 `is` 中读取字符直到遇到换行符（`\n`），并将结果存储在 `str` 中，包括读取到的所有字符但不包括换行符本身
- `std::istream& getline(std::istream& is, std::string& str, char delim);`
      - 允许指定一个自定义的分隔符 `delim`，当读取过程中遇到该字符时停止读取

```cpp linenums="1"
# include <iostream>
# include <string>

int main() {
    std::string data;
    std::cout << "Enter data separated by commas: ";
    std::getline(std::cin, data, ',');  // getline 将会读取输入直到遇到第一个逗号 ,
    std::cout << "First part: " << data << std::endl;
    return 0;
}
```

1. 当使用 `getline()` 读取输入后，如果紧接着有其他非字符串类型的输入操作，可能会因为缓冲区中的剩余换行符而导致问题。在这种情况下，可能需要额外处理或清除输入缓冲区，可使用 `cin.ignore()`，默认忽略一个字符
      - `istream& ignore(streamsize n = 1, int delim = EOF)`
          - `n`：要忽略的最大字符数
          - `delim`：分隔符，当遇到此字符时停止忽略字符
          - `cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n')`：忽略尽可能多的字符数量
2. `getline()` 返回其输入流参数，因此可以用来检查流状态（例如是否到达文件末尾）。如果读取失败，返回的流将处于错误状态

### 2.3 元素的访问和修改

可以使用下标运算符 `[]` 或 `at()` 成员函数访问和修改字符串中的字符

```cpp linenums="1"
# include <iostream>
# include <string>
using namespace std;

int main()
{
    string str = "Hello, World!";
    cout << "First character: " << str[0] << endl; // 输出: H
    cout << "Last character: " << str[str.length() - 1] << endl; // 输出: !

    str[0] = 'h';
    cout << "Modified string: " << str << endl; // 输出: hello, World!

    return 0;
}
```

### 2.4 `string` 的连接、比较

可以使用 `+` 运算符或 `+=` 运算符连接字符串

```cpp linenums="1"
# include <iostream>
# include <string>
using namespace std;

int main()
{
    string str1 = "Hello";
    string str2 = "World";
    string str3 = str1 + ", " + str2 + "!"; // 使用 + 运算符连接
    str1 += ", " + str2 + "!"; // 使用 += 运算符连接

    cout << str3 << endl; // 输出: Hello, World!
    cout << str1 << endl; // 输出: Hello, World!

    return 0;
}
```

可以使用比较运算符（如 `==`, `!=`, `<`, `>`, `<=`, `>=`）比较字符串

```cpp linenums="1"
# include <iostream>
# include <string>
using namespace std;

int main()
{
    string str1 = "Hello";
    string str2 = "World";
    string str3 = "Hello";

    cout << (str1 == str2) << endl; // 输出: 0 (false)
    cout << (str1 == str3) << endl; // 输出: 1 (true)
    cout << (str1 < str2) << endl; // 输出: 1 (true)

    return 0;
}
```

### 2.5 `string` 的方法

| 方法 | 功能 | 返回值 |
| -- | -- | -- |
| `size_t length() const` | 获取字符串的长度 | |
| `size_t size() const` | 获取字符串的长度 | |
| `bool empty() const` | 检查字符串是否为空 | 如果字符串为空，返回 `true`，否则返回 `false` |
| `void clear()` | 清空字符串内容 | |
| `char& at(size_t pos)` | 访问字符串中的元素 | 如果 `pos >= size()`，则会抛出 `std::out_of_range` 异常 |
| `string& append(const string& str)`<br/>`string& append(size_t n, char c)` | 在字符串末尾追加内容 | |
| `string& insert(size_t pos, const string& str)`<br/>`string& insert(size_t pos, char ch)` | 在指定位置插入内容 | |
| `string& erase(size_t pos = 0, size_t len = npos)` | 删除字符串中的部分内容 | |
| `string substr(size_t pos = 0, size_t len = npos) const` | 返回一个子字符串 | |
| `size_t find(const string& str, size_t pos = 0) const`| 查找子字符串在字符串中的位置 | 如果未找到，返回 `string::npos` |
| `string& replace(size_t pos, size_t len, const string& str)` | 替换字符串中的部分内容 | |

> 1. `size_t`：无符号整数类型，通常用于表示内存中对象的大小或者数组的长度
> 2. `string&`：`string` 的引用
> 3. 函数原型前面跟着 `const` 表示不能通过这个引用来修改原始字符串中的字符
> 4. 函数原型后面跟着 `const` 表示这个成员函数不会修改其所属的对象，允许它被常量对象调用
> 5. `string::npos`：通常用于表示一个无效的位置或者长度值。在实际应用中，`npos` 主要用于表示“直到字符串末尾”的位置或指示搜索函数没有找到匹配项的情况

### 2.6 `string` 的指针

```cpp linenums="1"
# include <iostream>
# include <string>
using namespace std;

int main()
{
    string s = "Hello";
    string* ps = &s; // 定义一个指向 s 的指针

    cout << "String: " << *ps << endl; // 输出: Hello

    // 使用指针调用字符串的方法
    cout << "Length: " << ps -> length() << endl; // 输出: 5
    cout << "Length: " << *(ps).length() << endl; // 输出: 5

    // 修改字符串内容
    *ps = "Hello, World!";
    cout << "Modified String: " << *ps << endl; // 输出: Hello, World!

    return 0;
}
```

可以将一个 `string` 指针赋值给另一个 `string` 指针，使它们指向同一个 `string` 对象

```cpp linenums="1"
# include <iostream>
# include <string>
using namespace std;

int main()
{
    string s1 = "Hello";
    string s2 = "World";
    string* ps1 = &s1;
    string* ps2 = &s2;

    // 将 ps2 指向 ps1 所指向的对象
    ps2 = ps1;

    cout << "ps1 points to: " << *ps1 << endl; // 输出: Hello
    cout << "ps2 points to: " << *ps2 << endl; // 输出: Hello

    return 0;
}
```

!!! tip "Object vs Pointer"

    - `string s`：object `s` 被定义并被初始化
    - `string* ps`：object `ps` 指向什么并不知道

## Homework

<!-- 此节内容在 2025/3/11 后上传至 Github -->

<!-- ???+ question "PTA 1.4"

    下列语句中，不能连续输出3个值的是：

    A. `cout<<x<<y<<z;`<br/>
    B. `cout<<x,y,z;`<br/>
    C. `cout<<x; cout<<y; cout<<z;`<br/>
    D. `cout<<(x,y,z)<<(x,y,z)<<(x,y,z);`<br/>

    ??? success "答案"

        B
        
        ---

        **B 选项：**

        `,` 运算符，从左往右计算表达式，并返回最后一个数据的值。但 B 选项的运算顺序是：`(cout << x), y, z`。先输出 x 的值，再计算 y 和 z，但不输出 y 和 z

        ```cpp linenums="1"
        # include <iostream>
        using namespace std;
        
        int main()
        {
            int x = 1;
            int y = 2;
            int z = 3;
            cout << x, y, z;
            return 0;
        }
        /*
        输出：
        1
        */
        ```

        **D 选项：**

        输出结果就是 3 个 z 的值

        ```cpp linenums="1"
        # include <iostream>
        using namespace std;
        
        int main()
        {
            int x = 1;
            int y = 2;
            int z = 3;
            cout << (x, y, z) << (x, y, z) << (x, y, z);
            return 0;
        }
        /*
        输出：
        333
        */
        ```

???+ question "PTA 1.6"

    使用操作符 setw 对数据进行格式输出时，需要包含（）文件

    A. iostream.h<br/>
    B. fstream.h<br/>
    C. iomanip.h<br/>
    D. stdlib.h<br/>

    ??? success "答案"

        C

        ---

        **AI 解释：**

        `setw` 是 C++ 标准库中的一个操纵器（manipulator），用于设置输出字段的宽度。它定义在 `<iomanip>` 头文件中，因此在使用 `setw` 之前需要包含这个头文件。`setw` 可以控制输出数据占用的字符宽度，对于格式化输出非常有用

        当你使用 `setw` 设置了一个特定的宽度值时，后续的输出操作将会按照设定的宽度来显示内容。如果输出的内容长度小于设定的宽度，则默认情况下会在左侧填充空格（右对齐）。若要改变对齐方式或填充字符，可以结合使用其他操纵器如 `left`、`right` 或 `setfill`
        
        下面是一个简单的例子，演示了如何使用 `setw`：
        
        ```cpp linenums="1"
        #include <iostream>
        #include <iomanip> // 需要包含此头文件才能使用 setw
        
        int main() {
            std::cout << std::setw(10) << "Hello" << std::endl; // 输出右对齐，宽度为10
            std::cout << std::left << std::setw(10) << "World" << std::endl; // 左对齐，宽度为10
            std::cout << std::right << std::setw(10) << "C++" << std::endl; // 右对齐，宽度为10
            std::cout << std::setfill('*') << std::setw(10) << "Test"; // 使用'*'填充，宽度为10
        
            return 0;
        }
        /*
        输出：
             Hello
        World     
               C++
        ******Test
        */
        ```
        
        在这个例子中，`std::setw(10)` 设置了输出字段的宽度为10个字符。第一行输出是默认的右对齐方式，第二行通过 `std::left` 改变了对齐方式为左对齐，第三行再次设置为右对齐，最后一行不仅设置了宽度还通过 `std::setfill('*')` 更改了填充字符为星号(*)。
        
        需要注意的是，`setw` 对每个单独的输出操作只生效一次，这意味着如果你想要对多个输出应用相同的宽度设置，你需要在每次输出时都指定 `setw`。

???+ question "PTA 1.7"

    有代码如下：

    ```cpp linenums="1"
    int n;
    string s;
    cin>>n;
    getline(cin, s);
    cout<<s.size()<<endl;
    ```

    则在输入以下数据后得到结果是（     ）

    ```cpp linenums="1"
    1
    Hello World
    ```

    A. 11<br/>
    B. 0<br/>
    C. 5<br/>
    D. 12<br/>

    ??? success "答案"

        B

        ---

        `cin >> n` 会读取数字 `1`，但不会读取之后的换行符，因此之后的 `getline` 语句会读取到一个空行

        可以在两个语句之间添加一个 `getchar()` 来消除换行符，或者使用 `cin.ignore()`

        ```cpp linenums="1"
        int n;
        string s;
        cin >> n;
        getchar();
        getline(cin, s);
        cout << s.size() << endl;
        ```

???+ question "PTA 1.9"

    关于面向对象程序设计，面向对象程序设计主要考虑的是提高软件的 ___

    A. 可靠性<br/>
    B. 可移植性<br/>
    C. 可修改性<br/>
    D. 可重用性<br/>

    ??? success "答案"

        D

        ---

        **AI 解释：**

        面向对象程序设计（Object-Oriented Programming, OOP）主要考虑的是提高软件的 **可修改性** 和 **可重用性**。但是，如果必须在这四个选项中选择一个最符合的答案，那么应该是：

        D. 可重用性
        
        面向对象程序设计通过封装、继承和多态等特性，极大地提高了代码的可重用性。封装允许将数据和操作封装在类中，使得其他部分的代码可以通过调用这些类的方法来重用它们的功能；继承允许创建一个新的类从现有的类那里继承功能，从而可以重用和扩展已有的代码；多态允许使用统一接口来处理不同类型的对象，这也促进了代码的重用
        
        同时，OOP也改善了软件的可修改性（即维护性），因为良好的面向对象设计可以减少代码重复，使系统更易于理解和修改。但鉴于题目要求选择最主要的一个考量，通常强调的是OOP对于提高软件可重用性的贡献。然而，值得注意的是，正确答案可能会根据具体的上下文或教学材料的重点有所不同。在这里，我们选择了“可重用性”作为最佳答案，但它同样非常重视“可修改性”

???+ question "PTA 1.10"

    C++在C语言的注释方式基础上增加了（  ）
    
    A. 多行注释<br/>
    B. 单行注释<br/>
    C. 块注释<br/>
    D. 星号注释<br/>

    ??? success "答案"

        B

        ---

        **AI 解释：**

        **现代C语言标准（C99及之后）** 也支持单行注释（//）。但在C++诞生时（1980年代），C语言的标准（如C89/ANSI C）并不支持单行注释，单行注释是C++在C语言基础上新增的特性

        因此，从历史发展的角度来看，C++确实在C语言的注释方式基础上增加了单行注释。不过，随着C语言标准的更新，现代C语言也支持单行注释了
        
        如果题目是基于历史背景或早期C语言标准，那么答案仍然是 B. 单行注释。但如果题目是基于现代C语言（C99及之后），那么C和C++都支持单行注释和多行注释，题目本身就不太严谨了 -->