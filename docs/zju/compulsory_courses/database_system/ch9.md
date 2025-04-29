# 9 Query Processing

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

    > 哦，神圣的史，完全不知道这节在干嘛

1. CPU 无法直接处理磁盘中的数据
2. 磁盘数据读取速度的增长速度要比磁盘大小的增长速度慢
3. 磁盘寻道速度的增长速度比磁盘数据传输速度的增长速度慢得多

## 1 Overview

### 1.1 Basic Steps in QQuery Processing

1. parsing and translation：语法分析与翻译

    1. 类似于编译器的工作流程，首先解析 SQL 查询语句
    2. 解析器会检查 SQL 语句的语法是否正确
    3. 验证查询中涉及的关系（表）是否存在
    4. 将 SQL 查询转换为内部表示形式 —— extended relational algebra 扩展关系代数（ERA）

2. optimization：优化

    1. 对于同一个 SQL 查询，可能存在多个等价的 relational algebra expressions（关系代数表达式）
    2. 每个关系代数操作可以使用不同的算法来执行
    3. 数据库优化器会生成一个 evaluation plan（评估计划），明确指定

        1. 使用哪些关系代数表达式
        2. 每个操作采用什么算法（如使用索引还是全表扫描）
        3. 操作的执行顺序和数据传递方式

3. evaluation：评估

    1. 查询执行引擎接收经过翻译的查询计划
    2. 执行这个 evaluation plan 并返回查询结果

### 1.2 Basic Steps: Optimization

1. 找出各种等价的关系代数表达式
2. 一系列指定详细执行策略的基本操作，称为查询执行计划（query execution plan）或查询评估计划（query evaluation plan）
3. query optimization：在所有等价的评估计划中选择成本最低的方案。成本估算基于两个因素：

    1. 成本取决于具体执行算法的选择
    2. 成本估算需要使用数据库目录中的统计信息。例如：每个关系的元组数量、元组大小等

## 2 Measures of Query Cost

成本通常以查询 total elapsed time（总响应时间）衡量。影响时间成本的多重因素：disk access + CPU + network communication（网络通信）

通常磁盘访问是主要成本因素（相对容易估算），具体通过以下指标衡量：

1. 执行的寻道操作次数
2. 读取的块数 × 单块读取平均成本
3. 写入的块数 × 单块写入平均成本

写入块的成本高于读取块。写入后需要回读数据以确保写入成功

简单起见，我们仅使用以下两个指标作为成本度量标准：

1. $t_T$：传输一个数据块的时间（time to transfer one block）
2. $t_S$：执行一次磁盘寻道的时间（time for one seek）

完成 b 次块传输加 S 次寻道的总成本：$b \times t_T + S \times t_S$

> 1. 为简化模型，暂不考虑 CPU 计算成本（但实际系统会考虑）
> 2. 结果数据写回磁盘的成本也不包含在本公式中

内存缓冲区与查询成本的关系：

1. 查询成本取决于主内存缓冲区大小：内存越大，磁盘访问需求越少
2. 实际可用内存受以下因素影响： 操作系统其他并发进程的内存占用；难以在执行前准确预判
1. 常用评估方法：采用最坏情况估计（假设仅满足操作最低内存需求），同时考虑最佳情况估计
2. 数据缓存的影响：所需数据可能已驻留缓冲区（避免磁盘 I/O），但这一因素难以在成本预估中量化考虑

## 3 Selection Operation

### 3.1 Basic Algorithms

**file scan**（文件扫描）：不使用索引，通过搜索算法定位并检索满足选择条件的记录

**A1: linear search**（线性搜索）：扫描每个文件块并测试所有记录是否满足选择条件

成本估算：$b_r$ 次块 transfer + 1 次 seek。$b_r$ 表示包含关系 r 记录的块数量。如果是对键属性的选择，找到记录后可立即停止，成本 = $\dfrac{b_r}{2}$ 次块 transfer + 1 次 seek

> 初始化寻道：磁头移动到块头位置（1 次 seek）；连续传输：依次读取所有数据块（$b_r$ 次传输）
>
> 当搜索键属性（可提前终止）时：平均只需扫描一半块数 $\dfrac{b_r}{2}$

线性搜索的适用性：

1. 不受选择条件类型影响
2. 不受记录存储顺序影响
3. 不依赖索引可用性

binary search 通常不适用，因为数据不是连续存储的。除非有可用索引，而且二分查找比索引搜索需要更多的寻道操作

---

**A2: binary search**（二分搜索）：当选择条件是针对已排序文件的属性进行等值比较时适用

假设关系的所有块是连续存储的。成本 = $⌈log₂(b_r)⌉$ 次块传输 + $⌈log₂(b_r)⌉$ 次寻道。如果选择的不是键属性，还需加上包含满足条件记录的所有块数量

