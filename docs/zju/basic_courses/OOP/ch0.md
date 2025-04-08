# 0 Introduction

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    1. 本文档仅涉及部分内容，仅可用于复习重点知识

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

### 3.1 命名规则

1. 有意义：名称应清晰表达其用途
2. 避免缩写：除非是广泛认可的缩写（如 max、min、idx）
3. 避免下划线开头：`_` 开头的名称可能保留给编译器/标准库

#### 3.1.1 变量和函数

1.小驼峰式（camelCase）

```cpp linenums="1"
int studentCount;
void calculateTotalPrice();
```

2.蛇形命名（snake_case）

```cpp linenums="1"
int student_count;
void calculate_total_price();
```

#### 3.1.2 类、结构体和枚举

大驼峰式（PascalCase）

```cpp linenums="1"
class StudentRecord;
struct UserInfo;
enum class ColorPalette;
```

#### 3.1.3 常量和宏

全大写 + 下划线

```cpp linenums="1"
const int MAX_BUFFER_SIZE = 1024;
#define MIN(a,b) ((a)<(b)?(a):(b))  // 尽量避免使用宏
```

#### 3.1.4 私有成员变量

```cpp linenums="1"
class MyClass {
private:
    int m_count;       // 'm_' 前缀
    std::string name_; // '_' 后缀
};
```

#### 3.1.5 特定类型命名

##### 布尔变量

以 is、has、can 等开头

```cpp linenums="1"
bool isVisible;
bool hasPermission;
```

##### 集合

使用复数形式或 List、Array 等后缀

```cpp linenums="1"
std::vector<int> students;
std::list<Employee> employeeList;
```

### 3.2 格式规则

#### 3.2.1 缩进

使用 4 个空格或 1 个制表符（项目内保持一致）

花括号风格：

```cpp linenums="1"
// K&R 风格（推荐）
void func() {
    // ...
}

// 或 Allman 风格
void func()
{
    // ...
}
```

#### 3.2.2 空格

1.运算符周围

```cpp linenums="1"
int sum = a + b;  // 不是 a+b
```

2.逗号、分号后

```cpp linenums="1"
for (int i = 0; i < 10; ++i)
```

3.函数参数列表

```cpp linenums="1"
void func(int a, float b, const std::string& c)
```

#### 3.2.3 行长度

通常限制为 80 或 120 字符，视项目而定

#### 3.2.4 指针和引用

1.星号/与号紧贴类型（更强调类型）

```cpp linenums="1"
int* ptr;
const std::string& str;
```

2.或者紧贴变量名（更强调变量）

```cpp linenums="1"
int *ptr;
const std::string &str;
```

#### 3.2.5 头文件保护

```cpp linenums="1"
#ifndef FILENAME_H
#define FILENAME_H
// ...
#endif
```

现代方式：

```cpp linenums="1"
#pragma once
```

#### 3.2.6 其他

1. 避免使用全局变量
2. 类成员函数顺序：
      - public → protected → private
      - 构造函数/析构函数 → 普通成员函数 → 数据成员
3. 包含顺序：
      1. 相关头文件（当前 `.cpp` 文件对应的 `.h` 文件）
      2. C 标准库
      3. C++ 标准库
      4. 其他库
      5. 项目本地头文件
