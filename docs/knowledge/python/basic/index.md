# Python 编程基础

!!! tip "说明"

    本文档正在更新中……

!!! info "参考"

    [美]Al Sweigart.Python编程快速上手:让繁琐工作自动化(第2版)[M].王海鹏,译.北京:人民邮电出版社,2021.

其他推荐书目：

[美]Eric Matthes.Python编程:从入门到实践(第3版)[M].袁国忠,译.北京:人民邮电出版社,2023.

## 教程

[0 Python 环境及编辑器](./ch0.md)<br/>
[1 Python 基础](./ch1.md)<br/>
[2 控制流](./ch2.md)<br/>
[3 函数](./ch3.md)<br/>
[4 列表](./ch4.md)<br/>
[5 字典和结构化数据](./ch5.md)

## Python 规则

### 命名规则

Python 遵循 PEP 8 风格指南中的命名约定

1. 变量命名：
      1. 使用小写字母，单词间用下划线 `_` 分隔
      2. 避免单字符。除非是临时变量或在非常小的作用域中
2. 常量命名：全大写字母，单词间用下划线 `_` 分隔
3. 函数命名：使用小写字母，单词间用下划线 `_` 分隔
4. 类命名：驼峰命名法（PascalCase）。每个单词首字母大写，不使用下划线
5. 方法命名：使用小写字母，单词间用下划线 `_` 分隔
6. 模块命名：简短小写字母。尽可能使用简短的小写名称，可以使用下划线
7. 包命名：简短小写字母，与模块命名类似，但不建议使用下划线
8. 特殊命名约定：
      1. 单下划线前缀：表示"内部使用"的非公共 API（私有成员）
      2. 双下划线前缀：用于名称修饰（name mangling）
      3. 前后双下划线：特殊方法或属性（魔法方法）
9. 避免使用的名称：
      1. 避免使用小写字母 `l`、大写字母 `O` 和大写字母 `I` 作为单字符变量名
      2. 避免使用 Python 关键字和内置函数名作为变量名
10. 命名长度：
    1. 保持名称足够长以描述其用途，但不要过长
    2. 通常 1-3 个单词为宜

### 格式规则

#### 注释格式

##### 单行注释

以 `#` 开头，后接一个空格，注释与代码在同一行或单独一行

```python linenums="1"
# 这是单行注释
x = 10  # 也可以写在代码尾部（代码尾部后加 2 个空格，再加 # 写注释）
```

##### 多行注释

用连续的 `#` 号，每行对齐

```python linenums="1"
# 这是多行注释的第一行
# 这是第二行
```

函数/类注释（Docstring）：使用三引号 `"""` 或 `'''`，遵循 PEP 257。首行简要描述，空一行后写详细说明（如参数、返回值）

有不同的主流注释风格

=== "reStructuredText"

    ```python linenums="1"
    def add(a, b):
        """
        Calculate the sum of two numbers.
    
        :param a: First number.
        :param b: Second number.
        :return: Sum of a and b.
        """
        return a + b
    ```

=== "Google"

    ```python linenums="1"
    def add(a, b):
        """Calculate the sum of two numbers.
    
        Args:
            a (int): First number.
            b (int): Second number.
    
        Returns:
            int: Sum of a and b.
        """
        return a + b
    ```

=== "NumPy"

    ```python linenums="1"
    def add(a, b):
        """Calculate the sum of two numbers.
    
        Parameters
        ----------
        a : int
            First number.
        b : int
            Second number.
    
        Returns
        -------
        int
            Sum of a and b.
        """
        return a + b
    ```

#### `import` 语句格式

1.按标准库、第三方库、本地库分组，每组之间空一行，按字母顺序排列

```python linenums="1"
# 标准库
import os
import sys

# 第三方库
import numpy as np
import pandas as pd

# 本地模块
from my_module import my_function
```

2.避免一行导入多个模块

```python linenums="1"
# 错误写法
import os, sys

# 正确写法
import os
import sys
```

3.避免通配符导入：禁用 `from module import *`（除非在 `__init__.py` 中）

#### 缩进与换行

- 缩进：用 4 个空格（非制表符）
- 行宽：每行不超过 79 字符（PEP 8），可扩展到 88（Black 等格式化工具）
- 换行时使用反斜杠 `\` 或括号对齐

```python linenums="1"
# 换行示例
long_string = ("This is a very long string "
               "that spans multiple lines.")
```

#### 空格与运算符

1.运算符两侧加空格

```python linenums="1"
x = 1 + 2  # 正确
x=1+2      # 错误
```

2.函数参数逗号后加空格

```python linenums="1"
def func(a, b, c):  # 正确
def func(a,b,c):    # 错误
```

#### 空行

##### 文件顶部

- 文件开头不需要空行（除非有 Shebang）
- Shebang 后应有 1 个空行

```python linenums="1"
#!/usr/bin/env python3
# 这里空一行

import os
import sys
```

##### `import` 语句

1. 标准库 `import` 和第三方库 `import` 之间：1 个空行、
2. 第三方库 `import` 和本地应用/库 `import` 之间：1 个空行
3. `import` 块和后续代码之间：2 个空行

```python linenums="1"
import os
import sys
# 这里空一行

import django
import flask
# 这里空一行

from myapp import utils
# 这里空两行


def main():
    pass
```

##### 函数定义

1. 函数定义前后：2 个空行
2. 函数内部逻辑块之间：1 个空行

```python linenums="1"
def function_one():
    pass
# 这里空两行


def function_two():
    var = 1
    # 这里空一行

    if var:
        print(var)
```

##### 类定义

1. 类定义前后：2 个空行
2. 类方法之间：1 个空行

```python linenums="1"
class MyClass:
    def method_one(self):
        pass
    # 这里空一行
    
    def method_two(self):
        pass
# 这里空两行


def another_function():
    pass
```

##### 方法内部

1. 方法内部逻辑块之间：1 个空行
2. 不要滥用空行，仅在明显分隔逻辑块时使用

```python linenums="1"
def process_data(data):
    # 数据清洗
    cleaned = clean(data)
    # 这里空一行
    
    # 数据分析
    result = analyze(cleaned)
    
    return result
```

##### 特殊情况

1. 类中的 `@classmethod`、`@staticmethod` 和 `@property` 装饰器之间：1 个空行
2. 同一组的多个相关单行函数/方法之间可以减少到 1 个空行

```python linenums="1"
class Calculator:
    @staticmethod
    def add(a, b):
        return a + b
    # 这里空一行
    
    @staticmethod
    def subtract(a, b):
        return a - b
```

#### 其他规则

1. 避免冗余代码：如无意义的括号或重复逻辑
2. 字符串引号：统一用 `"` 或 `'`（PEP 8 无强制规定，但项目内需一致）
3. 文件编码：UTF-8（Python 3 默认）