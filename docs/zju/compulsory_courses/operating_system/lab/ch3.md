# 3 GDB

!!! tip "说明"

    本文档正在更新中……

## 1 基本使用流程

要使用 GDB，你的程序必须包含调试信息。调试信息包含了变量名、函数名、源代码行号等，这样 GDB 才能将机器指令和你写的代码对应起来

**1.使用 `-g` 选项编译程序**

在编译时（无论是 gcc 还是 g++），必须加上 `-g` 选项

```bash linenums="1"
# 编译 C 程序
gcc -g -o my_program my_program.c

# 编译 C++ 程序
g++ -g -o my_program my_program.cpp
```

> 如果编译时没有 `-g`，GDB 将无法显示源代码，只能显示汇编指令，调试会非常困难

**2.启动 GDB**

在终端中，使用以下命令启动 GDB 并加载程序：

```bash linenums="1"
gdb ./my_program
```

这会进入 GDB 的交互式命令行界面，提示符会变成 `(gdb)`

**3.设置运行参数（如果需要）**

如果你的程序需要命令行参数，不要在启动 GDB 时直接加在后面（那是 GDB 自己的参数）。应该在 GDB 内部使用 `set args` 命令设置

```bash linenums="1"
(gdb) set args arg1 arg2 "第三个参数"
```

**4.设置断点**

在运行程序之前，通常需要先设置断点，让程序在特定位置暂停

```bash linenums="1"
# 在 main 函数开始处设置断点
(gdb) break main

# 在第 10 行代码处设置断点
(gdb) break 10

# 在文件 myfile.c 的第 25 行设置断点
(gdb) break myfile.c:25

# 在函数 foo 处设置断点
(gdb) break foo
```

**5.运行程序**

使用 `run` 命令（或简写 `r`）开始执行程序。程序会运行，直到遇到断点、崩溃或结束

```bash linenums="1"
(gdb) run
```

**6.程序暂停后，进行调试**

当程序在断点处暂停后，你就可以使用各种命令来检查程序状态：

- 查看代码：使用 `list`（或 `l`）查看当前行附近的源代码
- 查看变量值：使用 `print`（或 `p`）打印变量或表达式的值

```bash linenums="1"
(gdb) print variable_name
(gdb) print array[i]
(gdb) p function_call() # 甚至可以调用函数，但需谨慎！
```

- 单步执行：

    - `next`（或 `n`）：执行下一行代码，不会进入函数内部（跳过函数调用）
    - `step`（或 `s`）： 执行下一行代码，会进入函数内部

- 继续运行：使用 `continue`（或 `c`）让程序继续运行，直到下一个断点或结束

**7.退出 GDB**

调试完成后，使用 `quit` 命令（或 `q`）退出 GDB

```bash linenums="1"
(gdb) quit
```

## 2 常用命令

| 命令 | 简写 | 说明 |
| -- | -- | -- |
| `file <filename>` | | 加载可执行文件到 GDB |
| `run` | `r` | 开始运行程序 |
| `break <location>` | `b` | 设置断点`<location>` 可以是函数名、行号、文件名:行号等 |
| `break ... if <condition>` | | 设置条件断点，只有当条件为真时才暂停例如：`b 10 if i == 100` |
| `info breakpoints` | `i b` | 查看所有已设置的断点信息 |
| `delete <breakpoint-num>` | `d` | 删除指定编号的断点 |
| `list` | `l` | 显示当前位置附近的源代码 |
| `print <expression>` | `p` | 打印表达式（变量、结构体等）的值 |
| `display <expression>` | | 每次程序暂停时，自动打印指定表达式的值 |
| `next` | `n` | 单步执行（不进入函数） |
| `step` | `s` | 单步执行（进入函数） |
| `continue` | `c` | 继续运行程序，直到下一个断点 |
| `backtrace` | `bt` | 显示函数调用栈（非常有用，可以查看程序是如何执行到当前位置的） |
| `frame <frame-num>` | `f` | 切换到调用栈的指定帧，可以查看该层函数的局部变量 |
| `info locals` | `i lo` | 显示当前函数的所有局部变量 |
| `watch <expression>` | | 设置观察点，当表达式的值改变时暂停程序 |
| `quit` | `q` | 退出 GDB |

## 3 调试 QEMU

```bash linenums="1"
# 内核启动关键函数
(gdb) break start_kernel
(gdb) break rest_init
(gdb) break kernel_init
(gdb) break do_fork
(gdb) break sys_call_table
```