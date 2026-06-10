# 8 需求工程

!!! info "说明"

    本文档由 AI 生成

这一章（Chapter 8: Understanding Requirements）是软件工程的核心重点，也是考试中的高频考点。它详细阐述了**需求工程 (Requirements Engineering)** 的全过程。

这一章的逻辑非常清晰，从最初的项目启动（Inception）开始，逐步深入到需求的获取、分析建模、协商、规格说明，最后是验证与管理。

以下是为你整理的详细笔记（Markdown格式），专有名词后均已附上英文对照：

---

### 📚 软件工程 Chapter 8: 需求工程 (Understanding Requirements)

#### 1. 需求工程流程 (Requirements Engineering Process)
需求工程是一组用于**定义、文档化和维护系统需求**的任务框架。

| 阶段 | 英文 | 核心任务 |
| :--- | :--- | :--- |
| **启动** | **Inception** | 建立基本理解，确定干系人，明确初步沟通。 |
| **获取** | **Elicitation** | 从所有干系人那里提取需求，解决范围、理解和易变性问题。 |
| **精化** | **Elaboration** | 创建分析模型 (Analysis Model)，识别数据、功能和行为需求。 |
| **协商** | **Negotiation** | 开发者与客户达成一致，确定一个现实的、可交付的系统（Win-Win）。 |
| **规格说明** | **Specification** | 将需求文档化（文档、模型、原型等）。 |
| **验证** | **Validation** | 检查内容错误、缺失信息、不一致和冲突。 |
| **管理** | **Management** | 跟踪需求变更，特别是在增量开发中。 |

#### 2. 启动阶段 (Inception)
这是项目的起点，旨在快速建立对问题的初步理解。

*   **核心问题 (Key Questions):**
    *   **Who is behind the request?** (谁提出的需求？)
    *   **Who will use the solution?** (谁会使用这个解决方案？)
    *   **What is the economic benefit?** (成功的解决方案带来的经济效益是什么？)
    *   **Is there another source?** (是否有其他现成的解决方案？)
*   **关键活动:**
    *   **识别干系人 (Identify Stakeholders):** 问“我还应该和谁谈谈？”
    *   **寻求协作 (Work toward collaboration):** 打破隔阂，建立合作氛围。

#### 3. 需求获取 (Eliciting Requirements)
这是最困难的环节（The hardest single part），因为存在**范围问题 (Problem of scope)**、**理解问题 (Problem of understanding)** 和**易变性问题 (Problem of volatility)**。

*   **获取会议 (Elicitation Meetings):**
    *   **促进者 (Facilitator):** 控制会议进程。
    *   **参与者:** 软件工程师和客户共同参与。
    *   **规则:** 建立准备和参与的规则。
*   **定义机制 (Definition Mechanism):** 使用便签、电子公告板、聊天室等工具记录。
*   **获取工作产品 (Elicitation Work Products):**
    *   需求陈述和可行性分析。
    *   系统范围的界定陈述。
    *   参与者的列表。
    *   技术环境描述。
    *   需求列表和领域约束。
    *   使用场景 (Usage scenarios) 和原型。

#### 4. 需求分类与优先级 (Requirement Types & Prioritization)

*   **功能性需求 (Functional Requirements):** 系统必须执行的功能。
*   **非功能性需求 (Non-Functional Requirements, NFR):** 质量属性、性能、安全性、约束。
    *   **NFR 兼容性矩阵:** 用于确定 NFR 之间是互补、重叠、冲突还是独立。
*   **质量功能部署 (Quality Function Deployment, QFD):** 一种确定需求优先级的方法。
    *   **功能部署 (Function deployment):** 确定每个功能的客户感知价值。
    *   **信息部署 (Information deployment):** 识别数据对象和事件。
    *   **任务部署 (Task deployment):** 检查系统行为。
    *   **价值分析 (Value analysis):** 确定需求的相对优先级。
    *   **需求的三种类型:**
        1.  **基本需求 (Normal requirements):** 客户明确想要的。
        2.  **期望需求 (Expected requirements):** 客户认为理所当然会有的（如软件的易用性）。
        3.  **兴奋需求 (Exciting requirements):** 客户没想到但会带来惊喜的。

#### 5. 用例 (Use-Cases)
用例是描述系统使用流程的用户场景集合。

