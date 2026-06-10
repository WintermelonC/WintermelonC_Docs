# 5 敏捷开发

!!! info "说明"

    本文档由 AI 生成

这一章（Chapter 5: Agile Development）是现代软件工程的核心内容。随着行业对快速交付和变化响应的需求增加，**敏捷开发 (Agile Development)** 变得越来越重要。

这份 PPT 详细介绍了敏捷宣言、核心原则、以及几种主流的敏捷方法论（如 XP、Scrum、DSDM 等）。

以下是为你整理的详细笔记：

---

### 📚 软件工程 Chapter 5: 敏捷开发 (Agile Development)

#### 1. 敏捷宣言 (The Manifesto for Agile Software Development)
这是敏捷开发的基石，由 Kent Beck 等人提出。它并不是完全否定右边的项，而是**优先考虑**左边的项。

*   **个体和互动 (Individuals and interactions)** 优于 流程和工具 (Processes and tools)
*   **可工作的软件 (Working software)** 优于 面面俱到的文档 (Comprehensive documentation)
*   **客户合作 (Customer collaboration)** 优于 合同谈判 (Contract negotiation)
*   **响应变化 (Responding to change)** 优于 遵循计划 (Following a plan)

#### 2. 什么是“敏捷性” (What is "Agility"?)
敏捷性的核心在于：

*   对变化做出有效（快速且适应性强）的响应。
*   所有利益相关者之间的有效沟通。
*   让客户成为团队的一部分。
*   组织一个能够**自我管理 (Self-organizing)** 的团队。
*   最终产出：**快速、增量式交付 (Rapid, incremental delivery)**。

#### 3. 敏捷原则 (Agility Principles)
PPT 中列出了 12 条原则，以下是核心要点：

*   **优先级：** 最高优先级是通过早期和持续交付有价值的软件来满足客户。
*   **拥抱变化：** 欢迎需求变化（即使在开发后期），利用变化为客户获取竞争优势。
*   **交付频率：** 频繁交付工作软件（几周到几个月），倾向于较短的时间尺度。
*   **协作：** 业务人员（Business people）和开发人员必须在整个项目中**每日协作 (Work together daily)**。
*   **激励与信任：** 围绕有动力的个体构建项目，信任他们能完成工作。
*   **沟通：** 面对面交谈是最有效、最高效的沟通方式。
*   **进度度量：** 可工作的软件是主要的进度度量标准。
*   **可持续性：** 敏捷过程提倡可持续开发，保持恒定的步调。
*   **技术卓越：** 持续关注技术卓越和良好设计。
*   **简单性：** 最大化“未做工作量”的艺术是本质的（即不要做过度设计）。
*   **自组织团队：** 最好的架构、需求和设计来自自组织团队。
*   **反思与调整：** 团队定期反思如何更有效，并相应地调整行为。

#### 4. 人员因素 (Human Factors)
敏捷开发对团队成员有较高的软技能要求：

*   **能力 (Competence)**
*   **共同关注点 (Common focus)**
*   **协作 (Collaboration)**
*   **决策能力 (Decision-making ability)**
*   **模糊问题解决能力 (Fuzzy problem-solving ability)**
*   **相互信任与尊重 (Mutual trust and respect)**
*   **自组织 (Self-organization)**

---

### 🛠️ 主流敏捷方法论 (Popular Agile Methods)

#### 1. 极限编程 (Extreme Programming, XP)
由 Kent Beck 提出，是使用最广泛的敏捷过程。

*   **XP 规划 (Planning):**
    *   使用 **用户故事 (User stories)** 来描述需求。
    *   团队评估每个故事并分配成本。
    *   根据**项目速度 (Project velocity)** 来预测后续增量的交付日期。
*   **XP 设计 (Design):**
    *   遵循 **KIS (Keep It Simple)** 原则。
    *   使用 **CRC 卡 (CRC cards)** 进行设计。
    *   针对难题创建 **Spike 解决方案 (Spike solutions)**（设计原型）。
    *   鼓励 **重构 (Refactoring)** ——迭代式地改进内部设计。
*   **XP 编码 (Coding):**
    *   **结对编程 (Pair programming)**：两名程序员在同一台机器上工作。
    *   **测试驱动开发 (Test-driven development)**：先写测试，再写代码。
*   **XP 测试 (Testing):**
    *   每日执行所有单元测试。
    *   客户定义 **验收测试 (Acceptance tests)**。

#### 2. 工业极限编程 (Industrial XP, IXP)
在 XP 基础上增加了管理实践：

*   **新增的 6 项实践：**
    1.  准备度评估 (Readiness assessment)
    2.  项目社区 (Project community)
    8.  项目章程 (Project chartering)
    4.  测试驱动管理 (Test driven management)
    5.  回顾 (Retrospectives)
    6.  持续学习 (Continuous learning)

#### 3. Scrum
由 Schwaber 和 Beedle 提出。

*   **特点：**
    *   开发工作被划分为“包 (packets)”。
    *   测试和文档贯穿始终。
*   **核心概念：**
    *   **Sprint：** 一个固定时间段（Time-boxed）的迭代。
    *   **Backlog：** 需求列表。
    *   **每日站会 (Daily Stand-up/Meeting)：** 短会，通常站着开。
    *   **Demo：** 在 Sprint 结束时向客户展示功能。

#### 4. 动态系统开发方法 (DSDM - Dynamic Systems Development Method)
由 DSDM 联盟推广，强调 9 条指导原则。

*   **核心原则：**
    *   **用户必须积极参与。**
    *   **团队必须被授权做决策。**
    *   重点是**频繁交付 (Frequent delivery)**。
    *   适合业务用途 (Fitness for business purpose) 是验收标准。
    *   迭代和增量开发是必要的。
    *   开发期间的所有变更都是**可逆的 (Reversible)**。
    *   需求在高层次上基线化 (Baselined)。
    *   测试贯穿整个生命周期。

#### 5. 其他敏捷方法

*   **敏捷建模 (Agile Modeling):** 提出了一套原则，如“有目的地建模”、“使用多种模型”、“轻装上阵 (Travel light)”。
*   **敏捷统一过程 (Agile Unified Process, AUP):** 基于 Rational Unified Process (RUP) 的简化版。每次迭代包含：建模、实现、测试、部署、配置管理、环境管理。

---

### 💡 复习重点总结 (Key Takeaways for Exam)

1.  **敏捷宣言的 4 个价值观：** 务必背熟，特别是左边优先于右边的逻辑。
2.  **XP 的核心实践：** 结对编程、测试驱动开发、重构、简单设计。
3.  **Scrum 的核心术语：** Sprint, Backlog, Daily Stand-up, Demo。
4.  **DSDM 的特点：** 变更是可逆的、用户必须积极参与。
5.  **通用概念：** 理解“增量交付”、“自组织团队”和“响应变化”的重要性。

这一章的概念很多都是目前 IT 行业的实际工作流（特别是 Scrum 和 XP），理解了它们对你未来的工作也很有帮助。加油！