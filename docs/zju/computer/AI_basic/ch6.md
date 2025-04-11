# 6 数据的聚类和降维技术

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 6.1 无监督学习方法概述

<figure markdown="span">
  ![Img 1](../../../img/AI_basic/ch6/ai_ch6_img1.png){ width="600" }
</figure>

异常检测：既可以是有监督学习，也可以是无监督学习

无监督学习的两大类方法

1. 聚类：目标是将相似的数据点分组在一起，形成簇（cluster）
2. 降维：降维将高维数据转换为低维表示，减少数据的复杂度，同时巧妙地保留了原始数据中最重要的信息

## 6.2 聚类分析技术

聚类是一种无监督学习技术，旨在将数据集分成若干组（K 个组），使得同组内的样本相似度高，而不同组间的样本相似度低

### 6.2.2 K-means 算法

K-means 是最常用的聚类算法之一

1. 随机初始化若干个中心点，周围散布着未分类的数据点
2. 将每个数据点分配给最近的中心，形成初步的簇
3. 重新计算每个簇的中心点
4. 最终达到一个局部最优的划分结果

<figure markdown="span">
  ![Img 2](../../../img/AI_basic/ch6/ai_ch6_img2.png){ width="600" }
</figure>

### 6.2.3 鸢尾花案例

在鸢尾花案例中，聚类就像是在没有任何先验知识的情况下，仅仅根据花的特征（花萼和花瓣的长度和宽度）来将它们分类

```python linenums="1"
from sklearn import datasets
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt


# 加载数据集
iris = datasets.load_iris()
X = iris.data
y = iris.target

# 标准化数据
# 标准化的目的是将所有特征调整到相同的尺度
# 这对 K-means 算法很重要，因为它基于距离计算
scaler = StandardScaler()
# fit_transform 用于拟合数据并进行转换
X_scaled = scaler.fit_transform(X)

# random_state=42 确保结果的可重复性
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X_scaled)

y_kmeans = kmeans.predict(X_scaled)

# 将聚类中心反标准化
centers_original = scaler.inverse_transform(kmeans.cluster_centers_)

plt.figure(figsize=(12, 5))

# 原始数据的真实类别
plt.subplot(121)
plt.scatter(X[:, 0], X[:, 1], c=y, cmap='viridis')
plt.title('True Labels')
plt.xlabel('Sepal Length (cm)')
plt.ylabel('Sepal Width (cm)')

# K-means 聚类的结果
plt.subplot(122)
plt.scatter(X[:, 0], X[:, 1], c=y_kmeans, cmap='viridis')
plt.scatter(centers_original[:, 0], centers_original[:, 1], 
            s=300, c='red', marker='*', label='Centroids')
plt.title('K-means Clustering Results')
plt.xlabel('Sepal Length (cm)')
plt.ylabel('Sepal Width (cm)')
plt.legend()

plt.show()

accuracy = accuracy_score(y, y_kmeans)
print(f'Clustering Accuracy: {accuracy:.2f}')

for i in range(3):
    cluster = np.where(y_kmeans == i)[0]
    print(f'\nComposition of Cluster {i}:')
    for iris_type in range(3):
        # 计算每个预测的聚类中每个真实类别的数量
        count = np.sum(y[cluster] == iris_type)
        print(f' {iris.target_names[iris_type]}: {count}')

"""Output:
Composition of Cluster 0:
 setosa: 0
 versicolor: 46
 virginica: 50

Composition of Cluster 1:
 setosa: 33
 versicolor: 0
 virginica: 0

Composition of Cluster 2:
 setosa: 17
 versicolor: 4
 virginica: 0

说明：

1. Cluster 1 只包含 setosa 类别的样本，说明 K-means 成功地将 setosa 类别分开，但只是部分
2. Cluster 0 的结果最不理想，包含了很多 versicolor 和 virginica 的样本，未能很好地区分它们
"""
```

## 6.3 数据降维技术

降维是将高维数据转换为低维表示的过程，以简化数据集并降低计算复杂性

### 6.3.1 数据降维技术的用途

1. 数据可视化（二维绘图）
2. 降低计算复杂度
3. 数据去噪，去除系统性伪影
4. 数据压缩（图像，音频）
5. 加速监督学习

### 6.3.2 主成分分析

PCA（Principal Component Analysis）是最常用的降维技术之一

1. 数据中心化
2. 计算协方差矩阵
3. 计算特征向量和特征值
4. 选择主成分

寻找到原始空间中的一个方向，将数据降维到这个方向中，可以保留最多的信息，使得数据在新坐标系下的方差最大化，同时保持不同维度之间的正交性

<figure markdown="span">
  ![Img 3](../../../img/AI_basic/ch6/ai_ch6_img3.png){ width="600" }
</figure>

### 6.3.3 鸢尾花案例

```python linenums="1"
from sklearn import datasets
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import numpy as np


# 加载数据集
iris = datasets.load_iris()
X = iris.data
y = iris.target

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

pca = PCA()
X_pca = pca.fit_transform(X_scaled)

explained_variance_ratio = pca.explained_variance_ratio_
print(f'Explained Variance Ratio: {explained_variance_ratio}')

print('主成分的特征向量：')
for i, component in enumerate(pca.components_):
    print(f'PC{i + 1}: {component}')

print('\n原始特征与主成分的相关性：')
for i, component in enumerate(pca.components_):
    correlations = component * np.sqrt(pca.explained_variance_[i])
    print(f'PC{i + 1}: ')
    for j, corr in enumerate(correlations):
        print(f'{iris.feature_names[j]}: {corr:.3f}')
```
