# 动态规划

动态规划（DP）是一种通过把原问题分解为相互重叠的子问题，并复用子问题的解来避免重复计算的方法。核心思想：记住你已经算过的，下次直接用

解法一：带备忘录的自顶向下（记忆化搜索）

```cpp linenums="1"
// 递归 + 备忘录：算过的存起来，下次直接取
int fib(int n, std::vector<int>& memo) {
    if (n <= 1) return 1;
    if (memo[n] != 0) return memo[n];  // 查表！
    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
}
```

解法二：自底向上（DP Table）

```cpp linenums="1"
// 从小问题推大问题
int fib(int n) {
    if (n <= 1) return 1;
    std::vector<int> dp(n + 1);
    dp[0] = dp[1] = 1;
    for (int i = 2; i <= n; ++i)
        dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}

// 空间优化：只需要前两个状态
int fib_optimized(int n) {
    if (n <= 1) return 1;
    int prev2 = 1, prev1 = 1, curr;
    for (int i = 2; i <= n; ++i) {
        curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return curr;
}
```

解决任何 DP 问题的标准流程：

1. 定义状态：`dp[i]` 代表什么？
2. 状态转移方程：`dp[i]` 如何由更小的状态推出？
3. 初始条件：最小的状态是什么？
4. 计算顺序：从小到大还是从大到小？

## 1 经典例题

### 1.1 0-1 背包问题

n 个物品，重量 `w[i]`，价值 `v[i]`，背包容量 W。每个物品要么拿要么不拿，求最大价值

1. 定义状态：`dp[i][j]` = 前 i 个物品，背包容量为 j 时的最大价值
2. 状态转移：$dp[i][j] = \max\begin{cases}dp[i-1][j] & \text{不选第 i 个} \\ dp[i-1][j- w_i] + v_i & \text{选第 i 个}\end{cases}$
3. 初始条件：`dp[0][*] = 0`

```cpp linenums="1"
int knapsack(std::vector<int>& w, std::vector<int>& v, int W) {
    int n = w.size();
    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(W + 1, 0));

    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j <= W; ++j) {
            dp[i][j] = dp[i - 1][j];  // 不选
            if (j >= w[i - 1])        // 选（如果装得下）
                dp[i][j] = std::max(dp[i][j],
                    dp[i - 1][j - w[i - 1]] + v[i - 1]);
        }
    }
    return dp[n][W];
}

// 空间优化：一维滚动数组（必须倒序遍历 j！）
int knapsack_1d(std::vector<int>& w, std::vector<int>& v, int W) {
    std::vector<int> dp(W + 1, 0);
    for (int i = 0; i < w.size(); ++i)
        for (int j = W; j >= w[i]; --j)  // 倒序！防止物品被重复使用
            dp[j] = std::max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}
```

### 1.2 最长公共子序列（LCS）

求两个字符串的最长公共子序列（字符可以不连续但顺序一致）

```cpp linenums="1"
text1 = "abcde", text2 = "ace"
LCS = "ace", 长度 = 3
```

1. 定义状态：`dp[i][j]` = `text1[0..i-1]` 和 `text2[0..j-1]` 的 LCS 长度
2. 状态转移：$dp[i][j] = \begin{cases}dp[i-1][j-1] + 1 & \text{若 } text1[i-1] = text2[j-1] \\\max(dp[i-1][j], dp[i][j-1]) & \text{否则}\end{cases}$

```cpp linenums="1"
int LCS(std::string& text1, std::string& text2) {
    int m = text1.size(), n = text2.size();
    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));

    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (text1[i - 1] == text2[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}
```

### 1.3 最长递增子序列（LIS）

求数组中严格递增的最长子序列长度

```cpp linenums="1"
nums = [10, 9, 2, 5, 3, 7, 101, 18]
LIS = [2, 3, 7, 101] 或 [2, 5, 7, 101], 长度 = 4
```

解法一：$O(N^2)$ DP

1. 定义状态：`dp[i]` = 以 `nums[i]` 结尾的 LIS 长度
2. 状态转移：$dp[i] = \max\limits_{j < i, nums[j] < nums[i]}(dp[j] + 1)$

```cpp linenums="1"
int lengthOfLIS(std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> dp(n, 1);  // 每个元素自身构成长度为1的LIS
    int ans = 1;

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < i; ++j) {
            if (nums[j] < nums[i])
                dp[i] = std::max(dp[i], dp[j] + 1);
        }
        ans = std::max(ans, dp[i]);
    }
    return ans;
}
```

解法二：$O(N\log N)$ 贪心 + 二分

维护一个数组 `tails`，`tails[k]` 表示长度为 `k+1` 的 LIS 的最小末尾值

```cpp linenums="1"
int lengthOfLIS_fast(std::vector<int>& nums) {
    std::vector<int> tails;  // tails[k] = 长度k+1的LIS的最小末尾
    for (int x : nums) {
        // 在 tails 中找第一个 >= x 的位置
        auto it = std::lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end())
            tails.push_back(x);     // x 比所有末尾都大，扩展长度
        else
            *it = x;                // 替换，降低该长度对应的末尾值
    }
    return tails.size();
}
```

## 2 充要条件

1. 最优子结构：问题的最优解包含子问题的最优解
2. 重叠子问题：递归求解时会反复遇到相同的子问题
