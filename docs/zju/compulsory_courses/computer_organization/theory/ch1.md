# 1 Computer Abstractions and Technology

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    1. 部分内容由 AI 翻译课本原文，可能存在错误
    2. 本文档仅涉及部分内容，仅可用于复习重点知识
    3. 部分课本练习题答案可能存在错误，欢迎在评论区指出，也可以写下你的疑问

## 1.2 计算机体系结构中的八个基本思想

### 1 Design for Moore's Law

**根据摩尔定律设计**

摩尔定律指出，集成电路资源每18-24个月翻一番。由于计算机设计可能需要数年时间，每个芯片的可用资源从设计开始到设计结束很容易翻倍或翻四倍。因此计算机架构师必须要有预见性，当设计完成时，技术将会是什么样子，而不是按照当前的技术来设计

> 就是说，如果按照当前的技术来设计的话，等你设计完了，早已经有新的更好的技术替代旧技术了，你就白设计了。所以要根据摩尔定律来设计

### 2 Use Abstraction to Simplify Design

**使用抽象来简化设计**

硬件和软件是用抽象来表征设计在不同层次上的表现，较低层次的细节被隐藏以提供一个更简单的模型

### 3 Make the Common Case Fast 

**优化普遍案例**

优化普遍案例将会比优化罕见情况更好

### 4 Performance via Parallelism

**通过并行提高性能**

自从计算机诞生以来，计算机架构师就提供了通过并行计算操作获得更高性能的设计

### 5 Performance via Pipelining

**通过流水线提升性能**

有一种特殊的并行模式在计算机体系结构中非常普遍，以至于它有它自己的名字：流水线。例如，在消防车出现之前，如果发生火灾，村民们组成一个人链，把水源送到火场，因为他们可以更快地将水桶向上移动，而不是一个人来回跑。

### 6 Performance via Prediction

**通过预测提升性能**

俗话说，请求原谅比请求允许更好，下一个伟大的想法是预测。在某些情况下，假设从错误预测中恢复的机制不会太昂贵并且您的预测相对准确，那么提前猜测所有可能的情况并开始工作比等到您确定之后再开始工作平均要快得多

> 提前预测并计算好所有可能出现的结果。如果需要哪一个结果，那已经提前算好了；如果哪一个结果不对，改正这个结果所花费的成本也不是很高。所以能整体提升效率

### 7 Hierarchy of Memories

**内存的层次结构**

程序员希望内存更快、更大、更便宜，因为内存的速度决定了性能，但是内存容量限制了解决问题的大小，而如今内存的成本通常是计算机成本的主要部分。架构师发现，他们可以通过内存层次结构来解决这些相互冲突的需求。每比特最快、最小和最昂贵的内存位于层次结构的顶部，每比特最慢、最大和最便宜的内存位于底部

### 8 Dependability via Redundancy

**通过冗余实现可靠性**

计算机不仅要快，他们需要可靠。由于任何物理设备都可能发生故障，因此我们通过包括冗余组件使系统可靠，这些组件可以在故障发生时接管并帮助检测故障

> 比如汽车在车的不同部位都装有备用电池

???+ example "课本 1.2"

    将 8 种思想和下面 8 种事件相匹配

    1. Assembly lines in automobile manufacturing
    2. Suspension bridge cables
    3. Aircraft and marine navigation systems that incorporate wind information
    4. Express elevators in buildings
    5. Library reserve desk
    6. Increasing the gate area on a CMOS transistor to decrease its switching time
    7. Adding electromagnetic aircraft catapults (which are electrically powered as opposed to current steam-powered models), allowed by the increased power generation offered by the new reactor technology
    8. Building self-driving cars whose control systems partially rely on existing sensor systems already installed into the base vehicle, such as lane departure systems and smart cruise control systems

    ??? success "答案"

        1. Performance via Pipelining
        2. Dependability via Redundancy
        3. Performance via Prediction
        4. Make the Common Case Fast 
        5. Hierarchy of Memories
        6. Performance via Parallelism
        7. Design for Moore's Law
        8. Use Abstraction to Simplify Design

## 1.6 Performance

**性能**

### 定义

$$
Performance = \frac{1}{Execution\ time}
$$

定量地比较两台不同计算机地性能，使用"X is $n$ times faster than Y" 或 "X is $n$ times as fast as Y"的表达方式：
$$
\frac{Performance_X}{Performance_Y} = n
$$

### CPU 性能及其因素

$$
CPU\ execution\ time\ for\ a\ program = CPU\ clock\ cycles\ for\ program \times Clock\ cycle\ time\\
一个程序的CPU执行时间 = 一个程序的CPU时钟周期数 \times 时钟周期时间
$$

$$
CPU\ execution\ time\ for\ a\ program = \frac{CPU\ clock\ cycles\ for\ program}{Clock\ rate}
$$

$$
一个程序的CPU执行时间 = \frac{一个程序的CPU时钟周期数}{时钟频率}
$$

### 指令的性能

$$
CPU\ clock\ cycles = Instructions\ for\ a\ program \times Average\ clock\ cycles\ per\ instruction\\
CPU时钟周期数 = 程序的指令数 \times 每条指令的平均时钟周期数
$$

$Average\ clock\ cycles\ per\ instruction$ 缩写为 $CPI$

### 经典的 CPU 性能公式

$$
CPU\ time = Instruction\ count \times CPI \times Clock\ cycle\ time\\
CPU时间 = 指令数 \times CPI \times 时钟周期时间
$$

$$
CPU\ time = \frac{Instruction\ count \times CPI}{Clock\ rate}
$$

$$
CPU时间 = \frac{指令数 \times CPI}{时钟频率}
$$
