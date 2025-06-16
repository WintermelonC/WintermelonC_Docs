# 习题整理

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    1. 本文档仅涉及部分内容，仅可用于复习重点知识
    2. 部分内容由 AI 生成

## 3 人工智能的应用开发基础

???+ question "判断"

    在 PyTorch 中，torch.utils.data.DataLoader 是用来处理模型的参数更新的

    ??? success "答案"

        错误

        ---

        在 PyTorch 中，torch.utils.data.DataLoader 是用于数据加载和批处理的工具。它的主要功能包括：

        1. 批量加载数据（batching the data）
        2. 打乱数据（shuffling the data）
        3. 使用多进程并行加载数据（parallel data loading）

        模型的参数更新是由优化器（optimizer）完成的，优化器会根据损失函数的梯度来更新模型的参数

???+ question "判断"

    Python 是一种静态类型语言

    ??? success "答案"

        错误

        ---

        Python 是一种动态类型语言（Dynamic Typing Language），而不是静态类型语言（Static Typing Language）

        | 特性 | 静态类型语言 | 动态类型语言 |
        |------|-------------------------------|--------------------------------|
        | **类型检查时间** | 编译时检查类型 | 运行时检查类型 |
        | **变量类型声明** | 需要显式声明（如 `int x = 10;`） | 无需声明，类型由值决定（如 `x = 10`） |
        | **灵活性** | 类型严格，错误更早发现 | 更灵活，但运行时可能出错 |
        | **典型语言** | C, C++, Java, Go | Python, JavaScript, Ruby |

???+ question

    以下哪个不是 Pandas 中的数据结构
    
    A. DataFrame<br/>
    B. Series<br/>
    C. Array<br/>
    D. Index<br/>

    ??? success "答案"

        C

        ---

        1. Series：一维带标签数组（类似字典或 Excel 的一列）
        2. DataFrame：二维表格（类似 Excel 或 SQL 表），由多个 Series 组成
        3. Index：用于标识 Series 或 DataFrame 的行/列标签（不可变对象）

### 3.1 Anaconda

- `conda create --name myenv`：创建新环境
- `conda activate myenv`：激活环境
- `conda deactivate`：停用当前环境
- `conda env list` / `conda info --envs`：列出所有环境
- `conda env remove --name myenv`：删除环境
- `conda install package_name`：安装包
- `conda update package_name`：更新包
- `conda remove package_name`：卸载包
- `conda list`：查看已安装的包（在特定环境中执行）

## 4 从问题求解到机器学习

```python linenums="1"
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# 加载数据集
digits = load_digits()

# 将数据展平并分割为训练集和测试集
X = digits.images.reshape((len(digits.images), -1))
y = digits.target
"""
:param test_size: 测试集占比
:param random_state: 伪随机数生成器的种子值
    设置这个参数后，可以确保每次运行代码时，
    数据的划分结果都是一样的，即具有可重复性

为什么是 random_state = 42：

这其实是一个程序员圈子里的梗，
源自科幻小说《银河系漫游指南》中“生命、宇宙以及一切的终极答案”是 42。
它只是一个常见的默认值，并没有特殊意义。
你可以使用任何整数值作为随机种子，比如 0, 123, 999 等
"""
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 标准化特征
scaler = StandardScaler()
# 拟合训练数据的分布（计算均值、标准差等）
# 然后根据这些统计信息对训练数据进行标准化（或归一化）
X_train = scaler.fit_transform(X_train)
# 使用之前从训练集学到的参数（均值、标准差等）来对测试集进行相同的变换
X_test = scaler.transform(X_test)

# 训练K-近邻分类器
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

# 预测并计算准确率
predicted = knn.predict(X_test)
accuracy = accuracy_score(y_test, predicted)
print(f"Accuracy: {accuracy * 100:.2f}%")
```

- `sklearn.datasets`：用于加载示例数据集或生成测试数据

    - `load_iris`: 加载鸢尾花数据集，这是一个经典的多类别分类问题数据集
    - `load_digits`: 加载手写数字的数据集，通常用于分类任务的学习与演示

