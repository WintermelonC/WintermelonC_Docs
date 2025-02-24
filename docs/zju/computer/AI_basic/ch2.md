# 2 人工智能的系统数据基础

<!-- !!! tip "说明"

    此文档正在更新中…… -->

!!! info "说明"

    本文档只涉及部分知识点，仅可用来复习重点知识

本节要点：

<figure markdown="span">
  ![Img 1](../../../img/AI_basic/ch2/ai_ch_img1.png){ width="400" }
</figure>

## 2.1 初始人工智能系统

### 2.1.1 人工智能系统架构

<figure markdown="span">
  ![Img 2](../../../img/AI_basic/ch2/ai_ch_img2.png){ width="600" }
</figure>

### 2.1.2 人工智能系统三要素

数据，算法，算力

<figure markdown="span">
  ![Img 3](../../../img/AI_basic/ch2/ai_ch_img3.png){ width="400" }
</figure>

## 2.2 人工智能系统基础

### 2.2.1 计算机的定义

是一种现代化的信息处理工具，它对信息进行处理并提供结果，其结果（输出）取决于所接收的信息（输入）及相应的处理算法

### 2.2.2 图灵机

### 2.2.3 冯·诺伊曼计算机模型

组成部分：

- 输入设备、存储器、处理器（运算 + 控制）、输出
- Input, Memory, CPU (Datapath + Controller), Output

程序存储原理：

1. 程序和程序执行所需要的数据在执行前存放到存储器中
2. 要求程序和数据采用同样的格式 —— 二进制
3. 执行程序时，给出程序所在的存储位置

### 2.2.4 计算机系统组成

三个子系统：CPU，Memory，I/O

连接三个子系统的是总线（Bus），分为地址总线、数据总线和控制总线

<figure markdown="span">
  ![Img 4](../../../img/AI_basic/ch2/ai_ch_img4.png){ width="400" }
</figure>

#### CPU

<figure markdown="span">
  ![Img 5](../../../img/AI_basic/ch2/ai_ch_img5.png){ width="600" }
</figure>

性能指标：

1. 主频
2. CPU 数量、内核数量
3. 字长：处理器一次能够处理的最大二进制数的位数
4. 协处理器：不单独工作、在 CPU 的协调下完成任务，例如处理浮点运算的协处理器
5. 内部高速缓存器（Cache）

#### 存储器系统

- 存储器由若干个存储单元组成，每个存储单元都有一个唯一的标识叫做存储器地址，用二进制位模式进行标识
- 数据存放在存储单元中，存储单元以字节（Byte，缩写为 B ）为单位，一个字节由 8 位二进制位（bit，缩写为 b） 组成
- 存储容量即存储器中存储单元的总数，也叫做字节数，或者称为地址空间

<figure markdown="span">
  ![Img 7](../../../img/AI_basic/ch2/ai_ch_img7.png){ width="600" }
</figure>

##### 内存储器（主存储器）

容量小，运行速度快

- 每个内存单元存储 1 个字节的地址，地址也按二进制位进行标识，连续存放
- 内存空间和 CPU 地址总线数目有关

<figure markdown="span">
  ![Img 6](../../../img/AI_basic/ch2/ai_ch_img6.png){ width="600" }
</figure>

1. 随机存取存储器（RAM）
      1. DRAM：制作内存条
      2. SRAM：制作 Cache
2. 制度存储器（ROM）：断电后存储的数据不会丢失
      1. PROM
      2. EPROM
      3. EEPROM

##### 外存储器（辅助存储器）

容量大，运行速度慢

磁盘（disk）

---

固态存储器（SSD），存储介质是内存（Flash Memory）

优势：

1. 速度快
2. 克服了 RAM 的易失性

类型：

1. U 盘，固态硬盘
2. 卡片式固态存储器：CF 卡，SD 卡

#### I/O 系统

端口：是外部设备与主机连接器。如 USB 接口，Type C 接口

### 2.2.5 操作系统

操作系统是计算机硬件和用户 其他软件和人之间的接口，位于计算机系统核心，它使用户能够方便地操作计算机，能有效地对计算机软件和硬件资源进行管理和使用

- 内核（kernel）：是操作系统的核心，管理计算机各种资源所需要的基本模块（程序）代码 ，包括文件管理、设备驱动、内存管理、 CPU 调度和控制等功能
- Shell（外壳程序）：负责接收用户（包括用户执行的应用程序）的操作命令，并将这个命令解释后交给 Kernel 去执行
- 在 Windows 系统中 Shell 是 GUI

#### 文件系统

## 2.3 人工智能数据基础

### 2.3.1 数的表示

- 原码
- 反码
- 补码

[浮点数的表示](../../compulsory_courses/computer_organization/theory/ch3.md#35-floating-point){:target="_blank"}

### 2.3.2 字符的表示

ASCII 码、GBK、UTF-8

### 2.3.3 音频

### 2.3.5 图形图像

矢量图

### 2.3.6 视频