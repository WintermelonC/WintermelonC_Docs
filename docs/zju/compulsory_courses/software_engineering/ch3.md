# 3 软件过程结构

!!! info "说明"

    本文档由 AI 生成

看完了你上传的第三章 PPT（SE03.ppt），这一章内容非常扎实，它从**宏观的流程框架**深入到了**具体的执行细节**，并且引入了非常重要的**过程改进模型（CMMI）**。

这一章的考点通常集中在**过程流的类型**（尤其是并行和迭代的区别）以及**CMMI 的五个等级**上。

为了帮你高效备考，我将 PPT 内容整理成了结构化的笔记，并按要求标注了英文专有名词。

---

### 📚 软件工程 Chapter 3: 软件过程结构 (Software Process Structure)

#### 1. 通用过程模型 (A Generic Process Model)
这是对第一章通用框架的细化，强调了**层次化**和**活动流**。

*   **层次结构 (Hierarchy):**
    *   **框架活动 (Framework Activities):** 也就是第一章提到的沟通、规划、建模、构建、部署。
    *   **动作 (Actions):** 针对特定框架活动的一系列动作（如“沟通”动作包括需求获取）。
    *   **任务集 (Task Set):** 定义了工程工作中的最小活动单元（如写代码、单元测试）。
    *   **伞状活动 (Umbrella Activities):** 覆盖整个过程的活动，如软件项目跟踪与控制、风险管理等。

*   **过程流 (Process Flow):**
    *   **迭代过程流 (Iterative Process Flow):** 时间被划分为一系列的**增量 (Increments)**。在每个增量期间，交付一个部分完成的系统。这体现了敏捷开发的思想。
    *   **演化过程流 (Evolutionary Process Flow):** 强调系统是逐步演化出来的（通常指原型法）。
    *   **并行过程流 (Parallel Process Flow):** 某些活动可以同时进行（例如，在一个模块进行编码的同时，另一个模块进行设计）。

#### 2. 过程模式 (Process Patterns)
这是一个比较抽象的概念，你可以把它理解为**“解决过程问题的模板”**。

*   **定义 (Definition):** 过程模式定义了一组活动、动作、工作任务、工作产品或相关行为。
*   **模式要素 (Pattern Elements):**
    *   **名称 (Name):** 有意义的模式名。
    *   **意图 (Intent):** 模式的客观目标。
    *   **类型 (Type):**
        *   **任务模式 (Task Pattern):** 定义工程动作或工作任务。
        *   **阶段模式 (Stage Pattern):** 定义过程的框架活动。
        *   **阶段序列模式 (Phase Pattern):** 定义框架活动在过程中的顺序或流。
    *   **上下文 (Context):** 包括初始上下文（使用前的条件）和结果上下文（使用后的条件）。
    *   **解决方案 (Solution):** 如何正确实施该模式。
    *   **相关模式 (Related Patterns):** 与其他模式的关联。

#### 3. 过程评估与改进 (Process Assessment & Improvement)
这是本章的重中之重，涉及软件组织成熟度的衡量。

*   **核心概念 (Core Concepts):**
    *   **软件过程评估 (Software Process Assessment):** 识别软件过程的能力和风险。
    *   **能力确定 (Capability Determination):** 通过评估得出结论。
    *   **软件过程改进 (Software Process Improvement):** 基于评估结果进行优化。

*   **评估标准与方法 (Standards & Methods):**
    *   **SPICE:** 即 ISO/IEC 15504（国际标准）。
    *   **CBA IPI:** 用于能力评估的基准。
    *   **SCAMPI:** 一种评估方法。
    *   **ISO 9001:2000:** 针对软件的质量管理体系标准。

#### 4. 能力成熟度模型集成 (CMMI - Capability Maturity Model Integration)
由卡内基梅隆大学软件工程研究所 (SEI) 提出，是衡量软件开发过程成熟度的事实标准。

**CMMI 五个等级 (5 Levels):**

| 等级 | 名称 | 描述 (Key Characteristics) |
| :--- | :--- | :--- |
| **Level 0** | **未完成级 (Incomplete)** | 过程未执行，或未达到该级别的所有目标。 |
| **Level 1** | **执行级 (Performed)** | 执行了产生所需工作产品的工作任务。 |
| **Level 2** | **管理级 (Managed)** | 工作人员拥有足够的资源；利益相关者积极参与；工作产品被监控和审查；**关注单个项目**。 |
| **Level 3** | **定义级 (Defined)** | 管理和工程过程被文档化、标准化，并集成到**全组织范围**的软件过程中。 |
| **Level 4** | **量化管理级 (Quantitatively Managed)** | 使用详细的度量 (Measures) 对软件过程和产品进行**定量**的理解和控制。 |
| **Level 5** | **优化级 (Optimizing)** | 通过过程的定量反馈和测试创新想法，实现**持续的过程改进**。 |

---

### 💡 复习重点总结 (Key Takeaways for Exam)

1.  **CMMI 五级模型:** 这是必考点。请务必记住 **Level 2 (Managed)** 是项目级的管理，**Level 3 (Defined)** 是组织级的标准，**Level 4 (Quantitatively)** 强调数据量化。
2.  **过程流的区别:** 理解 **Iterative (迭代)** 是分增量交付，**Parallel (并行)** 是同时进行。
3.  **过程模式:** 记住它的三个类型 (Task, Stage, Phase) 即可。
4.  **术语:** 注意区分 **Software Process Improvement (改进)** 和 **Software Process Assessment (评估)** 的关系。

这一章的理论比较枯燥，但逻辑很清晰。重点把 CMMI 的表格背下来，考试就很稳了！加油！