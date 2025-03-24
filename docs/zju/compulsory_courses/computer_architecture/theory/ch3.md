# 3 Memory Hierarchy Design

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    1. 本文档仅涉及部分内容，仅可用于复习重点知识
    2. 本文档内容对应课本 Chapter 2 和 Appendix B

## 3.1 引言

memory hierarchy（存储器层次结构）：

principle of locality of reference（局部性原理）：程序在任意时刻通常只访问地址空间的一小部分。为了提高访问速度，可以将最近访问的数据项保存在快速存储器中。这通常通过使用缓存（cache）来实现，缓存是一种小而快速的存储器，用于存储最近或频繁访问的数据，以减少访问较慢的主存储器的次数
      1. temporal locality（时间局部性）：最近访问过的数据很可能在不久的将来再次被访问
      2. spatial locality（空间局部性）：如果一个数据被访问，那么它附近的数据也可能很快被访问

### 3.1.1 4 个存储器层次结构问题

如果处理器需要的数据存放在高层存储器中的某个块中，则称为一次 **命中**（hit）。如果在高层存储器中没有找到所需的数据，这次数据请求则称为一次 **缺失**（miss）。随后访问低层存储器来寻找包含所需数据的那一块。**命中率**（hit rate），或命中比率（hit ratio），是在高层存储器中找到数据的存储访问比例，通常被当成存储器层次结构性能的一个衡量标准。**缺失率**（miss rate）（1－命中率）则是数据在高层存储器中没有找到的存储访问比例

追求高性能是我们使用存储器层次结构的主要目的，因而命中和缺失的执行时间就显得尤为重要。**命中时间**（hit time）是指访问存储器层次结构中的高层存储器所需要的时间，包括了判断当前访问是命中还是缺失所需的时间。**缺失代价**（miss penalty）是将相应的块从低层存储器替换到高层存储器中，以及将该信息块传送给处理器的时间之和，由于较高存储层次容量较小并且使用了快速的存储器部件，因此比起对存储层次中较低层的访问，命中时间要少得多，这也是缺失代价的主要组成部分

#### Block Placement

**一个块可以放在上一级的什么位置**

在 cache 中为主存中每个字分配一个位置的最简单方法就是根据这个字的主存地址进行分配，这种 cache 结构称为 **直接映射**（direct mapped）。每个主存地址对应到 cache 中一个确定的地址

$$
（块地址） mod （cache 中的块数）
$$

**全相联：**（fully associative） 一个块可以被放置在 cache 中的任何位置

**组相联：**（set associative） 每个块可被放置的位置数是固定的（至少两个）

每个块有 n 个位置可放的 cache 被称作 n 路组相联 cache（n-way set-associative cache）。一个 n 路组相联 cache 由很多个组构成，每个组有 n 块。根据索引域，存储器中的每个块对应到 cache 中唯一的组，并且可以放在这个组中的任何一个位置上

在组相联 cache 中，包含存储块的组是这样给出的：

$(Block\ number) mod (number\ of\ sets\ in\ the\ cache)$<br/>
$（块号）mod（cache 中的组数）$

<figure markdown="span">
    ![Img 1](../../../../img/comp_arch/ch3/ca_ch3_img1.png){ width="600" }
</figure>

#### Block Identification

**如果一个块在上一级中，如何找到它**

由于 cache 中每个位置可能对应于主存中多个不同的地址，我们如何知道 cache 中的数据项是否是所请求的字呢？即如何知道所请求的字是否在 cache 中？我们可以在 cache 中增加一组 **标记**（tag），标记中包含了地址信息，这些地址信息可以用来判断 cache 中的字是否就是所请求的字。标记只需包含地址的高位，也就是没有用来检索 cache 的那些位。例如，在上图中，标记位只需使用 5 位地址中的高 2 位，地址低 3 位的索引域则用来选择 cache 中的块

我们还需要一种方法来判断 cache 块中确实没有包含有效信息。例如，当一个处理器启动时，cache 中没有数据，标记域中的值没有意义。甚至在执行了一些指令后，cache 中的一些块依然为空。因此，在 cache 中，这些块的标记应该被忽略。最常用的方法就是增加一个 **有效位**（valid bit）来标识一个块是否含有一个有效地址。如果该位没有被设置，则不能使用该块中的内容

#### Block Replacement

**在缺失时应当替换哪个块**

