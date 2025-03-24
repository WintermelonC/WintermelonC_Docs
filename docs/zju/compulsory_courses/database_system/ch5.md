# 5 Entity-Relationship Model

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

E-R 模型通过实体集、关系集和属性来描述数据库的结构，并使用 E-R 图来图形化表示这些结构。E-R 图的简洁性和清晰性使其成为数据库设计中的常用工具

## 1 Entity Sets

1. entity：一个实体是存在并且可以与其他对象所区分的对象，它可以是具体的，也可以是抽象的
2. attributes：实体都有属性
3. entity set：实体集就是共享相同属性的同一类型实体的集合

<figure markdown="span">
  ![Img 1](../../../img/database/ch5/database_ch5_img1.png){ width="600" }
</figure>

### 1.1 Attributes

实体由一组属性表示，这些属性是实体集中所有成员所拥有的描述性特性

domain（域）：每个属性允许的值的集合

类型：

1. simple and composite attributes（简单和复合属性）
2. single-valued and multi-valued attributes（单值和多值属性）
3. derived attributes（派生属性）
      1. 可以从其他属性计算得出
      2. 与 base attributes（基属性）和 stored attributes（存储属性）相对

#### 1.1.1 Composite Attributes

<figure markdown="span">
  ![Img 2](../../../img/database/ch5/database_ch5_img2.png){ width="600" }
</figure>

> 分量属性是指复合属性中的各个组成部分。复合属性是由多个简单属性组合而成的属性，而这些简单属性就是分量属性

## 2 Relationship Sets

1. relationship：关系是多个不同实体之间的关联
2. relationship set：关系集是同类型实体（即实体集）之间关系的集合

> 从数学概念上来说，$\lbrace (e_1, e_2, \cdots, e_n)|e_1 \in E_1, e_2 \in E_2 ,\cdots , e_n \in E_n \rbrace$，$(e_1, e_2, \cdots, e_n)$ 就是一个关系，$E_i$ 是一个实体集

<figure markdown="span">
  ![Img 4](../../../img/database/ch5/database_ch5_img4.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 3](../../../img/database/ch5/database_ch5_img3.png){ width="600" }
</figure>

属性不仅可以属于实体集（Entity Set），还可以属于关系集（Relationship Set）。例如上图例子，depositor 这个关系集表示 customer 和 account 之间的关系，而这个关系集本身也可以有自己的属性，比如 access-data

### 2.1 Degree

degree of a relationship set

1. 关系集的度指的是参与关系集的实体集的数量
2. 涉及两个实体集的关系集是二元的 binary（或度为二）

### 2.2 Mapping Cardinalities

**映射基数**：表示通过关系集，一个实体可以与另一类实体相关联的实体数量

对于 binary relationship set：

1. one to on：就任总统（总统，国家）
2. one to many：分班情况（班级，学生）
3. many to one：就医（病人，医生）
4. many ro many：选课（学生，课程）

<div class="grid" markdown>

<figure markdown="span">
  ![Img 5](../../../img/database/ch5/database_ch5_img5.png){ width="500" }
</figure>

<figure markdown="span">
  ![Img 6](../../../img/database/ch5/database_ch5_img6.png){ width="500" }
</figure>

</div>

> A 和 B 中的实体可以没有映射

## 3 Keys

Keys of Entity Sets：

1. super key
2. candidate key
3. primary key

Keys of Relationship Sets:

1. super key：参与一个关系集的各实体集的 primary key 的组合
2. 作为 primary key 的属性不能为空

## 4 E-R Diagram

<figure markdown="span">
  ![Img 7](../../../img/database/ch5/database_ch5_img7.png){ width="500" }
</figure>

1. 矩形表示 entity sets
2. 菱形表示 relationship sets
3. 线条将 attributes 联系到 entity sets 并且将 entity sets 联系到 relationship  sets
4. 椭圆表示 attributes
      1. 双椭圆表示 multi-valued attributes
      2. 虚线椭圆表示 derived attributes
5. 下划线表示 primary key

<figure markdown="span">
  ![Img 8](../../../img/database/ch5/database_ch5_img8.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 9](../../../img/database/ch5/database_ch5_img9.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 10](../../../img/database/ch5/database_ch5_img10.png){ width="600" }
