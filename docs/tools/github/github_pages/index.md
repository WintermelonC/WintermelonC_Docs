# Github Pages

!!! tip "说明"

    本文档正在更新中……

!!! info "AI 介绍"

    GitHub Pages 是 **GitHub** 提供的静态网站托管服务，允许用户直接从 GitHub 仓库免费发布个人、项目或组织页面。它非常适合搭建博客、项目文档、个人简历或小型网站
    
    **主要特点**：
    
    1. **免费托管**：支持自定义域名（也可用 `username.github.io` 的默认域名）
    2. **静态网站**：直接托管 HTML、CSS、JavaScript 等静态文件，支持 Jekyll（内置静态站点生成器）
    3. **自动构建**：提交代码后自动部署（需配置 GitHub Actions 或直接使用 Jekyll）
    4. **开源项目支持**：每个 GitHub 仓库可单独部署项目页面（`gh-pages` 分支或 `/docs` 文件夹）
    
    **常见用途**：
    
    - **个人博客/简历**：通过 Jekyll 快速生成博客（如 [https://username.github.io](https://username.github.io){:target="_blank"}）
    - **项目文档**：为开源项目托管说明文档（如 Vue.js 的文档）
    - **作品集展示**：设计师或开发者展示作品
    
    **限制**：
    
    - **流量限制**：每月 100 GB 带宽，10 万次访问（一般足够个人使用）
    - **禁止动态内容**：不支持 PHP、数据库等后端功能（但可通过 API 调用第三方服务）

## 1 简单示例