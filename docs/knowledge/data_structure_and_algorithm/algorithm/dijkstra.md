# Dijkstra

**前提条件**：图中所有边的权重必须 **非负**

Dijkstra 是一种 **贪心算法**，它基于一个关键事实：在尚未确定最短距离的顶点中，当前 `dist` 值最小的那个顶点，它的最短距离已经确定了（不会再被更新）

因此算法反复做两件事：

1. **选点**：从"未确定"的顶点中挑出 `dist` 最小的顶点 `u`，把它标记为"已确定"
2. **松弛（Relaxation）**：用 `u` 去更新它的所有邻居 `v`：若 `dist[u] + w(u,v) < dist[v]`，则令 `dist[v] = dist[u] + w(u,v)`

算法步骤：

1. 初始化：`dist[s] = 0`，其余顶点 `dist = ∞`，全部标记为"未确定"
2. 在未确定顶点中选出 `dist` 最小的顶点 `u`
3. 将 `u` 标记为已确定；对 `u` 的每条出边 `(u, v, w)` 执行松弛
4. 重复 2、3 步，直到所有顶点都已确定（或剩余顶点都不可达）

## 1 代码实现

### 1.1 朴素版本 $O(V^2)$（适合稠密图）

```cpp linenums="1"
#include <vector>
#include <utility>

const int INF = 1e9;

// 邻接表 adj[u] = { {v, w}, ... }，n 个顶点，起点 s
std::vector<int> dijkstra(int n,
                          const std::vector<std::vector<std::pair<int, int>>>& adj,
                          int s) {
    std::vector<int> dist(n, INF);
    std::vector<bool> done(n, false);   // 是否已确定最短距离
    dist[s] = 0;

    for (int i = 0; i < n; ++i) {
        // 在未确定顶点中找 dist 最小的
        int u = -1;
        for (int v = 0; v < n; ++v) {
            if (!done[v] && (u == -1 || dist[v] < dist[u]))
                u = v;
        }

        if (u == -1 || dist[u] == INF) break;  // 剩余顶点不可达
        done[u] = true;

        // 松弛 u 的所有邻边
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v])
                dist[v] = dist[u] + w;
        }
    }
    return dist;
}
```

### 1.2 堆优化版本 $O((V+E)\log V)$（适合稀疏图）

用 `std::priority_queue` 维护"当前距离最小的未确定顶点"：

```cpp linenums="1"
#include <vector>
#include <queue>
#include <utility>

const int INF = 1e9;

std::vector<int> dijkstra(int n,
                          const std::vector<std::vector<std::pair<int, int>>>& adj,
                          int s) {
    std::vector<int> dist(n, INF);
    // 小顶堆：pair<当前距离, 顶点>
    std::priority_queue<std::pair<int, int>,
                        std::vector<std::pair<int, int>>,
                        std::greater<>> pq;

    dist[s] = 0;
    pq.push({0, s});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;   // 过期的旧条目，跳过

        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});  // 距离变小，压入新条目
            }
        }
    }
    return dist;
}
```

!!! tip "为什么要判断 `d > dist[u]`"

    同一个顶点可能被多次压入堆（每次距离变小时都会 `push` 一次）。堆里会残留距离较大的"旧条目"。弹出时若发现 `d > dist[u]`，说明这条记录已经过期，直接跳过即可。由于每个顶点被成功松弛一次才入堆一次，总入堆次数为 $O(E)$

!!! tip "为什么不能处理负权边"

    Dijkstra 的贪心前提是：**一旦确定了一个顶点，它的距离就不可能再变小**。但负权边会破坏这一点——后面发现的一条"绕远路 + 负边"的路径可能比已经确定的值更小
    
    经典反例：
    
    ```mermaid
    graph LR
        A((A)) -->|4| B((B))
        A -->|2| C((C))
        C -->|-3| B
    ```
    
    从 `A` 出发：
    
    - Dijkstra 先确定 `C`（距离 2），再确定 `B`（距离 4），结束
    - 但真实最短路径是 $A \to C \to B = 2 + (-3) = -1$，比 4 小得多
    
    所以负权边场景应改用 **Bellman-Ford**（$O(VE)$）或 **SPFA**。负权回路则所有算法都无法给出有限的最短路径

