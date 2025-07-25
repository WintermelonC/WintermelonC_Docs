# 2 控制流

<!-- !!! tip "说明"

    本文档正在更新中…… -->

## 2.1 布尔值

“布尔”（Boolean）数据类型只有两种值：`True` 和 `False`。在作为输入时，布尔值 `True` 和 `False` 不像字符串，两边没有引号

像其他值一样，布尔值也用在表达式中，并且可以保存在变量中

## 2.2 比较操作符

“比较操作符”（也称为“关系操作符”）比较两个值，求值为一个布尔值

| 操作符 | 含义 |
| :--: | :--: |
| `==` | 等于 |
| `!=` | 不等于 |
| `<` | 小于 |
| `>` | 大于 |
| `<=` | 小于等于 |
| `>=` | 大于等于 |

```python
>>> 42 == 42
True
>>> 42 == 99
False
>>> 2 != 3
True
>>> 2 != 2
False
>>> 'hello' == 'hello'
True
>>> 'hello' == 'Hello'
False
>>> 42 == 42.0
True
>>> 42 == '42'
False
```

`<` `>` `<=` `>=` 操作符仅用于整型和浮点型值：

```python
>>> 42 < 100
True
>>> 42 > 100
False
>>> count = 42
>>> count <= 42
True
```

## 2.3 布尔操作符

### 2.3.1 二元布尔操作符

`and` 和 `or` 操作符总是接收两个布尔值（或表达式），所以被称为“二元”操作符。如果两个布尔值都为 `True`，`and` 操作符就将表达式求值为 `True`；否则求值为 `False`

```python
>>> True and True
True
>>> False and True
False
```

| 表达式 | 求值为 |
| :--: | :--: |
| `True and True` | True |
| `True and False` | False |
| `False and True` | False |
| `False and False` | False |

> `and` 操作符真值表

只要有一个布尔值为真，`or` 操作符就将表达式求值为 `True`。如果都是 `False` 则求值为 `False`

| 表达式 | 求值为 |
| :--: | :--: |
| `True or True` | True |
| `True or False` | True |
| `False or True` | True |
| `False or False` | False |

> `or` 操作符真值表

### 2.3.2 `not` 操作符

`not` 操作符只作用于一个布尔值（或表达式），称为“一元”操作符。`not` 操作符求值为相反的布尔值

```python
>>> not not not True
False
```

| 表达式 | 求值为 |
| :--: | :--: |
| `not True` | False |
| `not False` | True |

> `not` 操作符真值表

## 2.4 混合布尔和比较操作符

```python
>>> (4 < 5) and (5 < 6)
True
>>> (4 < 5) and (9 < 6)
False
>>> (1 == 2) or (2 == 2)
True
```

计算机将先求值左边的表达式，然后求值右边的表达式。得到两个布尔值后，又将整个表达式再求值为一个布尔值

```python
>>> 2 + 2 == 4 and not 2 + 2 == 5 and 2 * 2 == 2 + 2
True
```

布尔操作符也有操作顺序。在所有算术和比较操作符求值后，Python 先求值 `not` 操作符，然后求值 `and` 操作符，最后求值 `or` 操作符。

算术操作符 -> 比较操作符 -> `not` -> `and` -> `or`

## 2.5 控制流的元素

控制流语句的开始部分通常是“条件”；接下来是一个代码块，称为“子句”

### 2.5.1 条件

条件总是求值为一个布尔值：`True` 或 `False`

### 2.5.2 代码块

一些代码行可以作为一组，放在“代码块”中。可以根据代码行的缩进判断代码块的开始和结束。代码块有以下 3 条规则：

1. 缩进增加时，代码块开始
2. 代码块可以包含其他代码块
3. 缩进减少为零，或与外围包围代码块对齐，代码块就结束了

```python linenums="1"
name = 'Mary'
password = 'swordfish'
if name == 'Mary':
    print('Hello, Mary')  # 第一个代码块开始处，包含后面所有的行
    if password == 'swordfish':
        print('Access granted.')  # 第二个代码块，只有一行
    else:
        print('Wrong password.')  # 第三个代码块，只有一行
```

## 2.6 程序执行

Python 一条一条从上往下执行代码。但是，并非所有的程序都是从上至下简单地执行。如果遇到一个带有控制流语句地程序，可能程序会根据条件跳过源代码，且有可能跳过整个子句

## 2.7 控制流语句

### 2.7.1 `if` 语句

最常见地控制流语句是 `if` 语句。`if` 语句的子句，将在语句的 条件为 `True` 时执行。如果条件为 `False`，将跳过子句

`if` 语句包含以下部分：

