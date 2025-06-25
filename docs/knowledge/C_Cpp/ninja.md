# Ninja

!!! info "AI 解释"

    **Ninja** 是和 **CMake** 相关的构建工具，全称是 **Ninja Build**。它是一个专注于速度的小型构建系统，通常作为 CMake 的生成器（Generator）使用，替代传统的 `make` 工具
    
    **Ninja 是什么？**
    
    - **定位**：轻量级、高性能的构建工具，由 Google 工程师开发，专为快速增量编译优化
    - **特点**：
    
        - 极简设计：仅关注构建逻辑，不提供复杂的脚本功能（如 `make` 的 Shell 命令）
        - 并行构建：默认多线程运行，大幅加速编译
        - 低开销：通过精确的依赖分析和极少的文件 I/O 提升性能
    
    **与 CMake 的关系**
    
    - **作为生成器**：CMake 可以生成 `Ninja` 格式的构建文件（如 `build.ninja`），替代默认的 `Makefile`
    - **优势**：
    
        - 比 `make` 更快，尤其适合大型项目（如 LLVM、Chrome）
        - 清晰的日志输出，便于调试构建问题
    
    **为什么选择 Ninja？**
    
    - **性能**：在增量构建时比 `make` 快 20%-50%
    - **现代项目支持**：许多开源项目（如 Android NDK、Rust）默认推荐使用 Ninja
    - **与 CMake 深度集成**：CMake 的 `Ninja` 生成器成熟稳定
    
    **对比其他工具**
    
    | 工具      | 特点                          | 适用场景                |
    |-----------|-----------------------------|-----------------------|
    | `make`    | 功能丰富，兼容性强，但速度较慢   | 传统 Unix 项目          |
    | `Ninja`   | 极速，轻量，但功能单一          | 大型项目/频繁增量构建     |
    | `MSBuild` | Windows 生态集成，复杂          | Visual Studio 项目     |

## 1 安装

官网下载并安装：[Releases · ninja-build/ninja](https://github.com/ninja-build/ninja/releases){:target="_blank"}

将可执行文件所在的目录添加到系统环境变量 `PATH`

## 2 与 CMake 集成

[CMake 文档](./cmake.md){:target="_blank"}

通过在 CMake 命令中指定生成器实现。为了方便起见，可以进行相应的设置

以 VS Code 为例，打开配置文件，输入：

```json linenums="1"
{
    "cmake.generator": "Ninja",
}
```

### 2.1 示例

详见 [CMake 4.1](./cmake.md#41-示例){:target="_blank"}