!!! tip "复杂度分析"

    | 实现方式 | 时间复杂度 | 适用场景 |
    |---|---|---|
    | 朴素 $O(V^2)$ | $O(V^2)$ | 稠密图（$E \approx V^2$） |
    | 堆优化 | $O((V+E)\log V)$ | 稀疏图（$E \ll V^2$） |
    | 斐波那契堆（理论） | $O(E + V\log V)$ | 理论最优，常数大，实际少用 |
    
    空间复杂度均为 $O(V+E)$（存储图 + dist 数组）

## 2 记录最短路径

只需维护一个 `parent`（前驱）数组，在松弛成功时记录：

```cpp linenums="1"
std::vector<int> parent(n, -1);

// 松弛成功时：
if (dist[u] + w < dist[v]) {
    dist[v] = dist[u] + w;
    parent[v] = u;              // 记录 v 的前驱
}

// 回溯得到 s -> t 的路径
std::vector<int> path;
for (int cur = t; cur != -1; cur = parent[cur])
    path.push_back(cur);
std::reverse(path.begin(), path.end());
```

!!! tip "与其他最短路径算法对比"

    | 算法 | 边权 | 源点 | 时间复杂度 | 负环检测 |
    |---|---|---|---|---|
    | **Dijkstra** | 非负 | 单源 | $O((V+E)\log V)$ | ✗ |
    | Bellman-Ford | 任意 | 单源 | $O(VE)$ | ✓ |
    | SPFA | 任意（期望快） | 单源 | 期望 $O(E)$，最坏 $O(VE)$ | ✓ |
    | Floyd-Warshall | 任意 | 多源 | $O(V^3)$ | ✓（检测 `dist[i][i] < 0`） |
    | BFS（无权） | 均为 1 | 单源 | $O(V+E)$ | ✗ |

## 3 推广：多条平行边（重边）

图中两个顶点之间可能存在多条边（比如两地之间有多条不同道路）。这其实 **不需要任何特殊处理** ——邻接表天然支持：

```cpp linenums="1"
// u 到 v 之间有两条边：权重 5 和 3
adj[u].push_back({v, 5});
adj[u].push_back({v, 3});
// Dijkstra 遍历时自然会松弛两条边，保留更优的 dist[v]
```

如果用的是 **邻接矩阵**，只需在存图时保留最小的那条边即可：

```cpp linenums="1"
int g[MAXN][MAXN];
// 初始化 g 为 INF
g[u][v] = std::min(g[u][v], w);   // 重边只保留最小权重
```

## 4 推广：多重标尺最短路径（"第二标尺"问题）

每条边带多个权重时，最常见的要求是：**先保证第一标尺最优（如距离最短），在第一标尺相同时再让第二标尺最优（如花费最少）**

常见的三类第二标尺：

| 类型 | 第二标尺 | 典型问题 |
|---|---|---|
| 边权之和最小 | 花费最少、时间最少 | 旅行计划（最短路径 + 最小花费） |
| 点权之和最大 | 收益最多、救援队最多 | 紧急救援（最短路径 + 最多救援队） |
| 路径条数 | 有几条最短路径 | 统计最短路径数量 |

### 4.1 通用模板

核心思想：增加若干辅助数组（如 `cost[]`、`num[]`、`sum[]`），在 **松弛时先比较主标尺，相等时再比较次标尺**：

