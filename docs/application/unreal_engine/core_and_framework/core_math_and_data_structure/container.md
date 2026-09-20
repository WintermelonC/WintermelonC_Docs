# 容器体系

UE 提供了一整套自研容器，与 STL 容器功能对应，但在内存分配、跨平台一致性与反射集成上针对游戏做了深度优化。业务代码应始终使用 UE 容器而非 STL 容器

## 1 容器概览

| UE 容器 | 对应 STL | 说明 |
| --- | --- | --- |
| `TArray` | `std::vector` | 动态数组 |
| `TMap` | `std::unordered_map` | 哈希表 |
| `TSet` | `std::unordered_set` | 哈希集合 |
| `TMultiMap` | `std::unordered_multimap` | 多值映射 |
| `TQueue` | `std::queue` | 队列（可线程安全） |
| `TDoubleLinkedList` | `std::list` | 双向链表 |
| `TArrayView` | `std::span` | 非拥有视图 |
| `TStaticArray` | `std::array` | 定长数组 |
| `TBitArray` | `std::bitset` / `std::vector<bool>` | 位数组 |

!!! question "为什么不用 STL 容器"

    UE 自建容器是为了跨平台一致的内存布局与二进制序列化、与垃圾回收和反射系统集成、精细的内存分配控制（内联分配、分箱），以及更好的缓存局部性。STL 容器在这些方面无法满足引擎需求

!!! question "UE 容器与原生容器，哪些参与反射和垃圾回收"

    一句话原则：**UE 容器 + `UPROPERTY` 才参与反射和 GC，STL 容器永远不参与**

    - 反射：`TArray` / `TMap` / `TSet` / `FString` 等 UE 容器被 `UPROPERTY` 修饰后，会被 UHT 识别并生成反射数据，从而自动序列化、在编辑器与蓝图中显示编辑；`std::vector` / `std::map` / `std::string` 无法被 UHT 解析，不能作为 `UPROPERTY` 成员
    - 垃圾回收：`TArray<UObject*>`、`TMap<Key, UObject*>` 等容器中的 `UObject*` 指针，只要容器被 `UPROPERTY` 修饰，GC 就会自动追踪其中每个指针；容器没加 `UPROPERTY`、或裸指针存 `UObject`，GC 都不追踪
    - STL 容器即使装 `UObject*`，GC 也无法自动追踪，必须自己重写 `AddReferencedObjects` 手动登记

## 2 TArray

`TArray` 是最常用的动态数组，定义于 `Engine/Source/Runtime/Core/Public/Containers/Array.h`：

```cpp linenums="1"
TArray<int32> Numbers;
Numbers.Add(1);
Numbers.Emplace(2);                 // 原地构造，比 Add 少一次拷贝
Numbers.Append({3, 4, 5});
Numbers.Insert(0, 0);               // 在下标 0 处插入 0

int32 N = Numbers[0];               // 随机访问
bool bHas = Numbers.Contains(3);    // 是否包含
int32 Idx = Numbers.IndexOfByKey(4); // 按下标查找
```

删除操作：

```cpp linenums="1"
Numbers.RemoveAt(0);                              // 保序删除（O(n)）
Numbers.RemoveAtSwap(2);                          // 与末元素交换后删除（O(1)，乱序）
Numbers.RemoveAll([](int32 N){ return N < 0; });  // 按条件删除
Numbers.Empty();                                  // 清空但不释放内存
Numbers.Reset();                                  // 清空并释放内存
```

### 2.1 Slack 机制

`TArray` 删除元素后通常 **不立即释放内存**，而是保留预留空间（Slack），下次添加时直接复用：

```cpp linenums="1"
Numbers.Reserve(100);               // 预留 100 个元素容量
int32 Slack = Numbers.GetSlack();   // 查看当前预留
Numbers.Shrink();                   // 收缩到实际大小
```

### 2.2 内联分配器

`TInlineAllocator<N>` 把小数组直接放在 **栈上**，超过 N 个元素才转堆分配，避免频繁小对象堆分配：

```cpp linenums="1"
TArray<int32, TInlineAllocator<16>> Small;   // 前 16 个元素在栈上
```