</figure>

---

关系中的实体集可能是不同的，例如 recursive relationship set

1. 这意味着一个实体集可以与自身建立关系
2. role：角色描述了实体在关系中的功能或作用。例如 works-for 关系集中，员工实体可以扮演“经理”或“工人”的角色。角色标签（如“经理”和“工人”）用于明确实体在关系中的具体作用
3. role label：角色标签是可选的，但它们有助于更清晰地理解关系的语义

<figure markdown="span">
  ![Img 11](../../../img/database/ch5/database_ch5_img11.png){ width="600" }
</figure>

### 4.1 Cardinality Constraints

1. directed line $\rightarrow$：表示 one
2. undirected line $—$：表示 many

**one to one**

<figure markdown="span">
  ![Img 12](../../../img/database/ch5/database_ch5_img12.png){ width="400" }
</figure>

**one to many**

<figure markdown="span">
  ![Img 13](../../../img/database/ch5/database_ch5_img13.png){ width="400" }
</figure>

**many to one**

<figure markdown="span">
  ![Img 14](../../../img/database/ch5/database_ch5_img14.png){ width="400" }
</figure>

**many to many**

<figure markdown="span">
  ![Img 15](../../../img/database/ch5/database_ch5_img15.png){ width="400" }
</figure>

1. total participation（全参与）（用 double line $=$ 表示）：实体集中的每个实体都至少参与关系集中的一个关系
2. partial participation（部分参与）：实体集中的一些实体可能不参与关系集中的任何关系

<figure markdown="span">
  ![Img 16](../../../img/database/ch5/database_ch5_img16.png){ width="600" }
</figure>

1. mapping cardinality constraints：限定了一个实体与发生关联的另一端实体可能关联的数目上限
2. total / partial participation：反映了一个实体参与关联的数目下限

Alternative notation：

<figure markdown="span">
  ![Img 17](../../../img/database/ch5/database_ch5_img17.png){ width="600" }
</figure>

**Example**：一个银行职员在多个支行兼职，并承担不同类型的工作

<figure markdown="span">
  ![Img 18](../../../img/database/ch5/database_ch5_img18.png){ width="600" }
</figure>

### 4.2 Non-Binary Relationships

一些关系集使用 non-binary 比使用 binary 要更好

1. parents(he, she, child)
2. works-on(employee, branch, job)

通常，任何非二元关系都可以通过创建一个 artificial entity set（人工实体集）来用二元关系表示

<figure markdown="span">
  ![Img 19](../../../img/database/ch5/database_ch5_img19.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 20](../../../img/database/ch5/database_ch5_img20.png){ width="600" }
</figure>

## 5 Week Entity Sets

1. week entity sets（弱实体集）：没有主键的实体集
2. 弱实体集的存在依赖于 identifying entity set（标识实体集或强实体集）的存在
      1. 它必须通过一个从标识实体集到弱实体集的全参与、一对多的关系集与标识实体集相关联
      2. identifying relationship（标识关系）用双菱形表示
3. 弱实体集的 discriminator / partial（分辨符 / 部分键）是区分弱实体集中所有实体的属性集
4. 弱实体集的主键由其所依赖的强实体集的主键加上弱实体集的分辨符组成

<figure markdown="span">
  ![Img 21](../../../img/database/ch5/database_ch5_img21.png){ width="600" }
</figure>

1. 下划虚线表示弱实体集的标识符
2. 将弱实体集的标识关系放在双菱形中

---

1. 弱实体集的主键由强实体集的主键和弱实体集的分辨符组成。强实体集的主键不会显式地存储在弱实体集中，因为这种关系已经在标识关系中隐含了
2. 如果显式地将 course_id 存储在 section 中，那么 section 可以成为一个强实体。然而，这样做会导致 section 和 course 之间的关系被重复表示：一次通过显式的 course_id 属性，另一次通过标识关系。这种重复可能会导致数据冗余和不一致性

<figure markdown="span">
  ![Img 22](../../../img/database/ch5/database_ch5_img22.png){ width="600" }
</figure>

<figure markdown="span">
  ![Img 23](../../../img/database/ch5/database_ch5_img23.png){ width="800" }
</figure>

## 6 Extended E-R Features

