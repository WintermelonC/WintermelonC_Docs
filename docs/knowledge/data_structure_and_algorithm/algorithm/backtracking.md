# 回溯

回溯算法是一种系统性搜索解空间的算法。核心思想：尝试 → 失败 → 撤销 → 尝试其他路径。形象地说就是"一条路走到黑，走不通就回头"

回溯可以看作一种带剪枝的深度优先搜索（DFS），在搜索过程中一旦发现当前路径不可能产生有效解，就立即回退（剪枝），不再继续深入

回溯问题本质上是在一个决策树上做 DFS，通用模板如下：

```cpp linenums="1"
void backtrack(路径, 选择列表) {
    if (满足结束条件) {
        收集结果;
        return;
    }

    for (选择 in 选择列表) {
        if (选择不合法) continue;  // 剪枝

        做选择（将选择加入路径）;
        backtrack(路径, 新的选择列表);  // 递归
        撤销选择（将选择移出路径）;      // 回溯！
    }
}
```

## 1 经典例题：全排列

```cpp linenums="1"
class Solution {
private:
    std::vector<std::vector<int>> result;
    std::vector<int> path;
    std::vector<bool> used;  // 标记已使用的元素

    void backtrack(const std::vector<int>& nums) {
        // 结束条件：路径长度等于 nums 长度
        if (path.size() == nums.size()) {
            result.push_back(path);
            return;
        }

        for (int i = 0; i < nums.size(); ++i) {
            if (used[i]) continue;  // 剪枝：跳过已使用的

            // 做选择
            path.push_back(nums[i]);
            used[i] = true;

            backtrack(nums);  // 递归

            // 撤销选择（回溯！）
            path.pop_back();
            used[i] = false;
        }
    }

public:
    std::vector<std::vector<int>> permute(std::vector<int>& nums) {
        used.assign(nums.size(), false);
        backtrack(nums);
        return result;
    }
};
```