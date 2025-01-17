# 3 函数

<!-- !!! tip "说明"

    此文档正在更新中…… -->

## 3.1 `def` 语句和参数

```python
def hello(name):
    print(f'Hello, {name}')


hello('Alice')
```

在这个函数的定义中，有一个名为 `name` 的变元。保存在变元中的值，在函数返回后就丢失了

1. **定义** 一个函数就是创建一个函数
2. `hello('Alice')` **调用** 刚才创建的函数
3. 也称为将字符串值 `'Alice'` **传递** 给该函数
4. 传递给函数的值是 **参数**
5. 接收参数值的变量是 **变元**

## 3.2 返回值和 `return` 语句

可以用 `return` 语句指定应该返回什么值

## 3.3 `None` 值

`None` 表示没有值。`None` 是 `NoneType` 数据类型的唯一值

有一个使用 `None` 的地方就是 `print()` 函数的返回值

```python
>>> spam = print('Hello')
Hello!
>>> spam == None
True
>>> print(spam)
None
```

对于所有没有 `return` 语句的函数定义，Python 都会在末尾上加上 `return None`。如果使用不带值的 `return` 语句，也返回 `None`

## 3.4 关键字参数和 `print()` 函数

大多数参数是由它们在函数调用中的位置来识别的。但是，“关键字参数”是在函数调用时由它们前面的关键字来识别的。关键字参数通常用于“可选变元”。例如，`print()` 函数有可选的变元 `end` 和 `sep`，分别指定在参数末尾输出什么，以及在参数之间输出什么来隔开它们

```python linenums="1"
print('Hello', end='')
print('World')
```

```python title="输出"
HelloWorld
```

类似地，如果向 `print()` 函数传入多个字符串值，该函数就会自动用一个空格分隔它们

```python linenums="1"
print('cats', 'dogs', 'mice')
```

```python title="输出"
cats dogs mice
```

```python linenums="1"
print('cats', 'dogs', 'mice', sep=',')
```

```python title="输出"
cats,dogs,mice
```

部分编辑器可以使用 ++ctrl+left-button++ 单击某个函数，跳转至该函数的定义处或引用处，例如单击 `print()` 函数：

```python title="print() 定义" linenums="1"
def print(self, *args, sep=' ', end='\n', file=None): # known special case of print
    """
    Prints the values to a stream, or to sys.stdout by default.
    
      sep
        string inserted between values, default a space.
      end
        string appended after the last value, default a newline.
      file
        a file-like object (stream); defaults to the current sys.stdout.
      flush
        whether to forcibly flush the stream.
    """
    pass
```

可以看到 `sep` 默认值便是 `' '`，`end` 默认值便是 `\n`

## 3.5 调用栈

“调用栈”是 Python 记住每个函数调用后在哪里返回执行的方式。当程序调用一个函数时，Python 在调用栈的顶部创建一个“帧对象”。帧对象保存了最初函数调用的行号，使得 Python 可以记住返回的位置

当函数调用返回时，Python 从栈顶部删除一个帧对象，并将执行转移至保存在其中的行号。帧对象始终是从栈顶部添加和删除的，而不是从其他任意位置

## 3.6 局部和全局作用域

在被调用函数内赋值的变元和变量，处于该函数的 **局部作用域** 中。在所有函数之外赋值的变量，处于 **全局作用域** 中。处于局部作用域中的变量，被称为 **局部变量**。处于全局作用域中的变量，被称为 **全局变量**。一个变量必属于其中一种，不能既是局部的又是全局的

可以将 **作用域** 看成变量的容器。当作用域被销毁时，所有保存在该作用域内的变量的值就被丢弃了。只有一个全局作用域，它是在程序开始时创建的。如果程序终止，全局作用域就被销毁，它的所有变量就被丢弃了

一个函数被调用时，就创建了一个局部作用域。在这个函数内赋值的所有变量，存在于该局部作用域内。该函数返回时，这个局部作用域就被销毁了，这些变量就丢失了。下次调用这个函数时，局部变量不会记得改函数上次被调用时它们保存的值

1. 全局作用域中的代码不能使用任何局部变量
2. 局部作用域中的代码可以访问全局变量
3. 一个函数的局部作用域中的代码，不能使用其他局部作用域中的变量
4. 在不同的作用域中，你可以用相同的名字命名不同的变量

### 3.6.1 局部变量不能在全局作用域内使用

```python linenums="1"
def spam():
    eggs = 100
spam()
print(eggs)
```

```python title="输出"
NameError: name 'eggs' is not defined
```

### 3.6.2 局部作用域不能使用其他局部作用域内的变量

