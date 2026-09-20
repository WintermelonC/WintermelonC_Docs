# 字符串库

## 1 `std::string`

[C++ string](../../../zju/basic_courses/OOP/ch1.md){:target="_blank"}

`std::string` 是 C++ 标准库中管理字符串的类，定义于 `<string>` 头文件。它本质是 `std::basic_string<char>` 的别名（`std::wstring` 对应 `wchar_t`）。相比 C 风格字符数组，`std::string` 自动管理内存、支持动态增长，是 C++ 中处理字符串的首选

访问元素：

| 方法 | 说明 |
|---|---|
| `s[i]` | 下标访问，**不检查越界**（越界是未定义行为） |
| `s.at(i)` | 下标访问，**越界抛 `std::out_of_range`** |
| `s.front()` / `s.back()` | 首 / 尾字符 |
| `s.data()` / `s.c_str()` | 返回底层字符数组指针 |

容量管理：

| 方法 | 说明 |
|---|---|
| `size()` / `length()` | 字符串长度（两者等价） |
| `empty()` | 是否为空 |
| `capacity()` | 当前分配的容量（≥ size） |
| `reserve(n)` | 预分配容量，避免反复扩容 |
| `shrink_to_fit()` | 请求释放多余容量 |
| `clear()` | 清空内容（size=0，capacity 不变） |

!!! tip "小字符串优化（SSO）"

    这是 `std::string` 最重要的性能特性之一。对于 **短字符串**，`std::string` 不进行堆分配，而是直接把字符存在 **对象内部** 的缓冲区里：

    ```mermaid
    graph TD
        subgraph 短字符串_SSO
        A["std::string 对象<br/>(栈上)"] --> B["内部缓冲区<br/>直接存字符"]
        end
        subgraph 长字符串
        C["std::string 对象<br/>(栈上)"] --> D["指针 → 堆内存"]
        end
    ```
    
    - 短字符串（通常 ≤ 15 字节，GCC/MSVC；Clang 不同）：零堆分配，创建/拷贝极快
    - 长字符串：才在堆上分配
    - 所以 `std::string` 的 `sizeof` 通常是 24 或 32 字节（内含指针 + 长度 + 内部缓冲区），而不是 8 字节

    !!! tip "为什么 SSO 很重要"
    
        大量短字符串（如解析日志、JSON 键名）如果每次都堆分配，性能会非常差。SSO 让绝大多数短字符串的开销接近一个栈上数组

修改操作：

```cpp linenums="1"
std::string s = "hello";

s += " world";           // 追加："hello world"
s.append("!");           // 追加："hello world!"
s.push_back('?');        // 追加单个字符："hello world!?"
s.insert(5, " dear");    // 在下标 5 处插入："hello dear world!?"
s.erase(5, 5);           // 从下标 5 删 5 个字符："hello world!?"
s.replace(5, 5, "C++");  // 替换下标 5 起的 5 个字符："hello C++!?"
s.pop_back();            // 删除尾字符："hello C++!?"
s.clear();               // 清空：""
```

查找操作：

```cpp linenums="1"
std::string s = "hello world, hello C++";

s.find("hello");         // 0（第一个匹配位置）
s.find("hello", 1);      // 13（从下标 1 开始找）
s.rfind("hello");        // 13（从右往左找）
s.find_first_of("aeiou"); // 1（第一个元音位置）
s.find_last_of("aeiou");  // 最后一个元音位置
s.find_first_not_of("helo "); // 第一个不属于集合的位置

// 找不到返回 std::string::npos（一个极大值，通常 -1 转成 size_t）
if (s.find("xyz") == std::string::npos) {
    // 未找到
}
```

子串与比较：

```cpp linenums="1"
std::string s = "hello world";

std::string sub = s.substr(6, 5);   // "world"（从 6 开始取 5 个）
std::string sub2 = s.substr(6);     // "world"（取到末尾）

// 比较：可以直接用运算符
bool eq = (s == "hello world");     // true
bool lt = (s < "zzz");              // true（字典序）

// compare 返回负数/0/正数
int r = s.compare("hello");         // 正数（"hello world" > "hello"）
```

