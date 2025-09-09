# 5 字典和结构化数据

!!! info "说明"

    本文档为个人整理的复习概要，内容侧重重点提炼而非详细讲解，不适合零基础的同学

<!-- !!! tip "说明"

    本文档正在更新中…… -->

## 5.1 字典数据类型

像列表一样，**字典** 是许多值的集合。但不像列表的索引，字典的索引可以使用许多不同的数据类型，不只是整数。字典的索引被称为 **键**，键及其关联的值被称为 **键-值对**

在代码中，字典输入时带花括号 `{}`

```python
>>> my_cat = {'size': 'fat', 'color': 'gray', 'disposition': 'loud'}
```

这将一个字典赋给 `my_cat` 变量，这个字典的键是 `'size'` `'color'` `'disposition'`。这些键相应的值是 `'fat'` `'gray'` `'load'` 。可以通过它们的键访问这些值：

```python
>>> my_cat['size']
'fat'
>>> 'My cat has ' + my_cat['color'] + ' fur.'
'My cat has gray fur.'
```

字典可以用整数值作为键，它们不必从 0 开始，可以是任何数字

### 5.1.1 字典与列表

不像列表，字典中的项是不排序的。在字典中，键-值对输入的顺序并不重要

```python
>>> eggs = {'name': 'Zophie', 'species': 'cat'}
>>> ham = {'species': 'cat', 'name': 'Zophie'}
>>> eggs == ham
True
```

因为字典是不排序的，所以不能像列表那样切片

尝试访问字典中不存在的键，将出现 `KeyError` 错误信息

字典可以用任意值作为键，这一点让你能够用强大的方式来组织数据。假定你希望程序保存朋友生日的数据，就可以使用一个字典，用名字作为键，用生日作为值

```python linenums="1"
birthdays = {'Alice': 'Apr 1', 'Bob': 'Dec 12'}

while True:
    print('Enter a name: (blank to quit)')
    name = input()
    if name == '':
        break
    
    if name in birthdays:
        print(birthdays[name] + ' is the birthday of ' + name)
    else:
        print(f'I do not have birthday information for {name}')
        bday = input('What is their birthday?')
        birthdays[name] = bday
        print('Birthday database updated.')
```

用 `in` 关键字，可以查看输入的名字是否作为键存在于字典中。如果在，可以用方括号访问关联的值；如果不在，可以用同样的方括号语法和赋值操作符添加它

!!! tip "Python 3.7 中排序的字典"

    在 Python 3.7 及更高的版本中，尽管字典仍然没有排序，但是如果你在它们中创建序列值，字典将记住其键-值对的插入顺序

    ```python
    >>> eggs = {'name': 'Zophie', 'species': 'cat'}
    >>> list(eggs)
    ['name', 'species']
    >>> ham = {'species': 'cat', 'name': 'Zophie'}
    >>> list(ham)
    ['species', 'name']
    ```

    请注意，字典仍然是无序的

### 5.1.2 `keys()`、`values()` 和 `items()` 方法

这 3 个字典方法，将返回类似列表的值，分别对应于字典的键、值和键-值对：`keys()`、`values()` 和 `items()` 方法。这些方法返回的值不是真正的列表，它们不能被修改，没有 `append()` 方法。但这些数据类型（分别是 `dict_keys` `dict_values` `dict_items`）可以用于 `for` 循环

```python
>>> eggs = {'name': 'Zophie', 'species': 'cat'}
>>> for v in eggs.values():
...    print(v)

red
42
>>> for i in eggs.items():
...    print(i)
('name', 'Zophie')
('species', 'cat')
```

`items()` 方法返回的 `dict_items` 值包含的是键和值的元组

如果希望通过这些方法得到一个真正的列表，就把类似列表的返回值传递给 `list()` 函数

```python
>>> eggs = {'name': 'Zophie', 'species': 'cat'}
>>> eggs.keys()
dict_keys(['name', 'species'])
>>> list(eggs.keys())
['name', 'species']
```

也可以利用多重赋值的技巧，在 `for` 循环中将键和值赋给不同的变量

```python
>>> eggs = {'name': 'Zophie', 'species': 'cat'}
>>> for k, v in eggs.items():
...    print(f'keys: {k} value: {v}')

keys: name value: Zophie
keys: species value: cat
```

### 5.1.3 检查字典中是否存在键或值

利用 `in` `not in` 操作符

```python
>>> spam = {'name': 'Zophie', 'age': 7}
>>> 'name' in spam.keys()
True
>>> 'color' in spam
False
```

