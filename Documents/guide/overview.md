# 项目概述

## 什么是 MakiMath？

**MakiMath** 是一个专为数学与数理学科设计的**现代化开源结构化讲义与学习生态平台**。

在传统的数学学习与教学中，教材与电子讲义通常采用**线性篇章结构**（一页接一页），难以直观体现定理、定义、算法之间错综复杂的前置依赖关系；同时，传统的 LaTeX 排版环境配置繁重、编译迟缓，难以提供灵动的 Web 交互体验。

MakiMath 融合了**现代排版语言 Typst**、**DAG 有向无环图知识拓扑**与**现代前后端全栈架构**，致力于为学习者、教师与内容创作者提供如同“数学思想路线图”般的学习与编纂体验。
## 核心设计理念

![MakiMath 核心设计理念](/images/overview-philosophy.svg)

### 1. 结构化知识拓扑 (DAG Precedence Network)
传统的教材是线性的，而数学知识本质上是有向无环图（DAG）：
- **四级层级体系**：平台将讲义组织为 `分类 (Category)` → `课程 (Course)` → `章节 (Chapter)` → `小节 (Section)`。
- **前置依赖编排**：每个小节均可显式声明其前置依赖的小节（如：*学习“多重积分换元”前必须掌握“二阶行列式”与“极坐标变换”*）。
- **知识路线图**：前端基于 D3 引擎将小节依赖自动“上卷”为章节级图谱，为学习者自动生成个性化的学习路径。

### 2. Typst 现代化数学排版
- **轻量且优雅**：彻底摆脱传统 LaTeX 冗余的环境包裹标签与环境安装负担，Typst 语法极简、易写易读。
- **毫秒级 WASM 渲染**：讲义正文在后端保存为源码，通过编译器转换为标准 AST JSON，前端依托 Typlet WebAssembly 引擎在浏览器原生渲染高保真矢量排版，公式缩放永不失真。

### 3. 安全、开放与现代全栈
- **全链路加密**：前端请求体与后端响应体依托专有安全内核全程透明加解密，保护讲义内容版权与接口安全。
- **三级角色架构**：
  - **普通读者**：完全免登，秒级直达公开讲义。
  - **课程编者 (Editor)**：通过邀请码准入，在专属工作台协同编纂讲义、调试排版与拓扑依赖。
  - **平台管理员 (Super Admin)**：全权管理用户权限、邀请码派发与全量操作审计日志。
## 代码仓库生态矩阵

MakiMath 采用清晰的多工程模块化组织：

| 仓库 / 目录 | 技术栈 | 职责描述 |
|---|---|---|
| **[MakiMath-Frontend](https://github.com/new-maki-math/MakiMath-Frontend)** | Vue 3 + Vite 8 + D3 + Typlet | 核心前端应用：包含讲义阅读器、知识图谱、编者工作台与平台管理后台 |
| **[MakiMath-Backend](https://github.com/new-maki-math/MakiMath-Backend)** | Fastify 5 + PostgreSQL 16 | 异步高性能后端：拓扑排序、Typst AST 转换、全文检索、JWT 会话与审计 |
| **[SecureCorePackage](https://github.com/new-maki-math/SecureCorePackage)** | 内部安全支持库 | 负责数据安全封装与底层网络通信支持 |
| **[MakiMath-Docs](https://github.com/new-maki-math/MakiMath-Docs)** | VitePress 2 | 官方中英双语技术文档站与开发指南 |
## 下一步

- 阅读 [快速上手](./getting-started.md) 了解如何在 5 分钟内完成本地环境部署与运行。
- 阅读 [讲义编排规范](../authoring/workflow.md) 了解如何编写与组织数学讲义。

