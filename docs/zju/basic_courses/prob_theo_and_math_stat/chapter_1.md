# 1 概率论的基本概念

<!-- !!! tip "说明"

    此文档正在更新中…… -->

!!! info "说明"

    1. 有些公式块因为已经有图片了，懒得打 $\KaTeX$ 了，所以就直接用图片替代了
    2. 本文档仅涉及部分内容，仅可用于复习重点知识

## 1 样本空间，随机事件

### 1.2 事件的相互关系及运算

**互斥事件：** 设 $A,B$ 为两随机事件，当 $A \cap B = \varnothing$ ($P(AB) = 0$) 时，称事件 $A$ 与事件 $B$ **互不相容（或互斥）**

**差事件：** $A - B = A \cap \bar{B}$

## 2 频率与概率

### 2.2 概率

$P(A) = P(B) + P(\bar{A}B)$

$P(A \cup B) = P(A) + P(B) - P(AB)$

$P(A - B) = P(A) - P(AB) = P(A\bar{B})$

## 3 等可能概型

在抽签问题（无放回）中，第 $k(1 \leqslant k \leqslant n)$ 次摸到红球的概率即为第 1 次摸到红球的概率，与 $k$ 无关

## 4 条件概率

### 4.3 全概率公式、贝叶斯公式

**全概率公式：**
$$
P(A) = \sum\limits_{j = 1}^nP(B_j)P(A|B_j)
$$
**贝叶斯公式：**
$$
P(B_k|A) = \dfrac{P(B_kA)}{P(A)} = \dfrac{P(B_k)P(A|B_k)}{\sum\limits_{j = 1}^nP(B_j)P(A|B_j)}
$$

## 5 事件的独立性与独立试验

**定义：** 设 $A, B$ 为两随机事件，当
$$
P(AB) = P(A)P(B)
$$
时，称事件 $A, B$ **相互独立**

==两两独立的事件不一定相互独立==