- `sklearn.model_selection`：模型选择与数据划分

    - `train_test_split`：将数据集划分为训练集和测试集

- `sklearn.preprocessing`：用于数据的预处理和特征工程

    - `StandardScaler`：标准化数据，使数据转化为均值为 0，标准差为 1 的数据分布
    - `MinMaxScaler`: 将数据缩放到一个指定的范围（通常是[0, 1]）
    - `OneHotEncoder`: 将分类特征转换为独热编码形式
    - `LabelEncoder`: 将不连续的数值或文本变量转化为有序的数值型变量
    - `Normalizer`：对单个样本进行规范化，使得该样本的特征向量长度为 1
    - `Binarizer`：数据二值化

- `sklearn.neighbors`：专注于基于邻居的方法

    - `KNeighborsClassifier`: 实现了 K 近邻投票的分类算法
    - `KNeighborsRegressor`: 类似于 KNN 分类器，但是用于回归问题

- `sklearn.metrics`：专门用于模型评估

    - `accuracy_score`：准确率
    - `precision_score`：精确率
    - `recall_score`：召回率
    - `f1_score`：F1 分数
    - `confusion_matrix`：混淆矩阵
    - `roc_auc_score`：ROC 曲线下面积（AUC）
    - `mean_squared_error`：均方误差（MSE）
    - `mean_absolute_error`：平均绝对误差（MAE）
    - `r2_score`：决定系数 R²

## 6 数据的聚类和降维技术

- `sklearn.cluster`：聚类算法

    - `KMeans`

- `sklearn.decomposition`：降维与特征提取

    - `PCA`

## 7 深度网络基础组件

- `sklearn.neural_network`：提供基于神经网络的模型实现

    - `MLPClassifier`：基于多层感知机的分类器，支持一个或多个隐藏层，并能够处理多类别分类问题

### 7.1 梯度下降法

对曲面 $f(x,y)=3x^2+2y^2$ 进行梯度下降法求局部低点，起点 $P(3,5)$，学习率 $\eta = 0.3$，终止条件 $||\nabla|| < 0.002$

解：$\dfrac{\partial f}{\partial x} = 6x, \dfrac{\partial f}{\partial y} = 4y$

依次计算，直到符合条件

| 轮次 | $x$ | $y$ | $\dfrac{\partial f}{\partial x}$ | $\dfrac{\partial f}{\partial y}$ | $x - \eta\dfrac{\partial f}{\partial x}$ | $y - \eta\dfrac{\partial f}{\partial y}$ | $\text{\textbardbl}\nabla\text{\textbardbl}$ |
| :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| 1 | 3 | 5 | 18 | 20 | -2.4 | -1 | 724 |
| 2 | -2.4 | -1 | -14.4 | -4 | 1.92 | 0.2 | 223.4 |
| 3 | 1.92 | 0.2 | 11.52 | 0.8 | -1.54 | -0.04 | 133.4 |
| 4 | -1.54 | -0.04 | -9.22 | -0.16 | 1.23 | 0.008 | 85.0 |
| 5 | 1.23 | 0.008 | 7.37 | 0.03 | -0.98 | -0.0016 | 54.4 |
| 6 | -0.98 | -0.0016 | -5.91 | -0.0064 | 0.79 | 0.00032 | 34.8 |
| 7 | 0.79 | 0.00032 | 4.72 | -0.00128 | -0.63 | -0.000064 | 22.3 |

### 7.2 计算 Softmax

对于输入 $X = [2, 0, 7, -1.5, -0.9]$，计算 Softmax 输出

解：$sum = \sum\limits_je^{x_j} = e^2 + e^{0.7} + e^{-1.5} + e^{-0.9} = 10.03$

- $S_1 = \dfrac{e^{x_1}}{sum} = 0.74$
- $S_2 = \dfrac{e^{x_2}}{sum} = 0.20$
- $S_3 = \dfrac{e^{x_3}}{sum} = 0.02$
- $S_4 = \dfrac{e^{x_4}}{sum} = 0.04$

## 8 卷积神经网络

### 7.1 MLP

