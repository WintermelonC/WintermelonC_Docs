# Git

!!! tip "说明"

    本文档正在更新中……

## 其他

[停止跟踪文件](./other.md#停止跟踪文件)

## Git 规则

### 提交信息

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
