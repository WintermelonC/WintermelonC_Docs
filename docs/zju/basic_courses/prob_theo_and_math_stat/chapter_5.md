# 5 大数定律及中心极限定律

<!-- !!! tip "说明"

    此文档正在更新中…… -->

!!! info "说明"

    1. 有些公式块因为已经有图片了，懒得打 $\KaTeX$ 了，所以就直接用图片替代了
    2. 本文档仅涉及部分内容，仅可用于复习重点知识

## 1 大数定律

### 1.1 依概率收敛

**定义：**

设 $\lbrace Y_n, n \geqslant 1 \rbrace$ 为一随机变量序列，$c$ 为一常数。若对任意的 $\epsilon > 0$，都有

$$
\lim\limits_{n \rightarrow + \infty}P\lbrace |Y_n - c| \geqslant \epsilon \rbrace = 0\\
\Leftrightarrow \lim\limits_{n \rightarrow + \infty}P\lbrace |Y_n - c| < \epsilon \rbrace = 1
$$

成立，则称 $\lbrace Y_n, n \geqslant 1 \rbrace$ **依概率收敛** 于 $c$，记为 $Y_n \xrightarrow{P} c, n \rightarrow + \infty$

**性质：**

设 $X_n \xrightarrow{P} a, n \rightarrow +\infty$，若函数 $f(x)$ 在点 $x=a$ 处连续，则有 $f(X_n) \xrightarrow{P} f(a)$

### 1.2 马尔可夫不等式

若随机变量 $Y$ 的 $k$ 阶（原点）矩存在（$k > 0$），则对任意的 $\epsilon > 0$，有

$$
P\lbrace |Y| \geqslant \epsilon \rbrace \leqslant \dfrac{E(|Y|^k)}{\epsilon^k}\\
\Leftrightarrow P\lbrace |Y| < \epsilon \rbrace \geqslant 1- \dfrac{E(|Y|^k)}{\epsilon^k}
$$

### 1.3 切比雪夫不等式

设随机变量 $X$ 的数学期望和方差存在，分别记为 $\mu, \sigma^2$，则对任意的 $\epsilon > 0$，有

$$
P\lbrace |X - \mu| \geqslant \epsilon \rbrace \leqslant \dfrac{\sigma^2}{\epsilon^2}\\
\Leftrightarrow P\lbrace |X - \mu| < \epsilon \rbrace \geqslant 1- \dfrac{\sigma^2}{\epsilon^2}
$$

### 1.4 大数定律

**定义：**

设 $\lbrace X_i,i\geqslant 1\rbrace$ 为一随机变量序列，若存在常数序列 $\lbrace c_n,n \geqslant 1\rbrace$，使得对任意的 $\epsilon > 0$，有

$$
\lim\limits_{n \rightarrow +\infty}P\lbrace |\dfrac{1}{n}\sum\limits_{i=1}^{n}X_i - c_n| \geqslant \epsilon \rbrace = 0\\
\Leftrightarrow \lim\limits_{n \rightarrow +\infty}P\lbrace |\dfrac{1}{n}\sum\limits_{i=1}^{n}X_i - c_n| < \epsilon \rbrace = 1
$$

成立，即当 $n \rightarrow +\infty$ 时，有 $\dfrac{1}{n}\sum\limits_{i=1}^{n}X_i \xrightarrow{P} c,\ n \rightarrow +\infty$，则称随机变量序列 $\lbrace X_i,i\geqslant 1\rbrace$ 服从 **弱大数定律**，简称 **大数定律**

#### 1.4.1 切比雪夫大数定律

设 $\lbrace X_i,i\geqslant 1\rbrace$ 为 ==独立的、同期望、同方差== 的随机变量序列，则对任意的 $\epsilon > 0$，有

$$
\lim\limits_{n \rightarrow +\infty}P\lbrace |\dfrac{1}{n}\sum\limits_{i=1}^{n}X_i - \mu| \geqslant \epsilon \rbrace = 0
$$

