# 离散数学及其应用

<!-- !!! tip "说明"

    此文档正在更新中…… -->

## 课程介绍

!!! info "注意"

    此为 2023-2024 春夏学期课程安排，仅供参考

wyl老师

全英文授课

学的内容看起来比较杂，是为后面学数据结构等等的课打基础的

### 考核方式

#### 作业（10%）

作业按照对错打分

??? quote "碎碎念"

    哎，怎么说呢，有时候活套一些吧，别吃亏

#### 小测（20%）

#### 期中考试（20%）

#### 期末考试（50%）

## 历年题整理

[浙江大学课程攻略共享计划](https://qsctech.github.io/zju-icicles/%E7%A6%BB%E6%95%A3%E6%95%B0%E5%AD%A6%E5%8F%8A%E5%85%B6%E5%BA%94%E7%94%A8/){:target="_blank"}

### 2023-2024 春夏 期中

试题：

<embed src="../../../file/discrete_math/discrete_doc3.pdf" type="application/pdf" width="100%" height="500" />

??? success "部分答案"

    1. 判断题
        1. 1 - 5：$T\ F\ T\ T\ T$
        2. 6 - 10：$F\ T\ T\ F\ F$
        3. 11：$F$
    2. 填空题
        1. $(p \wedge q \wedge r) \vee (p \wedge q \wedge \neg r) \vee (\neg p \wedge q \wedge r) \vee (\neg p \wedge q \wedge \neg r) \vee (\neg p \wedge \neg q \wedge r) \vee (\neg p \wedge \neg q \wedge \neg r)$
        2. $\lbrace \varnothing,\lbrace \varnothing \rbrace,\lbrace \lbrace \varnothing \rbrace \rbrace,\lbrace \varnothing, \lbrace \varnothing \rbrace \rbrace \rbrace$
        3. $\lbrace (1,7),(2,10),(3,10),(4,7) \rbrace$
        4. $2^8$
        5. $(\log n)^3,\sqrt{n}\log n,n^{99}+n^{98},n^{100},2.5^n,(n!)^2$
        6. $P(24,20)$<br/>$0$
        7. (7)
            1. $4^{10}$
            2. $C(13,10)$
            3. $C(9,3)$
        8. $P(7,7)+\dfrac{P(7,7)C(6,1)}{P(2,2)}$
        9. $3256147$
        10. $\lbrace 1,2,3,6 \rbrace$
        11. $C(n+1,7)$
        12. $V(n) = 21V(n-1) + 105V(n-2)$
        13. $an + b + nc \cdot 2^n$
    3. No，反证法
    4. 4
        1. $p \vee q$<br/>$\neg r \rightarrow \neg p \equiv r \vee \neg p$<br/>$r \rightarrow s \equiv \neg r \vee s$<br/>$\neg q$<br/>$\therefore s$
        2. valid
    5. $\lbrace 1,2 \rbrace \lbrace 3,4 \rbrace \lbrace 5,6 \rbrace ··· \lbrace 2n-1,2n \rbrace$，$n$ 个 set，但需要 $n + 1$ 个正数，必存在两个数是相邻的，相邻的数互质
    6. $L.H.S = C_n^n + C_{n+1}^n + C_{n-2}^n + ··· + C_{n+r}^n$<br/>$R.H.S = C_{n+r+1}^{n+1}$<br/>假设有一个长度为 $n+r+1$ 的 $01$ 字符串，要求刚好有 $n+1$ 个 $1$，满足此要求的字符串有多少个。$R.H.S$ 就是从 $n+r+1$ 中直接选 $n+1$ 个。$L.H.S$：$C_n^n$ 表示最后一个 1 在 $(n+1)^{th}$ 的位置；$C_{n+1}^n$ 表示最后一个 1 在 $(n + 2)^{th}$ 的位置，在此位置之前有 $C_{n+1}^n$ 种选择；以此类推直至最后一个 1 在 $(n+r+1)^{th}$ 的位置，在此位置之前有 $C_{n+r}^r$ 种选择。每一项加起来就是 $L.H.S$
    7. $a_n = 2a_{n-1} + a_{n-2} + 2a_{n-5},\ a_0 = 1,\ a_1 = 2,\ a_2 = 5,\ a_3 = 12,\ a_4 = 29$<br/>当第一个为 $1\ coin$ 时：$a_{n-1}$<br/>当第一个为 $1\ bill$ 时：$a_{n-1}$<br/>当第一个为 $2\ bill$ 时：$a_{n-2}$<br/>当第一个为 $5\ coin$ 时：$a_{n-5}$<br/>当第一个为 $5\ bill$ 时：$a_{n-5}$

### 2018-2019 春夏 期末

试题：

<embed src="../../../file/discrete_math/discrete_doc1.pdf" type="application/pdf" width="100%" height="500" />

答案：

<embed src="../../../file/discrete_math/discrete_doc2.pdf" type="application/pdf" width="100%" height="500" />

## 个人感受

一门题看起来很简单，但就是不会做的课 😅

??? quote "碎碎念"

    但老师真得很细心，感觉最后我那绩点都对不起老师 😢