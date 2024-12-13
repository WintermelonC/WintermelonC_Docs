# 5 Large and Fast: Exploiting Memory Hierarchy

!!! tip "说明"

    此文档正在更新中……

!!! info "说明"

    1. 部分内容由 AI 翻译课本原文，可能存在错误
    2. 本文档只涉及部分知识点，仅可用来复习重点知识
    3. 部分课本练习题答案可能存在错误，欢迎在评论区指出，也可以写下你的疑问

## 5.1 引言

主存储器由 DRAM （动态随机存取存储器）实现，靠近处理器的那层（cache）则由 SRAM （静态随机存取存储器）来实现。磁盘（disk）通常是存储层次结构中容量最大且速度最慢的一层。在很多嵌入式设备中，常用闪存（flash memory）来替代磁盘

<figure markdown="span">
    ![Img 1](../../../../img/computer_organization/theory/ch5/comp_ch5_img1.png){ width="600" }
</figure>

存储器层次结构可以由多层构成，但是数据每次只能在相邻的两个层次之间进行复制。因此我们将注意力重点集中在两个层次上。高层的存储器靠近处理器，比低层存储器容量小且访问速度更快，我们将一个两级层次结构中存储信息的最小单元称为 **块**（block）或 **行**（line）

<figure markdown="span">
    ![Img 2](../../../../img/computer_organization/theory/ch5/comp_ch5_img2.png){ width="600" }
</figure>

如果处理器需要的数据存放在高层存储器中的某个块中，则称为一次 **命中**（hit）。如果在高层存储器中没有找到所需的数据，这次数据请求则称为一次 **缺失**（miss）。随后访问低层存储器来寻找包含所需数据的那一块。**命中率**（hit rate），或命中比率（hit ratio），是在高层存储器中找到数据的存储访问比例，通常被当成存储器层次结构性能的一个衡量标准。**缺失率**（miss rate）（1－命中率）则是数据在高层存储器中没有找到的存储访问比例

追求高性能是我们使用存储器层次结构的主要目的，因而命中和缺失的执行时间就显得尤为重要。**命中时间**（hit time）是指访问存储器层次结构中的高层存储器所需要的时间，包括了判断当前访问是命中还是缺失所需的时间。**缺失代价**（miss penalty）是将相应的块从低层存储器替换到高层存储器中，以及将该信息块传送给处理器的时间之和，由于较高存储层次容量较小并且使用了快速的存储器部件，因此比起对存储层次中较低层的访问，命中时间要少得多，这也是缺失代价的主要组成部分

<figure markdown="span">
    ![Img 3](../../../../img/computer_organization/theory/ch5/comp_ch5_img3.png){ width="600" }
</figure>

## 5.2 Memory Technologies

1. SRAM Technology
2. DRAM Technology
3. Flash Memory
4. Disk Memory

## 5.3 cache 的基本原理

要访问的数据项最初不在 cache 中，该请求导致了一次缺失，$X_n$ 被从主存调入 cache 之中

<figure markdown="span">
    ![Img 4](../../../../img/computer_organization/theory/ch5/comp_ch5_img4.png){ width="600" }
</figure>

在 cache 中为主存中每个字分配一个位置的最简单方法就是根据这个字的主存地址进行分配，这种 cache 结构称为 **直接映射**（direct mapped）。每个主存地址对应到 cache 中一个确定的地址

$$
（块地址） mod （cache 中的块数）
$$

如果 cache 中的块数是 2 的幂，则只需要取地址的低 $\log_2$ 位

<figure markdown="span">
    ![Img 5](../../../../img/computer_organization/theory/ch5/comp_ch5_img5.png){ width="600" }
</figure>

由于 cache 中每个位置可能对应于主存中多个不同的地址，我们如何知道 cache 中的数据项是否是所请求的字呢？即如何知道所请求的字是否在 cache 中？我们可以在 cache 中增加一组 **标记**（tag），标记中包含了地址信息，这些地址信息可以用来判断 cache 中的字是否就是所请求的字。标记只需包含地址的高位，也就是没有用来检索 cache 的那些位。例如，在上图中，标记位只需使用 5 位地址中的高 2 位，地址低 3 位的索引域则用来选择 cache 中的块

我们还需要一种方法来判断 cache 块中确实没有包含有效信息。例如，当一个处理器启动时，cache 中没有数据，标记域中的值没有意义。甚至在执行了一些指令后，cache 中的一些块依然为空。因此，在 cache 中，这些块的标记应该被忽略。最常用的方法就是增加一个 **有效位**（valid bit）来标识一个块是否含有一个有效地址。如果该位没有被设置，则不能使用该块中的内容

### 5.3.1 cache 访问

<figure markdown="span">
    ![Img 6](../../../../img/computer_organization/theory/ch5/comp_ch5_img6.png){ width="600" }
</figure>

<figure markdown="span">
    ![Img 7](../../../../img/computer_organization/theory/ch5/comp_ch5_img7.png){ width="600" }
