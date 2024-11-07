# 2 Instructions: Language of the Computer

!!! tip "说明"

    此文档正在更新中……

!!! info "说明"

    1. 部分内容由 AI 翻译课本原文，可能存在错误
    2. 本文档只涉及部分知识点，仅可用来复习重点知识

## 2.2 计算机硬件的操作

RISC-V 操作数（operands）：

<figure markdown="span">
    ![Img 1](../../../../img/computer_organization/theory/comp_orga_theo_ch2_img1.png){ width="800" }
</figure>

RISC-V 汇编语言（assembly language）：

<figure markdown="span">
    ![Img 2](../../../../img/computer_organization/theory/comp_orga_theo_ch2_img2.png){ width="800" }
</figure>

<figure markdown="span">
    ![Img 3](../../../../img/computer_organization/theory/comp_orga_theo_ch2_img3.png){ width="800" }
</figure>

## 2.3 计算机硬件的操作数

在 RISC-V 体系结构中寄存器大小为 64 bit，由于 64 bit 为 1 组的情况经常出现，因此在 RISC-V 体系结构中将其称为 $doubleword$，32 bit 为 1 组则称为 $word$

## 2.8 计算机硬件对过程的支持

### 2.8.2 嵌套过程

**Nested Procedures**

不调用其他过程的过程称为 **叶过程**（leaf procedure）

过程调用时保留和不保留的内容：

<figure markdown="span">
    ![Img 4](../../../../img/computer_organization/theory/comp_orga_theo_ch2_img4.png){ width="600" }
</figure>

> 书上的例子

### 2.8.3 在栈中为新数据分配空间

**Allocating Space for New Data on the Stack**

栈中包含过程所保存的寄存器和局部变量的片段称为 **过程帧**（procedure frame）或 **活动记录**（activation record）

### 2.8.4 在堆中为新数据分配空间

**Allocating Space for New Data on the Heap**

RISC-V 寄存器约定：

<figure markdown="span">
    ![Img 5](../../../../img/computer_organization/theory/comp_orga_theo_ch2_img5.png){ width="600" }
</figure>

## 2.9 人机交互

**Communicating with People**

## 2.10 RISC-V 中立即数和地址的寻址

**RISC-V Addressing for Wide Immediates
and Addresses**

### 2.10.1 立即数

RISC-V 指令集中的读取立即数高位指令（Load upper immediate）`lui`，将 20 bit 常数存储到寄存器的 [31:12] 中，寄存器 [63:32] 复制填充 [31] 的数据，[11:0] 填充 0

### 2.10.2 分支和跳转中的寻址

> 书上的例子

### 2.10.3 RISC-V 寻址模式总结

<figure markdown="span">
    ![Img 6](../../../../img/computer_organization/theory/comp_orga_theo_ch2_img6.png){ width="600" }
</figure>

1. Immediate addressing: where the operand is a constant within the instruction itself.
2. Register addressing: where the operand is a register.
3. Base or displacement addressing: where the operand is at the memory location whose address is the sum of a register and a constant in the instruction.
4. PC-relative addressing: where the branch address is the sum of the PC and a constant in the instruction.

### 2.10.4 机器语言解码

**Decoding Machine Language**

<figure markdown="span">
    ![Img 7](../../../../img/computer_organization/theory/comp_orga_theo_ch2_img7.png){ width="600" }
</figure>

RISC-V 指令的格式：

<figure markdown="span">
    ![Img 8](../../../../img/computer_organization/theory/comp_orga_theo_ch2_img8.png){ width="800" }
</figure>

## 2.11 并行与指令：同步

**Parallelism and Instructions:
Synchronization**

`lr.d`

`sc.d`

> 书上的例子

## 2.12 翻译并执行程序

<figure markdown="span">
    ![Img 8](../../../../img/computer_organization/theory/comp_orga_theo_ch2_img9.png){ width="800" }
</figure>

