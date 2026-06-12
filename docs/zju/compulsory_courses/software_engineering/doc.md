# 整理

## 1 图

### 1.1 Use-Case Diagram

[UML用例图（Use Case Diagram）概述](https://zhuanlan.zhihu.com/p/135348779){:target="_blank"}<br/>
[软件设计中如何画各类图之五用例图（Use Case Diagram）：系统功能需求与用户交互的图形化描述](https://blog.csdn.net/cooldream2009/article/details/134798264){:target="_blank"}

### 1.2 Class Diagram

[设计模式（0）：UML类图（Class Diagram）](https://blog.csdn.net/WHEgqing/article/details/107902548){:target="_blank"}

### 1.3 State Diagram

[2 分钟学会 UML 状态图](https://www.bilibili.com/video/BV1dx421S7Lo/){:target="_blank"}

### 1.4 CRC

[9. 简易类图+CRC卡片](https://zhuanlan.zhihu.com/p/149234056){:target="_blank"}

### 1.5 Sequence Diagram

[5 分钟学会 UML 时序图（顺序图、序列图）](https://www.bilibili.com/video/BV1YM411f7dr/){:target="_blank"}<br/>
[UML时序图(Sequence Diagram)](https://zhuanlan.zhihu.com/p/681732997){:target="_blank"}

### 1.6 Data Flow Diagram

[3 分钟学会 数据流图](https://www.bilibili.com/video/BV1Hx4y1J7yg/){:target="_blank"}

## 2 黑盒测试 vs 白盒测试

1. 黑盒测试：把被测软件看作一个看不见内部结构的“黑盒子”。测试时，只关注输入和输出之间的关系，不关心内部代码如何实现
2. 白盒测试：可以看到并利用软件的内部代码、逻辑结构和算法。测试时，要验证内部所有路径、分支、条件、循环是否正确执行

| 维度 | 黑盒测试 | 白盒测试 |
| -- | -- | -- |
| 视角 | 用户/外部视角 | 开发者/内部视角 |
| 关注点 | 功能是否符合需求 | 代码逻辑是否正确 |
| 是否需要代码 | 不需要 | 需要 |
| 发现典型缺陷 | 功能缺失、接口错误、性能问题 | 逻辑错误、路径遗漏、资源泄露 |
| 适用阶段 | 系统测试、集成测试、验收测试 | 单元测试、集成测试早期 |

了解黑盒测试和白盒测试的典型方法：[23 传统应用程序测试](./ch23.md){:target="_blank"}