数值与字符串互转：

C++11 起提供了便捷的转换函数：

```cpp linenums="1"
// 字符串 → 数值
int    i = std::stoi("42");
long   l = std::stol("42");
double d = std::stod("3.14");
float  f = std::stof("2.5");
long long ll = std::stoll("9223372036854775807");

// 可指定起始位置和进制
size_t pos;
int hex = std::stoi("1A", &pos, 16);   // 按 16 进制解析 → 26

// 数值 → 字符串
std::string a = std::to_string(42);        // "42"
std::string b = std::to_string(3.14);      // "3.140000"
```

与 C 字符串互操作：

```cpp linenums="1"
std::string s = "hello";

const char* p = s.c_str();   // 返回以 '\0' 结尾的 C 字符串
// 注意：p 的生命周期随 s 变化，s 修改后 p 可能失效

const char* q = s.data();    // C++17 起同样保证 '\0' 结尾

// C 字符串 → string
const char* c = "world";
std::string t(c);            // 直接构造
```

!!! warning "`c_str()` 的生命周期"

    `c_str()` 返回的指针 **随 `std::string` 的修改而失效**。不要长期保存它，更不要这样写：
    
    ```cpp linenums="1"
    const char* p = (s1 + s2).c_str();  // ✗ 悬垂指针！临时对象已销毁
    ```
    
    如果需要保存，应先拷贝到 `std::string` 里

遍历方式：

```cpp linenums="1"
std::string s = "hello";

// ① 下标遍历
for (size_t i = 0; i < s.size(); ++i)
    std::cout << s[i];

// ② 范围 for
for (char c : s)
    std::cout << c;

// ③ 迭代器
for (auto it = s.begin(); it != s.end(); ++it)
    std::cout << *it;

// ④ 修改时用引用
for (char& c : s)
    c = std::toupper(c);   // 全部转大写
```

常见陷阱：

```cpp linenums="1"
// 陷阱 1：下标越界不检查
std::string s = "hi";
s[100] = 'x';     // ✗ 未定义行为（at 才抛异常）

// 陷阱 2：find 找不到返回 npos，不能直接当 int 用
if (s.find("z")) { }   // ✗ 错误！npos 是极大正数，恒为真
// 正确：if (s.find("z") != std::string::npos)

// 陷阱 3：c_str 悬垂
const char* p = s.c_str();
s += "longer";     // p 现在可能失效

// 陷阱 4：性能——循环内频繁 + 拼接
std::string result;
for (int i = 0; i < 100000; ++i)
    result += std::to_string(i);   // 可能多次扩容
// 优化：先 reserve
result.reserve(100000 * 4);
```

性能要点：

1. **短字符串优先用 `std::string`**：SSO 下零堆分配
2. **预先 `reserve`**：已知最终大小时避免反复扩容
3. **用 `+=` 而非 `+` 链式拼接**：减少临时对象
4. **传参用 `const std::string&` 或 `std::string_view`**：避免不必要的拷贝
5. **大量查找用 `std::string_view`（C++17）**：避免为子串创建新对象

```cpp linenums="1"
#include <string_view>

// string_view：只读视图，不拥有数据，零拷贝
void process(std::string_view sv) {
    // 可 find、substr，但不拥有内存，需确保底层字符串存活
}
```

## 2 `std::string_view`

`std::string_view`（C++17，定义于 `<string_view>`）是一个 **只读的字符串视图**——它不拥有数据，只是"借用"一段已存在的字符串，用两个成员记录这段字符串的 **指针** 和 **长度**。它的核心价值是 **零拷贝**：查看、截取、查找子串都不需要复制字符

```cpp linenums="1"
// 问题：这个函数只想"读"字符串，却不得不创建 std::string 拷贝
void process(const std::string& s) {
    // ...
}

process("hello");                    // ① 字符串字面量要先转成临时 std::string
std::string s2 = s.substr(5, 10);    // ② substr 会拷贝出一段新字符串
```

`std::string` 是 **拥有** 字符数据的类，构造它需要分配内存并拷贝。而很多场景（解析、查找、传参）只需要"看一眼"字符串，根本不需要拥有它。`string_view` 就是为此设计：

