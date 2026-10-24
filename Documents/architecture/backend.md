# 后端架构 (Fastify + PostgreSQL)

MakiMath 服务端（代码位于 `maki-math-backend`）基于 Node.js 22+ 与 Fastify 5 框架构建。系统采用极简的插件化微内核架构，具有高吞吐、低延迟、强类型安全与严密数据库约束等特点。

## 技术架构与依赖选型

![后端微内核与插件架构](/images/arch-backend.svg)

## 目录分层与核心职责

```
maki-math-backend/src/
├── config.js              # 全局配置解析（端口、数据库 URL、JWT 密钥、通信安全配置）
├── server.js              # Fastify 实例引导、插件注册与生命周期钩子装配
├── db/
│   └── pool.js            # PostgreSQL 连接池单例与查询遥测
├── lib/
│   ├── crypto.js          # 服务端安全内核通信适配与加解密桥接工具
│   ├── errors.js          # 统一业务异常基类 (ValidationError, AuthError 等)
│   ├── order.js           # 目录树节点排序与 pos 权重重排计算逻辑
│   ├── typst-to-json.js   # Typst 语法轻量 AST 提取器与卡片宏语法分析
│   └── util.js            # 基础辅助函数（时间格式化、Hash 计算等）
├── plugins/
│   ├── auth.js            # JWT 签名认证、Cookie 提取与三级 RBAC 角色鉴权
│   └── crypto.js          # 全局请求 preParsing 解密与 onSend 加密拦截器
└── routes/
    ├── auth.js            # 登录、注册、注销、会话刷新与密码管理
    ├── categories.js      # 学科分类 CRUD
    ├── courses.js         # 课程元数据 CRUD 与课程级前置关联
    ├── chapters.js        # 章节管理与顺序调整
    ├── sections.js        # 小节内容 CRUD、源码保存与 DAG 依赖编排
    ├── invitations.js     # 邀请码生成、核销与额度管理
    ├── search.js          # 跨课程、章节与小节正文的高性能搜索
    └── users.js           # 用户管理、角色授权与账户状态封禁
```

## 核心系统机制

### 1. 透明 Payload 加解密生命周期 (`plugins/crypto.js`)
Fastify 的生命周期钩子机制保证了业务代码完全无感知密文通信：
- **解密阶段 (`preParsing`)**：
  - 当接收到加密请求时，安全插件在底层自动完成通信信道校验与数据解密。
  - 解密后的干净载荷被直接注入 `request.body`，业务路由代码无需关心任何底层加解密逻辑。
- **加密阶段 (`onSend`)**：
  - 在接口返回响应体时，插件在离网前自动将响应数据加密打包，确保全链路通信双向防嗅探与防篡改。

### 2. 统一权限与 RBAC 三级模型 (`plugins/auth.js`)
平台在 Fastify 实例上装饰了统一的身份与权限校验方法：
- **普通读者 (Reader)**：
  - 拥有全平台公开讲义与路线图的只读访问权，免登直达。
- **课程编者 (Editor)**：
  - 通过邀请码激活注册。通过 `fastify.requireEditor` 守卫拦截未授权的编辑请求。
  - 具备创建、修改和调排自己所负责的课程、章节与小节源码的权限。
- **超级管理员 (Super Admin)**：
  - 拥有最高权限，受 `fastify.requireAdmin` 严格保护。
  - 负责生成邀请码、分配课程管理归属、调整用户角色及查阅系统操作日志。

### 3. 数据一致性与并发编辑保护
- **数据库级防自环约束**：
  针对小节的前置依赖数组，PostgreSQL 层面施加显式约束：
  ```sql
  CONSTRAINT sections_no_self_prereq CHECK (NOT (id = ANY (prereqs)))
  ```
- **乐观锁与版本校验 (`source_hash`)**：
  当编者保存讲义源码时，请求体必须携带上一次读取时的 `source_hash`（SHA-256）。若数据库中内容已被其他协作者更新，保存将被拒绝并提示版本冲突，彻底杜绝数据意外覆盖。
- **事务级批量调序**：
  拖拽小节目录导致的大规模 `pos` 调整，均包裹在 `BEGIN ... COMMIT` 事务中执行，确保排序状态不发生断裂。