*   **参与者 (Actor):** 与系统交互的人或设备。
*   **场景描述需回答的问题:**
    *   主要参与者和次要参与者是谁？
    *   参与者的目标是什么？
    *   故事开始前的前置条件是什么？
    *   参与者执行的主要任务是什么？
    *   可能的扩展和变体是什么？
    *   系统信息如何被获取、产生或修改？
*   **SafeHome 示例:** 一个家庭安全系统，可以通过互联网配置，检测非法入侵、火灾等。

#### 6. 构建分析模型 (Building the Analysis Model)
分析模型用于在设计之前理解系统。主要包含以下几种图：

*   **基于场景的元素 (Scenario-based elements):**
    *   **用例图 (Use-case diagram):** 展示参与者与系统功能的关系。
*   **基于类的元素 (Class-based elements):**
    *   **类图 (Class diagram):** 展示系统中的对象及其关系。
    *   *示例:* `Sensor` 类包含属性（名称、ID、位置）和操作（identify, enable, disable）。
*   **行为元素 (Behavioral elements):**
    *   **状态图 (State diagram):** 展示系统或对象在其生命周期内所经历的状态序列。
    *   *示例:* 复印机的状态转换（初始化 -> 读取命令 -> 制作副本 -> 卡纸处理）。
*   **面向流的元素 (Flow-oriented elements):**
    *   **数据流图 (Data flow diagram):** 展示数据如何在系统中流动和被处理。

#### 7. 分析模式 (Analysis Patterns)
模式是解决特定问题的通用方案。

*   **模式要素:**
    *   **名称 (Name):** 描述符。
    *   **意图 (Intent):** 模式代表什么。
    *   **动机 (Motivation):** 说明如何使用模式的场景。
    *   **力与上下文 (Forces and context):** 影响模式使用的外部问题。
    *   **解决方案 (Solution):** 如何应用模式解决结构性和行为性问题。
    *   **后果 (Consequences):** 应用后的权衡和影响。
    *   **设计 (Design):** 如何通过设计模式实现。
    *   **相关模式 (Related patterns):** 结构相似或常用的伴随模式。

#### 8. 需求协商与验证 (Negotiation & Validation)

*   **协商 (Negotiation):**
    *   识别关键干系人。
    *   确定每个人的“获胜条件 (Win conditions)”。
    *   争取“双赢 (Win-Win)”的结果。
*   **验证 (Validation):** 检查需求的质量。
    *   **一致性 (Consistent):** 无冲突。
    *   **必要的 (Necessary):** 不是多余的。
    *   **有界且明确 (Bounded and Unambiguous):** 范围清晰，无歧义。
    *   **可归因 (Attribution):** 知道来源是谁。
    *   **可实现 (Achievable):** 技术上可行。
    *   **可测试 (Testable):** 一旦实现可以被测试。
    *   **正确抽象级别 (Proper level of abstraction):** 不要过早陷入技术细节。

#### 9. 需求管理 (Requirements Management)
*   **运行时验证 (Run-time verification):** 确定软件是否匹配其规格说明。
*   **运行时验证 (Run-time validation):** 评估演化的软件是否满足用户目标。
*   **业务活动监控 (Business activity monitoring):** 评估系统是否满足业务目标。
*   **演化与协同设计 (Evolution and codesign):** 随着系统演化向干系人提供信息。

---

### 💡 复习重点总结 (Key Takeaways for Exam)

1.  **核心流程 (Process):** 务必记住 **Inception, Elicitation, Elaboration, Negotiation, Specification, Validation** 这几个阶段的顺序和定义。
2.  **UML 图 (Diagrams):** 重点区分 **Use-case diagram** (谁用什么功能), **Class diagram** (对象和属性), **State diagram** (状态转换), **Sequence diagram** (时间顺序交互)。
3.  **QFD (质量功能部署):** 理解 **Normal, Expected, Exciting** 三种需求的区别。特别是 Expected（期望需求）是客户认为理所当然的。
4.  **需求验证 (Validation Criteria):** 记住那几个形容词：Consistent, Necessary, Unambiguous, Testable, Achievable。
5.  **SafeHome 案例:** 熟悉这个家庭安全系统的用例图和类图结构，考试可能会以此为背景出题。

这一章内容非常实用，理解了这些概念对你做项目也非常有帮助。祝你复习顺利！