!!! tip "Emplace 与 Add 的区别"

    `Add` 先构造临时对象再拷贝/移动进容器；`Emplace` 直接在容器内存里原地构造，省去一次拷贝或移动，对含 `FString`、`TArray` 等大对象元素尤其有效

!!! question "TArray 如何与反射和 GC 结合"

    `TArray` 本身只是普通 C++ 模板（定义在 `Core` 模块，不依赖 `CoreUObject`），它并不"知道"反射与 GC，结合是通过 UHT 生成的代码与 `FReferenceCollector` 的重载完成的。反射方面，UHT 遇到 `TArray<T>` 时生成 `FArrayProperty`，内部持有元素类型 `FProperty`，`FArrayProperty` 通过 `TArray` 的 `Num()` 与 `GetData()` 获取元素个数和首指针，从而逐个序列化、显示或复制元素。垃圾回收方面，`FReferenceCollector` 对 `TArray<UObject*>` 有专门重载，遍历每个指针并登记

    ```cpp linenums="1"
    // FReferenceCollector 对 TArray<UObject*> 的重载（简化）
    template<class T>
    void AddReferencedObjects(TArray<T*>& Array)
    {
        for (T*& Obj : Array)
        {
            AddReferencedObject(Obj);
        }
    }
    ```
    
    UHT 为类生成的 `AddReferencedObjects` 会遍历所有 `UPROPERTY`，对数组类型的属性调用上述重载，于是 `TArray<UObject*>` 里的指针就被 GC 追踪。容器本身没有 GC 逻辑，它只是暴露了 `GetData` / `Num` 供反射系统使用

## 3 TMap

`TMap` 是哈希表，定义于 `Engine/Source/Runtime/Core/Public/Containers/Map.h`：

```cpp linenums="1"
TMap<FString, int32> Scores;
Scores.Add(TEXT("Alice"), 100);
Scores.Emplace(TEXT("Bob"), 90);

if (int32* Ptr = Scores.Find(TEXT("Alice")))  // 找到返回指针
{
    *Ptr += 10;
}

int32& Ref = Scores.FindOrAdd(TEXT("Carol")); // 不存在则插入
Ref = 80;

Scores.Remove(TEXT("Bob"));                   // 按键删除
```

键类型需要提供哈希与相等比较。默认 `TDefaultMapKeyFuncs` 对内置类型、`FString`、`FName` 等已提供实现，自定义结构体需自己提供 `GetTypeHash` 与 `operator==`：

```cpp linenums="1"
struct FMyKey
{
    int32 Id;

    bool operator==(const FMyKey& Other) const { return Id == Other.Id; }
};

uint32 GetTypeHash(const FMyKey& Key) { return GetTypeHash(Key.Id); }
```

!!! tip "TMap 没有内建有序容器"

    UE 没有 `std::map` 那样的红黑树有序容器。需要有序遍历时，把 `TArray` 排序后遍历即可

!!! question "为什么 TMap 不用红黑树"

    `TMap` 采用开放寻址哈希表而不是红黑树，主要出于性能考量：

    - **平均 O(1) 查找**：哈希表平均常数时间查找，红黑树是 O(log n)
    - **缓存局部性更好**：哈希表元素存放在连续内存里，遍历与查找时缓存命中率高；红黑树节点分散在堆上，指针跳转频繁导致缓存未命中
    - **无需维护有序**：游戏里对映射的访问几乎都是按键随机查找，很少需要按键序遍历；真有需要时把 `TArray` 排序即可
    - **内存更紧凑**：开放寻址只需一个数组与少量元数据，不像树节点那样为每个元素存左右子节点指针

### 3.1 TMultiMap

`TMultiMap` 允许一个键对应多个值：

```cpp linenums="1"
TMultiMap<FString, int32> Multi;
Multi.Add(TEXT("Team"), 1);
Multi.Add(TEXT("Team"), 2);

TArray<int32> Values;
Multi.MultiFind(TEXT("Team"), Values);   // 取回该键的所有值
```

## 4 TSet

`TSet` 是哈希集合，定义于 `Engine/Source/Runtime/Core/Public/Containers/Set.h`：

