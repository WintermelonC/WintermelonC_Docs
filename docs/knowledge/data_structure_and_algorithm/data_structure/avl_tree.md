# 平衡二叉搜索树

普通二叉搜索树（BST）在 **有序插入** 时会严重退化：

```text
依次插入 1, 2, 3, 4, 5：
1
 \
  2
   \
    3
     \
      4
       \
        5
```

树高从理想的 $O(\log N)$ 退化到 $O(N)$，查找/插入/删除全部退化为 $O(N)$。平衡二叉搜索树的目标就是 **通过自调整，保证树高始终为 $O(\log N)$**

常见的平衡 BST 有：**AVL 树**、**红黑树**、Treap、Splay 树等

## 1 AVL 树

AVL 树是 **严格平衡** 的 BST：任意节点的左右子树高度差不超过 1

定义 **平衡因子（Balance Factor）**：

$$
bf = \text{height}(左子树) - \text{height}(右子树)
$$

AVL 树要求每个节点满足 $-1 \le bf \le 1$

| bf 值 | 含义 |
|---|---|
| 0 | 左右平衡 |
| 1 | 左高 1 |
| -1 | 右高 1 |
| >1 或 <-1 | **失衡，需要旋转** |

```cpp linenums="1"
struct AVLNode {
    int val;
    int height;                 // 以该节点为根的子树高度
    AVLNode *left, *right;
    AVLNode(int v) : val(v), height(1), left(nullptr), right(nullptr) {}
};

int height(AVLNode* n) { return n ? n->height : 0; }
int balanceFactor(AVLNode* n) { return n ? height(n->left) - height(n->right) : 0; }
void updateHeight(AVLNode* n) {
    n->height = std::max(height(n->left), height(n->right)) + 1;
}
```

## 2 四种旋转

插入或删除导致失衡时，通过 **旋转（Rotation）** 恢复平衡。失衡分四种情况，对应四种旋转：

### 2.1 LL 型（左左）→ 右旋

失衡节点的左子树 **左** 边过高：

```cpp linenums="1"
// 右旋：x 上升为根，y 成为 x 的右孩子
AVLNode* rotateRight(AVLNode* y) {
    AVLNode* x  = y->left;
    AVLNode* T2 = x->right;

    x->right = y;
    y->left  = T2;

    updateHeight(y);
    updateHeight(x);
    return x;                  // 返回新根
}
```

### 2.2 RR 型（右右）→ 左旋

失衡节点的右子树 **右** 边过高，是 LL 的镜像：

```cpp linenums="1"
// 左旋：y 上升为根，x 成为 y 的左孩子
AVLNode* rotateLeft(AVLNode* x) {
    AVLNode* y  = x->right;
    AVLNode* T2 = y->left;

    y->left  = x;
    x->right = T2;

    updateHeight(x);
    updateHeight(y);
    return y;
}
```

### 2.3 LR 型（左右）→ 先左旋再右旋

失衡节点的左子树 **右** 边过高。先把左子树左旋成 LL，再整体右旋：

```cpp linenums="1"
// LR：先对左子树左旋，再对根右旋
root->left = rotateLeft(root->left);
return rotateRight(root);
```

### 3.4 RL 型（右左）→ 先右旋再左旋

失衡节点的右子树 **左** 边过高，是 LR 的镜像：

```cpp linenums="1"
// RL：先对右子树右旋，再对根左旋
root->right = rotateRight(root->right);
return rotateLeft(root);
```

!!! tip "旋转记忆法"

    - 失衡在哪边，就向 **相反方向** 转
    - LL → 右旋（Right Rotation）
    - RR → 左旋（Left Rotation）
    - LR → 先左旋（左子树）再右旋（根）
    - RL → 先右旋（右子树）再左旋（根）

## 3 插入操作

插入和普通 BST 相同，插入后 **自底向上** 检查平衡因子，发现失衡就旋转。注意：**每次插入最多只需一次旋转** 即可恢复平衡：

```cpp linenums="1"
AVLNode* insert(AVLNode* root, int val) {
    // 1. 普通 BST 插入
    if (!root) return new AVLNode(val);
    if (val < root->val)
        root->left = insert(root->left, val);
    else if (val > root->val)
        root->right = insert(root->right, val);
    else
        return root;                    // 不允许重复

    // 2. 更新高度
    updateHeight(root);

    // 3. 检查平衡因子并旋转
    int bf = balanceFactor(root);

    // LL：左高，且新值插在左子树的左边
    if (bf > 1 && val < root->left->val)
        return rotateRight(root);

    // RR：右高，且新值插在右子树的右边
    if (bf < -1 && val > root->right->val)
        return rotateLeft(root);

    // LR：左高，但新值插在左子树的右边
    if (bf > 1 && val > root->left->val) {
        root->left = rotateLeft(root->left);
        return rotateRight(root);
    }

    // RL：右高，但新值插在右子树的左边
    if (bf < -1 && val < root->right->val) {
        root->right = rotateRight(root->right);
        return rotateLeft(root);
    }

    return root;
}
```

