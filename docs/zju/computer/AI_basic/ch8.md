# 8 卷积神经网络

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

Convolutional Neural Network（CNN）

## 8.2 卷积运算基础

### 8.2.1 数学中的卷积

假设有两个连续函数 $f(x), g(x)$，卷积可表示为：

$$
h(x) = \int_{-\infty}^{+\infty} f(\tau)g(x- \tau) d\tau
$$

记为 $h(x) = (f · g)(x)$

如果两个函数为离散函数：

$$
h(n) = (f · g)(n) = \sum\limits_{m=-\infty}^{+\infty}f(m)g(n-m)
$$

### 8.2.2 感受野

物体在视网膜处投射出影像后，在视觉信号向大脑传导的过程中，并不采用所有神经元全连接的方式，而是首先进行局部处理，经过多个层次的局部处理提取出特征值，再逐层传递。这个局部的大小范围就是“感受野”。因此，基于卷积算法思想和感受野概念构成的神经网络就被命名为“卷积”神经网络

### 8.2.3 图像的数字化表示

数字图像的每个像素用 RGB 三原色来表示

## 8.3 卷积神经网络的实现

### 8.3.1 卷积运算

卷积运算就是通过设计一系列大小适中的卷积核（感受野），对数字图像的各个通道分量进行加权求和，并提取特征值的过程

#### 运算过程

1. 补齐/填充（padding）：在输入图像的四边补上一定宽度的像素，值设置为 0

    - 当卷积核的大小为 3x3，步长为 1 时，如果在四边补齐 1 个像素宽度的 0，就可以保证输出特征图的大小与输入图像相同

2. 卷积运算
3. 计算其他颜色通道
4. 用新的卷积核
5. 生成 n 组特征向量

<div class="grid" markdown>
<div markdown>

<figure markdown="span">
![Img 1](../../../img/AI_basic/ch8/ai_ch8_img1.png){ width="400" }
<figcaption>阴影部分：0 x 0 + 1 x 1 + 3 x 2 + 4 x 3 = 19</figcaption>
</figure>

> 图片来源：https://zh.d2l.ai/chapter_convolutional-neural-networks/conv-layer.html

</div>
<div markdown>

<figure markdown="span">
![Img 2](../../../img/AI_basic/ch8/ai_ch8_img2.png){ width="400" }
<figcaption>带填充的卷积运算</figcaption>
</figure>

> 图片来源：https://zh.d2l.ai/chapter_convolutional-neural-networks/padding-and-strides.html

</div>
</div>

<figure markdown="span">
  ![Img 3](../../../img/AI_basic/ch8/ai_ch8_img3.png){ width="400" }
  <figcaption>垂直步幅为 3，水平步幅为 2 的卷积运算</figcaption>
</figure>

> 图片来源：https://zh.d2l.ai/chapter_convolutional-neural-networks/padding-and-strides.html

#### 主要参数

1. 卷积核的形状
2. 步长（stride）
3. 卷积核的数量

通常，当

1. $n_h$：输入的高度
2. $n_w$：输入的宽度
3. $k_h$：卷积核的高度
4. $k_w$：卷积核的宽度
5. $p_h$：行填充
6. $p_w$：列填充
7. $s_h$：垂直步幅
8. $s_w$：水平步幅

时，输出形状为

$$\lfloor(n_h-k_h+p_h+s_h)/s_h\rfloor \times \lfloor(n_w-k_w+p_w+s_w)/s_w\rfloor
$$

### 8.3.2 池化

池化（pooling）也称下采样，其作用是缩小特征图的尺寸以减少计算量

1. 最大池化
2. 随机池化
3. 平均池化
4. L2 范数池化

<figure markdown="span">
  ![Img 4](../../../img/AI_basic/ch8/ai_ch8_img4.png){ width="600" }
</figure>

### 8.3.3 归一化

归一化，将特征值的取值范围压缩在 0~1 之间

## 8.4 CNN 的应用领域

1. 图像分类
2. 物体检测
3. 分隔
4. 回归问题