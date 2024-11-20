# 4 The Processor

!!! tip "说明"

    此文档正在更新中……

!!! info "说明"

    1. 部分内容由 AI 翻译课本原文，可能存在错误
    2. 本文档只涉及部分知识点，仅可用来复习重点知识

## 4.1 引言

处理器的实现方式决定了时钟周期长度和 CPI

### 4.1.1 一个基本的 RISC-V 实现

核心子集：

1. 存储器访问指令：ld，sd
2. 算术逻辑指令：add，sub，and，or
3. 分支指令：beq

### 4.1.2 实现方式概述

> 理论课讲到这里的时候，实验课已经把单周期 CPU 都实现了，理解起来很容易啦

实现每条指令的前两步是一样的：

1. 程序计数器（PC）指向指令所在的存储单元，并从中取出指令
2. 译码，读寄存器

> 实验课里面，PC 指向指令所在的存储单元就是 ROM

<figure markdown="span">
    ![Img 1](../../../../img/computer_organization/theory/ch4/comp_ch4_img1.png){ width="800" }
</figure>

加入多选器模块和控制单元：

<figure markdown="span">
    ![Img 2](../../../../img/computer_organization/theory/ch4/comp_ch4_img2.png){ width="800" }
</figure>

## 4.2 逻辑设计惯例

**状态单元**（state element）：一个存储单元，如寄存器或存储器

1. 使用术语 **有效** （asserted），表示逻辑高（1）
2. 使用属于 **无效** （deasserted），表示逻辑低（0）

### 4.2.1 时钟方法

**clocking methodology**

## 4.3 建立数据通路

**building a datapath**

用于取指和程序计数器自增的数据通路部分：

<figure markdown="span">
    ![Img 3](../../../../img/computer_organization/theory/ch4/comp_ch4_img3.png){ width="600" }
</figure>

处理器的 32 个通用寄存器位于一个叫做 **寄存器堆**（register file）的结构中

实现分支指令的部分：

<figure markdown="span">
    ![Img 4](../../../../img/computer_organization/theory/ch4/comp_ch4_img4.png){ width="600" }
</figure>

### 4.3.1 创建一个简单的数据通路

实现 R-type 指令和存储指令：

<figure markdown="span">
    ![Img 5](../../../../img/computer_organization/theory/ch4/comp_ch4_img5.png){ width="600" }
</figure>

现在，我们将上述三个部分合并：

<figure markdown="span">
    ![Img 6](../../../../img/computer_organization/theory/ch4/comp_ch4_img6.png){ width="600" }
</figure>

## 4.4 一个简单的实现机制

### 4.4.1 ALU 控制

| ALU control lines | Function |
| :--: | :--: |
| 0000 | AND |
| 0001 | OR |
| 0010 | add |
| 0110 | subtract |

1. 对于取字和存储字指令，ALU 用加法计算存储器地址
2. 对于 R-type 指令：根据 funct7 和 funct3 选择某个操作
3. 对于 `beq` 指令：ALU 执行减法操作

<figure markdown="span">
    ![Img 7](../../../../img/computer_organization/theory/ch4/comp_ch4_img7.png){ width="600" }
</figure>

主控制单元生成 ALUOp 作为 ALU 控制单元的输入，再由 ALU 控制单元生成真正控制 ALU 的信号，这种多级译码的方法是一种常用的实现方式。使用多级译码可以减小主控制单元的规模。使用多个小控制单元还可以提高控制单元的速度。这种优化是很重要的，因为控制单元的性能对减少时钟周期非常关键