块传输次数 = $⌈log₂(b_r)⌉ + ⌈sc(A, r) / f_r⌉ - 1$

- $sc(A, r)$：满足选择条件的记录数
- $f_r$：每个块包含的记录数

### 3.2 Using Indices and Equality

**Index scan**（索引扫描）：使用索引的搜索算法。选择条件必须是索引的搜索键

**A3: (primary index, equality on key)**：检索满足等值条件的单条记录。成本 = $(h_i + 1) × (t_T + t_S)$，其中 $h_i$ 为索引树高度

> 1. 索引树遍历阶段（$h_i$ 次）需要从根节点逐层向下访问到叶子节点。每次层级跳转都需要：1 次 seek + 1 次 transfer
> 2. 数据获取阶段（+ 1 次）

---

**A4: (primary index, equality on nonkey)**：检索多条记录。记录将存储在连续的块中。设 b 为包含匹配记录的块数。成本 = $h_i × (t_T + t_S) + t_S + t_T × b$

> 1. 索引遍历阶段：$h_i × (t_T + t_S)$
> 2. 数据定位阶段：$+ t_S$
> 3. 数据读取阶段：$+ t_T × b$

---

**A5: (secondary index, equality on nonkey)**

1. 当搜索键是候选键时：检索单条记录。成本 = $(h_i + 1) × (t_T + t_S)$
2. 当搜索键不是候选键时：检索多条记录。每条匹配记录可能位于不同数据块。成本 = $(h_i + n) × (t_T + t_S)$

### 3.3 Involving Comparisons

实现比较查询：

1. linear file scan
2. binary search
3. using indices

**A6: (primary index, comparison)**：基于主索引的比较

1. 对于 $\sigma_{A \geqslant V}(r)$ 的查询，使用 index 定位到第一个 tuple，然后顺序读取即可
2. 对于 $\sigma_{A \leqslant V}(r)$ 的查询，顺序读取直到遇到不满足条件的 tuple。不使用 index

---

**A7: (secondary index, comparison)**：基于辅助索引的比较

1. 对于 $\sigma_{A \geqslant V}(r)$ 的查询，使用 index 定位到第一个 tuple，然后顺序扫描索引获取记录指针
2. 对于 $\sigma_{A \leqslant V}(r)$ 的查询，顺序读取指针直到遇到不满足条件的 tuple

两种情况下都需要获取指针指向的记录：每条记录都需要一次 I/O 操作，可能比线性文件扫描成本更高

### 3.4 Complex Selections

$\sigma_{\theta_1 \land \theta_2 \land \cdots \land \theta_n}(r)$

**A8: (conjunctive selection using one index)**：使用单一索引的合取选择

从条件 θ₁ 到 θₙ 中选择执行成本最低的 θᵢ（使用算法 A1-A7），将结果元组存入内存缓冲区。在内存中对这些元组检查其他条件

---

**A9: (conjunctive selection using composite index)**：使用复合索引的合取选择

如果有可用的复合（多键）索引则使用

---

**A10: (conjunctive selection by intersection of identifiers)**：通过标识符交集的合取选择

1. 需要带有记录指针的索引
2. 对每个条件使用相应索引，获取记录指针集合并求交集
3. 然后从文件中获取记录
4. 如果某些条件没有合适索引，则在内存中检查

---

$\sigma_{\theta_1 \lor \theta_2 \lor \cdots \lor \theta_n}(r)$

**A10: (disjunctive selection by union of identifiers)**：通过标识符并集的析取选择

适用条件：所有子条件都有可用索引。否则使用线性扫描

对每个条件使用相应索引，获取记录指针集合并取并集。最后从文件中获取记录

---

$\sigma_{\neg \theta}(r)$

默认使用线性文件扫描

例外情况：若满足 ¬θ 的记录极少，且 θ 有可用索引。先通过索引找出满足 θ 的记录，再反向筛选

## * 4 Sorting

为什么需要 sort：

1. 输出需求
2. 连接操作可以快速实现

我们可以在关系上建立索引，然后使用该索引按排序顺序读取关系。但这只是在逻辑上而非物理上对关系进行排序，并且可能导致每个元组都需要访问一个磁盘块

排序方法：

1. 内存排序：若数据能完全装入内存，使用高效的内部排序算法（如快速排序）
2. [external sorting](../ADS/ch15.md){:target="_blank"}：若数据量超过内存容量，需使用外部排序归并算法（分块排序后归并），适合大规模数据

<figure markdown="span">
  ![Img 1](../../../img/database/ch9/database_ch9_img1.png){ width="600" }
</figure>

## 5 Join Operation

处理 join 的不同算法：

1. Nested-loop join
2. Block nested-loop join
3. Indexed nested-loop join
4. Merge-join
5. Hash-join

### 5.1 Nested-Loop Join