```cpp linenums="1"
void process(std::string_view sv) {
    // 不拷贝，只是"借"了一段字符串
}

process("hello");            // 字面量直接构造，零拷贝
auto sub = sv.substr(5, 10); // substr 也只是"视图"上的切片，零拷贝
```

### 2.1 底层实现原理

`string_view` 本质就是两个成员：**一个指针 + 一个长度**，它 **不拥有** 指向的内存，也不负责释放

```text
std::string_view 对象（通常 16 字节，64 位系统）：
┌──────────────────────┐
│ const char* data_    │ ──→ 指向字符串的某个位置（不拥有）
├──────────────────────┤
│ size_t size_         │     字符串长度
└──────────────────────┘
```

```cpp linenums="1"
std::string s = "hello world";
std::string_view sv(s.data(), 5);   // 指向 s 的 "hello"

std::cout << sizeof(sv);            // 16（指针 8 + 长度 8）
```

关键点：

1. **不拥有数据**：`data_` 只是借用，析构时 **不会** `delete` 任何东西
2. **不一定以 `'\0'` 结尾**：它靠 `size_` 定界，底层字符后面可能没有空字符
3. **`substr` 是 $O(1)$**：只移动指针、缩小长度，完全不拷贝字符

!!! question "`substr` 为什么是 $O(1)$"

    普通 `std::string::substr` 会 `new` 一段内存并拷贝字符（$O(n)$）；`string_view::substr` 只是构造一个新的"指针 + 长度"对：

    ```cpp linenums="1"
    std::string_view sv = "hello world";
    
    // substr：不拷贝！只是 data_ 偏移、size_ 缩短
    auto sub = sv.substr(6, 5);   // 指向原字符串第 6 个字符，长度 5
    
    // 等价于底层：
    // sub.data_ = sv.data_ + 6;
    // sub.size_ = 5;
    ```
    
    ```text
    原 string_view：  data_ ──→ h e l l o   w o r l d
                              ↑           ↑
                              size_=11
    
    substr(6,5) 后：        data_ ──────→ w o r l d
                                         ↑
                                         size_=5
    ```

!!! tip "`remove_prefix` / `remove_suffix`"

    ```cpp linenums="1"
    std::string_view sv = "hello world";
    
    sv.remove_prefix(6);   // 变成 "world"：data_ 后移 6，size_ -= 6
    sv.remove_suffix(2);   // 变成 "wor"：size_ -= 2
    ```

    同样只是改指针和长度，零拷贝

### 2.2 生命周期陷阱：不拥有数据

这是 `string_view` 最大的坑——**它指向的数据必须比 string_view 本身活得久**：

```cpp linenums="1"
// ✗ 危险：悬垂的 string_view
std::string_view make_view() {
    std::string s = "hello";
    return std::string_view(s);   // s 在函数返回时销毁，返回的 view 悬空！
}

// ✗ 危险：临时 string 被立刻销毁
std::string_view sv = std::string("temp");   // 临时对象已死，sv 悬空
// 正确：std::string s = "temp"; std::string_view sv = s;
```

```cpp linenums="1"
// ✗ 危险：string 扩容后，原来的 view 失效
std::string s = "hello";
std::string_view sv = s;   // sv 指向 s 的内部缓冲区
s += " world, a very long string...";   // s 可能重新分配内存
std::cout << sv;           // ✗ 悬垂！sv 指向的旧缓冲区已释放
```

### 2.3 与其他字符串类型的关系

| 类型 | 拥有数据吗 | 可修改吗 | 保证 `'\0'` 结尾 | 拷贝开销 |
|---|---|---|---|---|
| `const char*` | 否 | 否 | 通常（C 字符串） | 无 |
| `std::string` | **是** | 是 | ✓ | 高 |
| `std::string_view` | 否 | 否 | ✗ 不保证 | **无** |

```cpp linenums="1"
std::string s = "hello";
std::string_view sv = s;        // ✓ 隐式转换（string → string_view，零开销）

// std::string s2 = sv;          // ✗ 不能隐式转回（string_view 可能不以 \0 结尾）
std::string s3 = std::string(sv);   // ✓ 必须显式，因为要拷贝字符
```

