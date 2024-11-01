# 7 Divide and Conquer

<!-- !!! tip "说明"

    此文档正在更新中…… -->

!!! tip "说明"

    本文档只涉及部分知识点，仅可用来复习重点知识

## 3 Solving Recurrent Equations

### 3.1 Substitution method

### 3.2 Recursion-tree method

### 3.3 Master method

!!! note ""

    设 $a \geqslant 1, b > 1$，$T(n)$ 满足：
    $$
    T(n) = aT(\frac{n}{b}) + f(n)
    $$
    并且 $T(0) = 0, T(1) = \Theta(1)$，==式中 $\frac{n}{b}$ 可替代 $\lfloor \frac{n}{b} \rfloor$ 和 $\lceil \frac{n}{b} \rceil$==

1. 若 $f(n) = \Theta(n^c),\ c \geqslant 0$
      1. 若 $c > \log_ba$，则 $T(n) = \Theta(n^c)$
      2. 若 $c = \log_ba$，则 $T(n) = \Theta(n^c \log n)$
      3. 若 $c < \log_ba$，则 $T(n) = \Theta(n^{\log_ba})$
2. 若 $f(n) = \Theta(n^{\log_ba}\log^kn)$，则 $T(n) = \Theta(n^{\log_ba}\log^{k+1}n)$
3. 若对某个常数 $\epsilon > 0$ 有 $f(n) = \Omega(n^{\log_ba + \epsilon})$，且对某个常数 $c < 1$ 和所有足够大的 $n$ 有 $af(\frac{n}{b}) \leqslant cf(n)$，则 $T(n) = \Theta(f(n))$

!!! tip "情况 1、2"

    情况 1、2 中的 $\Theta$ 符号，可以换成 $O$ 或 $\Omega$

    > 例子见下文

???+ question "PTA 7.1"

    When solving a problem with input size N by divide and conquer, if at each stage the problem is divided into 8 sub-problems of equal size $\frac{N}{3}$, and the conquer step takes $O(N^2\log N)$ to form the solution from the sub-solutions, then the overall time complexity is __.

    A. $O(N^2\log N)$<br/>
    B. $O(N^2\log^2 N)$<br/>
    C. $O(N^3\log N)$<br/>
    D. $O(N^{\frac{\log 8}{\log 3}})$

    ??? success "答案"

        A

        ---

        $T(n) = 8T(\frac{n}{3}) + O(n^2\log n)$

        $a = 8, b = 3$

        $1 < \log_ba = \log_38 < 2$

        存在 $\epsilon > 0$，有 $f(n) = \Omega(n^{\log_ba + \epsilon})$，当 $n$ 足够大时，验证存在 $c < 1$，使

        $$
        af(\frac{n}{b}) \leqslant cf(n)\\
        8f(\frac{n}{3}) \leqslant cf(n)\\
        8(\frac{n}{3})^2\log \frac{n}{3} \leqslant cn^2\log n\\
        \frac{8}{9}n^2(\log n - \log 3) \leqslant cn^2\log n\\
        \frac{8}{9}n^2\log n - \frac{8}{9}n^2\log 3 \leqslant cn^2\log n\\
        $$

        $n$ 足够大时， $- \frac{8}{9}n^2\log 3$ 可忽略，则

        $$
        \frac{8}{9}n^2\log n \leqslant cn^2\log n\\
        $$

        存在 $\frac{8}{9} \leqslant c < 1$，使 $af(\frac{n}{b}) \leqslant cf(n)$ 成立

        满足情况 3，所以 $T(n) = \Theta(f(n)) = O(N^2\log N)$

???+ question "PTA 7.2"

    To solve a problem with input size N by divide and conquer algorithm, among the following methods, __ is the worst.

    A. divide into 2 sub-problems of equal complexity $\frac{N}{3}$ and conquer in $O(N)$<br/>
    B. divide into 2 sub-problems of equal complexity $\frac{N}{3}$ and conquer in $O(N\log N)$<br/>
    C. divide into 3 sub-problems of equal complexity $\frac{N}{2}$ and conquer in $O(N)$<br/>
    D. divide into 3 sub-problems of equal complexity $\frac{N}{3}$ and conquer in $O(N\log N)$

    ??? success "答案"

        C

        ---

        **A 选项：**

        $T(n) = 2T(\frac{n}{3}) + O(n)$

        $f(n) = O(n)$，$a = 2, b = 3$

        $c = 1 > \log_ba = \log_32$

        满足情况 1，则 $T(n) = O(n)$

        **B 选项：**

        $T(n) = 2T(\frac{n}{3}) + O(n \log n)$

        $a = 2, b = 3$

        $0 < \log_ba = \log_32 < 1$

        验证满足情况 3，则 $T(n) = O(n\log n)$

        **C 选项：**

        $T(n) = 3T(\frac{n}{2}) + O(n)$

        $f(n) = O(n)$，$a = 3, b = 2$

        $c = 1 < \log_ba = \log_23$

        满足情况 1，则 $T(n) = O(n^{\log_ba}) = O(n^{\log_23})$

        **D 选项：**

        $T(n) = 3T(\frac{n}{3}) + O(n \log n)$

        $a = 3, b = 3$

        $\log_ba = \log_33 = 1$

        $f(n) = O(n^{\log_ba}\log^k n), k = 1$

        满足情况 2，则 $T(n) = O(n^{\log_ba}\log^{k+1} n) = O(n\log^2 n)$

        ---

        最后 4 个比较一下，C 选项的最差

???+ question "PTA 7.3"

    3-way-mergesort : Suppose instead of dividing in two halves at each step of the mergesort, we divide into three one thirds, sort each part, and finally combine all of them using a three-way-merge.  What is the overall time complexity of this algorithm ?

    A. $O(n(\log^2 n))$<br/>
    B. $O(n^2\log n)$<br/>
    C. $O(n\log n)$<br/>
    D. $O(n)$

    ??? success "答案"

        C

        ---

        $T(n) = 3T(\frac{n}{3}) + O(n)$

        $f(n) = O(n)$，$a = 3, b = 3$

        $c = 1 = \log_ba = \log_33$

        满足情况 1，则 $T(n) = O(n^c\log n) = O(n\log n)$

???+ question "PTA 7.4"

    Which one of the following is the lowest upper bound of T(n) for the following recursion  $T(n)=2T(\sqrt{n})+\log n$?

    A. $O(\log n\log \log n)$<br/>
    B. $O(\log^2 n)$<br/>
    C. $O(n\log n)$<br/>
    D. $O(n^2)$

    ??? success "答案"

        A

        ---

        令 $n = 2^m$，则 $m = \log n$

        $T(2^m) = 2T(2^{\frac{m}{2}}) + m$

        令 $S(m) = T(2^m)$，则

        $S(m) = 2S(\frac{m}{2}) + m$

        $f(m) = O(m)$，$a = 2, b = 2$

        $c = 1 = \log_ba = \log_22$

        满足情况 1，则 $S(m) = O(m\log m)$

        $T(n) = T(2^m) = S(m) = O(m \log m) = O(\log n \log \log n)$