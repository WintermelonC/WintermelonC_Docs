# 滑动窗口

滑动窗口（Sliding Window）算法是一种双指针技巧的高级应用，主要用于解决数组或字符串中连续子区间（子数组/子串）的问题。它的核心思想是：将嵌套的循环转化为单循环，从而将时间复杂度从 $O(N^2)$ 降低到 $O(N)$

滑动窗口可以被想象成一个在数组或字符串上滑动的“框”。这个“框”由左右两个指针（`left` 和 `right`）来维护区间 `[left, right]`：

1. 扩大窗口：右指针 `right` 主动向右移动，将新元素加入窗口，更新窗口状态
2. 缩小窗口：当窗口满足某种条件（或破坏了某种条件）时，左指针 `left` 被动向右移动，将最左侧的元素移出窗口，更新窗口状态
3. 更新记录：在窗口扩大或缩小的过程中，根据题意更新我们需要求的结果（如最大长度、最小长度、特定大小的和等）

由于不管是 `left` 还是 `right`，每个元素最多进窗口一次、出窗口一次，因此时间复杂度通常是 $O(N)$

```cpp linenums="1" title="通用模板"
int slidingWindowTemplate(string s) {
    // 初始化存放窗口状态的变量，例如 hash map, sum, count 等
    int left = 0, right = 0;
    int ans = 0; // 用于记录最终结果
    
    while (right < s.size()) {
        // 1. 将 s[right] 加入窗口，更新窗口状态
        char c = s[right];
        // ... 更新状态 ...

        // 2. 判断当前窗口状态是否需要收缩 (循环判断)
        while (/* 窗口需要收缩的条件 */) {
            // 根据题意，有时在这里更新最短/最小结果：
            // ans = min(ans, right - left + 1);
            
            // 3. 将 s[left] 移出窗口，更新窗口状态
            char d = s[left];
            // ... 更新状态 ...
            
            // 缩小窗口
            left++;
        }

        // 4. 根据题意，有时在这里更新最长/最大结果：
        // ans = max(ans, right - left + 1);

        // 扩大窗口
        right++;
    }
    
    return ans;
}
```

## 1 子数组最大平均数

> 固定窗口：窗口的大小是固定的常数 `k`。这种题目比较简单，通常不需要内层 `while` 循环，只需要在 `right - left + 1 == k` 时更新结果并移动 `left` 即可

给你一个由 `n` 个整数组成的数组 `nums` 和一个整数 `k`。请找出所有长度为 `k` 的连续子数组，并计算得到其最大平均数并返回

```cpp linenums="1"
class Solution {
public:
    double findMaxAverage(vector<int>& nums, int k) {
        int left = 0, right = 0;
        int current_sum = 0;
        int max_sum = INT_MIN;

        while (right < nums.size()) {
            // 进窗口
            current_sum += nums[right];

            // 窗口大小达到 k 时，开始维护并更新结果
            if (right - left + 1 == k) {
                // 更新结果
                max_sum = max(max_sum, current_sum);
                // 出窗口：减去左边界元素，左指针右移
                current_sum -= nums[left];
                left++;
            }
            
            right++;
        }

        return (double)max_sum / k;
    }
};
```

## 2 无重复字符的最长子串

> 可变窗口 - 求最长/最大：窗口大小不固定。在扩大窗口时，可能会破坏题目要求的条件；当条件被破坏时，通过移动 `left` 来恢复条件

给定一个字符串 `s` ，请你找出其中不含有重复字符的最长子串的长度

```cpp linenums="1"
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> window; // 记录窗口内出现的字符
        int left = 0, right = 0;
        int max_len = 0;

        while (right < s.size()) {
            char c = s[right];

            // 如果遇到重复字符，说明条件被破坏，需要收缩窗口
            while (window.count(c)) {
                window.erase(s[left]); // 将左边界字符移出窗口
                left++;
            }

            // 将当前字符加入窗口
            window.insert(c);

            // 更新最长结果 (此时窗口内一定没有重复字符)
            max_len = max(max_len, right - left + 1);
            
            right++;
        }

        return max_len;
    }
};
```

## 3 长度最小的子数组

> 可变窗口 - 求最短/最小：窗口大小不固定。在扩大窗口时，是在努力达到题目要求的条件；一旦达到条件，就开始试探性地缩小窗口，看是否能用更短的区间满足条件

给定一个含有 `n` 个正整数的数组和一个正整数 `target`。找出该数组中满足其和 `≥ target` 的长度最小的连续子数组，并返回其长度。如果不存在符合条件的子数组，返回 0

```cpp linenums="1"
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int left = 0, right = 0;
        int sum = 0;
        int min_len = INT_MAX;

        while (right < nums.size()) {
            // 进窗口
            sum += nums[right];

            // 当满足条件时，尝试缩小窗口找最优解
            while (sum >= target) {
                // 更新最短结果
                min_len = min(min_len, right - left + 1);
                
                // 出窗口
                sum -= nums[left];
                left++;
            }
            
            right++;
        }

        return min_len == INT_MAX ? 0 : min_len;
    }
};
```