# 4 Turing Machines

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 The Definition of A Turing Machine

本质上，一台 **Turing machines** 由一个有限状态控制单元和一条纸带组成。两者之间的通信由一个单独的磁头提供，该磁头从纸带上读取符号，也用于更改纸带上的符号。控制单元以离散的步骤运行；在每一步，它根据其当前状态和读/写磁头当前扫描到的纸带符号来执行两个功能：

1. 将控制单元置于一个新状态
2. 执行以下操作之一：

    1. 在当前扫描的纸带方格中写入一个符号，替换掉已有的符号
    2. 将读/写磁头向左或向右移动一个纸带方格

纸带有一个左端，但向右无限延伸。为了防止机器将其磁头移出纸带的左端，我们假设纸带的最左端总是由一个特殊符号 $\rhd$ 标记；我们进一步假设，我们所有的图灵机都是这样设计的：每当磁头读到 $\rhd$ 时，它立即向右移动。此外，我们将使用不同的符号 ← 和 → 分别表示磁头向左或向右移动；我们假设这两个符号不属于我们考虑的任何字母表

通过将输入字符串刻写在纸带左端、紧邻 $\rhd$ 符号右侧的纸带方格上，为图灵机提供输入。纸带的其余部分最初包含 **blank** 符号，记为 $\sqcup$。机器可以按其认为合适的任何方式自由改变其输入，并可以在右侧无限的空白纸带部分进行写入。由于机器一次只能将其磁头移动一个方格，在任何有限次的计算之后，只有有限多个纸带方格会被访问到

<figure markdown="span">
  ![Img 1](../../../img/computational_theory/ch4/computational_ch4_img1.png){ width="600" }
</figure>

!!! info ""

    A Turing machine is a quintuple $(K,\Sigma,\delta,s,H)$, where

    1. $K$ is a finite set of **states**
    2. $\Sigma$ is an alphabet, containing the **blank symbol** $\sqcup$ and the **left end symbol** $\rhd$, but not containing the symbols $\leftarrow$ and $\rightarrow$
    3. $s \in K$ is the **initial state**
    4. $H \subseteq K$ is the set of **halting states**
    5. $\delta$, the **transition function**, is a function from $(K-H)\times \Sigma$ to $K \times (\Sigma \cup \lbrace\leftarrow, \rightarrow \rbrace)$ such that

        1. for all $q \in K - H$, if $\delta(q,\rhd) = (p,b)$, then $b = \rightarrow$
        2. for all $q \in K - H$ and $a \in \Sigma$, if $\delta(q,a) = (p,b)$, then $b \not ={ \rhd}$

<figure markdown="span">
  ![Img 2](../../../img/computational_theory/ch4/computational_ch4_img2.png){ width="800" }
</figure>

<figure markdown="span">
  ![Img 3](../../../img/computational_theory/ch4/computational_ch4_img3.png){ width="800" }
</figure>

A **configuration** of a Turing machine $M = (K,\Sigma,\delta,s,H)$ is a member of $K \times \rhd \Sigma^* \times (\Sigma^*(\Sigma - \lbrace \sqcup \rbrace) \cup \lbrace e\rbrace)$

1. 第一个位置：表示图灵机当前的状态
2. 第二个位置：表示从纸带左端开始，到当前磁头所在位置（包含该位置符号）为止的字符串
3. 第三个位置：表示从当前磁头所在位置的下一个位置开始，直到最后一个非空白符号为止的字符串

<figure markdown="span">
  ![Img 4](../../../img/computational_theory/ch4/computational_ch4_img4.png){ width="600" }
</figure>

> 上图中三个图灵机当前的配置如下
> 
> 1. $(q, \rhd a, aba)$
> 2. $(h, \rhd\sqcup\sqcup\sqcup, \sqcup a)$
> 3. $(q, \rhd \sqcup a \sqcup\sqcup, e)$

也可以这样表示配置：$(q, \rhd \underline{a}aba)$, $(h, \rhd\sqcup\sqcup \underline{\sqcup}\sqcup a)$, $(q, \rhd \sqcup a \sqcup \underline{\sqcup})$，下划线表示当前磁头所在的位置

考虑两个配置 $(q_1, w_1\underline{a_1}u_1)$, $(q_2, w_2\underline{a_2}u_2)$，那么 $(q_1, w_1\underline{a_1}u_1) \vdash_M (q_2, w_2\underline{a_2}u_2)$ 当且仅当对于某个 $b \in \Sigma \cup \lbrace\leftarrow,\rightarrow\rbrace$，有 $\delta(q_1, a_1) = (q_2, b)$，并且满足下列情况之一：

1. $b \in \Sigma, w_1 = w_2, u_1 = u_2, a_2 = b$
2. $b = \leftarrow, w_1 = w_2a_2$，并且

    1. $u_2 = a_1u_1$，如果 $a_1 \not ={\sqcup}$ 或 $u_1 \not ={e}$，或者
    2. $u_2 = e$，如果 $a_1 = \sqcup$ 且 $u_1 = e$

3. $b = \rightarrow, w_2 = w_1a_1$，并且

    1. $u_1 = a_2u_2$，或者
    2. $u_1 = u_2 = e$ 且 $a_2 = \sqcup$

<figure markdown="span">
  ![Img 5](../../../img/computational_theory/ch4/computational_ch4_img5.png){ width="800" }
</figure>

令 $\vdash_M^*$ 是 $\vdash_M$ 的 reflexive, transitive 闭包

我们说配置 $C_1$ **yield** 配置 $C_2$ 如果 $C_1 \vdash_M^* C_2$

一个 **computation** 是一些配置的序列 $C_0 \vdash_M C_1 \vdash_M \cdots \vdash_M C_n$。称这个计算 **length** 为 $n$ 或有 $n$ **steps**，写作 $C_0 \vdash_M^n C_n$

<figure markdown="span">
  ![Img 6](../../../img/computational_theory/ch4/computational_ch4_img6.png){ width="800" }
</figure>

### 1.1 A Notation for Turing Machines

定义一个非常简单的 basic machines 库，以及组合机器的规则

