# Git

<!-- !!! tip "说明"

    本文档正在更新中…… -->

!!! info "AI 介绍"

    Git 是一个 **分布式版本控制系统**，用于跟踪和管理文件（尤其是源代码）的变更。它由 Linus Torvalds（Linux 内核的创始人）于 2005 年开发，旨在帮助开发者高效协作和管理项目历史记录。

    **Git 的核心功能**

    1. **版本控制**  
          - 记录文件的所有修改历史，可以回退到任意旧版本
          - 对比不同版本之间的差异
    2. **分布式管理**  
          - 每个开发者都有完整的代码仓库（Repository），不依赖中央服务器
          - 支持离线提交、分支操作等
    3. **分支与合并（Branch & Merge）**  
          - 可以创建独立的分支进行开发（如新功能、Bug 修复）
          - 完成后合并回主分支（如 `main` 或 `master`）
    4. **协作友好**  
          - 支持多人同时修改代码，通过 `pull`、`push`、`merge` 等操作同步变更
          - 开源项目常用平台（如 GitHub、GitLab、Bitbucket）基于 Git

    **为什么用 Git？**

    - **历史追溯**：随时回退到之前的版本
    - **团队协作**：多人并行开发，避免代码冲突
    - **实验性开发**：通过分支测试新功能，不影响主代码
    - **开源生态**：GitHub 等平台已成为开源项目的标准

## 1 教程

[1 安装与配置](./ch1.md)<br/>
[2 基本操作](./ch2.md)<br/>
[3 分支操作](./ch3.md)<br/>
[4 远程操作](ch4.md)<br/>
[5 多人协作](./ch5.md)

## 2 Git 规则

### 2.1 提交信息

基本格式：

```bash
<type>(<scope>): <subject>

<body>

<footer>
```

1. type：用来说明提交的性质，常见类型包括
      1. `feat`：新功能（Feature）
      2. `fix`：修复 Bug
      3. `docs`：文档更新
      4. `style`：代码格式调整（不影响功能）
      5. `refactor`：代码重构（不修复 Bug 也不新增功能）
      6. `test`：测试相关
      7. `chore`：构建或辅助工具变动
      8. `perf`：性能优化
      9. `ci`：持续集成相关
      10. `revert`：回滚某次提交
2. scope（可选）：说明影响的范围，比如模块、文件或功能，例如：
      1. `(auth)`
      2. `(api)`
      3. `(ui)`
3. subject：简洁描述提交内容，要求：
      1. 使用祈使句（如 "Add" 而不是 "Added" 或 "Adds"）
      2. 首字母小写
      3. 结尾不加句号
      4. 长度建议不超过 50 个字符
4. body：
      1. 详细描述提交的目的、变更内容和背景
      2. 使用换行符分段（每行不超过 72 字符）
      3. 可以列出具体改动点（如 - 修复了XXX问题）
      4. 如果是修复 Bug，可以关联 Issue（如 Fixes #123）
5. footer：
      1. 关联 Issue：用关键字关闭或引用 Issue，例如：`Closes #123`、`Fixes #456`
      2. 重大变更（Breaking Changes）：以 `BREAKING CHANGE:` 开头，说明不兼容的改动
6. 其他：
      1. 语言：通常使用英文（团队统一即可）
      2. 空行：标题与正文之间、正文与页脚之间需空一行
      3. 行尾空格：避免行尾多余空格
      4. 编辑器配置：可以用 `.gitmessage` 模板或 IDE 插件规范格式

示例：

=== "简单修复"

    ```bash
    fix(login): 修复密码验证失败的问题
    
    当用户密码包含特殊字符时，后端验证逻辑出错
    ```
    
=== "功能新增"

    ```bash
    feat(dashboard): 新增用户统计图表

    - 添加月活跃用户（MAU）折线图
    - 集成 ECharts 可视化库

    Closes #42
    ```

=== "重大变更"

    ```bash
    refactor(config): 重构配置文件加载方式

    BREAKING CHANGE: 旧版 config.yml 需迁移至 config.toml
    ```

### 2.2 标签