```cpp linenums="1"
// 松弛一条边 u -> v，主标尺权重 w，第二标尺权重 w2
if (dist[u] + w < dist[v]) {
    // 主标尺更优：全部更新
    dist[v] = dist[u] + w;
    cost[v] = cost[u] + w2;
    num[v]  = num[u];
    pre[v]  = u;                    // 记录前驱（如需输出路径）
} else if (dist[u] + w == dist[v]) {
    // 主标尺并列：比较第二标尺
    if (cost[u] + w2 < cost[v]) {   // 例：花费更少
        cost[v] = cost[u] + w2;
        pre[v]  = u;
    }
    num[v] += num[u];               // 并列路径条数累加
}
```

### 4.2 实例一：最短路径 + 最小花费（边权二标尺）

每条边有两个权重：`len`（长度）和 `cost`（花费）。求起点到终点：① 长度最短；② 长度相同则花费最少

```cpp linenums="1"
#include <vector>
#include <queue>
#include <utility>

const int INF = 1e9;

// 边结构：{v, len, cost}
struct Edge { int v, len, cost; };

// 返回 {最短距离数组 dist, 最小花费数组 c}
std::pair<std::vector<int>, std::vector<int>>
dijkstra(int n, const std::vector<std::vector<Edge>>& adj, int s) {
    std::vector<int> dist(n, INF);   // 第一标尺：长度
    std::vector<int> c(n, INF);      // 第二标尺：花费
    std::priority_queue<std::pair<int, int>,
                        std::vector<std::pair<int, int>>,
                        std::greater<>> pq;

    dist[s] = 0;
    c[s] = 0;
    pq.push({0, s});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;

        for (auto& e : adj[u]) {
            int v = e.v;
            // 主标尺更优：长度更短
            if (dist[u] + e.len < dist[v]) {
                dist[v] = dist[u] + e.len;
                c[v] = c[u] + e.cost;
                pq.push({dist[v], v});
            }
            // 主标尺并列：长度相同，花费更少
            else if (dist[u] + e.len == dist[v] && c[u] + e.cost < c[v]) {
                c[v] = c[u] + e.cost;
                // dist 未变，无需再次入堆
            }
        }
    }
    return {dist, c};
}
```

!!! warning "注意"

    第二标尺更新时 `dist[v]` 并没有变小，所以 **不需要重新 `push` 入堆**。只有主标尺变小才需要 `pq.push`

### 4.3 实例二：统计最短路径条数

在最短距离相同时，累加路径条数：

```cpp linenums="1"
std::vector<int> num(n, 0);   // num[v]：s 到 v 的最短路径条数
num[s] = 1;

// 松弛时：
if (dist[u] + w < dist[v]) {
    dist[v] = dist[u] + w;
    num[v] = num[u];          // 继承前驱的条数
    pq.push({dist[v], v});
} else if (dist[u] + w == dist[v]) {
    num[v] += num[u];         // 又发现一条并列最短路径，累加
}
```

### 4.4 实例三：点权之和最大（如最多救援队）

每个 **顶点** 有一个点权（如城市救援队数量），求最短路径上能收集到的最大点权和：

```cpp linenums="1"
// weight[v]：顶点 v 的点权；sum[v]：沿最短路径到达 v 的最大点权和
std::vector<int> sum(n, 0);
sum[s] = weight[s];

// 松弛时：
if (dist[u] + w < dist[v]) {
    dist[v] = dist[u] + w;
    sum[v] = sum[u] + weight[v];   // 主标尺更优，直接更新（加上 v 自己的点权）
    pq.push({dist[v], v});
} else if (dist[u] + w == dist[v] && sum[u] + weight[v] > sum[v]) {
    sum[v] = sum[u] + weight[v];   // 距离并列但能收集更多救援队
}
```

!!! tip "点权与边权的区别"

    - **边权**：随"经过这条边"累加（如 `cost[u] + w2`）
    - **点权**：随"到达这个顶点"累加（如 `sum[u] + weight[v]`，注意加的是 `v` 的权值）

## 5 推广：分层图最短路（多维状态 Dijkstra）

