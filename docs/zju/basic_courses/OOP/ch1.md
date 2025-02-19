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
6. `size_t .find(const string& str, size_t pos = 0) const`：查找字符串的位置

---

string 的指针

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