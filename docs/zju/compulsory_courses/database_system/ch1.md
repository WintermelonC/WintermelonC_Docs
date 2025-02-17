# 1 Introduction

!!! tip "说明"

    此文档正在更新中……

Database：长期存储在计算机内、有组织的、可共享的数据集合

Database-management system (DBMS)：一个用来存储，管理，便捷访问 database 的软件系统

## 1.2 Purpose of Database Systems

**file-processing system 的缺点：**

1. data redundancy and inconsistency
2. difficulty in accessing data
3. data isolation
4. integrity problems
5. atomicity problems（原子性问题，不可分割性问题）
      1. Transfer of funds from one account to another should either complete or not happen at all.（A 转出钱财，B 转入钱财，这两件事要么同时发生，要么都不发生）
6. concurrent-access anomalies（并发访问异常）
7. security problems

**DBMS 的特征：**

1. Efficiency and scalability in data access.（数据访问便捷性和可扩展性）
2. Reduced application development time.（减少应用处理时间）
3. Data independence (including physical data independence and logical data independence).（数据独立性）
4. Data integrity and security.（数据完整性和安全性）
5. Concurrent access and robustness (i.e., recovery).（支持多用户并发查询，稳健性）

## 1.3 View of Data

### 1.3.1 Level of Data Abstraction

数据库的 3 个 level：

<figure markdown="span">
  ![Img 1](../../../img/database/ch1/database_ch1_img1.png){ width="600" }
</figure>

- physical level：物理方面如何保存数据
- logical level：数据库中的数据，以及这些数据之间的关系
- view level：最终展现的视图结果。应用可以隐藏一些不必要的信息，或出于安全考虑不展示某些私密信息

### 1.3.2 Schemas and Instances