</figure>

由于 cache 初始为空，第一次访问的一些数据都会发生缺失。图 5-6 对每一次访问行为进行了描述。第 8 次访问将会对 cache 中的一个块产生冲突的请求。地址 18（\(10010_2\)）的字将被取到 cache 的第 2 块（\(010_2\)）中。因此，它将替换掉原先存在于 cache 第 2 块（\(010_2\)）中的地址为 26（\(11010_2\)）中的字。这种行为令 cache 具有时间局部性：最近访问过的字替换掉较早访问的字

- 标记域（tag field）：用来与 cache 中标记域的值进行比较
- cache 索引：用来选择块

<figure markdown="span">
    ![Img 8](../../../../img/computer_organization/theory/ch5/comp_ch5_img8.png){ width="600" }
</figure>

假设有以下情况：

1. 64-bit 地址
2. 直接映射 cache
3. cache 大小为 $2^n$ 个块，因此 $n$ 位被用来索引
4. 块大小为 $2^m$ 个字（$2^{m+2}$ 个字节），因此 $m$ 位用来查找块中的字，两位是字节偏移信息

tag field 的大小为：$64 - (n + m + 2)$

直接映射的 cache 总位数为：$2^n \times (block\ size + tag\ size + valid\ field\ size)$

块大小为 $2^m$ 个字（$2^{m+5}$ 位），同时我们需要 1 位有效位，因此这样一个 cache 的位数是 $2^n \times (2^m \times 32 + (64 - m - n -2) + 1) = 2^n \times (2^m \times 32 + 63 - n - m)$

尽管以上计算是实际的大小，但是通常对 cache 命名只考虑数据的大小而不考虑标记域和有效位域的大小，因此上图中是一个 4 KiB 的 cache

!!! example "cache 中的位数"

    假设一个直接映射的 cache，有 16 KiB 的数据，块大小为 4 个字，地址为 64 位，那么该 cache 总共需要多少位？

    ??? success "答案"

        数据共 $16\ KiB = 2^{14}\ bytes = 2^{12}\ words$，一个块 4 个 word，则一共有 $2^{10}$ 个块，因此用来索引的位有 10 位，标记域有 $64 - 10 - 2 - 2 = 50$ 位，有效位 1 位。则 cache 大小总共为 $2^{10} \times (4 \times 32 + 50 + 1) = 2^{10} \times 179 = 179\ Kibibits = 22.4\ KiB$

!!! example "将一个地址映射到多字大小的 cache 块中"

    考虑一个 cache 有 64 个块，每个块 16 字节，那么字节地址为 1200 将被映射到 cache 中的哪一块？

    ??? success "答案"

        $块地址 = \lfloor \dfrac{字节地址}{每块字节数} \rfloor = \lfloor \dfrac{1200}{16} \rfloor = 75$

        $（块地址）mod（cache 中的块数）= 75\ mod\ 64 = 11$。事实上地址 1200 和 1215 之间的所有地址都映射在这一块

### 5.3.2 cache 缺失处理

1. 把 PC 的原始值（当前 PC - 4）送到存储器中
2. 通知主存执行一次读操作，并等待主存访问完成
3. 写 cache 项，将从主存取回的数据写入 cache 中存放数据的部分，并将地址的高位（从 ALU 中得到）写入标记域，设置有效位
4. 重新返回指令执行第一步，重新取值，这次该指令在 cache 中

### 5.3.3 写操作处理

**write-through**（写直达法）：

将数据同时写入主存和 cache 中。但这样会花费大量的时间，一种解决方法是 write-buffer（写缓冲），当一个数据在等待写入主存时，先将它放入写缓冲中

**write-back**（写回机制）：

新值仅仅被写入 cache 块中，只有当修改过的块被替换时才需要写到较低层次存储结构中

### 5.3.4 一个 cache 的例子：内置 FastMATH 处理器

<figure markdown="span">
    ![Img 9](../../../../img/computer_organization/theory/ch5/comp_ch5_img9.png){ width="600" }
</figure>

cache 容量为 16 KB，有 256 个块，每个块有 16 个字

对 cache 的读请求的步骤如下：

1. 将地址送到适当的 cache 中去，该地址来自程序计数器（对于指令访问），或者来自于ALU（对于数据访问）

2. 如果 cache 发出命中信号，请求的字就出现在数据线上。由于在请求的数据块中有16个字，因此需要选择那个正确的字。块索引域用来控制多路选择器（如图5-9底部所示），从检索到的块中选择16个字中的某个字

3. 如果 cache 发出缺失信号，我们把地址送到主存。当主存返回数据时，把它写入 cache 后再读出以满足请求

对于写操作，内置 FastMATH 处理器同时提供写直达和写回机制，由操作系统来决定某种应用该使用哪个机制。它有一个只包含一项的写缓冲

## 5.4 cache 性能的评估和改进