```python linenums="1"
def spam():
    eggs = 100
    bacon()
    print(eggs)


def bacon():
    ham = 101
    eggs = 0


spam()
```

```python title="输出"
100
```

### 3.6.3 全局变量可以在局部作用域中读取

```python linenums="1"
def spam():
    print(eggs)


eggs = 42
spam()
print(eggs)
```

```python title="输出"
42
42
```

### 3.6.4 名称相同的局部变量和全局变量

```python linenums="1"
def spam():
    eggs = 'spam local'
    print(eggs)


def bacon():
    eggs = 'bacon local'
    print(eggs)
    spam()
    print(eggs)


eggs = 'global'
bacon()
print(eggs)
```

```python title="输出"
bacon local
spam local
bacon local
global
```

## 3.7 `global` 语句

如果需要在一个函数内修改全局变量，就是用 `global` 语句。如果在函数的顶部有 `global eggs` 这样的代码，则说明在接下来的代码中，使用全局变量 `eggs`

```python linenums="1"
def spam():
    global eggs
    eggs = 'spam'


eggs = 'global'
spam()
print(eggs)
```

```python title="输出"
spam
```

## 3.8 异常处理

错误可以由 `try` 和 `except` 语句来处理。那些可能出错的语句被放在 `try` 子句中。如果错误发生，程序执行就转到接下来的 `except` 子句开始处

```python linenums="1"
def spam(divide_by):
    try:
        return 42 / divide_by
    except ZeroDivisionError:
        print('Error: Invalid argument.')


print(spam(2))
print(spam(12))
print(spam(0))
print(spam(1))
```

```python title="output"
21.0
3.5
Error: Invalid argument.
None
42.0
```

`try` 语句块中，发生的所有错误都会被捕捉

```python linenums="1"
def spam(divide_by):
    return 42 / divide_by


try:
    print(spam(2))
    print(spam(12))
    print(spam(0))
    print(spam(1))  # 该行代码没有被执行
except ZeroDivisionError:
    print('Error: Invalid argument.')
```

```python title="output"
21.0
3.5
Error: Invalid argument.
```

## 3.9 小程序：Zigzag

```python linenums="1"
import time, sys


indent = 0  # 缩进的空格数
indent_increasing = True  # 是否增加缩进

try:
    while True:
        print(' ' * indent, end='')
        print('********')
        time.sleep(0.1)  # 暂停 0.1 秒

        if indent_increasing:  # 增加缩进
            indent += 1
            if indent == 20:
                indent_increasing = False  # 改变方向
        else:  # 减少缩进
            indent -= 1
            if indent == 0:
                indent_increasing = True  # 改变方向
except KeyboardInterrupt:  # 捕获 Ctrl + C
    sys.exit()
```

## 3.10 实践项目

### 3.10.1 Collatz 序列

编写一个名为 `Collatz()` 的函数，它有一个名为 `number` 的参数。如果参数是偶数，那么 `collatz()` 就输出 `number // 2`，并返回该值。如果 `number` 是奇数，`collatz()` 就输出并返回 `3 * number + 1`

然后编写一个程序，让用户输入一个整数，并不断对这个数调用 `collatz()` 函数，指导函数返回值为 1（令人惊奇的是，这个序列对于任何整数都有效，利用这个序列，你迟早会得到 1）

记得将 `input()` 函数的返回值用 `int()` 函数转换成一个整数

提示：如果 `number % 2 == 0`，整数 `number` 就是偶数；如果 `number % 2 == 1`，它就是奇数

```python title="输出样例"
Enter number:
3
10
5
16
8
4
2
1
```

??? success "答案"

    ```python linenums="1"
    def collatz(number):
        if number % 2 == 0:
            print(number // 2)
            return number // 2
        else:
            print(3 * number + 1)
            return 3 * number + 1
        
    
    user_number = int(input('Enter number:\n'))
    while user_number != 1:
        user_number = collatz(user_number)
    ```

### 3.10.2 输入验证

在 3.10.1 的项目中添加 `try` 和 `except` 语句，检测用户是否输入了一个非整数的字符串。在正常情况下，`int()` 函数在传入一个非整数字符串时，会产生 ValueError 的错误。在 `except` 子句中，向用户输入一条信息，告诉他们必须输入一个整数

??? success "答案"

    ```python linenums="1"
    def collatz(number):
        if number % 2 == 0:
            print(number // 2)
            return number // 2
        else:
            print(3 * number + 1)
            return 3 * number + 1
    
    
    while True:
        try:
            user_number = int(input('Enter number:\n'))
            while user_number != 1:
                user_number = collatz(user_number)
            break
        except ValueError:
            print('Please enter an integer.')
    ```