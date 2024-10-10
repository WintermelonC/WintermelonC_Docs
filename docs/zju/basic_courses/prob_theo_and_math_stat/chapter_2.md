# 随机变量及其概率分布

!!! tip "说明"

    此文档正在更新中……

## 3 随机变量的概率分布函数

### 3.1 定义

设 $X$ 为一随机变量， $x$ 为任意实数，函数
$$
F(x) = P \lbrace X \leqslant x \rbrace
$$
称为随机变量 $X$ 的 **概率分布函数** ，简称 **分布函数**

!!! abstract "几何意义"

    $F(x)$ 的几何意义：
    <figure markdown="span">
        ![Img 1](../../../img/prob_theo_and_math_stat/chapter_2/prob_math_ch2_img1.png){ width="300" }
    </figure>
    将 $X$ 设想成一随机点，那么 $X$ 落在区间 $(- \infty, x]$ 上的概率即为 $F(x)$

对任意的实数 $x_1, x_2 ( x_1 < x_2 )$ ，有
$$
P \lbrace x_1 < X \leqslant x_2 \rbrace = P \lbrace X \leqslant x_2 \rbrace - P \lbrace X \leqslant x_1 \rbrace = F ( x_2 ) -  F ( x_1 )
$$

### 3.2 性质

1. $0 \leqslant F(x) \leqslant 1$，且有 $F(-\infty) = 0, F(+\infty) = 1$
2. $F(x)$ 单调不减<br/>
   当 $x_2 > x_1$ 时， $F(x_2) - F(x_1) = P \lbrace x_1 < X \leqslant x_2 \rbrace \geqslant 0$， 因此 $F(x_2) \geqslant F(x_1)$
3. $F(x)$ 右连续，即 $F(x + 0) = F(x)$
4. $F(x) - F(x - 0) = P \lbrace X = x \rbrace$