1. random replacement：随机替换
2. least-recently used（LRU）：最近最少的被替换
3. first in, first out（FIFO）：先进先出法则

#### Write Strategy

**在写入时会发生什么**

当数据写入 cache 时，数据如何写入主存？

1. **write-through**（写直达法）：将数据同时写入主存和 cache 中。但这样会花费大量的时间，一种解决方法是 write-buffer（写缓冲），当一个数据在等待写入主存时，先将它放入写缓冲中
2. **write-back**（写回机制）：新值仅仅被写入 cache 块中，只有当修改过的块被替换时才需要写到较低层次存储结构中
      1. 需要 valid 和 dirty 位
        - dirty bit 用于标记缓存行（cache line）中的数据是否已被修改但尚未写回到主存中
        - 当一个缓存行中的数据被处理器修改时，dirty bit 会被设置为“1”，表示该缓存行中的数据与主存中的数据不一致（即“脏”）
        - 如果 dirty bit 为“0”，则表示缓存行中的数据与主存中的数据一致（即“干净”）
      2. 当某个块需要被替换时，系统会检查 dirty bit
        - 如果 dirty bit 为“1”，则将该缓存行中的数据写回主存，以确保数据一致性
        - 如果 dirty bit 为“0”，则直接丢弃该缓存行，因为主存中已经存在相同的数据

优点：

1. 写直达
      1. 更容易实现
      2. 下一级存储器中拥有数据的最新副本，从而简化了数据一致性
2. 写回
      1. 写入操作的速度与缓存存储器的速度相同
      2. 使用的存储器带宽较少，使写回策略对多处理器更具吸引力
      3. 写回对存储器层次结构其余部分及存储器互连的使用少于直写，节省功耗，对于嵌入式应用极具吸引力

处理器在直写期间必须等待写入操作的完成，则称该处理器处于写入停顿（write stall）状态。减少此停顿的常见优化方法时写入缓冲区（write buffer），但即使有了此缓冲区，write stall 也可能会发生

当发生写入缺失时（cache 里没有处理器要修改的那个数据地址），如何处理？

1. **write allocate**：将目标数据块从主存加载到缓存，随后在缓存中完成写入。适用于后续可能频繁访问该数据块的场景
2. **write around** / **no-write allocate**：不将数据块加载到缓存，直接写入主存

一般搭配：

1. write-back + write-allocate
2. write-through + write-around

<figure markdown="span">
    ![Img 2](../../../../img/comp_arch/ch3/ca_ch3_img2.png){ width="600" }
</figure>

> 好家伙，计组没搞懂的东西，终于在这里搞懂了

### 3.1.2 缓存架构

1. unified cache（统一缓存）：所有内存请求（包括指令和数据）都通过单一的缓存进行处理
      1. 硬件需求较少，设计相对简单
      2. 由于指令和数据共享同一个缓存，可能导致缓存争用，从而降低命中率
2. spilt I & D cache（分离缓存）：使用独立的缓存分别处理指令和数据。指令缓存（I-Cache）和数据缓存（D-Cache）分开
      1. 可以减少指令和数据之间的争用，提高命中率。指令缓存通常是只读的，这简化了设计
      2. 需要更多的硬件资源

<figure markdown="span">
    ![Img 3](../../../../img/comp_arch/ch3/ca_ch3_img3.png){ width="600" }
</figure>

## 3.2 Cache Performance

$CPU\ time = (CPU\ execution\ clock\ cycles + Memory\text{-}stall\ clock\ cycles) \times Clock\ cycle\ time$

$Memory\ stall\ cycles = IC\times Mem\ refs\ per\ instruction（每条指令的内存访问次数）\times Miss\ rate\times Miss\ penalty$

$\Rightarrow$

$CPU\ time = IC\times (CPI + \dfrac{MemAccess}{Inst} \times miss\ rate \times miss\ penalty) \times cycle\ time$

$\Rightarrow$

$CPU\ time = IC\times (CPI + \dfrac{MemMisses}{Inst} \times miss\ penalty) \times cycle\ time$

### 3.2.1 AMAT

存储器平均访问时间（average memory access time）

$AMAT = hit\ time + miss\ rate \times miss\ penalty$

$CPU\ time = IC\times (\dfrac{AluOps}{Inst}\times CPI_{AluOps} + \dfrac{MemAccess}{Inst} \times AMAT) \times cycle\ time$

