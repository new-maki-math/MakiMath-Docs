# 社区贡献指南

欢迎参与 MakiMath 开源项目！无论是修复 Bug、新增功能、编写数学讲义，还是改进中英双语技术文档，我们都热烈欢迎社区开发者的贡献。

## 贡献方式与流程

### 1. 代码贡献标准流程
1. **Fork 仓库**：在 GitHub 上将目标仓库 Fork 到你的个人账号下：
   - 前端应用：[MakiMath-Frontend](https://github.com/new-maki-math/MakiMath-Frontend)
   - 后端服务：[MakiMath-Backend](https://github.com/new-maki-math/MakiMath-Backend)
   - 文档站点：[MakiMath-Docs](https://github.com/new-maki-math/MakiMath-Docs)
2. **克隆到本地**：
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/MakiMath-Frontend.git
   cd MakiMath-Frontend
   ```
3. **基于 `main` 新建工作分支**：
   ```bash
   git checkout -b feature/interactive-dag-controls
   # 或修复 Bug 时：
   git checkout -b fix/editor-save-conflict
   ```
4. **本地开发与测试**：
   - 保持环境纯净，使用 `pnpm install` 安装依赖。
   - 运行本地服务（`pnpm dev`）进行自测。
   - 运行项目内置单元测试（`pnpm test`），确保既有测试用例全部通过。
5. **提交变更**：
   遵循 [Git 提交与分支规范](./git-rules.md) 编写清晰的 Commit Message。
6. **推送并创建 Pull Request**：
   将分支推送到个人远程仓库，并在 GitHub 上向官方仓库的 `main` 分支提交 Pull Request。

## 本地开发工作流

### 1. 前端应用 (`maki-math-frontend`)
```bash
cd maki-math-frontend
pnpm install
pnpm dev
```
前端默认运行于 `http://localhost:5173`。

### 2. 后端应用 (`maki-math-backend`)
```bash
cd maki-math-backend
pnpm install

# 确保本地已启动 PostgreSQL 并配置 .env
pnpm dev
# 运行单元测试
pnpm test
```
后端基于 Node.js 原生 `--watch` 监听热重载，默认运行于 `http://localhost:3000`。

### 3. 文档站点 (`maki-math-docs`)
```bash
cd maki-math-docs
pnpm install
pnpm run docs:dev
# 构建测试
pnpm run docs:build
```
文档开发服务器运行于 `http://localhost:5173`。

## 问题反馈与需求建议 (Issues)

在提交 Issue 前，建议先检索既有已关闭或进行中的 Issue，避免重复提问：
- **Bug 报告**：请尽可能提供最小可复现步骤、操作系统、浏览器版本、错误日志及截图。
- **功能建议**：请描述清晰的使用场景、预期的交互流程以及可能带来的价值。

## 社区行为准则

MakiMath 秉持开放、平等、专业与友善的开源协作氛围：
- 尊重每位贡献者的观点，鼓励理性的学术与工程讨论。
- 严禁任何形式的骚扰、歧视或攻击性言论。
- 共同维护数学教育与学术开源的纯粹性。
