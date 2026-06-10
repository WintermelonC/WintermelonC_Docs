# 9 基于场景的需求建模

!!! info "说明"

    本文档由 AI 生成

这一章（Chapter 9: Requirements Modeling: Scenario-Based Methods）非常关键，它承接了第8章的需求工程，重点讲解了如何通过**基于场景的方法 (Scenario-Based Methods)** 来构建分析模型。

这一章的核心逻辑是从抽象的“需求”转化为具体的“模型”，主要包含用例图（Use-case）、活动图（Activity Diagram）和泳道图（Swim Lane）。

以下是为你整理的详细笔记（Markdown格式），专有名词后均已附上英文对照：

---

### 📚 软件工程 Chapter 9: 基于场景的需求建模 (Requirements Modeling: Scenario-Based Methods)

#### 1. 需求分析概述 (Requirements Analysis)
需求分析是连接**系统描述**与**设计模型**的桥梁。

*   **目标 (Objectives):**
    *   描述客户的需求。
    *   建立创建软件设计的基础。
    *   定义一组可验证的需求。
*   **分析师的任务 (Analyst's Role):**
    *   对早期建立的基本需求进行**精化 (Elaboration)**。
    *   构建描述用户场景、功能活动、问题类及其关系、系统行为和数据流的模型。
*   **分析模型的组成 (Components of Analysis Model):**
    *   **基于场景 (Scenario-based):** 用例图、用例描述。
    *   **面向流 (Flow-oriented):** 数据流图 (DFD)、控制流图 (CFD)。
    *   **基于类 (Class-based):** 类图 (Class diagrams)、CRC模型。
    *   **行为 (Behavioral):** 状态图 (State diagrams)、序列图 (Sequence diagrams)。

#### 2. 建模经验法则 (Rules of Thumb)
*   **关注问题域 (Focus on Problem Domain):** 模型应关注在问题域或业务域内可见的需求，抽象级别应相对较高。
*   **增加理解 (Add Understanding):** 每个模型元素都应增加对软件需求的整体理解。
*   **推迟基础设施考虑 (Delay Infrastructure):** 将基础设施和其他非功能性模型的考虑推迟到设计阶段。
*   **最小化耦合 (Minimize Coupling):** 减少系统各部分之间的依赖。
*   **保持简单 (Keep it Simple):** 模型应尽可能简单。

#### 3. 领域分析 (Domain Analysis)
*   **目标:** 识别、分析和指定特定应用领域（Application Domain）内的通用需求，通常用于在多个项目中**复用 (Reuse)**。
*   **知识来源 (Sources of Knowledge):**
    *   技术文献、现有应用程序、重用标准、客户调查、专家建议等。
*   **产出:** 领域分析模型（功能模型、类分类法等）。

#### 4. 用例 (Use-Cases)
用例是描述系统“使用线程 (Thread of usage)”的场景，它定义了**参与者 (Actors)** 与系统之间的交互。

*   **参与者 (Actors):** 代表在系统功能执行期间扮演特定角色的人或设备。
    *   *注意:* 同一个用户可以在不同场景下扮演不同角色。
*   **开发用例的关键问题:**
    *   参与者执行的主要任务是什么？
    *   参与者获取、产生或更改哪些系统信息？
    *   参与者是否需要告知系统外部环境的变化？
    *   参与者希望从系统中获得什么信息？
    *   参与者是否希望被通知意外变化？
*   **用例图 (Use-Case Diagram):**
    *   展示参与者与系统功能（用例椭圆）之间的关系。
    *   *SafeHome 示例:* 房主 (Homeowner) 可以“通过互联网访问摄像头监控”、“配置系统参数”、“设置警报”。

#### 5. 用例评审与细化 (Reviewing a Use-Case)
*   **形式:** 用例通常先以**叙述形式 (Narrative form)** 编写，必要时再映射到正式模板。
*   **评审重点:**
    *   **替代交互 (Alternative Interactions):** 是否存在其他可能的交互路径？
    *   **错误条件 (Error Conditions):** 参与者是否会遇到错误？如果是，系统如何响应？
    *   **其他行为 (Other Behavior):** 是否存在其他可能的行为分支？

#### 6. 活动图 (Activity Diagram)
*   **作用:** 补充用例，提供过程流的**图示化表示 (Diagrammatic representation)**。
*   **核心元素:**
    *   **动作状态 (Action states):** 圆角矩形，表示执行的动作。
    *   **转移 (Transitions):** 箭头，表示流程方向。
    *   **分支/合并 (Branching/Merging):** 菱形，表示条件判断。
    *   **分叉/汇合 (Forking/Joining):** 粗横线，表示并发流程。
*   **SafeHome 活动图示例 (Access Camera Surveillance):**
    1.  输入密码和用户ID -> 验证 -> (有效/无效)。
    2.  选择主要功能 -> 选择监控功能。
    3.  显示缩略图视图 -> 选择特定摄像头。
    4.  在标记窗口中查看摄像头输出。
    5.  循环或退出。

#### 7. 泳道图 (Swim Lane Diagrams)
*   **定义:** 泳道图是活动图的一种变体。
*   **核心功能:** 在表示用例活动流程的同时，明确指出**哪个参与者**或**哪个分析类**负责特定活动矩形中描述的动作。
*   **价值:** 清晰地划分职责，防止功能归属不清。

---

### 💡 复习重点总结 (Key Takeaways for Exam)

1.  **核心概念区分:**
    *   **Use-case (用例):** 描述“谁”用“什么功能”，侧重于外部行为。
    *   **Activity Diagram (活动图):** 描述功能内部的**流程逻辑**，类似流程图。
    *   **Swim Lane (泳道图):** 带有职责划分的活动图，能看出**谁**负责哪一步。
2.  **UML 图识别:** 考试可能会给出一张图，让你判断是用例图、活动图还是状态图。注意活动图有**开始/结束节点**和**动作状态**，而用例图主要是**椭圆**和**小人**。
3.  **SafeHome 案例:** 熟悉这个系统的用例（访问监控、配置参数、设防）以及访问监控的详细活动流程（输入密码 -> 验证 -> 选择摄像头 -> 查看画面）。
4.  **建模原则:** 记住“推迟基础设施考虑”和“最小化耦合”是分析阶段的重要原则。

这一章的图表比较多，建议结合 PPT 中的图片一起记忆，特别是活动图的符号含义。祝你复习顺利！