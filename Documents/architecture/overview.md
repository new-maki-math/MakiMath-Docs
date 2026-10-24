# 系统架构总览

MakiMath 是一套专为现代数学教学与科研打造的高性能全栈讲义平台。系统致力于攻克传统数学教材“线性割裂、缺乏拓扑”以及传统数学网站“LaTeX 渲染重、公式易失真、版权无保护”的三大顽疾。

---

## 总体系统架构与核心交互时序

MakiMath 的架构核心围绕两条主交互干线展开：**面向读者的公开免登阅读流** 与 **面向编者的受限工作台编辑流**。系统各模块在此交互时序中高效协同：

![MakiMath 总体系统交互时序](/images/arch-topology.svg)

### 1. 普通读者公开阅读链路
- **免登直达**：读者访问公开讲义（如 `/course/math-analysis/doc/sec-1`）时，前端发送无需 Token 的公开请求。
- **状态核验与解析**：后端校验小节所属课程处于 `live` 发布状态后，执行 Typst 结构解析并返回讲义数据。
- **本地矢量排版**：前端结合样式预设适配卡片，依托 Typlet WebAssembly 引擎在浏览器原生渲染高保真数学公式。

### 2. 编者工作台修改与保存链路
- **细粒度权限校验**：编者保存小节内容时携带身份凭证，后端校验登录态（`requireLogin`）及课程编者权限（`requireCourseEditor`）。
- **版本哈希与防并发覆盖**：更新讲义源码的同时写入 `sha256` 校验哈希，防止多人协作时发生意外覆盖。
- **操作审计存证**：每次修改均向 `audit_logs` 写入审计记录，确保讲义内容变更具备完整的历史追溯能力。

---

## 代码仓库生态矩阵

MakiMath 采用清晰的多工程模块化组织：

| 仓库 / 目录 | 技术栈 | 职责描述 |
|---|---|---|
| **[MakiMath-Frontend](https://github.com/new-maki-math/MakiMath-Frontend)** | Vue 3 + Vite 8 + D3 + Typlet | 核心前端应用：包含讲义阅读器、知识图谱、编者工作台与平台管理后台 |
| **[MakiMath-Backend](https://github.com/new-maki-math/MakiMath-Backend)** | Fastify 5 + PostgreSQL 16 | 异步高性能后端：拓扑排序、Typst AST 转换、全文检索、JWT 会话与审计 |
| **[SecureCorePackage](https://github.com/new-maki-math/SecureCorePackage)** | 内部安全支持库 | 负责数据安全封装与底层网络通信支持 |
| **[MakiMath-Docs](https://github.com/new-maki-math/MakiMath-Docs)** | VitePress 2 | 官方中英双语技术文档站与开发指南 |

---

## 核心数据与业务流水线

### 1. 讲义编译与渲染流水线 (Typst Pipeline)
传统数学平台普遍采用 MathJax 或 KaTeX 将数学公式片段嵌在 HTML 中，导致版面割裂且无法统一掌控宏语义。MakiMath 创新性地采用端到端 Typst 方案：

![Typst 矢量排版渲染流水线](/images/arch-typst-pipeline.svg)

- **免环境侵入**：讲义源码无需声明 `#set page` 等纸张打印属性，直接书写纯粹的定理、证明与公式。
- **样式统一适配**：前端内置专属 Preset 样式集，自动为定理、推论、例题与警示卡片匹配现代化视觉主题。

### 2. DAG 知识图谱推导流水线 (Graph Pipeline)
- **底层小节级关联**：编者在创建或编辑小节时，显式配置 `prereqs`（前置小节 ID 数组）。
- **环路安全检测**：后端在保存时执行拓扑遍历算法，并在数据库层面附加 `CHECK (NOT (id = ANY (prereqs)))` 约束，严禁出现自环或逻辑闭环。
- **智能宏观上卷 (Rollup)**：当学习者浏览宏观课程路线图时，前端基于 D3 引擎将数百个细粒度小节依赖聚类上卷为章节级 DAG，清晰展示学习路径先后序。

### 3. 通信安全与数据保护机制 (Security Pipeline)
- **传输层保护**：请求体与响应体在网络传输中经过自动封装处理，降低明文直接暴露风险。
- **会话状态隔离**：会话密钥仅存在于运行时内存中，页面刷新后重新建立，不依赖本地持久化存储。
- **双向透明集成**：框架底层在拦截器与中间件中统一接管编解码逻辑，业务层开发保持标准的 JSON 数据交互体验。
