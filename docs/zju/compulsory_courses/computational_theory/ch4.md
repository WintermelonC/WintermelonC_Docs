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

**symbol-writing machines** and **head-moving machines**：固定机器的字母表 $Σ$。对于每个 $a ∈ Σ ∪ \lbrace →, ← \rbrace − \lbrace\rhd\rbrace$，定义一台图灵机 $M_a = (\lbrace s, h \rbrace, Σ, δ, s, \lbrace h \rbrace)$，其中对每个 $b ∈ Σ − \lbrace \rhd\rbrace$，$δ(s,b) = (h,a)$。自然地，$δ(s,\rhd)$ 仍然是 $(s, →)$。也就是说，这台机器的作用只是执行动作 $a$：如果 $a ∈ Σ$，则写入符号 $a$；如果 $a ∈ \lbrace←, →\rbrace$，则按 $a$ 指示的方向移动，然后立即停止。当然，这个行为有一个例外情况：如果扫描到的符号是 $\rhd$，那么机器会向右移动

由于符号写入机器被频繁使用，我们简化其名称，直接用 $a$ 代替 $M_a$。也就是说，若 $a ∈ Σ$，则 a-writing machine 简记为 $a$。头移动机器 $M_←$ 和 $M_→$ 将分别简记为 $L$ 和 $R$

图灵机将以一种类似于有限自动机结构的方式进行组合。单个机器就像有限自动机的状态，机器之间可以像有限自动机的状态之间那样相互连接。然而，从一台机器到另一台机器的连接不会在第一台机器停止之前执行；只有当第一台机器停止后，第二台机器才会从其初始状态开始运行，此时磁带和读写头的位置由第一台机器留下的状态决定

因此，如果 $M₁$、$M₂$ 和 $M₃$ 是图灵机，则下图所示的机器按如下方式工作：从 $M₁$ 的初始状态开始；按照 $M₁$ 的方式运行，直到 $M₁$ 停止；然后，如果当前扫描的符号是 $a$，则启动 $M₂$ 并按照 $M₂$ 的方式运行；否则，如果当前扫描的符号是 $b$，则启动 $M₃$ 并按照 $M₃$ 的方式运行

<figure markdown="span">
  ![Img 7](../../../img/computational_theory/ch4/computational_ch4_img7.png){ width="400" }
</figure>

假设上图三个图灵机 $M₁$、$M₂$ 和 $M₃$ 分别为：$M₁ = (K₁, Σ, δ₁, s₁, H₁)$，$M₂ = (K₂, Σ, δ₂, s₂, H₂)$，$M₃ = (K₃, Σ, δ₃, s₃, H₃)$，那么上图所示的组合机器就是 $M = (K, Σ, δ, s, H)$

1. $K = K₁ ∪ K₂ ∪ K₃$
2. $s = s₁$
3. $H = H₂ ∪ H₃$

对于每个 $σ ∈ Σ$ 和 $q ∈ K − H$，$δ(q, σ)$ 的定义如下：

1. 如果 $q ∈ K₁ − H₁$，则 $δ(q, σ) = δ₁(q, σ)$
2. 如果 $q ∈ K₂ − H₂$，则 $δ(q, σ) = δ₂(q, σ)$
3. 如果 $q ∈ K₃ − H₃$，则 $δ(q, σ) = δ₃(q, σ)$
4. 如果 $q ∈ H₁$

    1. 若 $σ = a$，则 $δ(q, σ) = s₂$
    2. 若 $σ = b$，则 $δ(q, σ) = s₃$
    3. ==否则 $δ(q, σ) ∈ H$==（没得变了就停止机器）

> 实际上就是以数学形式描述了状态转换

<figure markdown="span">
  ![Img 10](../../../img/computational_theory/ch4/computational_ch4_img10.png){ width="800" }
</figure>

<figure markdown="span">
  ![Img 8](../../../img/computational_theory/ch4/computational_ch4_img8.png){ width="800" }
</figure>

<figure markdown="span">
  ![Img 9](../../../img/computational_theory/ch4/computational_ch4_img9.png){ width="800" }
</figure>

**copying machine** $C$：将 $\sqcup w \underline{\sqcup}$ 变成 $\sqcup w \sqcup  w \underline{\sqcup}$（$w$ 中不能有 $\sqcup$ 字符）

<figure markdown="span">
  ![Img 11](../../../img/computational_theory/ch4/computational_ch4_img11.png){ width="600" }
</figure>

**right-shifting machine** $S_\rightarrow$：将字符串 $\sqcup w \underline{\sqcup}$ 变成 $\sqcup \sqcup w \underline{\sqcup}$（$w$ 中不能有 $\sqcup$ 字符）

<figure markdown="span">
  ![Img 12](../../../img/computational_theory/ch4/computational_ch4_img12.png){ width="600" }
</figure>

同理有 left-shifting machine

<figure markdown="span">
  ![Img 13](../../../img/computational_theory/ch4/computational_ch4_img13.png){ width="800" }
</figure>

## 2 Computing with Turing Machines

我们采用以下策略来向图灵机提供输入：输入字符串（不含空白符号）写在最左侧符号 $\rhd$ 的右侧，其左侧有一个空白，右侧也有空白；读写头位于 $\rhd$ 与输入之间的空白方格上；机器从初始状态开始运行。如果 $M = (K, \Sigma, \delta, s, H)$ 是一台图灵机，且 $w \in (\Sigma - \lbrace \sqcup, \rhd\rbrace)^*$，那么 $M$ 在输入 $w$ 上的 **initial configuration** 是 $(s, \rhd  \underline{\sqcup}w)$