1. 版本标签：推荐使用语义化版本控制（SemVer）格式：
      1. `v<major>.<minor>.<patch>`，例如：`v1.0.0`, `v2.3.1`
      2. 预发布版本可以添加后缀：`v1.0.0-beta`, `v2.0.0-rc.1`
2. 其他标签：可以使用描述性名称，如：
      1. `release-20230418`
      2. `feature/login-page`
      3. `hotfix/database-connection`
3. 命名规则：
      1. 避免使用空格，可以用连字符 `-` 或下划线 `_` 代替
      2. 避免使用特殊字符
      3. 保持简洁但有描述性

!!! tip "SemVer"

    **1.MAJOR**（主版本号）

    当有 **不兼容的 API 变更**（破坏性变更）时递增 `MAJOR`，并重置 `MINOR` 和 `PATCH` 为 0

    示例：`v1.2.3` → `v2.0.0`（如果新版本不再兼容旧版 API）

    典型情况：

    1. 删除或重命名 API 方法/函数
    2. 修改了核心功能，导致旧代码无法正常运行
    3. 数据库结构变更，旧数据无法直接迁移

    **2.MINOR**（次版本号）

    当新增 **向后兼容的功能**（非破坏性变更）时递增 `MINOR`，并重置 `PATCH` 为 0

    示例：`v1.2.3` → `v1.3.0`（新增功能，但旧代码仍能运行）

    典型情况：

    1. 新增 API 方法或功能
    2. 优化性能但未改变现有行为
    3. 新增可选配置项

    **3.PATCH**（修订号）

    当修复 **向后兼容的 bug** 时递增 `PATCH`

    示例：`v1.2.3` → `v1.2.4`（仅修复 bug，无新功能）

    典型情况：

    1. 修复崩溃或安全漏洞
    2. 修正错误的行为（如计算错误）
    3. 文档修正或代码优化（不影响功能）

    **特殊情况**

    如果版本处于测试或预发布阶段，可以附加后缀：

    1. v1.0.0-alpha（内测版）
    2. v1.0.0-beta（公测版）
    3. v1.0.0-rc.1（候选发布版，rc = Release Candidate）

    **示例版本升级流程**

    1. 初始版本：v0.1.0（初始开发版，0 开头表示不稳定）
    2. 修复 bug → v0.1.1
    3. 新增功能 → v0.2.0
    4. 正式发布 → v1.0.0
    5. 修复安全漏洞 → v1.0.1
    6. 新增兼容功能 → v1.1.0
    7. 破坏性变更 → v2.0.0

### 2.3 `.gitignore` 文件

常用 `.gitignore` 模板：[github/gitignore](https://github.com/github/gitignore){:target="_blank"}

1. 每行一个规则，匹配一个文件或目录
2. 空行会被忽略
3. 以 `#` 开头的行是注释
4. 支持通配符：
      1. `*` 匹配任意字符（除了 `/`）
      2. `?` 匹配单个字符
      3. `**` 匹配任意层级的目录
      4. `[abc]` 匹配 a、b 或 c
      5. `[0-9]` 匹配数字

**1.直接匹配文件名**

```gitignore linenums="1"
# 忽略所有名为 "temp.txt" 的文件
temp.txt
```

**2.匹配目录**

- 以 `/` 结尾表示匹配目录

```gitignore linenums="1"
# 忽略所有名为 "logs" 的目录
logs/
```

- 不以 `/` 结尾表示匹配文件和目录

```gitignore linenums="1"
# 忽略所有名为 "build" 的文件和目录
build
```

**3.通配符匹配**

```gitignore linenums="1"
# 忽略所有 .log 文件
*.log

# 忽略 node_modules 目录及其所有内容
node_modules/

# 忽略所有 .tmp 和 .temp 文件
*.tmp
*.temp

# 忽略 build 目录下的所有 .o 文件
build/*.o
```

**4.`**` 递归匹配任意子目录**

```gitignore linenums="1"
# 忽略所有子目录下的 .DS_Store 文件
**/.DS_Store

# 忽略 docs 目录及其所有子目录下的 .txt 文件
docs/**/*.txt
```

**5.`!` 排除（取反）**

```gitignore linenums="1"
# 忽略所有 .txt 文件，但除了 important.txt
*.txt
!important.txt
```