1. `if` 关键字
2. 条件
3. 冒号
4. 在下一行开始，缩进的代码块（称为 `if` 子句）

以下代码用于检查某人的名字是否为 Alice，假设此前曾为 `name` 赋值

```python linenums="1"
if name == 'Alice':
    print('Hi, Alice.')
```

所有控制流语句都以冒号结尾，后面跟着一个新的代码块（子句）

控制流可以用流程图来表示：

```mermaid
graph TD
A([开始]) --> B{name == 'Alice'}
B -->|真| C["print('Hi, Alice.')"]
B -->|假| D([结束])
C --> D
```

### 2.7.2 `else` 语句

`if` 语句后面有时候也可以跟着 `else` 语句。只有 `if` 语句的条件为 `False` 时，`else` 子句才会执行。`else` 语句不包含条件，`else` 语句包含以下部分：

1. `else` 关键字
2. 冒号
3. 在下一行开始，缩进的代码块（称为 `else` 子句）

```python linenums="1"
if name == 'Alice':
    print('Hi, Alice.')
else:
    print('Hello, stranger.')  # 在名字不是 Alice 时，发出不一样的问候
```

```mermaid
graph TD
A([开始]) --> B{name == 'Alice'}
B -->|真| C["print('Hi, Alice.')"]
B -->|假| E["print('Hello, stranger.')"]
C --> D([结束])
E --> D
```

### 2.7.3 `elif` 语句

有时候希望“许多”可能的子句中有一个被执行。`elif` 语句是“否则如果”，总是跟在 `if` 或另一条 `elif` 语句后面。它提供了另一个条件，仅在前面的条件为 `False` 时才检查该条件。`elif` 语句总是包含以下部分：

1. `elif` 关键字
2. 条件
3. 冒号
4. 在下一行开始，缩进的代码块（称为 `elif` 子句）

```python linenums="1"
if name == 'Alice':
    print('Hi, Alice.')
elif age < 12:
    print('You are not Alice, kiddo.')  # kiddo 意为“小朋友”
```

```mermaid
graph TD
A([开始]) --> B{name == 'Alice'}
B -->|真| C["print('Hi, Alice.')"]
B -->|假| E{age < 12}
C --> D([结束])
E -->|真| F["print('You are not Alice, kiddo.')"]
E -->|假| D
F --> D
```

如果有一系列的 `elif` 语句，仅有一条或零条子句被执行，一旦一个语句的条件为 `True`，会自动跳过剩下的 `elif` 子句

因此，`elif` 语句的次序很重要，例如：

<div class="grid" markdown>

```python linenums="1"
name = 'Carol'
age = 3000
if name == 'Alice':
    print('Hi, Alice.')
elif age < 12:
    print('You are not Alice, kiddo.')
elif age > 2000:  # 条件为真
    print('Unlike you, Alice is not an undead, immortal vampire.')  # 执行此行代码
elif age > 100:
    print('You are not Alice, grannie.')
```

```python linenums="1"
name = 'Carol'
age = 3000
if name == 'Alice':
    print('Hi, Alice.')
elif age < 12:
    print('You are not Alice, kiddo.')
elif age > 100:  # 条件为真
    print('You are not Alice, grannie.')  # 执行此行代码
elif age > 2000:
    print('Unlike you, Alice is not an undead, immortal vampire.')
```

</div>

当然，可以选择在最后的 `elif` 语句后面加上 `else` 语句。如果每个 `if` 和 `elif` 语句中的条件都为 `False`，就执行 `else` 子句

```python linenums="1"
name = 'Carol'
age = 3000
if name == 'Alice':
    print('Hi, Alice.')
elif age < 12:
    print('You are not Alice, kiddo.')
else:
    print('You are neither Alice nor a little kid.')
```

### 2.7.4 `while` 循环语句

利用 `while` 循环语句，可以让一个代码块一遍又一遍地执行。只要 `while` 循环语句的条件为 `True`，`while` 子句中的代码就会执行。`while` 循环语句总是包含以下部分：

1. `while` 关键字
2. 条件
3. 冒号
4. 从下一行开始，缩进的代码块（称为 `while` 子句）

`while` 循环语句看起来和 `if` 语句类似。不同之处是它们的行为，例如：

<div class="grid" markdown>

```python linenums="1"
spam = 0
if spam < 5:
    print('Hello, world.')
    spam = spam + 1
```

```python linenums="1"
spam = 0
while spam < 5:
    print('Hello, world.')
    spam = spam + 1
```

```mermaid
graph TD
A([开始]) --> B{spam < 5}
B -->|真| C["print('Hello, world.')"]
C --> E["spam = spam + 1"]
B -->|假| D([结束])
E --> D
```

