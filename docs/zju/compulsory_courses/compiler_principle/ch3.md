# 3 Parsing

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

<figure markdown="span">
  ![Img 28](../../../img/compiler_principle/ch3/compiler_ch3_img28.png){ width="600" }
</figure>

## 1 Context-Free Grammars

### 1.1 Ambiguity

<figure markdown="span">
  ![Img 1](../../../img/compiler_principle/ch3/compiler_ch3_img1.png){ width="600" }
</figure>

一个 grammar 如果分析一个字符串能得到两个 parse trees，就说明它是 ambiguous

<figure markdown="span">
  ![Img 2](../../../img/compiler_principle/ch3/compiler_ch3_img2.png){ width="600" }
</figure>

## 2 Top-Down Parsing

通用的 CFG 解析算法虽然能处理所有文法，但效率很低，甚至占编译时间的 1/3，因此实际编译器中会使用针对特定文法的专用算法来提高效率

递归下降分析：从起始符号开始，尝试根据输入内容选择相应的产生式展开，递归地匹配输入。它是预测性的，意味着在每一步，只需看当前输入的一个符号就能决定用哪条产生式。虽然实现简单，但它只能处理 LL(1)（Left-to-right parse; Leftmost-derivation; 1 symbol lookahead）文法（即一种确定性的、无需回溯的文法）

<figure markdown="span">
  ![Img 3](../../../img/compiler_principle/ch3/compiler_ch3_img3.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 4](../../../img/compiler_principle/ch3/compiler_ch3_img4.png){ width="600" }
</figure>

但是存在一个问题：

<figure markdown="span">
  ![Img 5](../../../img/compiler_principle/ch3/compiler_ch3_img5.png){ width="600" }
</figure>

这就需要 predictive parsing

### 2.1 Predictive Parsing

预测性分析的基本要求：在自顶向下分析中，解析器需要根据当前输入的第一个符号来决定使用哪条产生式。这就要求，对于同一个非终结符的不同产生式，它们的首终结符集合（FIRST 集）必须互不相交。否则解析器就无法确定该选哪一条

为了让文法适用于预测性分析，需要先计算每条产生式的 FIRST 集（即该产生式可能推导出的第一个终结符）。如果冲突存在，就需要改写文法，通常的做法是消除左递归并进行左公因子提取，使得每个非终结符的各个产生式的 FIRST 集互不相交

#### 2.1.1 FIRST and FOLLOW Sets

1. FIRST 集：对于任意文法符号串 $γ$，FIRST($γ$) 是所有可能从 $γ$ 推导出的字符串的第一个终结符的集合
2. FOLLOW 集：对于非终结符 $X$，FOLLOW($X$) 是所有可能紧跟在 $X$ 后面出现的终结符的集合
3. NULLABLE 集：如果一个非终结符能推出空字符串，那么它就属于 NULLABLE 集

那么对于非终结符 $X$，产生式 $X → γ$，可能的首终结符可以是：

1. 来自 FIRST($γ$) 的终结符
2. 如果 $γ$ 可以推导出空串，那么 FOLLOW($X$) 中的任何记号也可以作为首终结符

$$
FIRST(X)=
\begin{cases}
    \lbrace X \rbrace & \text{如果} X \text{是终结符}\\
    FIRST(X) \cup FIRST(Y_1Y_2\cdots Y_k) & \text{如果} X \text{是非终结符并且} X \rightarrow Y_1Y_2\cdots Y_k
\end{cases}
$$

$$
FOLLOW(X)=
\begin{cases}
    FOLLOW(X) \cup FIRST(\beta) & \text{if } Y \rightarrow \alpha X\beta\\
    FOLLOW(X) \cup FOLLOW(Y)& \text{if } Y \rightarrow \alpha X \beta \text{ and } \beta \rightarrow \epsilon
\end{cases}
$$

<figure markdown="span">
  ![Img 6](../../../img/compiler_principle/ch3/compiler_ch3_img6.png){ width="800" }
</figure>

#### 2.1.2 Predictive Parsing Tables

<figure markdown="span">
  ![Img 7](../../../img/compiler_principle/ch3/compiler_ch3_img7.png){ width="800" }
</figure>

表中空白的格子即代表语法错误（syntax errors）

LL(1) 文法的核心特征是：预测分析表中每个格子最多只有一条产生式

如果一个格子里有两条或更多产生式，说明在某个非终结符下，仅凭一个向前看符号无法唯一确定使用哪条产生式，这样的文法就不是 LL(1)

LL(k) 分析表：当向前看符号数量增加到 k 时，列不再对应单个终结符，而是对应所有可能的长度为 k 的终结符序列。例如，如果文法有终结符 a、b、c，那么 LL(2) 分析表的列就会是：aa、ab、ac、ba、bb、bc、ca、cb、cc 等

如果某个文法是 LL(k)，那么它也是 LL(k + n) (n ≥ 0)

#### 2.1.3 Stack-Based Implementation