设 $M=(K,Σ,δ,s,H)$ 是一台图灵机，其中停机状态集合 $H=\lbrace y,n \rbrace$ 包含两个不同的停机状态（$y$ 表示是，$n$ 表示否）。任何停机配置，若其状态分量为 $y$，称为一个 **accepting configuration**；若其状态分量为 $n$，则称为一个 **rejecting configuration**。我们说 $M$ **accepting** 输入 $w∈(Σ−\lbrace⊔,▹\rbrace)^∗$，当且仅当 $(s,▹\underline{⊔}w)$ 导致一个接受配置；类似地，我们说 $M$ **reject** 输入 $w$，当且仅当 $(s,▹\underline{⊔}w)$ 导致一个拒绝配置

设 $\Sigma_0 \in \Sigma - \lbrace \sqcup, \rhd\rbrace$ 为一个字母表，称为 $M$ 的 **input alphabet**；通过将 $Σ_0$ 固定为 $Σ−\lbrace⊔,▹\rbrace$ 的一个子集，我们允许图灵机在计算过程中使用除输入中出现的符号之外的额外符号。我们说 $M$ **decide** 一个语言 $L⊆Σ_0^*$，当且仅当对于任意字符串 $w \in \Sigma_0^*$，满足以下条件：如果 $w∈L$，则 $M$ 接受 $w$；如果 $w\notin L$，则 $M$ 拒绝 $w$

称一个语言 L 为 **recursive**（递归的），如果存在一台图灵机能判定它

换句话说，一台图灵机判定一个语言 $L$，意味着当以输入 $w$ 启动时，它总是会停止，并且在正确的停机状态中停止：如果是 $y$，则 $w∈L$；如果是 $n$，则 $w\notin L$。请注意，如果输入包含空白或左端符号，则不保证会发生什么

<figure markdown="span">
  ![Img 14](../../../img/computational_theory/ch4/computational_ch4_img14.png){ width="800" }
</figure>

### 2.1 Recursive Functions

设 $M=(K,Σ,δ,s,\lbrace h\rbrace)$ 是一台图灵机，令 $Σ_0⊆Σ−\lbrace⊔,▹\rbrace$ 为一个字母表，且 $w∈Σ_0^∗$​。假设 $M$ 在输入 $w$ 上停止，并且存在某个 $y∈Σ_0^∗$，使得从初始配置 $(s,▹\underline{⊔}w)$ 出发，经过若干步后进入停机配置 $(h,▹\underline{⊔}y)$。那么称 $y$ 为 $M$ 在输入 $w$ 上的输出，记作 $M(w)$。注意，$M(w)$ 只有在 $M$ 在输入 $w$ 上停止时才被定义，而且实际上必须是在形如 $(h,▹\underline{⊔}y)$ 的配置中停止，其中 $y∈Σ_0^∗$

现在设 $f$ 是从 $\Sigma_0^*$ 到 $\Sigma_0^*$ 的任意函数。我们说图灵机 $M$ **compute** 函数 $f$，如果对所有 $w∈\Sigma_0^*$，都有 $M(w)=f(w)$。也就是说，对于所有 $w∈\Sigma_0^*$，当 $M$ 在输入 $w$ 上运行时，最终会停止，且其磁带包含字符串 $▹⊔f(w)$。若存在一台图灵机 $M$ 能计算函数 $f$，则称函数 $f$ 为 **recursive**

<figure markdown="span">
  ![Img 15](../../../img/computational_theory/ch4/computational_ch4_img15.png){ width="800" }
</figure>

集合 $\lbrace0,1\rbrace^∗$ 中的字符串可以用熟悉的二进制表示法来表示非负整数。任意字符串 $w = a_1a_2 \cdots a_n \in \lbrace 0,1 \rbrace^*$ 表示的数值为：$num(w) = a_1 \cdot 2^{n-1} + a_2 \cdot 2^{n-2} + \cdots + a_n$。并且，任何自然数都可以通过一个形如 $0∪1(0∪1)^∗$ 的字符串唯一地表示，也就是说，不包含前导零（即开头多余的 $0$）

因此，计算从 $\lbrace0,1\rbrace^∗$ 到 $\lbrace0,1\rbrace^∗$ 的函数的图灵机，可以被看作是计算从自然数到自然数的函数。事实上，具有多个参数的数值函数，例如加法和乘法，可以通过图灵机来计算，这些图灵机计算的是从 $\lbrace 0,1,; \rbrace^*$ 到 $\lbrace 0,1\rbrace^*$，其中 $;$ 是一个用于分隔二进制参数的符号

设 $M=(K,Σ,δ,s,\lbrace h\rbrace)$ 是一台图灵机，其中符号 $0,1,;∈Σ$，令 $f$ 是从 $N^k$ 到 $N$ 的任意函数（对某个 $k≥1$）。我们说图灵机 $M$ 计算函数 $f$，如果对于所有 $w_1, \cdots, w_k \in 0 \cup 1 (0 \cup 1)^*$（即，任何 $k$ 个整数的二进制编码字符串），都有：$num(M(w_1;\cdots;w_k)) = f(num(w_1), \cdots, num(w_k))$

也就是说，如果 $M$ 以整数 $n_1,\cdots,n_k$ 的二进制表示作为输入，则它最终会停止，并且当它停止时，其磁带上包含一个表示数值 $f(n_1,\cdots,n_k)$ 的字符串，即该函数的值。若存在一台图灵机 $M$ 能计算函数 $f$，则称函数 $f: N^k \rightarrow N$ 为 **recursive**

<figure markdown="span">
  ![Img 16](../../../img/computational_theory/ch4/computational_ch4_img16.png){ width="800" }
</figure>

### 2.2 Recursively Enumerable Languages
