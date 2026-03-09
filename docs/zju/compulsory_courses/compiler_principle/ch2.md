# 2 Lexical Analysis

!!! tip "说明"

    本文档正在更新中……

## 1 Lexical Token

词法单元：词法分析的结果。它是源代码中最小的、有独立意义的单位。在这里，词法单元就充当了终结符的角色，语法分析器会直接处理这些词法单元，而不会关心它们内部的单个字符

<figure markdown="span">
  ![Img 1](../../../img/compiler_principle/ch2/compiler_ch2_img1.png){ width="600" }
</figure>

非词法单元：

1. 注释
2. 预处理指令：`#include<stdio.h>`
3. 宏定义
4. 空格、制表符和换行

<figure markdown="span">
  ![Img 2](../../../img/compiler_principle/ch2/compiler_ch2_img2.png){ width="600" }
</figure>

## 2 Regular Expression

<figure markdown="span">
  ![Img 3](../../../img/compiler_principle/ch2/compiler_ch2_img3.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 4](../../../img/compiler_principle/ch2/compiler_ch2_img4.png){ width="600" }
</figure>

当输入字符串可能被多种规则匹配时，两条重要的歧义消除规则决定了最终的选择：

1. longest match：从输入的开头开始，能够与任意正则表达式匹配的最长初始子字符串，将被作为下一个词法单元
2. rule priority：对于某一个特定的最长初始子字符串，第一个能够匹配它的正则表达式决定了它的词法单元类型。这意味着编写正则表达式规则的顺序非常重要

对于 `if8` 来说，最长匹配规则会将 `if8` 视作一个 token，因此 `if8` 被识别为 ID

对于 `if` 来说，关键字规则 `if` 和标识符规则都能匹配，但关键字规则在前，所以会采用前者，将 `if` 识别为 IF
