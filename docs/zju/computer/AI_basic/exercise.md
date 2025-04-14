# 习题整理

!!! tip "说明"

    本文档正在更新中……

!!! info "说明"

    本文档仅涉及部分内容，仅可用于复习重点知识

## 第 3 章

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

## 第 4 章

- `sklearn.preprocessing`：用于数据的预处理和特征工程
      - `StandardScaler`：标准化数据
- `sklearn.metrics`：模型评估与指标计算
      - `mean_squared_error()`：均方误差
      - `r2_score()`：决定系数 $R^2$
      - `accuracy_score()`：准确率
      - `confusion_matrix()`：混淆矩阵
- `sklearn.model_selection`：模型选择与数据划分
- `sklearn.linear_model`：线性模型

| Python | 功能 | 参数 |
| :--: | :--: | :--: |
| `train_test_split()` | 划分训练集和测试集 | `test_size` 指定测试集的占比 |
| `fit()` | 训练模型 | |
| `predict()` | 模型预测 | |

## 第 6 章

- `sklearn.cluster`：聚类算法
      - `KMeans`
- `sklearn.decomposition`：降维与特征提取
      - `PCA`