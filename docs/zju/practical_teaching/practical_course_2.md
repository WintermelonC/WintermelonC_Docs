# 课程综合实践Ⅱ

<!-- !!! tip "说明"

    本文档正在更新中…… -->

## 课程介绍

!!! info "注意"

    此为 2025-2026 短学期（暑假）课程安排，仅供参考

具体的选课通知老师会在通知群里发的

官网通知：[更新2025-2026学年计算机学院短学期课程时间和场地安排](http://cspo.zju.edu.cn/2025/0515/c29529a3051086/page.htm){:target="_blank"}

我选的是 ^^C++ 项目管理及工程实践^^，yx老师

### 课程内容与考核方式

<div class="hq-card hq-file-block" markdown="1">
<div class="file-icon"><img src="../../../img/pdf.svg" style="height: 3em;"></div>
<div class="hq-file-body">
<div class="hq-file-title">C++ 项目管理及工程实践</div>
<div class="hq-file-meta">495 KB | 7 Page</div>
</div>
<a class="hq-down-button" target="_blank" href="../../../file/practical_teaching/practical_teaching_doc2.pdf" markdown="1">:fontawesome-solid-download: 下载</a>
</div>

这门课只需要写一个 C++ 项目就行。需要用到的工具（课上会提到）：

1. [vcpkg](../../knowledge/C_Cpp/vcpkg.md){:target="_blank"}
2. [CMake](../../knowledge/C_Cpp/cmake.md){:target="_blank"}
3. [git](../../tools/git/index.md){:target="_blank"}

代码架构 **必须** 要使用 MVVM 架构，因此选题的时候要注意选择适合 MVVM 架构的

## project

我们小组用 SFML 库写了一个 Edge Surf 小游戏，并把写的 💩 放到了 github 上：[ZJU2025SummerCpp_surf](https://github.com/WintermelonC/ZJU2025SummerCpp_surf){:target="_blank"}

> 我们的代码架构仍存在问题，但应该是符合 MVVM 架构的基本要求

## 个人感受

一开始我得知作业就是写一个 C++ 项目，于是我就闷头开始写代码，完全不知道要用 MVVM 架构来写。再加上没有完全理解 MVVM 架构，我们的代码总共重构了 4 次，导致我们的进度一直停滞在某个阶段，因此后面就没有时间加功能了

所以一定要花时间把 MVVM 架构研究一下，老师课件当中有代码示例的。说实话，我到现在也没有完全搞明白这个 MVVM 架构 😂