普通 Dijkstra 的 `dist[u]` 只有一个维度（顶点）。但有些问题中，到达顶点 `u` 之后还有 **其他量会影响后续决策**（如剩余油量、已使用的优惠次数、已走的边数）。此时必须把这些量也纳入状态，把状态 `(顶点, 附加维度...)` 当作扩展图的新顶点，再跑 Dijkstra。这种技巧称为 **分层图最短路（Layered Graph Shortest Path）**，也叫 **多维状态 Dijkstra**

识别方法很简单：问一句——"到达某个顶点后，除了距离，还有没有别的量会影响后面的选择？" 有，就分层

!!! question "为什么必须分层？"

    因为存在 **后效性**：到达同一个顶点时附加状态不同，后续能走的路线就不同。只看"最短距离"会丢弃那些"距离略长但状态更有利"的路径，导致漏掉最优解
    
    例如油量问题：路线 A 用 5s 到达某城市但剩 0 油，路线 B 用 8s 到达但剩 3 油。若只保留 A，之后需要耗 3 油才能到终点时就会误判为不可达

### 5.1 建模模板

状态为二元组 `(u, s)`，其中 `u` 是原图顶点，`s` 是附加状态（取值有限，如油量 `0..F`）。状态数 = $n \times$ 附加状态数

- `dist[u][s]`：到达状态 `(u, s)` 的最短距离
- 转移：枚举从状态 `(u, s)` 能走到的所有新状态
- 答案：对所有 `s` 取 `min(dist[终点][s])`

### 5.2 例题：油量限制下的最短时间

**题意**：$n$ 个城市、$m$ 条双向道路。汽车油量上限为 $F$，初始满油。每条边 `(u, v, c, t)` 表示从 `u` 到 `v` 消耗 `c` 油、花 `t` 时间。在第 `i` 个城市加油，每加 1 油花费 `oilAddCost[i]` 时间。求从城市 1 到城市 n 的最短时间

**建模**：

| 操作 | 转移 | 消耗时间 | 条件 |
|---|---|---|---|
| 加油 | `(u, f) → (u, f+1)` | `oilAddCost[u]` | `f < F` |
| 行驶 | `(u, f) → (v, f-c)` | `t` | `f >= c` |

```cpp linenums="1"
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m, F;
    cin >> n >> m >> F;

    vector<int> addCost(n + 1);
    for (int i = 1; i <= n; ++i) cin >> addCost[i];

    // 邻接表存边：{v, 油耗 c, 时间 t}
    vector<vector<array<int, 3>>> adj(n + 1);
    for (int i = 0; i < m; ++i) {
        int u, v, c, t;
        cin >> u >> v >> c >> t;
        adj[u].push_back({v, c, t});
        adj[v].push_back({u, c, t});   // 双向道路
    }

    const long long INF = 4e18;
    // dist[城市][油量] = 最短时间
    vector<vector<long long>> dist(n + 1, vector<long long>(F + 1, INF));

    using State = tuple<long long, int, int>;   // {时间, 城市, 油量}
    priority_queue<State, vector<State>, greater<>> pq;

    dist[1][F] = 0;                // 起点：城市 1，满油
    pq.push({0, 1, F});

    while (!pq.empty()) {
        auto [d, u, f] = pq.top();
        pq.pop();
        if (d > dist[u][f]) continue;   // 过期条目

        // 转移 1：在当前城市加油（一次加 1 个燃油）
        if (f < F && d + addCost[u] < dist[u][f + 1]) {
            dist[u][f + 1] = d + addCost[u];
            pq.push({dist[u][f + 1], u, f + 1});
        }

        // 转移 2：行驶到相邻城市
        for (auto [v, c, t] : adj[u]) {
            if (f >= c && d + t < dist[v][f - c]) {
                dist[v][f - c] = d + t;
                pq.push({dist[v][f - c], v, f - c});
            }
        }
    }

    // 答案：到达城市 n 时的最小时间（油量任意）
    long long ans = INF;
    for (int f = 0; f <= F; ++f)
        ans = min(ans, dist[n][f]);

    cout << ans << '\n';
}
```