即 $\dfrac{1}{n}\sum\limits_{i=1}^{n}X_i \xrightarrow{P} \mu (n \rightarrow +\infty)$，并认为此时随机变量序列 $\lbrace X_i,i\geqslant 1\rbrace$ 服从大数定律

#### 1.4.2 辛钦大数定律

设 $\lbrace X_i,i\geqslant 1\rbrace$ 为 ==独立同分布== (1) 的随机变量序列，则对任意的 $\epsilon > 0$，有
{.annotate}

1. 同分布不一定同方差，因为方差可能不存在

$$
\lim\limits_{n \rightarrow +\infty}P\lbrace |\dfrac{1}{n}\sum\limits_{i=1}^{n}X_i - \mu| \geqslant \epsilon \rbrace = 0
$$

即 $\dfrac{1}{n}\sum\limits_{i=1}^{n}X_i \xrightarrow{P} \mu (n \rightarrow +\infty)$，并认为此时随机变量序列 $\lbrace X_i,i\geqslant 1\rbrace$ 服从大数定律

#### 1.4.3 伯努利大数定律

设 $n_A$ 为 $n$ 重伯努利试验中事件 $A$ 发生的次数，$p(0 < p < 1)$ 为事件 $A$ 在每次试验中发生的概率，即 $P(A) = p$，则对任意的 $\epsilon > 0$，有

$$
\lim\limits_{n \rightarrow +\infty}P\lbrace |\dfrac{n_A}{n} - p| \geqslant \epsilon \rbrace = 0
$$

---

**推论**

设 $\lbrace X_i,i\geqslant 1\rbrace$ 为独立同分布的随机变量序列，若 $h(x)$ 为一连续函数，且 $E(|h(X_1)|) < +\infty$，则对任意的 $\epsilon > 0$，有

$$
\lim\limits_{n \rightarrow +\infty}P\lbrace |\dfrac{1}{n}\sum\limits_{i=1}^{n}h(X_i) - a| \geqslant \epsilon \rbrace = 0
$$

其中 $a = E(h(X_1))$，即 $\dfrac{1}{n}\sum\limits_{i=1}^{n}h(X_i) \xrightarrow{P} a ,\ n \rightarrow +\infty$

## 2 中心极限定理

### 2.1 林德伯格 - 莱维中心极限定理

设 $\lbrace X_i,i\geqslant 1 \rbrace$ 为独立同分布的随机变量序列，且数学期望 $E(X_i) = \mu$ 和方差 $Var(X_i) = \sigma^2$ 均存在（$\sigma > 0$），则对任意的 $x \in R$，有

$$
\lim\limits_{n \rightarrow +\infty}P\lbrace \dfrac{\sum\limits_{i=1}^n X_i - n\mu}{\sigma \sqrt{n}} \leqslant x \rbrace = \Phi(x)
$$

即当 $n$ 充分大时， $S_n = \sum\limits_{i=1}^n X_i \overset{近似地}{\sim} N(n\mu, n \sigma^2) \Leftrightarrow \dfrac{S_n}{n} = \dfrac{\sum\limits_{i=1}^n X_i}{n} \overset{近似地}{\sim} N(\mu, \dfrac{\sigma^2}{n})$

也称 **独立同分布的中心极限定理**

### 2.2 棣莫弗 - 拉普拉斯中心极限定理

设 $n_A$ 为在 $n$ 重伯努利试验中事件 $A$ 发生的次数，$p$ 为事件 $A$ 在每次试验中发生的概率，即 $P(A) = p(0 < p < 1)$，则对任意的 $x \in R$，有

$$
\lim\limits_{n \rightarrow +\infty}P\lbrace \dfrac{n_A - np}{\sqrt{np(1-p)} \leqslant x} \rbrace= \Phi(x)
$$

即当 $n$ 充分大时，二项分布 $B(n,p)$ 可用正态分布 $N(np, np(1-p))$ 来逼近