## 4 删除操作

删除比插入复杂：**可能需要多次旋转**（从被删节点一路向上逐个检查）：

```cpp linenums="1"
AVLNode* findMin(AVLNode* root) {
    while (root && root->left) root = root->left;
    return root;
}

AVLNode* remove(AVLNode* root, int val) {
    if (!root) return nullptr;

    // 1. 普通 BST 删除
    if (val < root->val)
        root->left = remove(root->left, val);
    else if (val > root->val)
        root->right = remove(root->right, val);
    else {
        // 叶子或单子节点
        if (!root->left || !root->right) {
            AVLNode* tmp = root->left ? root->left : root->right;
            if (!tmp) {            // 叶子
                tmp = root;
                root = nullptr;
            } else {               // 单子：复制孩子内容
                *root = *tmp;
            }
            delete tmp;
        } else {                   // 双子：用后继顶替
            AVLNode* succ = findMin(root->right);
            root->val = succ->val;
            root->right = remove(root->right, succ->val);
        }
    }

    if (!root) return nullptr;

    // 2. 更新高度 + 重新平衡
    updateHeight(root);
    int bf = balanceFactor(root);

    // 删除后判断失衡需看子树的平衡因子（而非 val 位置）
    if (bf > 1 && balanceFactor(root->left) >= 0)       // LL
        return rotateRight(root);
    if (bf > 1 && balanceFactor(root->left) < 0) {      // LR
        root->left = rotateLeft(root->left);
        return rotateRight(root);
    }
    if (bf < -1 && balanceFactor(root->right) <= 0)     // RR
        return rotateLeft(root);
    if (bf < -1 && balanceFactor(root->right) > 0) {    // RL
        root->right = rotateRight(root->right);
        return rotateLeft(root);
    }
    return root;
}
```

!!! warning "插入 vs 删除的差异"

    - **插入**：最多一次旋转即可恢复平衡（插入前树平衡，插入后只可能在一个位置失衡）
    - **删除**：可能沿路径产生连锁失衡，需要 **逐层向上** 检查和旋转，可能旋转 $O(\log N)$ 次

## 5 复杂度分析

AVL 树严格保证树高 $h \le 1.44 \log_2 N$，因此：

| 操作 | 时间复杂度 |
|---|---|
| 查找 | $O(\log N)$（最坏情况） |
| 插入 | $O(\log N)$ |
| 删除 | $O(\log N)$ |
| 中序遍历 | $O(N)$ |

## 6 AVL 树 vs 红黑树

| 维度 | AVL 树 | 红黑树 |
|---|---|---|
| 平衡性 | **严格**（高度差 ≤ 1） | 近似（最长 ≤ 2× 最短路径） |
| 树高 | 更低（约 1.44 log N） | 稍高（约 2 log N） |
| 查找 | **更快**（树更矮） | 略慢 |
| 插入/删除 | 旋转次数多 | **旋转少**（最多 2 次），更适合频繁修改 |
| 应用 | 查找密集型 | `std::map`、`std::set`（C++ 标准库）、Linux 内核 |

!!! tip "为什么 STL 用红黑树而不是 AVL"

    `std::map`/`std::set` 需要频繁插入删除，红黑树每次插入/删除最多只需常数次旋转（不超过 2~3 次），而 AVL 删除可能旋转 $O(\log N)$ 次。虽然 AVL 查找略快，但综合插入删除的修改密集型场景，红黑树更优。

## 7 其他平衡树一览

| 结构 | 特点 |
|---|---|
| **AVL 树** | 严格平衡，查找快 |
| **红黑树** | 近似平衡，修改快，STL 使用 |
| **Treap** | 堆 + BST，随机优先级，实现简单 |
| **Splay 树** | 访问后旋转到根，适合局部性强的场景 |
| **B 树 / B+ 树** | 多路平衡，适合磁盘/数据库索引 |
| **替罪羊树** | 失衡后整体重建 |

## 8 小结

1. 平衡 BST 解决普通 BST 有序插入时退化为链表的问题
2. AVL 树用 **平衡因子**（左右子树高度差）衡量平衡，失衡即旋转
3. 四种旋转：**LL→右旋、RR→左旋、LR→左右双旋、RL→右左双旋**
4. 插入最多旋转一次，删除可能需要多次
5. 所有操作最坏 $O(\log N)$