```cpp linenums="1"
TSet<int32> Set;
Set.Add(1);
Set.Add(2);
Set.Add(2);                 // 重复，不会插入

bool bHas = Set.Contains(1);
Set.Remove(1);
```

支持集合运算：

```cpp linenums="1"
TSet<int32> A = {1, 2, 3};
TSet<int32> B = {2, 3, 4};
TSet<int32> U = A.Union(B);        // 并集
TSet<int32> I = A.Intersect(B);    // 交集
TSet<int32> D = A.Difference(B);   // 差集
```

## 5 其他容器

### 5.1 TQueue

`TQueue` 是队列，支持线程安全模式：

```cpp linenums="1"
TQueue<int32> Queue;
Queue.Enqueue(1);
Queue.Enqueue(2);

int32 Out;
if (Queue.Dequeue(Out)) { /* 消费 Out */ }

// 线程安全队列（多生产者单消费者）
TQueue<int32, EQueueMode::Mpsc> ThreadSafeQueue;
```

### 5.2 TDoubleLinkedList

双向链表，适合频繁在中间插入删除：

```cpp linenums="1"
TDoubleLinkedList<int32> List;
List.AddHead(1);
List.AddTail(2);
```

### 5.3 TArrayView 与 TStaticArray

`TArrayView` 是非拥有的只读视图，零拷贝：

```cpp linenums="1"
TArray<int32> Arr = {1, 2, 3, 4};
TArrayView<int32> View = Arr;                 // 视图
TArrayView<int32> Sub = View.Slice(1, 2);     // {2, 3}
```

`TStaticArray` 是编译期定长数组，完全无堆分配：

```cpp linenums="1"
TStaticArray<int32, 4> Fixed;
Fixed[0] = 1;
```

### 5.4 TBitArray

位数组，适合标记大量布尔状态：

```cpp linenums="1"
TBitArray<> Bits;
Bits.Add(true);
Bits.Add(false);
bool B = Bits[0];
```

## 6 迭代器

所有 UE 容器都支持范围 for：

```cpp linenums="1"
for (int32 N : Numbers) { /* ... */ }

for (const TPair<FString, int32>& Pair : Scores)   // TMap 遍历键值对
{
    Pair.Key;
    Pair.Value;
}
```

遍历中需要删除元素时，用 `CreateIterator`：

```cpp linenums="1"
for (auto It = Numbers.CreateIterator(); It; ++It)
{
    if (*It < 0)
    {
        It.RemoveCurrent();   // 安全删除当前元素
    }
}
```

!!! warning "范围 for 中不能删除元素"

    在范围 for 里调用 `Remove` / `RemoveAt` 会使迭代器失效，导致越界或崩溃。需要边遍历边删除时，必须用 `CreateIterator` 的 `RemoveCurrent`

## 7 分配器

UE 容器通过模板参数选择分配器：

| 分配器 | 说明 |
| --- | --- |
| `FDefaultAllocator` | 默认堆分配 |
| `TInlineAllocator<N>` | 栈内分配 N 个，超出转堆 |
| `TFixedAllocator<N>` | 固定 N 个，超出断言 |

```cpp linenums="1"
TArray<int32> A;                                  // 默认堆分配
TArray<int32, TInlineAllocator<8>> B;             // 栈内 8 个
TArray<int32, TFixedAllocator<4>> C;              // 固定 4 个
```

## 8 常见陷阱与最佳实践

- 范围 for 中 **不要** 增删元素，用 `CreateIterator` 安全删除
- `TArray<UObject*>` 中的对象指针要加 `UPROPERTY`，否则 GC 不会追踪
- 容器作为 `UPROPERTY` 时用 `TArray` / `TMap` / `TSet`，**不要** 用 STL 容器
- 小数组用 `TInlineAllocator`，避免频繁堆分配
- `RemoveAtSwap` 会打乱顺序，不需要保序时用它提升性能
- 大对象元素优先用 `Emplace` 而非 `Add`
- 自定义结构体做 `TMap` 键时，必须提供 `GetTypeHash` 与 `operator==`
