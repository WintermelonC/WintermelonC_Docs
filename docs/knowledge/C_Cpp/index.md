# C/C++

## 工具

1. [CMake](./cmake.md)
2. [vcpkg](./vcpkg.md)
3. [Ninja](./ninja.md)

## C/C++ 规则

### 命名规则

1. 有意义：名称应清晰表达其用途
2. 避免缩写：除非是广泛认可的缩写（如 max、min、idx）
3. 避免下划线开头：`_` 开头的名称可能保留给编译器/标准库

#### 变量和函数

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

#### 类、结构体和枚举

大驼峰式（PascalCase）

```cpp linenums="1"
class StudentRecord;
struct UserInfo;
enum class ColorPalette;
```

#### 常量和宏

全大写 + 下划线

```cpp linenums="1"
const int MAX_BUFFER_SIZE = 1024;
#define MIN(a,b) ((a)<(b)?(a):(b))  // 尽量避免使用宏
```

#### 私有成员变量

前缀或后缀约定

```cpp linenums="1"
class MyClass {
private:
    int m_count;       // 'm_' 前缀
    std::string name_; // '_' 后缀
};
```

#### 特定类型命名

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

##### 迭代器

1.简单清晰的命名

- `it`：最常见的迭代器变量名，简洁且易于理解
- `iter`：`iterator` 的缩写，比 `it` 更明确

2.结合容器名称

`容器名 + It`：明确表示迭代器属于哪个容器

```cpp linenums="1"
auto vecIt = vec.begin();    // vector 的迭代器
auto mapIt = myMap.begin();  // map 的迭代器
```

3.范围循环中的迭代器

在 C++11 之后的基于范围的 `for` 循环中，直接使用元素类型（无需显式迭代器）：

```cpp linenums="1"
for (const auto& element : vec) {
    std::cout << element << " ";
}
```

---

1. 反向迭代器
      - `rit` 或 `reverseIt`：表示反向迭代器
2. 常量迭代器
      - `cit` 或 `constIt`：表示不可修改元素的迭代器
3. 多容器协作时的命名
      - 如果同时操作多个容器的迭代器，可以通过后缀区分

```cpp linenums="1"
auto srcIt = source.begin();
auto destIt = destination.begin();
```

### 格式规则

#### 缩进

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

#### 空格

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

#### 行长度

通常限制为 80 或 120 字符，视项目而定

#### 指针和引用

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

#### 头文件保护

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

#### 注释

##### 单行注释

```cpp linenums="1"
// 这是一个单行注释
int x = 5;  // 也可以放在代码行尾
```

##### 多行注释

C 风格

```cpp linenums="1"
/* 
 * 这是一个多行注释
 * 可以跨越多行
 */
```

##### 函数注释

函数注释有多种风格

=== "Doxygen（推荐）"

    ```cpp linenums="1"
    /**
     * @brief 计算两个数的和
     * 
     * @param a 第一个加数
     * @param b 第二个加数
     * @return int 两个参数的和
     * 
     * @note 这是一个简单的加法函数示例
     * @warning 不处理整数溢出
     */
    int add(int a, int b) {
        return a + b;
    }
    ```

=== "Qt"

    ```cpp linenums="1"
    /*!
     * \brief 计算两个数的和
     * \param a 第一个加数
     * \param b 第二个加数
     * \return 两个参数的和
     */
    int add(int a, int b) {
        return a + b;
    }
    ```

=== "简洁风格（适合简单函数）"

    ```cpp linenums="1"
    // 计算两个数的和，参数 a 和 b 为加数，返回它们的和
    int add(int a, int b) {
        return a + b;
    }
    ```

##### 类注释

```cpp linenums="1"
/**
 * @class MyClass
 * @brief 示例类说明
 * 
 * 这里是类的详细描述，可以包含多行。
 * 描述类的用途、设计思路等。
 */
class MyClass {
public:
    /**
     * @brief 构造函数
     * @param value 初始值
     */
    MyClass(int value);
    
    // ... 其他成员函数
};
```

##### 文件头注释

```cpp linenums="1"
/**
 * @file filename.cpp
 * @author 作者名
 * @date 创建日期
 * @brief 文件简要说明
 * 
 * 这里是文件的详细描述，可以包含多行。
 * 描述文件的主要内容、功能等。
 */
```

##### 其他

1. 公共 API 必须注释：所有公共函数、类、方法都应该有完整注释
2. 避免无意义注释：不要写“设置 x 的值”这样的废话
3. 注释要同步更新：代码修改时记得更新相关注释
4. 复杂逻辑必须注释：解释算法、特殊处理等
5. TODO/FIXME 注释：

```cpp linenums="1"
// TODO: 需要优化这个算法
// FIXME: 这里存在潜在的内存泄漏风险
```

#### 其他

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