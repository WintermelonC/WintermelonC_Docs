# 4 Threads

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 1 Overview

假设正在开发一个 Web 程序

```java linenums="1"
while (1) {
    RetrieveData();  // block for 1 second
    DisplayData();  // block for 1 second
    GetInputEvents();  // block for 1 second
}
```

如果想要让程序响应更快

```java linenums="1"
while (1) {
    RetrieveALittleData();  // block for 0.1 second
    DisplayALittleData();  // block for 0.1 second
    GetAFewInputEvents();  // block for 0.1 second
}
```

```java linenums="1"
while (1) {
    if (CheckData() == True) {
        RetrieveALittleData();  // block for 0.1 second
        DisplayALittleData();  // block for 0.1 second
    }
    
    if (CheckInputEvents() == True) {
        GetAFewInputEvents();  // block for 0.1 second
    }
}

// 太多的检查，效率不高，响应仍然不快
```

为了使其足够响应迅速，我们需要：将操作分解成非常小的片段，但是同时我们也希望以大块的形式执行代码。更准确地说，我们希望在自己地程序代码中对这些操作进行 schedule

将繁琐的工作交给操作系统，由它在线程中进行调度

```java linenums="1"
CreateThread(RetrieveData());
CreateThread(DisplayData());
CreateThread(GetInputEvents());
WaitForThreads();
```

---

<figure markdown="span">
  ![Img 1](../../../../img/operating_system/ch4/os_ch4_img1.png){ width="600" }
</figure>

多线程的优点：

1. responsiveness（响应性）：在交互式应用程序（如图形界面程序、游戏、网页浏览器等）中，用户希望程序能快速响应输入。使用多线程后，一个线程可以处理用户界面（UI），而其他线程执行耗时任务（如文件读写、网络请求）。这样即使后台任务运行，用户界面仍保持流畅响应，避免“卡死”现象
2. resource sharing（资源共享）：同一进程内的多个线程共享该进程的内存空间，包括代码段、堆、全局变量和堆栈等。这意味着线程之间可以方便地交换数据，无需复杂的通信机制（如管道、消息队列），从而提高效率
3. economy（经济性）：创建和管理一个新进程需要大量系统资源（如独立的地址空间、内存分配、上下文切换开销等）。相比之下，创建线程的开销小得多，因为线程属于同一进程，共享资源，因此更轻量、更高效
4. utilization of MP Architectures（多处理器架构的利用）：现代计算机通常配备多核 CPU。多线程允许程序将不同线程并行分配到不同的 CPU 核心上运行，从而真正实现并行计算，显著提升程序性能和并发能力

## 2 Multithreading Models



## 3 Threading Issues

## 4 Pthreads

## 5 Windows XP Threads

## 6 Linux Threads

## 7 Java Threads