# 1 Fundamentals of Quantitative Design and Analysis

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

**量化设计与分析基础**

<div>
<ul>
<li>RISC：精简指令集计算机</li>
<li>CISC：复杂指令集计算机</li>
</ul>
</div>

## 1.2 计算机的分类

**Personal Mobile Device**（PMD）

- 基于 Web 应用、面向媒体
- 采用闪存作为存储方式
- 需求：成本、能耗效率

**Desktop Computing**

- 优化性价比

**Servers**

1. 首先，availability 是至关重要的
2. 第二个关键特征是 scalability
3. 最后一个特征是 efficient throughout

**Clusters/Warehouse-Scale Computers**

- 软件即服务（SaaS）应用
- 仓库级计算机（WSC）
- 需求：性价比、功耗

**Embedded systems**

- 性能要求
- 价格是关键因素

---

应用程序中主要有以下两种并行：

1. DLP：数据级并行
2. TLP：任务级并行

计算机硬件用以下 4 种主要方式来实现这两种：

1. 指令级并行
2. 向量体系结构和 GPUs
3. 线程级并行
4. 请求级并行

计算机的分类：

1. 单指令流、单数据流（SISD）
2. 单指令流、多数据流（SIMD）
3. MISD
4. MIMD

## 1.4 技术趋势

- 摩尔定律
- 带宽胜过延迟

## 1.5 集成电路中的功率和能耗趋势

### 1.5.2 微处理器内部的能耗和功率

**动态能耗**（dynamic energy）

- 晶体管一次转换的能耗：$energy_{dynamic} \propto \dfrac{1}{2} \times capacitive\ load \times voltage^2$
- 晶体管一次转换的功率：$power_{dynamic} \propto \dfrac{1}{2} \times capacitive\ load \times voltage^2 \times frequency\ switched$

**静态能耗**（static energy）

$power_{static} \propto current_{static} \times voltage$

## 1.6 成本趋势

### 1.6.2 集成电路的成本

$cost\ of\ integrated\ circuit = \dfrac{cost\ of\ die + cost\ of\ testing\ die + cost\ of\ packaging\ and\ final\ test}{final\ test\ yield}$

$cost\ of\ die = \dfrac{cost\ of\ wafer}{dies\ per\ wafer \times die\ yield}$

$dies\ per\ wafer = \dfrac{\pi \times (wafer\ diameter / 2)^2}{die\ area} - \dfrac{\pi \times wafer\ diameter}{\sqrt{2 \times die\ area}}$

$die\ yield = wafer\ yield \times \dfrac{1}{(1 + defects\ per\ unit\ area \times die\ area)^N}$

$N$ 是一个称为工艺复杂度因数的参数

## 1.7 可信任度

**Dependability**

- Service accomplishment（服务实现）：提供了指定服务
- Service interruption（服务中断）：所提供服务与 SLA（服务等级协议）不一致

可信任度的两种主要度量：

1. reliability（可靠性）：从一个参考初始时刻开始持续实现服务的度量
    - MTTF（平均无故障时间）
    - rate of failures（故障率）：MTTF 的倒数，用 FIT（运行 10 亿小时发生的故障数）衡量
    - MTTR（平均修复时间）
    - MTBF（平均间隔时间）：MTTF + MTTR
2. availability（可用性）：服务完成与服务中断两种状态之间切换时，对服务完成的度量
    - $availability = \dfrac{MTTF}{MTTF + MTTR}$

## 1.8 性能的测量、报告和汇总

**Measuring, Reporting, and Summarizing Performance**

- response time / execution time（响应时间 / 执行时间）：一个事件从启动到完成的时间
- throughput（吞吐量）：在给定时间内完成的总工作量

## 1.9 计算机设计的量化原理

### 1.9.1 充分利用并行

**Take Advantage of Parallelism**

- 系统层面：使用多处理器
- 指令层面：使用流水线
- 数据运算层面：组相联 cache

### 1.9.2 局限性原理

**Principle of Locality**

一个程序 90 % 的执行时间花费在仅 10 % 的代码中

- 时间局域性（temporal locality）：最近访问过的内容很可能会在短期内被再次访问
- 空间局域性（Spatial locality）：地址相互临近的项目很可能会在短时间内都被用到

### 1.9.3 Focus on the Common Case

优化 common case 对整体性能的提升很大

### 1.9.4 Amdahl 定律

$execution\ time_{new} = execution\ time_{old} \times ((1 - fraction_{enhanced}) + \dfrac{fraction_{enhanced}}{speedup_{enhanced}})$

$speedup_{overall} = \dfrac{execution\ time_{old}}{execution\ time_{new}}$

### 1.9.5 处理器性能公式

$CPU\ execution\ time\ for\ a\ program = CPU\ clock\ cycles\ for\ program \times Clock\ cycle\ time$

$CPU\ clock\ cycles = Instructions\ for\ a\ program \times Average\ clock\ cycles\ per\ instruction$

$CPU\ time = Instruction\ count \times CPI \times Clock\ cycle\ time$

??? example "例题"

    <figure markdown="span">
      ![Img 1](../../../img/comp_arch/ch1/ca_ch1_img1.png){ width="600" }
    </figure>
