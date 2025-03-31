# 6 Relational Database Design

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 First Normal Form

atomic domain（原子域）：第一范式的核心是要求每个属性的值必须是原子的（不可再分）。这意味着

1. 不能包含复合值（如将"姓名"拆分为"姓"和"名"）
2. 不能包含多值（如一个属性存储多个电话号码）
3. 不能是复杂对象类型

在关系数据库中，所有表/关系必须至少满足第一范式，这是关系模型的基本要求

如何处理 non-atomic values：

1. composite attributes：拆分成多个简单属性
2. multi-value attributes
      1. 使用 multi fields：`person(name, phone1, phone2, phone3)`
      2. 使用单独的一张表（推荐方式）：`phone(name, phone)`
      3. 使用单个字段存储多个值（如逗号分隔的字符串）：`person(name, phones)`

非原子策略的缺点：

1. 存储复杂化：如多字段方案可能导致空值，单字段方案需要额外解析
2. 数据冗余：例如多字段方案中，未使用的字段浪费空间
3. 查询复杂：如单字段存储多值时，需用字符串操作（如 LIKE 或正则表达式），效率低且易出错

Atomicity is actually a property of how the elements of the domain are used（原子性实际上是域元素使用方式的一种属性）

1. 原子性的相对性：
      - 原子性不是数据本身的固有属性，而是取决于如何使用数据
      - 通常认为字符串是原子的(不可分割)，但在特定使用场景下可能失去原子性
2. 具体案例：
      - 学号"CS0012"表面看是一个原子字符串
      - 但如果应用程序需要提取前两位"CS"表示计算机系，后四位"0012"表示序号
      - 这种使用方式实际上破坏了学号的原子性
3. 问题本质：
      - 将结构化信息编码在单一字段中(如院系代码+序号)
      - 迫使应用程序负责解析和提取这些信息
4. 设计缺陷：
      - 违反了数据库设计原则：信息应该明确存储在数据库中
      - 增加了应用程序的复杂性(需要编写解析逻辑)
      - 降低了数据可读性和可维护性
5. 正确做法：
      - 应该将学号拆分为两个独立字段：院系代码(dept_code)和序号(seq_num)
      - 或者在数据库中建立院系表，通过外键关联

这种设计理念强调了数据库应该明确、直接地存储信息，而不是依赖应用程序来解析编码数据，这也是关系数据库规范化的重要原则之一

## 2 Pitfalls in Relational Database Design

关系数据库设计要求我们找到一个"良好"的关系模式集合。糟糕的设计可能导致：数据冗余、插入/删除/更新异常（无法表示某些信息）

两种设计方法：

1. Top - down
2. Bottom - up
      1. 从泛关系（包含所有属性的单一表）开始
      2. 通过规范化理论 decomposition（分解）得到优化的关系模式

<figure markdown="span">
  ![Img 1](../../../img/database/ch6/database_ch6_img1.png){ width="600" }
</figure>

> 缺点：
>
> 1. Redundancy：浪费空间，可能导致数据不一致性
> 2. Updating anomaly：如果更新一行的 assets 数据，其他相关的行也需要更新，增大数据不一致性的概率
> 3. Insert / delete anomalies：如果一个 branch 没有 loan 信息，可以使用 null 值，但是 null 值很难处理

### 2.1 Decomposition

**分解**

将一个复杂的关系模式拆分为多个简单的模式，例如 ABCD = AB + BCD = ACD + ABD

> 可将上例的 Lending Relation 拆分为：`branch(branch_name, branch_city, assets)` 和 `branch_name, customer_name, loan_number, amount`

基本原则：

1. 完备性：分解后的模式必须包含原模式所有属性（$R = R₁ ∪ R₂$）
2. Lossless-join decomposition（无损连接）：通过自然连接能完全恢复原始数据（无信息损失）

<figure markdown="span">
  ![Img 2](../../../img/database/ch6/database_ch6_img2.png){ width="600" }
</figure>

1. 判断一个 relation 是否 good：no redundant
2. 如果一个 relation 不 good，将其分解为一组 relation
      1. 每个 relation 都是 good
      2. 该分解为无损连接分解
3. 理论基于：functional dependencies（函数依赖）和 multivalued dependencies（多值依赖）

## 3 Functional dependencies

给定关系模式 $R$ 和其属性子集 $\alpha\  \beta$，函数依赖 $\alpha \rightarrow \beta$ 成立的条件是：对于关系的所有可能合法实例，如果任意两个元组在 $α$ 上的值相同，则它们在 $β$ 上的值也必须相同

- $\alpha$ 称为 determinant（决定因子集）
- $\beta$ 称为 dependent（依赖属性集）
- 表明 $\alpha$ 的属性值可以唯一确定 $\beta$ 的属性值

<div class="grid" markdown>

| $\alpha$ | $\beta$ | $\gamma$ |
| :--: | :--: | :--: |
| a | f | 1 |
| b | h | 2 |
| a | f | 3 |
| c | f | 4 |

<div>

1. 当 $\alpha = a$，$\beta$ 总是 $f$
2. 当 $\alpha = b$，$\beta$ 总是 $h$
3. 当 $\alpha = b$，$\beta$ 总是 $f$

$\beta$ is functionally dependent on $\alpha$, $\alpha$ functionally determines $\beta$

</div>

</div>

函数依赖是一种 integrity constraints，表达了特定属性的值的关系，可以用来判断模式规范化，并提出改进建议

!!! tip "functional dependencies 和 key"

    - 函数依赖是比键更广义的约束概念
    - 所有键都是特殊的函数依赖，但函数依赖不一定是键

    函数依赖可以表达键无法表示的语义约束

    - 键约束强调唯一标识（实体完整性）
    - 函数依赖强调属性间的决定关系（语义完整性）

