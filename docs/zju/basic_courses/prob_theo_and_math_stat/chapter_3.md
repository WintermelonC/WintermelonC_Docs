# 3 多维随机变量及其分布

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    1. 有些公式块因为已经有图片了，懒得打 $\KaTeX$ 了，所以就直接用图片替代了
    2. 本文档仅涉及部分内容，仅可用于复习重点知识

## 1 二维离散型随机变量

### 1.2 二维离散型随机变量的边际分布

$P\lbrace Y = y_i \rbrace = \sum\limits_{i=1}^{+\infty}p_{ij} \xlongequal{def} p_{.j}$

### 1.3 二维离散型随机变量的条件分布

$P\lbrace X = x_i | Y = y_i \rbrace = \dfrac{p_{ij}}{p_{.j}}$

## 2 二维随机变量的分布函数

### 2.1 二维随机变量的联合分布函数

$P \lbrace x_1 < X \leqslant x_2, y_1 < Y \leqslant y_2 \rbrace = F(x_2,y_2) - F(x_1, y_2) - F(x_2, y_1) + F(x_1, y_1)$

### 2.2 二维随机变量的边际分布函数

$F_X(x) = F(x, +\infty)$

### 2.3 二维随机变量的条件分布函数

$F_{Y|X}(y|x_i) = P\lbrace Y \leqslant y|X = x_i\rbrace$

## 3 二维连续型随机变量

### 3.1 二维连续型随机变量的联合分布

$F(x,y) = \int_{-\infty}^x\int_{-\infty}^yf(u,v)dudv$

$\dfrac{\partial^2F(x,y)}{\partial x\partial y} = f(x,y)$

### 3.2 二维连续型随机变量的边际分布

$f_X(x) = \int_{-\infty}^{+\infty}f(x,y)dy$

### 3.3 二维连续型随机变量的条件分布

$f_{Y|X}(y|x) = \dfrac{f(x,y)}{f_X(x)}$

### 3.4 二元均匀分布和二元正态分布

## 4 随机变量的独立性

$X$与$Y$相互独立：$f(x,y) = f_X(x)f_Y(y)$

**定理：** 二维连续型随机变量 $X,Y$ 相互独立的充要条件是 $X,Y$ 的联合密度函数 $f(x,y)$ 几乎处处可写成 $x$ 的函数 $m(x)$ 与 $y$ 的函数 $n(y)$ 的乘积，即
$$
f(x,y) = m(x)n(y)
$$

## 5 多元随机变量函数的分布

### 5.1 $Z = X + Y$ 的分布

若 $(X,Y)$ 为二维离散型随机变量

$P\lbrace Z = z_k \rbrace = \sum\limits_{i=1}^{+\infty}P\lbrace X = x_i \rbrace P \lbrace Y = z_k - x_i \rbrace$

$P\lbrace Z = z_k \rbrace = \sum\limits_{i=1}^{+\infty}P\lbrace X = z_k - y_j \rbrace P \lbrace Y = y_j \rbrace$

---

若 $(X,Y)$ 为二维连续型随机变量

$f_Z(z) = \int_{-\infty}^{+\infty}f(x,z-x)dx$

$f_Z(z) = \int_{-\infty}^{+\infty}f(z-y,y)dy$

当 $X,Y$ 相互独立时

$f_Z(z) = \int_{-\infty}^{+\infty}f_X(x)f_Y(z-x)dx$

$f_Z(z) = \int_{-\infty}^{+\infty}f_X(z-y)f_Y(y)dy$

---

==n 个相互独立的服从泊松分布的随机变量的和仍服从泊松分布，其参数为 n 个分布的参数之和==

==n 个相互独立的正态变量的线性组合仍为正态变量==

### 5.2 $M = max\lbrace X,Y\rbrace, N = min\lbrace X,Y\rbrace$ 的分布

若 $X, Y$ 相互独立

$F_M(t) = F_X(t)F_Y(t)$

$F_N(t) = 1 - [1 - F_X(t)][1 - F_Y(t)]$
