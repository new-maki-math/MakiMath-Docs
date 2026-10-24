# Git 提交与分支规范

为了保持 MakiMath 跨模块代码库的历史清晰、可追溯并符合自动化发布标准，所有参与贡献的开发者均需遵循本规范。

## 分支管理策略

平台采用基于主干的简洁分支模型：

```
main (稳定主干) ───────────────────────────────────────────> (生产部署)
       │                                            ▲
       ├─────> feature/dag-zoom-controls ───────────┤ (PR 合并)
       │                                            │
       └─────> fix/section-slug-duplicate ──────────┘
```

- **`main` 分支**：唯一的受保护稳定分支。所有线上发布均基于此分支。**严禁直接推送或强推 (`force-push`)**。
- **功能分支 (`feature/<feature-name>`)**：从 `main` 检出，用于开发特定新功能。例如：`feature/workbench-shortcuts`。
- **修复分支 (`fix/<bug-name>`)**：用于修复已知缺陷。例如：`fix/audit-log-ip-parse`。
- **文档分支 (`docs/<topic>`)**：用于编写或完善中英技术文档。例如：`docs/api-permissions-matrix`。
- **重构分支 (`refactor/<module>`)**：用于架构优化与重构。例如：`refactor/d3-graph-layout`。

## 提交消息规范 (Conventional Commits)

每次提交的 Commit Message 均须遵循 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

[可选 body 正文]

[可选 footer 关联 issue]
```

### 1. Type 类别定义

| 类别 | 描述 | 适用场景 |
|---|---|---|
| **`feat`** | 新功能 | 引入了面向用户或系统的新特性（如：新增小节批量复制 API）。 |
| **`fix`** | 缺陷修复 | 修复了代码缺陷或非预期行为（如：修复小节排序时 pos 计算错误）。 |
| **`docs`** | 文档更新 | 仅对开发文档、README 或注释进行修改与补充。 |
| **`style`** | 格式调整 | 代码格式化、缺少分号、空格调整（不影响功能逻辑）。 |
| **`refactor`** | 代码重构 | 既不引入新功能也不修复 bug 的代码结构优化。 |
| **`perf`** | 性能提升 | 提高运行时性能或降低内存占用的变更（如：优化 AST 解析缓存）。 |
| **`test`** | 测试相关 | 新增或修正既有单元测试与集成测试用例。 |
| **`chore`** | 构建与日常 | 更新构建脚本、升级 pnpm 依赖包或辅助工具维护。 |

### 2. Scope 作用域建议

常用作用域包含但不限于：
- `auth`: 登录、注册、JWT 与会话
- `courses`: 课程元数据与目录
- `sections`: 小节管理与 Typst 源码
- `dag`: 知识图谱与依赖网络
- `workbench`: 编者工作台协同界面
- `crypto`: 通信编解码中间件
- `deploy`: Nginx、PM2 与部署脚本

### 3. 规范范例对照

#### 推荐范例
```
feat(sections): add batch copy endpoint across chapters
fix(auth): handle expired refresh token gracefully
docs(api): update master permission summary table
perf(typesetting): debounce live preview compiler to 300ms
refactor(pool): standardize database error mapping
```

#### 避免的反例
```
update code              # 模糊不清，无语义
fix bug                  # 未指出修复的具体问题
WIP                      # 临时提交严禁合入主干
feat: 12345              # 无实际描述
```

## 安全与保密红线

> [!CAUTION] 严禁敏感配置泄露
> - **严禁提交 `.env` 文件**：所有本地私有配置、数据库真实密码、JWT 密钥必须在 `.gitignore` 中排除。
> - **严禁提交生产证书与私钥**：SSL 证书文件（`.pem`, `.key`, `.crt`）严禁纳入版本控制。
> - 若不慎提交敏感信息，切勿仅使用追加提交（revert）覆盖，必须立即联系管理员重置密钥并清理历史引用。