<figure markdown="span">
  ![Img 8](../../../img/compiler_principle/ch3/compiler_ch3_img8.png){ width="800" }
</figure>

#### 2.1.4 Eliminate Left-Recursion

<figure markdown="span">
  ![Img 9](../../../img/compiler_principle/ch3/compiler_ch3_img9.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 10](../../../img/compiler_principle/ch3/compiler_ch3_img10.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 11](../../../img/compiler_principle/ch3/compiler_ch3_img11.png){ width="600" }
</figure>

## 3 Bottom-Up Parsing

LL(k) 语法分析是一种自顶向下的解析方法，它从左到右扫描输入，进行最左推导，并向前看 k 个记号来决定使用哪条产生式。它的优点是效率高、易于手工实现

LL(k) 的局限性：它必须仅凭产生式右部的前 k 个记号来决定使用哪条产生式，无法回退或试探其他可能性。如果两条产生式的前 k 个记号相同，就会发生冲突

<figure markdown="span">
  ![Img 12](../../../img/compiler_principle/ch3/compiler_ch3_img12.png){ width="600" }
</figure>

LR(k)（Left-to-right parse, Rightmost derivation, k-token lookahead）解析是一种自底向上的语法分析方法。它从左到右读取输入，并尝试反向构造最右推导（即通过归约操作将输入串逐步规约为起始符号）。LR(k) 可以推迟决策，直到看到产生式右部的全部内容，因此能处理更多类型的文法，包括左递归文法

<figure markdown="span">
  ![Img 13](../../../img/compiler_principle/ch3/compiler_ch3_img13.png){ width="600" }
</figure>

### 3.1 LR(0) Parsing

<figure markdown="span">
  ![Img 14](../../../img/compiler_principle/ch3/compiler_ch3_img14.png){ width="600" }
</figure>

将 NFA 转换为 DFA：

<figure markdown="span">
  ![Img 15](../../../img/compiler_principle/ch3/compiler_ch3_img15.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 16](../../../img/compiler_principle/ch3/compiler_ch3_img16.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 17](../../../img/compiler_principle/ch3/compiler_ch3_img17.png){ width="800" }
</figure>

<figure markdown="span">
  ![Img 18](../../../img/compiler_principle/ch3/compiler_ch3_img18.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 19](../../../img/compiler_principle/ch3/compiler_ch3_img19.png){ width="600" }
</figure>

### 3.2 SLR Parsing

LR(0) 存在 shift-reduce conflicts

<figure markdown="span">
  ![Img 20](../../../img/compiler_principle/ch3/compiler_ch3_img20.png){ width="600" }
</figure>

SLR 仅当输入符号属于 FOLLOW(A) 时才放置归约动作

<figure markdown="span">
  ![Img 21](../../../img/compiler_principle/ch3/compiler_ch3_img21.png){ width="600" }
</figure>

但 SLR 仍存在一些冲突

<figure markdown="span">
  ![Img 22](../../../img/compiler_principle/ch3/compiler_ch3_img22.png){ width="600" }
</figure>

### 3.3 LR(1) Parsing

<figure markdown="span">
  ![Img 23](../../../img/compiler_principle/ch3/compiler_ch3_img23.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 24](../../../img/compiler_principle/ch3/compiler_ch3_img24.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 25](../../../img/compiler_principle/ch3/compiler_ch3_img25.png){ width="600" }
</figure>

### 3.4 LALR(1) Parsing

规范 LR(1) 解析器为每个项目（产生式加位置）记录不同的向前看符号，导致状态数量可能非常大。对于实际编程语言的文法，LR(1) 状态数可能成百上千，导致解析表占用大量内存

在 LR(1) 项目集族中，经常出现两个状态：它们的核心项目（产生式和点的位置）完全相同，只是向前看符号集不同。LALR(1) 将这些状态合并为一个状态，将向前看符号集取并集

合并后状态数大幅减少，与 SLR(1) 或 LR(0) 的状态数相当，内存占用更小，解析表更紧凑。但可能引入新的归约-归约冲突（原本因向前看符号不同而可区分的归约动作可能冲突），但在实际编程语言文法中这种情况极少发生

<figure markdown="span">
  ![Img 26](../../../img/compiler_principle/ch3/compiler_ch3_img26.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 27](../../../img/compiler_principle/ch3/compiler_ch3_img27.png){ width="600" }
</figure>

### 3.5 LR Parsing of Ambiguous Grammars

大多数编程语言的文法规则都包含类似这样的形式：

$$
S \rightarrow \text{if } E \text{ then } S \text{ else } S\\
S \rightarrow \text{if } E \text{ then } S\\
S \rightarrow \text{other}
$$

几乎所有主流语言都规定 `else` 与最近的未匹配 `then` 结合。因此在遇到 `if E then S` 后面跟着 `else` 产生的冲突时，通常会选择 shift，将 `else` 读入，与内层 `then` 匹配

<figure markdown="span">
  ![Img 29](../../../img/compiler_principle/ch3/compiler_ch3_img29.png){ width="600" }
</figure>