# 并查集

并查集是一种树形数据结构，用于高效处理不相交集合的合并与查询。它主要支持两种操作：

1. Find（查找）：确定元素属于哪个集合（找根节点）
2. Union（合并）：将两个集合合并为一个

典型应用场景：判断无向图中两个节点是否连通、Kruskal 最小生成树算法、网络连接问题等

## 1 核心思想

用一个数组 `parent[i]` 记录每个元素的"父节点"。初始时每个元素自成一个集合（自己是自己的根）

```cpp linenums="1"
初始:  0   1   2   3   4
parent: 0   1   2   3   4   （每个元素指向自己）
```

合并 0 和 1 后：

```cpp linenums="1"
    0
    ↑
    1

parent: 0  0  2  3  4
```

## 2 朴素实现

```cpp linenums="1"
class UnionFind {
private:
    std::vector<int> parent;

public:
    UnionFind(int n) : parent(n) {
        for (int i = 0; i < n; ++i)
            parent[i] = i;  // 初始时每个元素自成一派
    }

    // 查找：一直向上找根
    int find(int x) {
        while (parent[x] != x)
            x = parent[x];
        return x;
    }

    // 合并：把 x 的根挂到 y 的根下面
    void unionSets(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX != rootY)
            parent[rootX] = rootY;
    }

    // 判断是否属于同一集合
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};
```