# 单调栈

单调栈是一种特殊的栈：**栈内元素始终保持单调递增或单调递减**。它不是用来"存储数据"的，而是用来 **快速找出每个元素左边/右边第一个比它大或小的元素**，是解决"Next Greater/Smaller Element"类问题的高效工具，时间复杂度 $O(N)$

普通栈是"后进先出"的容器，单调栈在入栈时多了一条规则：新元素入栈前，把 **破坏单调性的栈顶元素** 全部弹出。正是这个"弹出"动作携带了关键信息——**当元素 `x` 把栈顶元素 `y` 弹出去时，`x` 恰好就是 `y` 右边第一个比它大（或小）的元素**

因为每个元素最多入栈一次、出栈一次，所以总时间复杂度是 $O(N)$，均摊 $O(1)$

| 类型 | 栈底 → 栈顶 | 用途 | 弹出条件 |
|---|---|---|---|
| **单调递减栈** | 递减（栈顶最小） | 找"右边第一个**更大**"的元素 | `栈顶 < 新元素` 时弹出 |
| **单调递增栈** | 递增（栈顶最大） | 找"右边第一个**更小**"的元素 | `栈顶 > 新元素` 时弹出 |

## 1 代码模板：下一个更大元素（Next Greater Element）

给定数组 `nums`，对每个元素求**它右边第一个比它大的元素**，不存在则记为 `-1`：

```cpp linenums="1"
#include <vector>
#include <stack>

// 单调递减栈：找每个元素右边第一个更大的元素
std::vector<int> nextGreaterElement(const std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> ans(n, -1);
    std::stack<int> st;                 // 存下标（存值也可以，存下标更通用）

    for (int i = 0; i < n; ++i) {
        // 当前元素 nums[i] 比栈顶元素大 → 它就是栈顶的"下一个更大元素"
        while (!st.empty() && nums[st.top()] < nums[i]) {
            ans[st.top()] = nums[i];    // 记录答案
            st.pop();                   // 栈顶已经找到答案，出栈
        }
        st.push(i);
    }
    // 循环结束后，栈里剩下的元素右边没有更大的元素（ans 保持 -1）
    return ans;
}
```

对称地，**下一个更小元素**只需把比较符号反过来（`>` 变 `<`）：

```cpp linenums="1"
// 单调递增栈：找每个元素右边第一个更小的元素
while (!st.empty() && nums[st.top()] > nums[i]) {
    ans[st.top()] = nums[i];
    st.pop();
}
st.push(i);
```

## 2 经典应用

### 2.1 每日温度（LeetCode 739）

求"还要等几天才能遇到更高温度"，本质就是求 **下一个更大元素的下标差**：

```cpp linenums="1"
std::vector<int> dailyTemperatures(std::vector<int>& T) {
    int n = T.size();
    std::vector<int> ans(n, 0);
    std::stack<int> st;

    for (int i = 0; i < n; ++i) {
        while (!st.empty() && T[st.top()] < T[i]) {
            ans[st.top()] = i - st.top();   // 天数差
            st.pop();
        }
        st.push(i);
    }
    return ans;
}
```

### 2.2 柱状图中最大的矩形（LeetCode 84）

对每个柱子，找它 **左右两边第一个比它矮的柱子**，该柱子能扩展的宽度就是两者之间的距离：

```cpp linenums="1"
int largestRectangleArea(std::vector<int>& heights) {
    heights.insert(heights.begin(), 0);   // 哨兵，简化边界
    heights.push_back(0);

    std::stack<int> st;
    int ans = 0;
    for (int i = 0; i < heights.size(); ++i) {
        // 单调递增栈：找左右第一个更矮的
        while (!st.empty() && heights[st.top()] > heights[i]) {
            int h = heights[st.top()];
            st.pop();
            int width = i - st.top() - 1;  // 左右边界之间的宽度
            ans = std::max(ans, h * width);
        }
        st.push(i);
    }
    return ans;
}
```

!!! tip "哨兵技巧"

    在数组首尾各插入一个高度为 0 的哨兵，可以避免处理"栈空"和"最后剩余元素"的边界情况，让代码更简洁。

### 2.3 接雨水（LeetCode 42）

接雨水有多种解法，单调栈版本利用"左右更高的柱子夹出一个低洼区"：

```cpp linenums="1"
int trap(std::vector<int>& height) {
    std::stack<int> st;
    int ans = 0;
    for (int i = 0; i < height.size(); ++i) {
        while (!st.empty() && height[st.top()] < height[i]) {
            int bottom = st.top();         // 低洼的底部
            st.pop();
            if (st.empty()) break;         // 左边没有更高的墙
            int h = std::min(height[st.top()], height[i]) - height[bottom];
            int w = i - st.top() - 1;
            ans += h * w;
        }
        st.push(i);
    }
    return ans;
}
```

## 3 复杂度分析

| 项目 | 复杂度 | 说明 |
|---|---|---|
| 时间复杂度 | $O(N)$ | 每个元素最多入栈一次、出栈一次，均摊 $O(1)$ |
| 空间复杂度 | $O(N)$ | 栈最多存 N 个元素 |

## 4 单调栈 vs 单调队列

两者都是"维护单调性"的技巧，但适用场景不同：

| 维度 | 单调栈 | 单调队列 |
|---|---|---|
| 操作端 | 只在栈顶一端进出 | 队尾入、队头出（两端） |
| 典型问题 | 下一个更大/更小元素 | 滑动窗口最值 |
| 维护内容 | 单调序列，旧元素弹出后即丢弃 | 单调序列 + 淘汰"过期"元素 |