<figure markdown="span">
    ![Img 4](../../../../img/comp_arch/ch3/ca_ch3_img4.png){ width="600" }
</figure>

---

<figure markdown="span">
    ![Img 5](../../../../img/comp_arch/ch3/ca_ch3_img5.png){ width="600" }
</figure>

---

<figure markdown="span">
    ![Img 6](../../../../img/comp_arch/ch3/ca_ch3_img6.png){ width="600" }
</figure>

> 课本原图有误，本文档已修正

---

<figure markdown="span">
    ![Img 7](../../../../img/comp_arch/ch3/ca_ch3_img7.png){ width="600" }
</figure>

如上例所示，缓存特性可能会对性能产生巨大影响。此外，对于低 CPI、高时钟频率的处理器，缓存缺失会产生双重影响

1. $CPI_{execution}$ 越低，固定数目的缓存缺失时钟周期产生的相对影响越高
2. 在计算 CPI 时，一次缺失的缓存代价是以处理器时钟周期进行计算的。因此，即使两个计算机的存储器层次结构相同，时钟频率较高的处理器在每次缺失时会占用较多的时钟周期，CPI 的存储器部分也相应较高

<figure markdown="span">
    ![Img 8](../../../../img/comp_arch/ch3/ca_ch3_img8.png){ width="600" }
</figure>

### 3.2.2 miss penalty and Out-of-Order Execution Processors

**缺失代价与乱序执行处理器**

对于乱序执行处理器，如何定义“缺失代价”呢？是存储器缺失的全部延迟，还是仅考虑处理器必须停顿时的“暴露”延迟或无重叠延迟？对于那些在完成数据缺失之前必须停顿的处理器，不存在这一问题

重新定义存储器停顿，得到 miss penalty 的一种新定义，将其表示为 non-overlapped latency

$\dfrac{memory stall cycles}{instruction} = \dfrac{misses}{instruction} \times (total miss latency - overlapped miss latency)$

与此类似，由于一些乱序处理器会拉长命中时间，所以性能公式的这一部分可以除以总命中延迟减去重叠命中延迟之差。可以对这一公式进一步扩展，将总缺失延迟分解为没有争用时的延迟和因为争用导致的延迟，以考虑乱序处理器中的存储器资源。我们仅关注缺失延迟

1. length of memory latency（存储器延迟长度）：在乱序处理器中如何确定存储器操作的起止时刻
2. length of latency overlap（延迟重叠的长度）：如何确定与处理器相重叠的起始时刻（或者说，在什么时刻我们说存储器操作使处理器停顿）

由于乱序执行处理器的复杂性，所以不存在单一的准确定义

由于在流水线退出阶段只能看到已提交的操作，所以我们说：如果处理器在一个时钟周期内没有退出（retire）最大可能数目的指令，它就在该时钟周期内停顿。我们将这一停顿记在第一条未退出指令的账上。这一定义绝不像看上去那么简单。例如，为缩短特定停顿时间而应用某一种优化，并不一定总能缩短执行时间，这是因为此时可能会暴露出另一种类型的停顿（原本隐藏在所关注的停顿背后）

关于延迟，我们可以从存储器指令在指令窗口中排队的时刻开始测量，也可以从生成地址的时刻开始，还可以从指令被实际发送给存储器系统的时刻开始。只要保持一致，任何一种选项都是可以的

<figure markdown="span">
    ![Img 9](../../../../img/comp_arch/ch3/ca_ch3_img9.png){ width="600" }
</figure>

## 3.3 Optimizations of Cache Performance

1. Reduce the time to hit in the cache：缩短命中时间
2. Increase cache bandwidth：增加缓存带宽
3. Reduce the miss penalty：降低缺失代价
4. Reduce the miss rate：降低缺失率
5. Reduce the miss penalty and miss rate via parallelism：通过并行降低缺失代价或缺失率

### 3.3.1 Small and Simple First-Level Caches

**to reduce hit time and power**

**小而简单的第一级缓存，用以缩短命中时间、降低功率**

1. 实现缓存所需的硬件越少，硬件中的关键路径就越短
2. 直接映射缓存比组相联缓存在读写操作上更快
3. 将缓存与 CPU 集成在同一芯片上对实现快速访问时间也非常重要

