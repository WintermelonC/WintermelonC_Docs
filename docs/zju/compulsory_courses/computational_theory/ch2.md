# 2 Finite Automata

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Deterministic Finite Automata

A **deterministic finite automaton** is a quintuple $M = (K,\Sigma, \delta, s, F)$ where

1. $K$ is a finite set of **states**
2. $\Sigma$ is an alphabet
3. $s \in K$ is the **initial state**
4. $F \subseteq K$ is the set of **final states**
5. $\delta$, the **transition function**, is a function from $K \times \Sigma$ to $K$

**configuration** 描述了 DFA 在某个特定时刻的完整快照。一个配置被形式化地定义为 **当前状态** 和 **未读字符串** 的有序对，即属于笛卡尔积 $K \times \Sigma^*$

二元关系 $\vdash_M$ 在图灵机 $M$ 的两个配置之间成立，当且仅当机器可以通过一次移动从一个配置转换到另一个配置。因此，如果 $(q,w)$ 和 $(q',w')$ 是 $M$ 的两个配置，那么 $(q,w) \vdash_M (q', w')$ 当且仅当存在某个符号 $a \in \Sigma$，使得 $w = aw'$，并且转移函数满足 $\delta(q,a) = q'$。在这种情况下，我们说 **$(q,w)$ yields $(q',w')$ in one step**

实际上 $\vdash_M$ 是从 $K \times \Sigma^+$ 到 $K \times \Sigma^*$ 的一个函数，也就是说，除了形如 $(q,e)$ 的配置外，每个配置都有唯一确定的下一个配置。形如 $(q,e)$ 的配置表示图灵机 $M$ 已经消耗完所有输入，因此在此处停止运行

我们将 $\vdash_M$ 的 reflexive, transitive closure 记作 $\vdash_M^*$. $(q,w) \vdash_M^* (q', w')$ 被读作 **$(q,w)$ yields $(q',w')$**（在若干步（可能是零步）之后生成）

A string $w \in \Sigma^*$ is said to be **accepted** by $M$ 当且仅当存在某个状态 $q \in F$，使得 $(s,w) \vdash_M^*(q,e)$

the language accepted by $M$, $L(M)$, is the set of all strings accepted by $M$

<figure markdown="span">
  ![Img 1](../../../img/computational_theory/ch2/computational_ch2_img1.png){ width="800" }
</figure>

使用 **state diagram** 来方便的表示

<figure markdown="span">
  ![Img 2](../../../img/computational_theory/ch2/computational_ch2_img2.png){ width="200" }
</figure>

<figure markdown="span">
  ![Img 3](../../../img/computational_theory/ch2/computational_ch2_img3.png){ width="200" }
</figure>

## 2 Nondeterministic Finite Automata

$L = (ab\cup aba)^*$ 的 DFA 状态图

<figure markdown="span">
  ![Img 4](../../../img/computational_theory/ch2/computational_ch2_img4.png){ width="200" }
</figure>

> 这并不容易看懂

其 NFA 的状态图

<figure markdown="span">
  ![Img 5](../../../img/computational_theory/ch2/computational_ch2_img5.png){ width="200" }
  ![Img 6](../../../img/computational_theory/ch2/computational_ch2_img6.png){ width="200" }
</figure>

A **nondeterministic finite automaton** is a quintuple $M = (K,\Sigma, \Delta, s, F)$, where

1. $K$ is a finite set of **states**
2. $\Sigma$ is an alphabet
3. $s \in K$ is the **initial state**
4. $F \subseteq K$ is the set of **final states**
5. $\Delta$, the **transition relation**, is a subset of $K \times (\Sigma \cup \lbrace e\rbrace) \times K$

The relation $\vdash_M$ between configurations is defined as follows: $(q,w) \vdash_M (q', w')$ if and only if there is a $u \in \Sigma \cup \lbrace e\rbrace$ such that $w = uw'$ and $(q,u,q') \in \Delta$

$\vdash_M^*$ 同理

<figure markdown="span">
  ![Img 7](../../../img/computational_theory/ch2/computational_ch2_img7.png){ width="800" }
</figure>

由定义可知，DFA 是 NFA 的一种特殊情况

tow finite automata $M_1$ and $M_2$ are **equivalent** if and only if $L(M_1) = L(M_2)$

!!! tip ""

    每一个 NFA 都有和它 equivalent 的 DFA

令 $E(q) = \lbrace p \in K: (q,e) \vdash_M^* (p,e)\rbrace$

<figure markdown="span">
  ![Img 8](../../../img/computational_theory/ch2/computational_ch2_img8.png){ width="800" }
</figure>

现在定义一个和原状态机 $M$ 等价的状态机 $M' = (K',\Sigma,\delta',s',F')$

1. $K' = 2^K$
2. $s' = E(s)$
3. $F' = \lbrace Q \subseteq K: Q \cap F \not ={\emptyset}\rbrace$
4. $\delta'(Q,a)=\bigcup\lbrace E(p):p\in K \ and\ (q,a,p)\in \Delta\ for\ some\ q \in Q\rbrace$