```mermaid
graph TD
A([开始]) --> B{spam < 5}
B -->|真| C["print('Hello, world.')"]
C --> E["spam = spam + 1"]
B -->|假| D([结束])
E --> B
```

<div class="card" markdown>
`if` 语句的代码，如果条件为 `True`，就输出一次 "Hello, world."
</div>

<div class="card" markdown>
`while` 循环的代码则不同，会输出 5 次
</div>

</div>

在 `while` 循环中，条件总是在每次 “迭代” 开始时检查（也就是每次循环执行时）。如果条件为 `True`，子句就会执行，然后再次检查条件；当条件第一次为 `False` 时，就跳过 `while` 子句

---

> 以下内容开始摆烂（

### 2.7.5 恼人的循环

```python linenums="1"
name = ''
while name != 'your name':
    print('Please type your name.')
    name = input()
print('Thank you!')
```

### 2.7.6 `break` 语句

使用 `break` 语句来马上退出 `while` 子句

!!! tip "陷在无限循环中？"

    按下 ++ctrl+c++ 快捷键，可以停止程序

### 2.7.7 `continue` 语句

程序遇到 `continue` 语句，就会马上回到循环开始处，重新对循环条件求值

```python
while True:
    print('Who are you?')
    name = input()
    if name != 'Joe':
        continue
    print('Hello, Joe. What is the password? (It is a fish.)')
    password = input()
    if password == 'swordfish':
        break
print('Access granted.')
```

!!! tip "“类真”和“类假”的值"

    在用于条件时，`0`、`0.0` 和 `''`（空字符串）被认为是 `False`，其他值被认为是 `True`

    ```python linenums="1"
    name = ''
    while not name:  # 可以用 while not name != '' 替代
        print('Enter your name:')
        name = input()
    print('How many guests will you have?')
    num_guests = int(input())
    if num_guests:  # 可以用 if num_guests != 0 替代
        print('Be sure to have enough room for all your guests.')
    print('Done')
    ```

### 2.7.8 `for` 循环和 `range()` 函数

```python linenums="1"
for i in range(5):
    print(f'Five times ({i})')
```

!!! tip "注意"

    只能在 `while` 和 `for` 循环内部使用 `break` 和 `continue` 语句

### 2.7.9 等价的 `while` 循环

实际上可以用 `while` 循环来做和 `for` 循环同样的事，只是 `for` 循环更简洁

### 2.7.10 `range()` 函数的开始、停止和步长参数

`range({开始值}, {停止值}, {步长参数})`

停止值是上限，但是不包含它。即左闭右开

<div class="grid" markdown>

```python linenums="1"
for i in range(0, 10, 2):
    print(i)
```

```python title="输出"
0
2
4
6
8
```

```python linenums="1"
for i in range(5, -1, -1):
    print(i)
```

```python title="输出"
5
4
3
2
1
0
```

</div>

## 2.8 导入模块

Python 程序可以调用一组基本的函数，称为“内置函数”。Python 也包含一组模块，称为“标准库”。每个模块都是一个 Python 程序，包含一组相关的函数，可以嵌入你的程序之中。例如，math 模块有与数学运算相关的函数，random 模块有与随机数相关的函数等

使用 `import` 语句导入该模块

```python linenums="1"
import random
for i in range(5):
    print(random.randint(1, 10))
```

!!! tip "不要覆写模块名"

    如果不小心将程序命名为 `random.py`，并在另一个程序中使用 `import random` 语句，那么程序将导入你的 `random.py` 文件，而不是 Python 的 random 模块

```python linenums="1"
import random, sys, os, math
```

## 2.9 用 `sys.exit()` 函数提前结束程序

调用 `sys.exit()` 函数，可以让程序提前终止或退出

```python linenums="1"
import sys

while True:
    print('Type exit to exit.')
    response = input()
    if response == 'exit':
        sys.exit()
    print(f'You typed {response}.')
```

## 2.10 习题

1.自行搜索了解 `abs()` 函数

??? success "答案"

    `abs()` 函数是 Python 的内置函数，用于返回一个数的绝对值。绝对值是指一个数在数轴上与零点的距离，因此无论是正数还是负数，绝对值都是非负数

    `abs(x)`
    
    - x：一个数值表达式，可以是整数、浮点数或复数

    示例：

    ```python
    >>> abs(-5)
    5
    >>> abs(3.14)
    3.14
    >>> abs(-7.5)
    7.5
    >>> abs(0)
    0
    ```
    
    对于复数，`abs()` 函数返回其模（即复数在复平面上的距离）：

    ```python
    >>> abs(3 + 4j)
    5.0
    ```
    