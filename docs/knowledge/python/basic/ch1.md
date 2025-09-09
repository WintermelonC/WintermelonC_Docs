# 1 Python 基础

!!! info "说明"

    本文档为个人整理的复习概要，内容侧重重点提炼而非详细讲解，不适合零基础的同学

<!-- !!! tip "说明"

    本文档正在更新中…… -->

## 1.1 表达式

```python
>>> 2 + 2
4
```

没有操作符的单个值也被认为是一个表达式，尽管它求值的结果就是它自己

### 1.1.1 操作符

| 操作符 | 操作 | 例子 | 求值为 |
| :--: | :--: | :--: | :--: |
| `**` | 指数 | `2 ** 3` | 8 |
| `%` | 取模 | `22 % 8` | 6 |
| `//` | 整除 | `22 // 8` | 2 |
| `/` | 除法 | `22 / 8` | 2.75 |
| `*` | 乘法 | `3 * 5` | 15 |
| `-` | 减法 | `5 - 2` | 3 |
| `+` | 加法 | `2 + 2` | 4 |

> Python 数学操作符，优先级从高到低

Python 数学操作符的“操作顺序”（也称为“优先级”）与数学中类似。可以使用括号来改变通常的优先级。运算符和值之间的空格对于 Python 无关紧要（行首的缩进除外），但是惯例是保留一个空格

## 1.2 常见数据类型

“数据类型”是一类值，每个值都只属于一种数据类型

| 数据类型 | 例子 |
| :--: | :--: |
| 整型（int） | `-2` `-1` `0` |
| 浮点型（float）| `-1.25` `-1.0` `0.0` |
| 字符串（strs） | `'a'` `'11'` `'Hello !'` |

> 常见数据类型

Python 程序也可以有文本值，称为“字符串”（strs）。总是用单引号 `'` 包围住字符串，这样 Python 就能判断字符串的开始和结束。甚至可以有没有字符的字符串，称为“空字符串”或“空串”

## 1.3 字符串连接和复制

```python
>>> 'Alice' + 'Bob'
'AliceBob'
>>> 'Alice' + 42
# TypeError: can only concatenate str (not "int") to str
```

`*` 操作符用于一个字符串值和一个整型值，它就变成了“字符串复制”操作符

```python
>>> 'Alice' * 5
'AliceAliceAliceAliceAlice'
>>> 'Alice' * 'Bob'
# TypeError: can't multiply sequence by non-int of type 'str'
>>> 'Alice' * 5.0
# TypeError: can't multiply sequence by non-int of type 'float'
```

## 1.4 保存值到变量

### 1.4.1 赋值语句

```python
>>> spam = 40  # 第一次存入一个值，变量就被“初始化”（或创建）
>>> spam
40
>>> eggs = 2
>>> spam + eggs  # 此后，可以在表达式中使用它，以及其他变量和值
42
>>> spam + eggs + spam
82
>>> spam = spam + 2  # 如果变量被赋了一个新值，老值就被忘记了，称为“覆写”该变量
>>> spam
42
>>> spam = 'Hello'
>>> spam
'Hello'
```

### 1.4.2 变量名

你可以给变量取任何名字，只要它遵守以下 3 条规则

1. 只能是一个词，不带空格
2. 只能包含字母、数字和下划线 `_` 字符
3. 不能以数字开头

| 有效的变量名 | 无效的变量名 |
| :--: | :--: |
| `current_balance` | `current-balance`（不允许短横线） |
| `currentBalance` | `current balance`（不允许空格） |
| `account4` | `4account`（不允许数字开头） |
| `_42` | `42` |
| `TOTAL_SUM` | `TOTAL_$UM`（不允许 `$` 这样的特殊字符） |
| `hello` | `'hello'`（不允许 `'` 这样的特殊字符） | 

==变量名是区分大小写的。== `spam` `Spam` `SPAM` 是 3 个不同的变量。变量用小写字母开头是 Python 的惯例

## 1.5 一段简单的程序

```python linenums="1"
# This program says hello and asks for my name.

print('Hello, world!')
print('What is your name?')
my_name = input()
print('Nice to meet you, ' + my_name)
print('The length of your name is:')
print(len(my_name))
print('What is your age?')
my_age = input()
print('You will be ' + str(int(my_age) + 1) + ' in a year.')
```

```python title="输出" linenums="1"
Hello, world!
What is your name?
Wintermelon
Nice to meet you, Wintermelon
The length of your name is:
11
What is your age?
18
You will be 19 in a year.
```

Python 解释器一行一行的执行代码

### 1.5.1 注释

```python
# This program says hello and asks for my name.
```

有时，在测试代码时，会在一行代码前面加上 `#`，临时删除这行代码，这称为“注释掉”代码

在一段代码的末尾添加注释时，格式为：两个空格 + # + 一个空格 + 注释

```python
print()  # 添加注释
```

```python title="多行注释"
"""
多行注释
多行注释
多行注释一般可见于函数、类等，用于解释函数、类等的形式参数的含义
"""
```

### 1.5.2 `print()` 函数

```python
print('Hello, world!')
```

```python
print()  # 可以使用 print() 来输出一个空行
```

### 1.5.3 `input()` 函数

```python
my_name = input()
```

`input()` 函数内其实也可以有参数，例如可以把这两行缩减成一行

<div class="grid" markdown>

```python
print('What is your name?')
my_name = input()
```

```python
my_name = input('What is your name?\n')
```

</div>

### 1.5.4 `len()` 函数

该函数返回参数的长度。若传入字符串，则返回的就是字符串字符的个数

```python
print('The length of your name is:')
print(len(my_name))
```

```python
>>> len('')
0
>>> len('hello')
5
```

### 1.5.5 `str()` `int()` `float()` 函数

```python
>>> str(29)
'29'
>>> print('I am ' + 29 + ' years old.')
# 报错
>>> print('I am ' + str(29) + ' years old.')
I am 29 years old.
```

```python
>>> int(1.25)
1
>>> int(1.9)
1  # 不是我们一般情况下认为的四舍五入哦
>>> float('3.14')
3.14
>>> float(10)
10.0
```

`input()` 函数返回的是一个字符串

```python
>>> spam = input()
101
>>> spam
'101'
```

可以通过这些函数来转换变量类型，以达到特定目的

```python
>>> spam = int(spam)
>>> spam
101
>>> spam * 10 / 5
202.0
```

```python
my_age = input()
print('You will be ' + str(int(my_age) + 1) + ' in a year.')
```

可以看到，上述程序通过灵活运用这些函数，达到显示正确字符串的目的

但其实有个更方便的写法：

```python
print(f'You will be {int(my_age) + 1} in a year.')
```

称为 f 字符串，用 `{}` 标明被替换的字段

!!! tip "文本和数字相等判断"

    虽然数字的字符串值被认为与整型值和浮点型值完全不同，但整型值可以与浮点型值相等：

    ```python
    >>> 42 == '42'  # == 为比较操作符，两边相等返回 True，否则返回 False
    False  # 因为整型值和字符串是不同的
    >>> 42 == 42.0
    True  # 整型值和浮点数值都是数字
    >>> 42 == 0042.0000
    True
    ```