<figure markdown="span">
    ![Img 10](../../../../img/comp_arch/ch3/ca_ch3_img10.png){ width="600" }
</figure>

### 3.3.2 Way Prediction

**to reduce hie time**

**采用路预测以缩短命中时间**

这是另外一种可以减少冲突缺失，同时又能保持直接映射缓存命中速度的方法。在路预测技术中，缓存中另外保存了一些位，用于预测下一次缓存访问组中的路或块。这种预测意味着尽早设定多工选择器，以选择所需要的块，在与缓存数据读取并行的时钟周期内，只执行一次标签比较。如果缺失，则会在下一个时钟周期中查看其他块，以找出匹配项

在一个缓存的每个块中都添加块预测位。根据这些位选定要在下一次缓存访问中优先尝试哪些块。如果预测正确，则缓存访问延迟就等于这一快速命中时间。如果预测错误，则尝试其他块，改变路预测器，延迟会增加一个时钟周期

### 3.3.3 Avoiding Address Translation During Indexing of the Cache

**to reduce hit time**

**避免在索引缓存期间进行地址转换，以缩短命中时间**

即使一个小而简单的缓存也必须能够将来自处理器的虚拟地址转换为用以访问存储器的物理地址

为了加快这一翻译过程，我们可以使用 TLB

<figure markdown="span">
    ![Img 11](../../../../img/comp_arch/ch3/ca_ch3_img11.png){ width="600" }
</figure>

但是

1. TLB 访问延迟：即使 TLB 命中，也需要至少 1 个时钟周期完成地址转换
2. 串行依赖：缓存访问必须等待 TLB 转换完成，导致流水线停顿

为了减少这种延迟，可以采用以下优化方法

**1.虚拟索引缓存**（virtually indexed / VI）

- 原理：直接使用虚拟地址的一部分作为缓存的索引（Index），而不依赖物理地址
- 优点：缓存访问和 TLB 转换可以并行进行（减少串行依赖）
- 限制
      - 必须确保不同虚拟地址映射到同一物理地址时不会冲突（即避免别名问题，Aliasing）
      - 通常要求缓存大小 ≤ 页大小 × 相联度

**2.物理标记缓存**（physically tagged / PT）

- 原理：虽然索引使用虚拟地址，但缓存行的标记（Tag）仍然使用物理地址，以确保数据一致性
- 工作流程
      1. 并行操作：虚拟索引直接访问缓存，同时 TLB 转换物理地址
      2. 比较 Tag：缓存返回数据后，用 TLB 转换的物理地址与缓存行的 Tag 比较，确认是否命中
- 优点
      1. 仍然支持多进程共享缓存（因为 Tag 是物理地址）
      2. 减少关键路径延迟（TLB 和缓存访问部分并行）

**3.混合方案：VIPT**（virtually indexed，physically tagged）

- 索引（Index）：使用虚拟地址低位
- 标记（Tag）：使用物理地址（避免别名问题）
- 优点
      1. 几乎消除 TLB 对缓存访问的延迟影响（TLB 和缓存访问并行）
      2. 兼容多进程环境（不同进程的相同虚拟地址不会错误命中）

---

在每次切换进程时，虚拟地址会指向不同的物理地址，需要对缓存进行刷新。一种解决方案是增大缓存地址标志的宽度，增加一个进程识别符标志（process identifier tag / PID）。如果操作系统将这些标志指定给进程，那么只需要在 PID 被回收时才刷新缓存。也就是说，PID 可以区分缓存中的数据是不是为此这个程序准备的