```python linenums="1"
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# 数据预处理
transforms = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

# 加载数据集
train_dataset = datasets.CIFAR10(root='./data', train=True, download=True, transform=transforms)
test_dataset = datasets.CIFAR10(root='./data', train=False, download=True, transform=transforms)

# 创建数据加载器，shuffle=True 打乱训练数据
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)

class MLP(nn.Module):
    def __init__(self):
        super(MLP, self).__init__()
        # 输入层节点数：3 * 32 * 32（图片尺寸）
        self.fc1 = nn.Linear(3 * 32 * 32, 500)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(400, 100)
        # 输出层节点数：10（类别数）
        self.fc3 = nn.Linear(100, 10)

    def forward(self, x):
        # 展平图片，降维到一维
        x = x.view(-1, 3 * 32 * 32)
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.fc3(x)
        return x
    
model = MLP()

# 设置超参数
learning_rate = 0.001
epochs = 10

# 损失函数和优化器
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=learning_rate)

# 训练模型
for epoch in range(epochs):
    for images, labels in train_loader:
        # 误差不累积，置零
        optimizer.zero_grad()
        # 前向计算
        outputs = model(images)
        # 计算损失
        loss = criterion(outputs, labels)
        # 误差反向传播
        loss.backward()
        # 用选定的优化器更新模型参数
        optimizer.step()
    
    print(f'Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}')

# 评估模型
model.eval()
with torch.no_grad():
    correct = 0
    total = 0
    for images, labels in test_loader:
        outputs = model(images)
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

    print(f'Accuracy of the model on the 10000 test images: {100 * correct / total}%')
```

## 9 循环神经网络

### 9.1 计算 RNN 输出

已知拓扑结构为同步多对多 RNN，输入层、隐含层（一层）、输出层的神经元均为一个，激活函数均为 ReLU，$W = [0.5, 0.1, 0.2], H = [1], V = [3], S_0 = 0, \alpha = 0, \beta = 0$。对 $X = \begin{bmatrix}
    1 & 1& 1 \\ 2 & 2 & 2 \\ 3 & 3 & 3
\end{bmatrix}$ 的输入序列，计算其输出序列 $Y$

解：

$X_1 = [1,1,1], X_2=[2,2,2], X_3=[3,3,3]$<br/>
$S_1 = f(WX_1^T + HS_0) = f(0.8) = 0.8$<br/>
$Y_1 = h(VS_1) = h(2.4) = 2.4$<br/>
$S_2 = f(WX_2^T + HS_1) = f(2.4) = 2.4$<br/>
$Y_2 = h(VS_2) = h(7.2) = 7.2$<br/>
$S_3 = f(WX_3^T + HS_2) = f(4.8) = 4.8$<br/>
$Y_3 = h(VS_3) = h(14.4) = 14.4$<br/>

$\therefore Y = [2.4, 7.2, 14.4]$

## 11 自然语言处理建模

### 11.1 计算文本相似度

词向量 $A = [0.02, 0.093, 0.095, 0.01], B = [0.96, 0.77, 0.85, 0.15]$，计算 $A, B$ 的余弦相似度和广义 Jaccard 相似度

解：

$cos\theta = \dfrac{A \cdot B}{||A||\ ||B||} = \dfrac{1.5443}{1.3296 \times 1.5032} = 0.7727$

$EJ(A,B) = \dfrac{A \cdot B}{||A||^2 + ||B||^2 - A \cdot B} = \dfrac{1.5443}{1.7679 + 2.2595 - 1.5443} = 0.6219$

---

计算以下两个文本的 Jaccard 相似度，文本 1：“我爱北京天安门”，文本 2：“天安门雄伟壮阔让人不得不爱”（不考虑词频）

解：

文本 1 的集合 $A = {我，爱，北，京，天，安，门}$

文本 2 的集合 $B = {天，安，门，雄，伟，壮，阔，让，人，不，得，爱}$

$A ∩ B = {爱，天，安，门}$<br/>
$A ∪ B = {我，爱，北，京，天，安，门，雄，伟，壮，阔，让，人，不，得}$

Jaccard 相似度：$J(A, B) = \dfrac{|A ∩ B|}{|A ∪ B|}= \dfrac{4}{15} = 0.2667$