**嵌套循环连接**

$r \Join_\theta s$

算法流程：

1. 通过双重循环实现连接：外层循环遍历外部关系 r 的每个元组 $t_r$，内层循环遍历内部关系 s 的每个元组 $t_s$
2. 对每一对元组 $(t_r, t_s)$ 检查是否满足连接条件 θ，若满足则组合两元组并输出结果

关键术语：

1. Outer Relation（外部关系）：外层循环的关系 r，通常选择数据量较小的表以减少循环次数
2. Inner Relation（内部关系）：内层循环的关系 s

优点：无需依赖索引，适用于任意连接条件（灵活性高）

缺点：时间复杂度为 $O(n \times m)$ （n 和 m 为两表的元组数），性能较差，尤其适合小表连接或作为其他连接算法的备用方案

最坏情况代价：当内存仅能缓存每个表的一个数据块时

1. 块传输次数：$n_r \times b_s + b_r$（$n_r$ 为外部关系元组数，$b_s$ 和 $b_r$ 为内部/外部关系的块数）
2. 磁盘寻道次数：$n_r + b_r$（每次外层循环需重新定位内部关系的数据块）

> 1. 对于外部关系 r 的每一个元组 $t_r$，数据据库需要：扫描整个内部关系 s（即读取 $b_s$ 次块），因此，总块传输次数为 $n_r \times b_s$，最后还要完整读取一次外部关系 r（$b_r$ 次块）
> 2. 每次处理外部关系的一个元组 $t_r$ 时，可能需要：寻道到内部关系 s 的第一个块（1 次寻道），最坏情况下，认为每次外层循环都要重新寻道，因此 $n_r$ 次寻道。读取整个 r 需要 $b_r$ 次寻道（每块一次）

如果较小的关系能完全放入内存，则将其作为内部关系使用：代价降低至 $b_r + b_s$ 次块传输和 2 次磁盘寻道

### 5.2 Block Nested-Loop Join

**块嵌套循环连接**

四层循环结构：

1. 外层循环遍历外关系 r 的每个块
2. 次外层循环遍历内关系 s 的每个块
3. 内层两个循环分别处理当前两个块中的元组

最坏情况代价：

1. 传输次数：$b_r \times b_s + b_r$ 
2. 寻道次数：$2 \times b_r$

最佳情况代价：

1. 传输次数：$b_r + b_s$ 
2. 寻道次数：$2$

优化策略：

1. 内存利用：使用 M - 2 个磁盘块作为外关系的缓冲单元（M 是内存的块大小），剩下的 2 个块用于缓冲内关系和输出结果
2. 提前终止内循环：如果连接属性是主键或内关系具有唯一性，可以在第一次匹配后立即停止内循环扫描
3. 交替扫描内关系：交替正向和反向扫描内关系，以利用缓冲区的剩余块（采用 LRU 替换策略）
4. 利用索引：如果内关系上有索引，可以使用索引加速连接

### 5.3 Indexed Nested-Loop Join

**索引嵌套循环连接**

适用条件：

1. 连接是等值连接（equi-join）或自然连接（natural join）
2. 内关系的连接属性上存在索引

可以临时构建索引来优化连接计算

算法流程：对于外关系 r 中的每个元组 $t_r$，使用索引查找内关系 s 中满足连接条件的元组

最坏情况：缓冲区只能容纳 r 的一个页，并且对于 r 的每个元组，都需要在 s 上执行一次索引查找

$b_r + n \times c$

- n：匹配的元组数量
- c：单次索引查找的成本

索引查找成本 c 的估算：可以近似看作在 s 上执行一次基于连接条件的单点查询的成本

优化策略：如果两个关系的连接属性上都有索引，则选择元组较少的关系作为外关系，以减少索引查找次数

!!! example "例子"

    计算 $student \Join takes$，student 作为 outer relation。takes 在 ID 属性上有一个 B+ 树索引，每个 node 包含 20 项。takes 有 10000 个元组，树高 4，需要额外的 1 次访问来获取真实数据。student 有 5000 个元组

    block nested loop join：$100 \times 400 + 100 = 40100$ 传输次数，$2 \times 100 = 200$ 寻道次数

    indexed nested loop join：$100 + 5000 \times 5 = 25100$，$c = 4 + 1 = 5$

### 5.4 Merge Join

**排序归并连接**

1. 排序阶段（sort phase）：如果输入关系 pr 和 ps 未按连接属性（如 a₁）排序，则需先对它们进行排序（通常使用外部排序算法，如多路归并排序）。排序后的数据可以按连接属性顺序访问，为归并阶段做准备
2. 归并阶段（merge phase）

    1. 同时扫描两个已排序的关系，按连接属性值进行匹配：

        1. 如果 pr.a₁ == ps.a₁，则输出匹配的元组对（如 (a,3,A)）
        2. 如果 pr.a₁ < ps.a₁，则移动 pr 的指针到下一个更大的值
        3. 如果 pr.a₁ > ps.a₁，则移动 ps 的指针

    2. 重复值处理：如果连接属性有重复（如 pr 中的 d 出现两次），需匹配所有组合（如 (d,8,N) 和 (d,13,N)）