$CPU\ time = (CPU\ execution\ clock\ cycles + Memory-stall\ clock\ cycles) \times Clock\ cycle\ time$<br/>
$CPU\ 时间 = （CPU\ 执行时钟周期 + 存储器阻塞的时钟周期）\times 时钟周期$

$Memory-stall\ clock\ cycles = (Read-stall\ cycles + Write-stall\ cycles)$<br/>
$存储器阻塞时钟周期 = 读操作引起阻塞时的时钟周期 + 写操作引起阻塞的时钟周期$

$Read-stall\ cycles = \dfrac{Reads}{Program} \times Read\ miss\ rate \times Read\ miss\ penalty$<br/>
$读操作阻塞的时钟周期数 = \dfrac{读的次数}{程序数} \times 读缺失率 \times 读确实代价$

$Write-stall\ cycles = (\dfrac{Writes}{Program} \times Write\ miss\ rate \times Write\ miss\ penalty) + Write\ buffer\ stalls$<br/>
$写操作阻塞的时钟周期数 = (\dfrac{写的次数}{程序数} \times 写缺失率 \times 写缺失代价) + 写缓冲区阻塞$

在大部分写直达 cache 结构中，读和写的缺失代价是一样的（都是从主存中取回数据块的时间）。如果假设写缓冲区阻塞可以被忽略，那么我们可以合并读写操作并共用一个缺失率和缺失代价

$Memory-stall\ clock\ cycles = \dfrac{Memory\ accesses}{Program} \times Miss\ rate \times Miss\ penalty$<br/>
$存储器阻塞时钟周期 = \dfrac{存储器访问次数}{程序数} \times 缺失率 \times 缺失代价$

$Memory-stall\ clock\ cycles = \dfrac{Instructions}{Program} \times \dfrac{Misses}{Instructions} \times Miss\ penalty$<br/>
$存储器阻塞时钟周期 = \dfrac{指令数}{程序数} \times \dfrac{缺失数}{指令} \times 缺失代价$

!!! example "计算 cache 性能"

    假设指令 cache 的缺失率为 2%，数据 cache 的缺失率为 4%，处理器的 CPI 为 2，没有存储器阻塞，且每次缺失的代价为 100 个时钟周期，那么配置一个从不发生缺失的理想的 cache，处理器的速度快多少？这里假定全部 load 和 store 的频率为 36%
    
    根据指令计数器(I)，由指令缺失引起的时钟周期损失数为：
    
    指令缺失时钟周期 = I × 2% × 100 = 2.00 × I
    
    由于所有load和store指令出现的频率为36%，我们可以计算出数据缺失引起的时钟周期损失数：
    
    数据缺失时钟周期 = I × 36% × 4% × 100 = 1.44 × I
    
    总的存储器阻塞时钟周期为：
    
    2.00 × I + 1.44 × I = 3.44 × I
    
    每条指令的存储器阻塞超过3个时钟周期。因此，包括存储器阻塞在内的总的CPI是：$2 + 3.44 = 5.44$。由于指令计数器或时钟频率都没有改变，CPU 执行时间的比率为：
    
    $\dfrac{有阻塞的 CPU 执行时间}{配置理想 cache 的 CPU 执行时间} = \dfrac{I × CPI阻塞 × 时钟周期}{I × CPI理想 × 时钟周期} = \dfrac{CPI 阻塞}{CPI 理想} = \dfrac{5.44}{2}$
    
    因此，配置了理想的cache的CPU的性能是原来的：
    
    $\dfrac{5.44}{2} = 2.72 倍$
    
    所以，配置了理想的 cache 的 CPU 的性能是原来的 2.72 倍

如果处理器速度很快，而存储系统却不快，那样又会发生什么？存储器阻塞花费的时间占据执行时间的比例会上升。一些简单的例子会说明这个问题有多严重。假设我们加速上面例子中的计算机，通过改进流水线，在不改变时钟频率的情况下，将 CPI 从 2 降到 1。那么具有 cache 缺失的系统的 CPI 为 1 + 3.44 = 4.44，而配置理想的 cache 的系统性能是它的 4.44 / 1 = 4.44 倍。存储器阻塞所花费的时间占据整个执行时间的比例则从 3.44 / 5.4 = 63% 上升到 3.44 / 4.44 = 77%

同样，仅仅提高时钟频率而不改进存储系统也会因cache缺失的增加而加剧性能的流失

**平均存储器访问时间**（AMAT）：$Time\ for\ a\ hit + Miss\ rate \times Miss\ penalty$<br/>
$命中时间 + 缺失率 \times 缺失代价$

!!! example "计算平均存储器访问时间"

    处理器时钟周期的时间为 1 ns，缺失代价是 20 个时钟周期，缺失率为每条指令 0.05 次缺失，cache 访问时间（包括命中判断）为 1 个时钟周期。假设读操作和写操作的缺失代价相同并且忽略其他写阻塞。请计算 AMAT

    $AMAT = 1 + 0.05 \times 20 = 2 个时钟周期$

    即为 2 ns

### 5.4.1 通过更灵活地放置块来减少 cache 缺失

