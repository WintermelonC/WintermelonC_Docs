# 1 软件的本质与演变

!!! info "说明"

    本文档由 AI 生成

期末复习加油！软件工程的第一章通常奠定了整门课程的基础，理解好这些核心概念非常重要。

这份 PPT 主要讲述了软件的本质（The Nature of Software）以及软件工程领域的历史演变和现代形态。

为了方便你复习，我将 PPT 的核心内容整理成了一份结构化的笔记。**特别注意**，我已经按照你的要求，在关键的专有名词后面标注了英文原文，这对你的英文试卷备考非常有帮助。

---

### 📚 软件工程 Chapter 1: 软件的本质与演变 (The Nature of Software & Its Evolution)

#### 1. 软件的发展历程 (The Evolution)
*   **早期 (Early Days):**
    *   模式：用户直接操作计算机 (User → Computer)。
    *   定义：软件被简单视为“将一系列指令组合在一起，让计算机做有用的事情”。
*   **20世纪50年代后期 (Late 1950s):**
    *   变化：计算机变得更便宜、更普及。高级语言 (High-level languages) 被发明。
    *   模式：用户 → 程序员 → 计算机。
*   **20世纪60年代初 (Early 1960s):**
    *   “黑客” (Hacker) 一词当时并不等同于“破解者” (Cracker)，而是指专家。
    *   当时很少有大型软件项目是由专家完成的。

#### 2. 经典案例：IBM 360 操作系统 (Case Study: IBM 360 OS)
这是一个在软件工程历史上非常著名的失败案例，它揭示了当时软件开发面临的困境。
*   **项目规模：** 1963-1966年开发，耗时5000人-年 (5000 person-years)，最多时有1000人参与，编写了近100万行源代码。
*   **结果：** 每个新版本都是修正前一版本1000个错误的结果。
*   **Brooks 博士的教训：**
    *   他将当时的开发状态比作“野兽落入泥沼”，越是挣扎（增加人手），陷得越深（效率越低）。
    *   **核心著作：** 他后来撰写了软件工程领域的经典著作 **《人月神话》 (The Mythical Man-Month)**。

#### 3. 软件的本质与定义 (What is Software?)
*   **定义：** 软件不仅仅是代码，它是一组形成特定配置的项目或对象。
    1.  **指令 (Instructions):** 即计算机程序 (Computer Programs)，执行时提供所需功能和性能。
    2.  **数据结构 (Data Structures):** 使程序能够充分处理信息。
    3.  **文档 (Documents):** 描述程序的操作和使用。
*   **关键特性 (Key Characteristics):**
    *   **开发而非制造 (Developed, not Manufactured):** 软件是被开发或工程化出来的，而不是像传统工业那样被“制造”出来的。
    *   **不磨损但会退化 (Doesn't wear out but deteriorates):**
        *   硬件有物理磨损，软件没有物理损耗。
        *   但是，软件会因为副作用 (side effects) 导致故障率增加，或者因为环境变化而变得难以维护。
        *   **无备件 (No spare parts):** 软件没有备用零件。
    *   **定制构建 (Custom built):** 尽管现在有基于组件的开发，但大多数软件仍然是定制构建的 (Custom built)。

#### 4. 软件应用类型 (Software Application Types)
PPT 中列举了多种软件类型：
*   系统软件 (System software)
*   应用软件 (Application software)
*   工程/科学软件 (Engineering/Scientific software)
*   嵌入式软件 (Embedded software)
*   产品线软件 (Product-line software)
*   Web应用 (Web-applications)
*   人工智能软件 (Artificial intelligence software)

#### 5. 遗留软件 (Legacy Software)
*   **定义：** 指那些仍在使用但可能过时的旧系统。
*   **为什么要改变 (Why must it change)?**
    *   适应新的计算环境或技术。
    *   增强以实现新的业务需求。
    *   扩展使其能与其他现代系统或数据库互操作。
    *   重新架构 (Re-architected) 以在网络环境中生存。

#### 6. 软件性质的变化 (The Changing Nature of Software)
现代软件已经从单一的程序演变成了复杂的系统。

*   **Web应用 (WebApps):**
    *   不仅仅是超文本文档，结合了 XML, Java 等工具。
    *   包含交互式计算能力，可能与企业数据库集成。
    *   **语义网 (Semantic web / Web 3.0):** 涵盖语义数据库、灵活的数据表示和API接口。
*   **移动应用 (Mobile Applications):**
    *   运行在手机或平板等移动平台 (Mobile platforms)。
    *   利用设备特性（如位置属性）和本地存储。
    *   分为移动Web应用（通过浏览器访问）和原生应用（直接访问硬件）。
*   **云计算 (Cloud Computing):**
    *   提供分布式的数据存储和处理资源。
    *   **前端 (Frontend):** 客户端设备和访问应用。
    *   **后端 (Backend):** 服务器、数据存储和服务器端应用。
    *   架构可以分段以保护私有数据。
*   **产品线软件 (Product Line Software):**
    *   **定义：** 一组共享共同特征、满足特定市场需求的软件密集型系统。
    *   **核心：** 使用共同的核心可重用软件组件 (Reusable software components)。
    *   **优势：** 通过利用产品线内的共性来开发多种产品，提高效率。

---

### 💡 复习重点总结 (Key Takeaways for Exam)
1.  **Brooks定律与人月神话：** 记住IBM 360的例子，以及“向进度落后的项目中增加人手，只会使进度更加落后”这一核心思想（虽然PPT原文没直接写这句话，但描述了这个现象）。
2.  **软件 vs 硬件：** 软件不会物理磨损，但会退化；软件是开发的，不是制造的。
3.  **现代趋势：** 了解 WebApp, Mobile App, Cloud Computing, 和 Product Line 的区别和特点。

祝你考试顺利！如果有其他章节需要整理，随时告诉我。