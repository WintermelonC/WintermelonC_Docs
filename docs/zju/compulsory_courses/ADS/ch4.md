# 4 Leftist Heaps and Skew Heaps

!!! tip "说明"

    此文档正在更新中……

!!! info "说明"

    本文档只涉及部分知识点，仅可用来复习重点知识

## 1 Leftist Heaps

**左式堆**

定义 null path length，$Npl(X)$ 是从 X 至一个没有孩子的结点的路径的最短长度，规定 $Npl(NULL) = -1$
$$
Npl(X) = min \lbrace Npl(left\ child), Npl(right\ child)\rbrace + 1
$$

### 定义

左式堆具有以下性质：

1. 对于每个结点 X，X 左孩子的 Npl 值大于等于 X 右孩子的 Npl 值

<figure markdown="span">
    ![Img 1](../../../img/ADS/ADS_ch4_img1.png){ width="600" }
</figure>

!!! tip "定理"

    一个左式堆，若其 right path 上有 r 个结点，则该左式堆一定至少有 $2^r - 1$ 个结点

### merge

#### 递归实现

**recursive version**

<figure markdown="span">
    ![Img 2](../../../img/ADS/ADS_ch4_img2.png){ width="600" }
</figure>

??? example "递归实现模拟"

    

现有两个左式堆 H1，H2，模拟一下递归实现

<div class="grid" id="grid-mid" markdown>
<div>

```mermaid
graph TD;
a3((3))
a10((10))
a21((21))
a14((14))
a23((23))
a8((8))
a17((17))
a26((26))
a3 === a10
a3 === a8
a10 === a21
a10 === a14
a14 === a23
a14 === n1((NULL))
a8 === a17
a8 === n2((NULL))
a17 === a26
a17 === n3((NULL))
```

<p id="txt-mid">H1</p>
</div>
<div>

```mermaid
graph TD;
a6((6))
a12((12))
a18((18))
a24((24))
a33((33))
a7((7))
a37((37))
a182((18))
a6 === a12
a6 === a7
a12 === a18
a12 === a24
a24 === a33
a24 === n1((NULL))
a7 === a37
a7 === a182
```

<p id="txt-mid">H2</p>
</div>
</div>

---

<figure markdown="span">
    ![Img 3](../../../img/ADS/ADS_ch4_img3.png){ width="600" }
</figure>

