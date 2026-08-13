# 贪心算法

贪心算法是一种在每一步都做出当前看起来最优的选择，期望最终得到全局最优解的策略。核心思想：局部最优 → 全局最优

贪心算法不保证总是得到全局最优解。只有问题满足特定性质时，贪心才正确

## 1 经典例题

### 1.1 零钱兑换

用最少数量的硬币凑出目标金额。假设硬币面额为 [1, 5, 10, 25]，凑 63 分

```cpp linenums="1"
// 贪心策略：每次选不超过剩余金额的最大面额
int coinChange(std::vector<int>& coins, int amount) {
    std::sort(coins.begin(), coins.end(), std::greater<int>()); // 降序
    int count = 0;
    for (int coin : coins) {
        while (amount >= coin) {
            amount -= coin;
            count++;
        }
    }
    return amount == 0 ? count : -1;
}

// coins = [25, 10, 5, 1], amount = 63
// 63 → 25×2 → 剩13 → 10×1 → 剩3 → 1×3 → 共 6 枚 ✓
```

贪心不总是最优！例如硬币 [1, 3, 4]，凑 6 分：

1. 贪心：6 = 4 + 1 + 1（3 枚）
2. 最优：6 = 3 + 3（2 枚）

此时贪心失效，需要用动态规划

### 1.2 活动选择问题

给定 n 个活动，每个活动有开始时间 `start[i]` 和结束时间 `end[i]`。同一时间只能参加一个活动，求最多能参加几个

```cpp linenums="1"
// 贪心策略：按结束时间升序排列，每次选最早结束且不冲突的活动
int maxActivities(std::vector<int>& start, std::vector<int>& end) {
    int n = start.size();
    std::vector<std::pair<int, int>> activities;
    for (int i = 0; i < n; ++i)
        activities.push_back({end[i], start[i]});
    
    // 按结束时间升序
    std::sort(activities.begin(), activities.end());
    
    int count = 0;
    int lastEnd = -1;  // 上一个选中活动的结束时间
    for (auto& [e, s] : activities) {
        if (s >= lastEnd) {   // 不冲突
            count++;
            lastEnd = e;
        }
    }
    return count;
}
```

直观理解：每次选最早结束的活动，为后续留下最多时间

```cpp linenums="1"
时间轴: 0  1  2  3  4  5  6  7  8  9  10
A1:     [======]
A2:        [============]
A3:              [====]
A4:                 [=======]
A5:                       [====]

按结束时间排序: A1(end=3) → A3(end=5) → A4(end=7) → A2(end=8) → A5(end=10)
选择: A1 → A3(不冲突) → A5(不冲突) → 共 3 个活动 ✓
```

### 1.3 哈夫曼编码

给定字符频率，构造最优前缀编码（出现频率越高的字符编码越短）

```cpp linenums="1"
// 贪心策略：每次取频率最小的两个节点合并
#include <queue>

struct Node {
    char ch;
    int freq;
    Node *left, *right;
    Node(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
};

struct Compare {
    bool operator()(Node* a, Node* b) {
        return a->freq > b->freq;  // 小顶堆
    }
};

Node* buildHuffman(std::unordered_map<char, int>& freqMap) {
    std::priority_queue<Node*, std::vector<Node*>, Compare> pq;

    for (auto& [ch, freq] : freqMap)
        pq.push(new Node(ch, freq));

    while (pq.size() > 1) {
        Node* left  = pq.top(); pq.pop();  // 取最小的两个
        Node* right = pq.top(); pq.pop();

        Node* merged = new Node('\0', left->freq + right->freq);
        merged->left  = left;
        merged->right = right;
        pq.push(merged);  // 合并后放回
    }
    return pq.top();  // 哈夫曼树根节点
}
```

## 2 正确性条件

只有问题满足以下性质时贪心才正确：

1. 贪心选择性质：局部最优选择能导致全局最优解。即：在做出贪心选择后，原问题退化为一个规模更小的子问题，且贪心选择始终包含在某个最优解中
2. 最优子结构：问题的最优解包含其子问题的最优解
3. 证明方法：常用两种手段证明贪心正确性

    1. 交换论证法：假设存在一个不包含贪心选择的最优解，通过"交换"操作将其改造为包含贪心选择的解，且不降低质量，得出矛盾
    2. 归纳法：证明每一步贪心选择后，剩余问题仍然是最优子问题