!!! question "什么时候用 / 不用"

    **适合用 `string_view`**：

    ```cpp linenums="1"
    // ① 函数参数：只想读字符串，不想拷贝
    void parse(std::string_view json);
    
    // ② 字符串解析：不断切分，零拷贝
    std::string_view csv = "a,b,c";
    while (!csv.empty()) {
        auto comma = csv.find(',');
        auto field = csv.substr(0, comma == csv.npos ? csv.size() : comma);
        // 处理 field...
        csv.remove_prefix(field.size() + (comma != csv.npos));
    }
    
    // ③ 大量子串操作
    auto key = path.substr(0, slash);   // O(1)
    ```
    
    **不适合用 `string_view`**（必须拥有数据时）：

    ```cpp linenums="1"
    // ① 需要长期保存字符串 → 用 string
    std::string cache = fetchFromNetwork();   // 拥有数据
    
    // ② 需要修改字符串 → 用 string
    // string_view 是只读的
    
    // ③ 需要传递给要求 C 字符串（const char*）的 API
    // string_view 不保证 \0 结尾，要先转 string 或用 c_str 语义
    void legacy(const char* cstr);
    // legacy(sv.data());  // ✗ 不安全！sv 可能不以 \0 结尾
    ```

## 3 字符转换与分类库 `<cctype>`

`<cctype>` 是 C 语言 `<ctype.h>` 的 C++ 版本，提供 **字符分类**（判断字符类型）和 **字符转换**（大小写转换）两类函数。这些函数在默认 C locale 下只处理 **ASCII 字符**，不适用于 Unicode / 多字节字符

### 3.1 字符分类函数

所有分类函数：参数为 `int`（实际传字符），若满足条件返回 **非 0**（通常 1），否则返回 **0**

| 函数 | 判断内容 | 说明 |
|---|---|---|
| `isalpha(c)` | 字母 | `A-Z`、`a-z` |
| `isdigit(c)` | 数字 | `0-9` |
| `isalnum(c)` | 字母或数字 | `isalpha \|\| isdigit` |
| `isupper(c)` | 大写字母 | `A-Z` |
| `islower(c)` | 小写字母 | `a-z` |
| `isspace(c)` | 空白字符 | 空格、`\t`、`\n`、`\v`、`\f`、`\r` |
| `isblank(c)` | 空格/制表符 | C++11，仅空格和 `\t` |
| `ispunct(c)` | 标点符号 | 可打印但不是字母数字空格 |
| `isgraph(c)` | 图形字符 | 可打印且非空格 |
| `isprint(c)` | 可打印字符 | 含空格（`isgraph` + 空格） |
| `isxdigit(c)` | 十六进制数字 | `0-9`、`a-f`、`A-F` |
| `iscntrl(c)` | 控制字符 | `0x00-0x1F`、`0x7F` |

### 3.2 字符转换函数

| 函数 | 作用 | 说明 |
|---|---|---|
| `toupper(c)` | 转大写 | 小写字母转大写，非小写字母原样返回 |
| `tolower(c)` | 转小写 | 大写字母转小写，非大写字母原样返回 |

### 3.3 重要注意事项

1. 参数必须转成 `unsigned char`：`<cctype>` 函数的参数类型是 `int`，**要求传入的值是 `unsigned char` 可表示的范围或 `EOF`**。直接传 `char` 有隐患——当 `char` 是有符号类型且字符的 ASCII 值 ≥ 128（如中文等多字节字符的某个字节）时，会变成负数，导致 **未定义行为**
2. 只处理 ASCII，不适用中文/Unicode：`isalpha('中')` 在默认 locale 下返回 0（不是字母）。判断中文字符、Unicode 字符应使用 `<locale>` 或 UTF-8 库（如 ICU）
3. 返回非 0，不一定是 1：这些函数只保证"真返回非 0，假返回 0"，不要把返回值当成 `1` 或 `true` 用：

```cpp linenums="1"
if (isalpha(ch) == true) { }   // ✗ 语义不严谨（虽然通常能工作）
if (isalpha(ch))         { }   // ✓ 正确用法
```