`'color' in spam` 本质上是一个简写版本，相当于 `'color' in spam.keys()`

### 5.1.4 `get()` 方法

`get()` 方法，有两个参数，分别为要取得其值的键，以及当该键不存在时返回的备用值

```python
>>> picnicItems = {'apples': 5, 'cups': 2}
>>> f'I am bringing {picnicItems.get('cups', 0)} cups.'
'I am bringing 2 cups.'
>>> f'I am bringing {picnicItems.get('eggs', 0)} eggs.'
'I am bringing 0 eggs.'
```

因为 `picnicItems` 字典中没有 `eggs` 键，所以 `get()` 方法返回的默认值是 0

### 5.1.5 `setdefault()` 方法

`setdefault()` 方法可以为字典中的某个键设置一个默认值，当该键没有任何值时使用它。该方法的第一个参数是要检查的键，第二个参数是当该键不存在时要设置的值。如果该键确实存在，那么 `setdefault()` 方法就会返回键的值

```python
>>> spam = {'name': 'Zophie', 'age': 7}
>>> spam.setdefault('color', 'black')
'black'
>>> spam
{'name': 'Zophie', 'age': 7, 'color': 'black'}
>>> spam.setdefault('color', 'white')
'black'
{'name': 'Zophie', 'age': 7, 'color': 'black'}
```

下面有一个小程序，可以计算一个字符串中每个字符出现的次数

```python linenums="1"
message = 'It was a bright cold day in April'
count = {}

for character in message:
    count.setdefault(character, 0)
    count[character] = count[character] + 1

print(count)
```

```python linenums="1" title="output"
{'I': 1, 't': 2, ' ': 7, 'w': 1, 'a': 3, 's': 1, 'b': 1, 'r': 2, 'i': 3, 'g': 1, 'h': 1, 'c': 1, 'o': 1, 'l': 2, 'd': 2, 'y': 1, 'n': 1, 'A': 1, 'p': 1}
```

## 5.2 美观地输出

如果程序导入了 `pprint` 模块，就可以使用 `pprint()` `pformat()` 函数，它们将“美观地输出”一个字典的字

```python linenums="1"
import pprint


message = 'It was a bright cold day in April'
count = {}

for character in message:
    count.setdefault(character, 0)
    count[character] = count[character] + 1

pprint.pprint(count)
```

```python linenums="1" title="output"
{' ': 7,
 'A': 1,
 'I': 1,
 'a': 3,
 'b': 1,
 'c': 1,
 'd': 2,
 'g': 1,
 'h': 1,
 'i': 3,
 'l': 2,
 'n': 1,
 'o': 1,
 'p': 1,
 'r': 2,
 's': 1,
 't': 2,
 'w': 1,
 'y': 1}
```

输出结果看起来更优雅，键是排过序的

如果字典本身包含嵌套的列表或字典，那么 `pprint()` 函数就特别有用

如果希望将美观的文字作为字符串输出，而不显示在屏幕上，那就调用 `pformat()` 函数。下面两行代码是等价的

```python linenums="1"
pprint.pprint(messages)
print(pprint.pformat(messages))
```

## 5.3 使用数据结构对真实世界建模

### 5.3.2 嵌套的字典和列表

当你对复杂的事物建模时，可能发现字典和列表中需要包含其他字典和列表。列表适用于包含一组有序的值，字典适用于包含关联的键与值。下面的程序使用字典包含其他字典，用于记录谁为野餐带来的什么事物

```python linenums="1"
def total_brought(guests, item):
    num_brought = 0
    for k, v in guests.items():
        num_brought += v.get(item, 0)
    return num_brought


all_guests = {'Alice': {'apples': 5, 'pretzels': 12},
              'Bob': {'ham sandwiches': 3, 'apples': 2},
              'Carol': {'cups': 3, 'apple pies': 1}}

print('Number of things being brought:')
print(' - Apples        ' + str(total_brought(all_guests, 'apples')))
print(' - Cups         ' + str(total_brought(all_guests, 'cups')))
print(' - Cakes        ' + str(total_brought(all_guests, 'cakes')))
print(' - Ham sandwiches ' + str(total_brought(all_guests, 'ham sandwiches')))
print(' - Apple pies   ' + str(total_brought(all_guests, 'apple pies')))
```

```python linenums="1" title="output"
Number of things being brought:
 - Apples        7
 - Cups         3
 - Cakes        0
 - Ham sandwiches 3
 - Apple pies   1
```
