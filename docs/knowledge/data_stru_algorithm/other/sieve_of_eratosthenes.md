# 埃拉托斯特尼筛法求质数

!!! info "说明"

    本文档内容由 AI 生成

使用筛法求出 1 到 N 以内的所有质数，最常用的算法是埃拉托斯特尼筛法（Sieve of Eratosthenes）。这个算法的效率相对较高，特别是对于较大的 N 值。以下是该算法的基本步骤：

1. 创建一个布尔数组 `isPrime`，大小为 N + 1，并初始化所有元素为 `true`。数组下标代表数字，而对应的值表示这个数字是否为质数。初始时假设所有数字都是质数
2. 将 `isPrime[0]` 和 `isPrime[1]` 设为 `false`，因为 0 和 1 不是质数
3. 从 2 开始遍历到 N：
      - 如果当前数字 i 被视为质数（即 `isPrime[i] == true`），则将 i 的所有倍数标记为非质数（即设置对应位置的值为 `false`）。注意，这里的倍数从 `i*i` 开始，因为小于 `i*i` 的倍数已经被之前的质数标记过了
4. 最后，遍历整个 `isPrime` 数组，收集所有值为 `true` 的下标，这些下标就是 1 到 N 范围内的所有质数

以下是一个简单的 C++ 代码实现示例：

```cpp linenums="1"
#include <iostream>
#include <vector>

void SieveOfEratosthenes(int N) {
    std::vector<bool> isPrime(N + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; i * i <= N; ++i) {
        if (isPrime[i]) {
            // 将 i 的倍数标记为非质数
            for (int j = i * i; j <= N; j += i) {
                isPrime[j] = false;
            }
        }
    }

    // 输出所有质数
    for (int i = 2; i <= N; ++i) {
        if (isPrime[i]) {
            std::cout << i << " ";
        }
    }
}

int main() {
    int N = 100; // 假设你想找到 1 至 100 之间的所有质数
    SieveOfEratosthenes(N);
    return 0;
}
```

这段代码首先定义了一个函数 `SieveOfEratosthenes` 来计算并打印从 1 到指定数值 N 之间的所有质数。通过调整变量 N 的值，你可以改变搜索质数的范围。上述示例中，N 被设定为 100，但是你可以根据需要更改这个值