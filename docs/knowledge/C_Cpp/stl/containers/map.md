# map

## map

map 存储 `pair<const Key, T>`，每个 key 唯一，自动按 key 排序（默认升序）

map 底层通常是红黑树，查找/插入/删除复杂度稳定在 $O(\log n)$

`operator[]` 方法会在 key 不存在时插入默认值再返回引用；`at()` 方法 key 不存在会抛异常，不会插入

使用 `emplace(k, v)` 可以原地构造，可能减少临时对象

`insert_or_assign(k, v)`（C++17）：存在就赋值，不存在就插入

`try_emplace(k, ...)`（C++17）：不存在才构造 value，避免无意义构造

插入通常不会使已有迭代器失效。删除某元素时，只会使指向该元素的迭代器失效

自定义排序：可以传比较器，比如降序：`std::map<int, int, std::greater<int>>`

### 红黑树

每个节点保存：

1. `pair<const Key, T>`（键值对，Key 不可改）
2. 左右孩子指针、父指针
3. 颜色位（红或黑）

中序遍历二叉搜索树会按 key 从小到大输出，所以 map 是有序的

## unordered_map

unordered_map 底层通常是哈希表，不会像 map 那样按 key 排序

查找/插入/删除平均复杂度为 $O(1)$

普通插入不一定失效，发生 rehash 后，迭代器通常会失效，删除元素时，指向被删元素的迭代器失效

元素变多会触发 rehash，rehash 成本较高，但摊还后平均操作仍是 $O(1)$

已知数据量时可以先 reserve，减少 rehash 次数