### 3.1 The Use of Functional Dependencies

**1.在给定的函数依赖 F 下，判断 relations 是否合法**

如果 relation r 合法，称为 r satisfies F

<figure markdown="span">
  ![Img 3](../../../img/database/ch6/database_ch6_img3.png){ width="600" }
</figure>

**2.分辨一组合法 relations（schema R） 的 constraints F**

如果所有合法 relations r on R 满足 F，称 F holds on R

- 容易判断单个关系实例 r 是否满足给定的 F
- 难以判断 F 是否在模式 R 上成立（不能仅从一个 r 推断 F）
- R 上的函数依赖 F 通常由 R 的语义定义决定
- 不能从单一实例反推函数依赖

### 3.2 Trivial and Non-Trivial Dependency

**trivial functional dependency**

右边属性集（β）完全包含于左边属性集（α）中的依赖，$\beta \sube \alpha$

- 自反性：$A \rightarrow A$（属性决定自身）
- 包含性：$AB \rightarrow A$（组合属性决定其子集）

**non-trivial functional dependency**

右边属性至少有一个不属于左边属性集的依赖，$\beta \not\subseteq \alpha$

### 3.3 Closure of Functional Dependencies

- 传递性：$A \rightarrow B,\ B \rightarrow C \implies A \rightarrow C$

定义：通过 F 推导出的所有函数依赖称为 F 的 closure（闭包），记作 $F^+$

$F = \lbrace A \rightarrow B,\ B \rightarrow C \rbrace \implies F^+ = \lbrace A \rightarrow B,\ B \rightarrow C,\ A \rightarrow C,\ A \rightarrow A,\ AB \rightarrow A,\ AB \rightarrow B,\ AC \rightarrow C,\ A \rightarrow BC, \cdots$

#### 3.3.1 Armstrong's Axioms

Armstrong 公理提供了用于求 $F^+$ 的推理规则

1. reflexivity（自反律）：$\beta \sube \alpha \implies \alpha \rightarrow \beta$
2. augmentation（增补律）：$\alpha \rightarrow \beta \implies \gamma \alpha \rightarrow \gamma \beta$
3. transitivity（传递律）：$\alpha \rightarrow \beta,\ \beta \rightarrow \gamma \implies \alpha \rightarrow \gamma$

性质：

1. soundness（保真性）：所有通过这些规则推导出的函数依赖都是逻辑正确的
2. completeness（完备性）：这些规则足以推导出所有可能的函数依赖

!!! example "例子"

    $R = (A, B, C, G, H, I)$

    $F = \lbrace A \rightarrow B, A \rightarrow C, CG \rightarrow H, CG \rightarrow I, B \rightarrow H \rbrace$

    Some members of $F^+$

    - $A \rightarrow H$：传递律
    - $AG \rightarrow I$：$A \rightarrow C \implies AG \rightarrow CG$（pseudotransitivity 伪传递律）
    - $AG \rightarrow H$
    - $CG \rightarrow HI$：$CG \rightarrow H \implies CG \rightarrow CGH$，$CG \rightarrow I \implies CGH \rightarrow HI$，$\implies CG \rightarrow HI$（合并律）
    - $A \rightarrow BC$

补充定律：

1. union（合并律）：$\alpha \rightarrow \beta,\ \alpha \rightarrow \gamma \implies \alpha \rightarrow \beta \gamma$
2. decomposition（分解律）：$\alpha \rightarrow \beta \gamma \implies \alpha \rightarrow \beta,\ \alpha \rightarrow \gamma$
3. pseudotransitivity（伪传递律）：$\alpha \rightarrow \beta,\ \beta \gamma \rightarrow \delta \implies \alpha \gamma \rightarrow \delta$

```sql linenums="1" title="计算 F+ 的过程"
F+ = F
repeat
    for each functional dependency f in F+
        apply reflexivity and augmentation rules on f
        add the resulting functional dependencies to F+
    for each pair of functional dependencies f1 and f2 in F+
        if f1 and f2 can be combined using transitivity
        then add the resulting functional dependency to F+
until F+ does not change any further
```

对于包含 n 个属性的关系模式，可能的函数依赖数量最多为 $2^n \times 2^n$

### 3.4 Closure of Attribute Sets

closure of a，记作 $a^+$，表示所有可以通过 F 中的函数依赖从 a 推导出的属性集合

> 若 $F = \lbrace A→B,B→C \rbrace$，则 $A^+ = \lbrace A,B,C \rbrace$

1. 测试 $\alpha \rightarrow \beta$ 是否在 $F^+$ 中，查看 $\beta \sube a^+$
2. 测试 a 是否是 super key，查看 $a^+ = R$

```sql linenums="1" title="计算 a+ 的过程"
result = a
while (changes to result) do
    for each β -> γ in F do
        begin
            if β ⊆ result then result = result ∪ γ
        end
a+ = result
```

<figure markdown="span">
  ![Img 4](../../../img/database/ch6/database_ch6_img4.png){ width="600" }
</figure>

---

<figure markdown="span">
  ![Img 5](../../../img/database/ch6/database_ch6_img5.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 6](../../../img/database/ch6/database_ch6_img6.png){ width="600" }
</figure>

#### 3.4.1 The Use of Attribute Set Closure

1. 测试 super key
2. 测试 functional dependencies
3. 计算 F 的闭包
      1. 找出所有子集
      2. 计算各个子集的闭包
      3. 从各个闭包生成所有函数依赖
      4. 最终 $F^+$ 包含上述所有有效依赖

### 3.5 Canonical Cover

**正则覆盖**