### 5.3 技巧：多维状态压缩成一维（状态编码）

上面的 `dist[city][fuel]` 是二维数组，也可以把它 **压平（Flatten）** 成一维数组 `dist[id]`，用状态编码把 `(city, fuel)` 映射成一个整数下标。维度较多、状态数较大时更省内存、缓存更友好

**编码（Encode）**：把多维下标映射为单个整数，本质就是 C++ 多维数组在内存里的"行优先（Row-major）"存储顺序

二维状态 `(city, fuel)`，第二维大小为 `width = F + 1`：

```cpp linenums="1"
int width = F + 1;                       // 第二维的大小
// 编码：id = city * width + fuel
auto id = [&](int city, int fuel) {
    return city * width + fuel;
};

// 解码：从 id 还原出 city 和 fuel
int city = state / width;
int fuel = state % width;
```

完整代码（一维编码版）：

```cpp linenums="1"
#include <iostream>
#include <vector>
#include <unordered_map>
#include <climits>
#include <queue>

using namespace std;

struct Edge {
    int to;
    int cost;
    int time;
};

class Solution {
public:
    Solution(int n, int m, int F, vector<int>& oilAddCost, vector<vector<Edge>>& graph)
        : n(n), m(m), F(F), oilAddCost(oilAddCost), graph(graph) {}

    long long getAnswer() {
        const long long INF = LLONG_MAX;
        int width = F + 1;
        // 状态编码：id = city * width + fuel
        auto id = [&](int city, int fuel) {
            return city * width + fuel;
        };
        // 从起点 (1, F) 到状态 (city, fuel) 的最短时间
        vector<long long> dist((n + 1) * width, INF);
        using PII = pair<long long, int>;
        // 小根堆，存储 (time, state_id)
        priority_queue<PII, vector<PII>, greater<PII>> pq;

        // 起点
        int start = id(1, F);
        dist[start] = 0;
        pq.push({0, start});

        while (!pq.empty()) {
            auto [d, state] = pq.top();
            pq.pop();
            // 删除旧状态
            if (d > dist[state]) continue;

            int city = state / width;
            int fuel = state % width;

            // 加油操作
            if (fuel < F) {
                int nextState = id(city, fuel + 1);
                long long nextDist = d + oilAddCost[city];
                if (nextDist < dist[nextState]) {
                    dist[nextState] = nextDist;
                    pq.push({nextDist, nextState});
                }
            }

            // 走每条道路
            for (auto& edge : graph[city]) {
                if (fuel < edge.cost) continue;  // 燃油不足
                int nextState = id(edge.to, fuel - edge.cost);
                long long nextDist = d + edge.time;
                if (nextDist < dist[nextState]) {
                    dist[nextState] = nextDist;
                    pq.push({nextDist, nextState});
                }
            }
        }

        long long ans = INF;
        for (int fuel = 0; fuel <= F; ++fuel) {
            ans = min(ans, dist[id(n, fuel)]);
        }
        return ans == INF ? -1 : ans;
    }

private:
    int n, m, F;
    vector<int> oilAddCost;
    vector<vector<Edge>> graph;
};

int main() {
    int n, m, F;
    cin >> n >> m >> F;
    vector<int> oilAddCost(n + 1);
    for (int i = 1; i <= n; ++i) {
        cin >> oilAddCost[i];
    }
    vector<vector<Edge>> graph(n + 1);
    for (int i = 0; i < m; ++i) {
        int u, v, c, t;
        cin >> u >> v >> c >> t;
        graph[u].push_back({v, c, t});
        graph[v].push_back({u, c, t});
    }
    Solution solution(n, m, F, oilAddCost, graph);
    cout << solution.getAnswer() << endl;
    return 0;
}
```