!!! note "AI 解释"

    **1.问题背景：进程切换与缓存刷新**
    
    - **虚拟地址（VA） vs. 物理地址（PA）**：现代操作系统使用虚拟内存机制，每个进程拥有独立的虚拟地址空间，但最终访问的是共享的物理内存
          - **进程切换时**，相同的虚拟地址可能映射到不同的物理地址（例如，进程 A 的 `VA=0x1000` → `PA=0x2000`，进程 B 的 `VA=0x1000` → `PA=0x3000`）
          - **缓存冲突风险**：如果缓存仅用虚拟地址或物理地址索引，新进程可能错误命中旧进程的缓存数据（**别名问题**）。 
    - **传统解决方案：缓存刷新（Flush）**：在进程切换时，清空缓存（如 TLB 刷新、缓存无效化），但会导致性能损失
          - **冷启动延迟**：新进程的缓存初始命中率低，需重新加载数据
          - **频繁切换开销大**（如多任务、多线程环境）
    
    ---
    
    **2.解决方案：扩展缓存标记位，增加 PID 标识符**
    
    **(1) 核心思想**
    
    - **在缓存行的标记（Tag）中增加进程标识符（PID）**：  
          - 缓存不仅存储物理地址 Tag，还存储当前占用该缓存行的进程 PID
          - **访问缓存时**，需同时匹配 **物理地址 Tag + PID**，才能判定命中
    
    **(2) 工作流程**
    1. **缓存存储结构**  
          - 每个缓存行的标记（Tag）扩展为：`| Physical Address Tag | PID | Valid Bit |`
          - **PID 由操作系统分配**（如进程 ID 或地址空间 ID, ASID）
    2. **缓存访问过程**  
          - CPU 访问虚拟地址 → TLB 转换为物理地址 + 当前进程 PID
          - 缓存控制器比较：  
              - 物理地址 Tag 是否匹配？
              - PID 是否匹配？
          - **只有两者均匹配**，才判定为缓存命中
    3. **进程切换时的行为**  
          - **无需刷新缓存**：新进程的 PID 不同，即使虚拟地址相同，也不会错误命中旧进程的数据
          - **PID 回收时刷新**：仅当 PID 被操作系统回收（如进程退出）时，才需清理对应 PID 的缓存行

操作系统和用户程序可能为同一物理地址使用两种不同的虚拟地址。这些重复地址称为同义地址或别名地址，可能会在虚拟缓存中生成同一数据的两个副本；如果其中一个被修改了，另一个就会包含错误值。而采用物理缓存是不可能发生这种情况的，因为这些访问将会首先被转换为相同的物理缓存块

页面着色（Page Coloring） 是一种通过控制物理页帧的分配策略，确保不同虚拟地址映射到同一物理地址时，其缓存索引（Index Bits）相同的技术

核心思想：

- 将物理内存页帧划分为若干“颜色”（Color），每个颜色对应一组特定的缓存索引位。
- 操作系统分配物理页时，强制让同一物理地址的虚拟页具有相同的“颜色”，从而避免别名冲突

!!! note "AI 解释"

    **(1) 缓存与页面的关系**
    
    假设：
    
    - 缓存大小为 \( C \)，组相联度为 \( N \)，每行大小 \( B \)。  
    - 缓存组数 \( S = \frac{C}{N \times B} \)，索引位数为 \( \log_2 S \)。  
    - 物理页大小 \( P \)（如 4KB），页内偏移位数为 \( \log_2 P \)。  
    
    **关键观察**：
    
    - 缓存的索引位（Index）通常来自虚拟地址的 **低位**（如页内偏移部分）
    - 若两个虚拟页的索引位相同，它们会映射到同一缓存组，可能引发别名
    
    **(2) 页面着色机制**
    
    1. **划分颜色**：  
          - 将物理页帧按缓存索引位的可能值划分为 \( K = 2^{\text{Index位数}} \) 种颜色（如 64 组缓存 → 64 种颜色）
          - 例如，若索引位为 6 位（\( 2^6 = 64 \) 组），则颜色编号 0~63 
    2. **分配策略**：  
          - 操作系统分配物理页时，根据进程的虚拟地址索引位 **强制选择对应颜色** 的物理页帧
          - 公式：$\text{物理页帧颜色} = (\text{虚拟地址索引位}) \mod K$
          - 这样，同一物理地址的所有虚拟映射会 **自动对齐到同一缓存组**，避免别名  
    
    **(3) 工作流程示例**
    
    - **场景**：  
          - 缓存：64 组（Index 6 位），页大小 4KB（偏移 12 位）
          - 虚拟地址 `VA1` 和 `VA2` 映射到同一物理页，但 `VA1` 的 Index=5，`VA2` 的 Index=10
    - **传统问题**：  
          - `VA1` 和 `VA2` 会分别映射到缓存组 5 和 10，导致同一数据存两份（别名） 
    - **页面着色解决**：  
          - 强制 `VA1` 和 `VA2` 使用颜色=5 的物理页（即物理页帧的 Index 位固定为 5）  
          - 访问时，无论 `VA1` 还是 `VA2`，均映射到缓存组 5，保证数据唯一性

### 3.3.4 Trace caches

