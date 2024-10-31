# 7 Divide and Conquer

!!! tip "说明"

    此文档正在更新中……

!!! tip "说明"

    本文档只涉及部分知识点，仅可用来复习重点知识

## 3 Solving Recurrent Equations

### 3.1 Substitution method

### 3.2 Recursion-tree method

### 3.3 Master method

!!! note ""

    设 $a \geqslant 1, b \geqslant 2, c \geqslant 0$，$T(n)$ 满足：
    $$
    T(n) = aT(\frac{n}{b}) + f(n)
    $$
    
    1. $f(n) = \Theta(n^c)$，尝试情况 1、2、3
    2. 否则尝试情况 4、5
    
    并且 $T(0) = 0, T(1) = \Theta(1)$，式中 $\frac{n}{b}$ 可替代 $\lfloor \frac{n}{b} \rfloor$ 和 $\lceil \frac{n}{b} \rceil$

1. 若 $c > \log_ba$，则 $T(n) = \Theta(n^c)$
2. 若 $c = \log_ba$，则 $T(n) = \Theta(n^c \log n)$
3. 若 $c < \log_ba$，则 $T(n) = \Theta(n^{\log_ba})$
4. 若 $f(n) = \Theta(n^{\log_ba}\log^kn)$，则 $T(n) = \Theta(n^{\log_ba}\log^{k+1}n)$
5. 若对某个常数 $\epsilon > 0$ 有 $f(n) = \Omega(n^{\log_ba + \epsilon})$，且对某个常数 $c < 1$ 和所有足够大的 $n$ 有 $af(\frac{n}{b}) \leqslant cf(n)$，则 $T(n) = \Theta(f(n))$