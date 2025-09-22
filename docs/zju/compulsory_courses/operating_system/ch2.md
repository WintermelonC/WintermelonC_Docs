# 2 Operating System Structures

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Operating System Services

一组操作系统服务提供对用户有帮助的功能：

1. user interface: CLI, GUI
2. program execution
3. I/O operations
4. file system manipulation
5. communications：进程可在同一台计算机或通过网络在不同计算机之间交换信息
6. error detection

另一组操作系统功能旨在通过资源共享确保系统自身的高效运行

1. resource allocation：当多个用户或多个任务并发运行时，必须为每个对象分配资源
2. accounting（统计）：跟踪记录用户使用的计算机资源数量和类型
3. protection and security：要实现系统保护与安全，必须在整个系统中实施预防措施。链条的强度取决于其最薄弱环节

## 2 User Operating System Interface

### 2.1 CLI

CLI 允许直接输入命令

- 有时通过 kernel 实现
- 有时通过 systems program 实现
- 有时实现多种风格：shell
- 有时命令是内置的（DOS）：命令直接嵌入 CLI 本身，执行效率高但扩展性差
- 有时只是程序名称（Unix）：CLI 只识别程序名称，实际执行外部可执行文件，支持功能扩展而无需修改 CLI 核心代码

## 3 System Calls

**系统调用**

操作系统提供服务的编程接口，通常用高级语言（C/C++）编写。程序主要通过高级应用程序接口（API，Application Program Interfaces）访问这些服务，而非直接使用系统调用

1. Win32 API：Windows
2. POSIX API：基于 POSIX 系统（包括几乎所有 UNIX、Linux 和 Mac OS X版本）
3. Java API：Java 虚拟机

使用 API：

1. portability（可移植性）
2. easy to use（易用性）

### 3.1 System Call Implementation

每个系统调用都有一个对应的编号，系统调用接口维护一个根据这些编号索引的表格

系统调用接口在操作系统内核中调用预期的系统调用，并返回系统调用的状态和任何返回值

调用者无需知道系统调用的具体实现方式，只需要遵守 API 并理解操作系统执行调用后的结果。API 向程序员隐藏了操作系统接口的大部分细节

### 3.2 System Call Parameter Passing

向操作系统传递参数的三种通用方法：

1. 通过寄存器传递参数：在某些情况下，参数数量可能超过寄存器数量
2. 参数存储在内存中的块或表中，块的地址作为参数通过寄存器传递
3. 参数由程序压入栈中，由操作系统弹出栈：块和栈方法不限制传递参数的数量或长度

## 4 Types of System Calls

1. process control
2. file management
3. device management
4. information maintenance
5. communication
6. protection

<figure markdown="span">
  ![Img 1](../../../img/operating_system/ch2/os_ch2_img1.png){ width="600" }
</figure>

### 4.1 System Programs

system program 为程序开发和执行提供了便利环境。它们可分为：

1. file manipulation
2. status information
3. file modification
4. programming language support
5. program loading and execution
6. communications
7. application programs

## 5 Operating System Design and Implementation

操作系统设计没有标准解决方案，属于开放性问题。不同系统采用不同架构（如宏内核、微内核等），结构差异显著

设计必须首先明确设计目标和功能规格，硬件平台和系统类型（实时系统、分时系统等）决定设计方向

- user goals：注重用户体验——易用性、学习曲线、性能表现和安全性
- system goals：关注工程实现——可维护性、灵活性、正确性和效率

policy 决定做什么，mechanism 决定怎么做