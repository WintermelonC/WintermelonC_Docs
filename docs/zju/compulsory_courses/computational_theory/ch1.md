# 1 Sets, Relations, and Languages

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Sets

!!! quote ""

    就是[离散数学](../../basic_courses/discrete_math.md){:target="_blank"}学的那些

A **set** is a collection of objects. 例如，四个字母 a, b, c, d 的 collection 是一个 set，常记作 $L = \lbrace a,b,c,d \rbrace$。构成一个 set 的 objects 被称为 **elements** / **members**. 例如，b 是 $L$ 的一个 element，记作 $b \in L$，称为 b is in $L$ 或 $L$ contains b. z 不是 $L$ 的 element，记作 $z \notin L$

两个集合 equal 当且仅当它们拥有相同的元素（互异性、无序性）

- **singleton**：单元素集合 / 单例
- **empty set**：空集，$\emptyset$

A set $A$ is a **subset** of a set **B**，记作 $A \subseteq B$

**proper subset**：真子集，记作 $A \subset B$

!!! tip ""

    $A \subseteq B, B \subseteq A \iff A = B$

- **union**：并集 $\cup$
- **intersection**：交集 $\cap$
- **difference**：差集 $A - B$

!!! tip "集合运算律"

    1. Idempotency
    2. Commutativity
    3. Associativity
    4. Distributivity
    5. Absorption

        1. $(A \cup B)\cap A = A$<br/>
        2. $(A \cap B)\cup A = A$

    6. DeMorgan's laws

        1. $A - (B \cup C) = (A - B) \cap (A - C)$
        2. $A - (B \cap C) = (A - B) \cup (A - C)$

!!! example "证明 De Morgan's laws"

    <figure markdown="span">
      ![Img 1](../../../img/computational_theory/ch1/computational_ch1_img1.png){ width="800" }
    </figure>

Two sets are **disjoint** if they have no element in common

如果 $S$ 是任意 sets 的 set，则集合 $\bigcup S$ 的 elements 是 $S$ 中所有 sets 的 elements

例如，$S = \lbrace \lbrace a,b \rbrace,\lbrace b,c \rbrace,\lbrace c,d \rbrace\rbrace$，$\bigcup S = \lbrace a,b,c,d \rbrace$

相似的，还有 $\bigcap S$

集合 $A$ 所有 subsets 的 collection 也是一个 set，称为 **power set** of $A$，记作 $2^A$

例如，$2^{\lbrace c,d\rbrace} = \lbrace \lbrace c,d\rbrace,\lbrace c\rbrace,\lbrace d\rbrace,\emptyset \rbrace$

$\Pi$ is a **partition** of A if $\Pi$ is a set of subsets of A such that

1. $\emptyset \notin \Pi$
2. distinct members of $\Pi$ are disjoint ($\forall S, T \in \Pi, S \not ={T}, S \cap T = \emptyset$)
3. $\bigcup \Pi = A$

例如，$\lbrace \lbrace a,b \rbrace,\lbrace c \rbrace,\lbrace d \rbrace\rbrace$ is a partition of $\lbrace a,b,c,d\rbrace$

## 2 Relations and Functions

**ordered pair**：顺序对
**components**：顺序对的元素

1. $(a,b)$ 和 $(b,a)$ 是 different
2. 顺序对的两个 components 可以不一样

The **Cartesian product** of two sets $A$ and $B$, denoted by $A \times B$, is the set of all ordered pairs $(a,b)$ with $a \in A$ and $b \in B$

A **binary relation** on two sets $A$ and $B$ is a subset of $A \times B$

一般的，$(a_1, \cdots, a_n)$ is an **ordered tuple**（元素不一定互不相同）

- ordered 2-tuples = ordered pairs
- ordered 3-tuples = ordered triples
- ordered 4-tuples = ordered quadruples
- ordered 5-tuples = ordered quintuples
- ordered 6-tuples = ordered sextuples

**sequence**：更通用的术语，指一个具有特定长度 n 的有序元组

**n-fold Cartesian product**：n 重笛卡尔积

$A$ 自身的 n-fold Cartesian product 记作 $A^n$

**n-ary relation** on sets $A_1, \cdots, A_n$ is a subsets of $A_1 \times \cdots \times A_n$

- 1-ary = unary
- 2-ary = binary
- 3-ary = ternary

A **function** from a set $A$ to a set $B$ is a binary relation $R$ on $A$ and $B$ with the following special property: for each element $a \in A$, there is *exactly one* ordered pair in $R$ with first component $a$

> 不能一对多，可以多对一

$f: A \mapsto B$

1. call $A$ the **domain** of $f$
2. $f(a)$ is called the **image** of $a$ under $f$
3. $f(a_1, \cdots, a_n) = b$, call $a_i$ the **arguments** of $f$, call $b$ the corresponding **value** of $f$

- **one-to-one**：单射（这个英文称呼感觉有点歧义）
- $f: A \mapsto B$ is **onto** $B$ if each element of $B$ is the image under $f$ of some element of $A$. 满射
- $f: A \mapsto B$ is a **bijection** between $A$ and $B$ if it is both one-to-one and onto $B$. 一一对应 / 双射

The **inverse** of a binary relation $R \subseteq A \times B$, denoted $R^{-1} \subseteq B \times A$, is the relation $\lbrace (b,a):(a,b) \in R \rbrace$

$Q \circ R = QR = \lbrace (a,b): \exist c\ (a,c) \in Q, (c,b) \in R \rbrace$

$(f \circ g)(a) = f(g(a))$

## 3 Special Types of Binary Relations

relation 可以用 **directed graph** 来表示

- **node**
- **edge**
- **path**：**length**，**cycle**

例如：$R=\lbrace (a,b),(b,a),(a,d),(d,c),(c,c),(c,a) \rbrace$

<figure markdown="span">
  ![Img 2](../../../img/computational_theory/ch1/computational_ch1_img2.png){ width="200" }
</figure>

A relation $R \subseteq A \times A$ is

1. **reflexive** if $\forall a \in A,(a,a) \in R$
2. **symmetric** if $(a,b) \in R \implies (b,a) \in R$
3. **antisymmetric** if $(a,b) \in R \wedge a \not ={b} \implies (b,a) \notin R$
4. **transitive** if $(a,b) \in R, (b,c) \in R \implies (a,c) \in R$

一个不存在形如 $(a,a)$ 对的 symmetric relation 称作 **undirected graph**，简称 **graph**，例如：

<figure markdown="span">
  ![Img 3](../../../img/computational_theory/ch1/computational_ch1_img3.png){ width="600" }
</figure>

!!! tip ""

    一个 relation 可以既不是 symmetric 也不是 antisymmetric

一个 relation 如果是 reflexive，symmetric，transitive 的，称为 **equivalence relation**

The clusters of an equivalence relation are called its **equivalence classes**. $[a] = \lbrace b:(a,b) \in R \rbrace$

!!! tip ""

    Let $R$ be an equivalence relation on a nonempty set $A$. Then the equivalence classes of $R$ constitute a partition of $A$

!!! example "proof"

    <figure markdown="span">
      ![Img 4](../../../img/computational_theory/ch1/computational_ch1_img4.png){ width="800" }
    </figure>

一个 relation 如果是 reflexive，antisymmetric， transitive 的，称为 **partial order**

如果 $R \subseteq A \times A$ 是 partial order，则一个 element $a \in A$ 是 **minimal** 如果满足条件：当且仅当 $a = b$，有 $(b,a) \in R$

一个 partial order $R \subset A \times A$ 是 **total order** if $\forall a,b \in A$，either $(a, b ) \in R$ or $(b,a) \in R$