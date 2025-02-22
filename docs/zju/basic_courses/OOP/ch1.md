# 1 Using Objects

<!-- !!! tip "说明"

    此文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1.1 string

string 在 C++ 中是一个 class，使用前添加头文件 `# include <string>`

```cpp linenums="1"
# include <string>
// string 的定义
string str;
// string 的初始化
string str = "Hello";
string str("Hello");
string str{"Hello"};
// string 的赋值
string str1;
string str2 = "Hello";
str1 = str2;
// string 的输入和输出
cin >> str;
cout << str;
// 读入一整行，包括空格
string line_var;
getline(cin, line_var)
```

1. cin 是预定义的对象
2. cin 也不能读取空格

### 1.1.1 string 方法

string 可以被看作 array 使用

```cpp linenums="1"
# include <string>
string s = "Hello";
s[0] = 'J';

// string 的拼接
string str3;
str3 = str1 + str2;  // 直接使用 +
str1 += str2;
str1 += 'lalala';
```

---

`.length()` 获取 string 的长度

```cpp linenums="1"
string str;
str.length();
```

1. `.substr(int pos, int len)`：获取子字符串
2. `.insert(size_t pos, const string& s)`：插入字符串
3. `.erase(size_t pos = 0, size_t len = npos)`：删除字符串的部分内容
4. `.append(const string& str)`：追加字符串
5. `.replace(size_t pos, size_t len, const string& str)`：替换字符串的部分内容
6. `size_t .find(const string& str, size_t pos = 0) const`：查找字符串的位置。未找到返回 `std::string::npos`

!!! tip ".insert()"

    `std::string::insert` 是 C++ 标准库中用于在 `std::string` 对象中插入字符或字符串的方法。它有几种不同的重载形式，允许你以不同的方式指定插入位置和内容。以下是几种常见的使用方式：
    
    **1.在指定位置插入单个字符**
    
    ```cpp
    string& insert(size_t pos, char ch);
    ```

    这会在位置 `pos` 插入一个字符 `ch`
    
    **2.在指定位置插入另一个字符串**
    
    ```cpp
    string& insert(size_t pos, const string& str);
    ```

    这会在位置 `pos` 插入整个字符串 `str`
    
    **3.在指定位置插入另一字符串的一部分**
    
    ```cpp
    string& insert(size_t pos, const string& str, size_t subpos, size_t sublen);
    ```

    这会在位置 `pos` 插入从 `subpos` 开始的 `sublen` 个字符的子串
    
    **4.在指定位置插入多个相同字符**
    
    ```cpp
    string& insert(size_t pos, size_t n, char ch);
    ```

    这会在位置 `pos` 插入 `n` 次字符 `ch`

---

### 1.1.2 string 指针

```cpp linenums="1"
string s = "Hello";
string* ps = &s;
// 使用指针
(*ps).length();
ps -> length();
```

- `string s`：s 被创建并被初始化
- `string *ps`：ps 指向什么未知

```cpp linenums="1"
string s1, s2;
s1 = s2;  // s2 的值赋值给 s1
string *ps1, *ps2;
ps1 = ps2;  // 之后，ps1 也指向 ps2 所指的那个变量
```

## 1.2 Object

存储在 string 变量里的那个东西就是一个 object，C++ 中任何一个类型都是一个 object

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

        可以在两个语句之间添加一个 `getchar()` 来消除换行符

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