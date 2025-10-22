# 3 Context-Free Languages

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Context-Free Grammars

- **language recognizer**：一个接受有效字符串的装置
- **language generator**：一个生成有效字符串的装置

**context-free grammars**：一类更复杂的语言生成器

以 $a(a^* \cup b^*) b$ 为例

令 $S$ 表示语言中的一个字符串，$M$ 表示中间部分，那么

$S \rightarrow aMb$

$\rightarrow$ 读作 "can be"，我们称这样的表达式为一条 **rule**。中间部分 $M$ can be 什么？要么是一串 $a$，要么是一串 $b$。我们通过添加以下规则来表达这一点：

$M \rightarrow A$，$M \rightarrow B$

$A$ 和 $B$ 分别表示一串 $a$ 和 $b$。那么什么是一串 $a$？可以继续添加规则

$A \rightarrow e$ 或者 $A \rightarrow aA$

于是，由 $a(a^* \cup b^*) b$ 所表示的语言，也可以由以下语言生成器来定义：从仅包含单个符号 $S$ 的字符串开始。在上述规则中，找出当前字符串中出现在某个箭头 $→$ 左侧的符号。用该规则中箭头右侧的字符串替换这个符号。重复此过程，直到无法再找到这样的符号为止

例如，为了生成字符串 $aaab$：

1. $S \rightarrow aMb$
2. 应用规则 $M \rightarrow A$，得到 $aAb$
3. 然后应用两次规则 $A \rightarrow aA$，得到 $aaaAb$
4. 最后应用规则 $A \rightarrow e$，得到 $aaab$

A **context-free grammar**（上下文无关文法）是一种像上面那样工作的语言生成器，它由一组类似的规则构成

> 考虑中间阶段的字符串 $aaAb$，它是生成 $aaab$ 过程中的一个中间结果。自然地，我们可以称其左右两边的字符串 $aa$ 和 $b$ 为符号 $A$ 的 **context**。现在，规则 $A \rightarrow aA$ 表示：无论周围字符串是什么，都可以将 $A$ 替换为 $aA$；换句话说，independently of the context of A

在一个上下文无关文法中，有些符号出现在规则中箭头左侧，而另一些符号则不会。后者这类符号称为 **terminals**，因为当生成的字符串只由这些符号组成时，就标志着生成过程的终止

!!! info ""

    A context-free grammar $G$ is a quadruple $(V, \Sigma, R,S)$ where

    1. $V$ is an alphabet
    2. $\Sigma$ (the set of terminals) is a subset of $V$
    3. $R$ (the set of rules) is a finite subset of $(V - \Sigma) \times V^*$
    4. $S$ (the start symbol) is an element of $V - \Sigma$

    集合 $V - \Sigma$ 中的成员称为 nonterminals
    
    对于任意 $A \in V - \Sigma$ 和 $u \in V^*$，如果 $(A, u) \in R$，我们就写作 $A \rightarrow_G u$
    
    对于任意两个字符串 $u,v \in V^*$，我们写成 $u \Rightarrow_G v$ 当且仅当存在字符串 $x, y \in V^*$ 和非终结符 $A \in V - \Sigma$，使得 $u=xAy, v=xv'y$，且 $A \rightarrow_G v'$

    关系 $\Rightarrow^*_G$ 是 $\Rightarrow_G$ 的自反传递闭包

    记 $L(G)$ 为由 $G$ 生成的语言，即 $\lbrace w \in \Sigma^*: S \Rightarrow^*_G w \rbrace$

    我们也说 