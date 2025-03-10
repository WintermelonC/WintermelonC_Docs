# 其他

<!-- !!! tip "说明"

    本文档正在更新中…… -->

## 停止跟踪文件

1. 将文件从暂存区中删除，但仍保留在工作区
      - `git rm --cached {filepath}`
2. 提交更改，此时此文件会被标记为已删除
      - `git commit -m "停止跟踪 {filepath}"`
3. 将文件写入 `.gitignore`