仅适用于等值连接和自然连接

每个数据块只需读取一次（假设内存可容纳连接属性的所有匹配元组）

- 传输次数：$b_r + b_s$
- 寻道次数：$\lceil \dfrac{b_r}{b_b} \rceil+\lceil \dfrac{b_s}{b_b} \rceil$

若关系未排序，需额外加上排序成本

> $b_b$ 表示块缓冲大小

Hybrid merge-join（混合归并连接）：若一个关系已排序，另一个关系在连接属性上有辅助 B+ 树索引

1. 归并阶段：已排序关系直接与 B+ 树索引的叶节点（存储键值和地址）匹配
2. 地址排序：将匹配结果的元组地址按物理存储顺序排序（减少随机访问）
3. 元组填充：按地址顺序扫描未排序关系，高效获取实际数据

### 5.5 Hash Join

**哈希连接**

仅适用于等值连接和自然连接

1. 分区阶段（partitioning phase）：使用哈希函数 h 对两个关系的元组进行分区：h 将连接属性（JoinAttrs）的值映射到 {0, 1, ..., n}，其中 JoinAttrs 是自然连接中 r 和 s 的共同属性
2. 探测阶段（probing phase）：对每一对分区 (ri, si) 将 ri 的元组与 si 的元组进行匹配。例如，将 ri 的所有元组加载到内存的哈希表中，然后扫描 si 的元组并查找匹配

<figure markdown="span">
  ![Img 2](../../../img/database/ch9/database_ch9_img2.png){ width="600" }
</figure>

分区数 n 和哈希函数 h 的选择：

1. 需确保每个分区 si 能放入内存
2. 通常 $n = \lceil \dfrac{b_s}{M} \rceil \times f$，其中 f 为 fudge factor（缓冲因子），通常取 1.2 左右
3. 探测关系的分区 si 无需全部装入内存

recursive partitioning（递归分区）：若分区数 n 超过内存页数 M，则需递归分区

1. 首次分区时，对关系 s 使用 M - 1 个分区
2. 对每个 M - 1 分区进一步用不同哈希函数分区
3. 对关系 r 采用相同的分区方法

无需递归分区时的成本公式：$3(b_r + b_s) + 4n_h$ 传输 + $2(\lceil \dfrac{b_r}{b_b} \rceil+\lceil \dfrac{b_s}{b_b} \rceil) + 2n_h$ 寻道

需要递归分区时：

1. 分区趟数（passes）由构建关系决定：$pass = \lceil \log_{M-1}(b_s)-1 \rceil$
2. $2(b_r + b_s)\lceil \log_{M-1}(b_s)-1 \rceil + b_r + b_s$ 传输 + $2(\lceil \dfrac{b_r}{b_b} \rceil+\lceil \dfrac{b_s}{b_b} \rceil)\lceil \log_{M-1}(b_s)-1 \rceil$ 寻道

最佳情况（构建关系可完全放入内存）：无需分区，成本降至：$b_r + b_s$ 次传输

#### * 5.5.1 Handling of Overflows

哈希表溢出发生在分区 si 无法装入内存时，可能原因包括：

1. 关系 s 中存在大量连接属性值相同的元组（数据分布不均）
2. 哈希函数设计不合理

若某些分区的元组数量显著多于其他分区，称为分区倾斜（skewed partitioning）

解决方案：

1. 常规选择分区数：$n = \lceil \dfrac{b_s}{M} \rceil \times f$，其中 f 为 fudge factor（缓冲因子），通常取 1.2 左右
2. 构建阶段溢出处理：使用不同哈希函数对溢出分区 si 进行二次分区。必须同步对 ri 执行相同操作

溢出预防：通过精细分区避免构建阶段溢出

#### * 5.5.2 Hybrid Hash Join

适用场景：当内存较大且构建关系（build input）超过内存容量时使用

核心特性：将构建关系的第一个分区始终保留在内存中

示例：内存 25 块时，将 instructor 表（100 块）划分为 5 个分区（每区 20 块）。第一个分区占 20 块内存，1 块用于输入缓冲，剩余 4 块分别缓冲其他 4 个分区；teaches 表同样划分为 5 个分区（每区 80 块），第一个分区立即用于探测（无需写磁盘）

最佳效能条件：当内存大小 $M ≫ \sqrt{b_s}$

### 5.6 Complex Join

## * 6 Other Operations

## * 7 Evaluation of Expressions