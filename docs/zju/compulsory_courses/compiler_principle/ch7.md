# 7 Intermediate Code

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

编译器在将源代码（如 C、Java）转换为机器码（如 x86、ARM）的过程中，会先生成一种“中间形式”。这种形式既不像源代码那样依赖具体语言特性（如面向对象、闭包），也不像机器码那样依赖具体硬件（如寄存器数量、指令集）。因此 IR 起到 桥梁 作用，方便进行各种优化和后续代码生成

不同的编译阶段和分析任务对 IR 的要求不同：

1. AST 适合语法分析和初步语义检查
2. TAC 适合进行简单的指令选择和数据流分析。
3. SSA 可以简化很多优化算法（如常量传播、死代码删除）
4. CFG 用于分析程序的控制结构（循环、分支）
5. 表达式树适合进行表达式层面的优化和代码生成

<figure markdown="span">
  ![Img 1](../../../img/compiler_principle/ch7/compiler_ch7_img1.png){ width="600" }
</figure>

## 1 Three-Address Code

每条指令最多三个地址（例如 `a = b + c`），接近许多真实机器指令，但忽略具体寄存器

<figure markdown="span">
  ![Img 2](../../../img/compiler_principle/ch7/compiler_ch7_img2.png){ width="600" }
</figure>

但是并非所有操作都适合 `x = y op z` 这种二元形式。例如一元运算等等

三地址码并不是一种严格标准化的 IR，不同编译器会根据自己的需要设计不同“方言”。当源语言引入特殊特性（如异常处理、协程、闭包、SIMD 向量操作等）时，可能需要发明新的三地址指令形式来合理表达这些语义。这种灵活性使三地址码能够适应各种源语言和目标机，但也导致不同编译器之间的三地址码不通用

<figure markdown="span">
  ![Img 3](../../../img/compiler_principle/ch7/compiler_ch7_img3.png){ width="600" }
</figure>

三地址码是一个指令序列，通常存储在数组或链表中，便于顺序遍历、插入和修改。每条指令用一个包含四个字段的记录表示：

1. op：操作符
2. arg1：第一操作数
3. arg2：第二操作数
4. result：结果存放位置

对于不需要全部三个地址的指令，用占位符（如 `_` 或 `null`）填充

<figure markdown="span">
  ![Img 4](../../../img/compiler_principle/ch7/compiler_ch7_img4.png){ width="600" }
</figure>

## 2 Intermediate Representation Tree

一个好的中间表示（IR）具有以下几个品质：

1. 便于语义分析阶段生成
2. 便于翻译到所有目标机器语言
3. 每种构造必须有清晰简单的含义

<figure markdown="span">
  ![Img 5](../../../img/compiler_principle/ch7/compiler_ch7_img5.png){ width="600" }
</figure>

抽象语法（通常是 AST 节点）中的指令可能具有复杂副作用（Complex Effects, CE），机器语言同样如此。但是两者的效果不是一一对应的。IR 将 AST 中那些一条顶多条、副作用复杂的指令，拆解成一系列语义简单、副作用清晰的微小操作。在代码生成阶段，优化器和后端可以将这些简单的 IR 指令重新组合成高效的目标机器指令

## 3 Translation into IR Trees

### 3.1 Expressions

三种表达式分类

| 类别 | 名称 | 对应的 IR | 说明 |
| -- | -- | -- | -- |
| 有返回值的表达式 | Ex | `T_exp` | 计算后得到一个值，如 `a + b`、`3 * f(x)` |
| 无返回值的表达式 | Nx | `T_stm` | 仅为了副作用而执行，不返回值，如 `while` 循环、无返回值的 `call` |
| 布尔表达式 | Cx | 条件跳转结构 | 如 `a > b`，不直接返回 `true`/`false`，而是根据真假跳转到不同标号 |

Tr_Cx 结构：

```cpp linenums="1"
// stm：一条 IR 语句，通常是一个条件跳转，如 CJUMP(>, a, b, true_label, false_label)
// patchList true / patchList false：记录哪些跳转目标尚未确定（例如，当 a > b 作为更大表达式的一部分时，true/false 的目标地址可能还未生成），后续可以回填
Tr_Cx (patchList true, patchList false, T_stm stm);
```

> 假设 AST 表达式：`(a > b) && (c < d)`
>
> 1. 对 `a > b` 生成 Cx：如果成立则继续检查 `c < d`，否则直接跳转到整个表达式的 false 目标
> 2. 对 `c < d` 生成 Cx：如果成立则跳转到整个表达式的 true 目标，否则跳转到 false 目标
> 3. 通过 patchList 机制，可以在生成完所有代码后，将实际的跳转地址回填到这些条件跳转指令中

<figure markdown="span">
  ![Img 6](../../../img/compiler_principle/ch7/compiler_ch7_img6.png){ width="600" }
</figure>

有时三种 IR 表达式类型之间需要相互转换。例如 `flag := (a > b | c < d)`，需要将 Cx 转换成 Ex。我们可以实现 `toEx(Cx)` 函数：

1. 创建两个新的标号：`true_label` 和 `false_label`
2. 生成一个临时变量 `t`（例如 `TEMP(t1)`）
3. 先给 `t` 赋值为 0（假定 0 表示 `false`）
4. 执行原来的 Cx 条件跳转：如果条件成立，跳转到 `true_label`，在那里将 `t` 赋值为 1（假定 1 表示 `true`），然后跳转到后续代码；否则继续执行到 `false_label`（`t` 保持为 0）
5. 最终 `t` 的值就是布尔条件的值（0 或 1），返回 `t` 作为 Ex

```cpp linenums="1"
flag := (a > b | c < d)

// 最终生成的 IR
e = Cx(true, false, stm)
MOVE(TEMP(flag), toEx(e))
```

### 3.2 Simple Variables

### 3.3 Array Variable

### 3.4 Structured L-Values

### 3.5 Subscripting and Field SSelection

### 3.6 Arithmetic

### 3.7 Conditionals

### 3.8 While Loops

### 3.9 For Loops

### 3.10 Function Call

## 4 Translation of Declarations

### 4.1 Variable Definition

### 4.2 Function Definition