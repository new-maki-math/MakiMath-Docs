# API 接口概览与约定

MakiMath 后端服务采用模块化 RESTful 架构。本篇文档汇总了全平台 API 接口规范、通用响应结构，以及**全平台 API 接口与权限对照总表**。

---

## 协议与通用约定

- **基础访问路径**：全量业务接口统一挂载于 `/api` 前缀下（例如：`https://api.makimath.com/api/courses`）。
- **数据交换格式**：请求体（Request Body）与响应体（Response Body）统一采用 `application/json; charset=utf-8`。
- **身份认证机制**：受保护接口需在 HTTP 请求头中携带标准 Bearer 令牌：
  ```http
  Authorization: Bearer <YOUR_JWT_TOKEN>
  ```
- **字段命名风格**：
  - URL 路径参数与 Query 参数：蛇形命名（如 `category_id`、`course_id`）。
  - 请求与响应 JSON 字段：驼峰命名与蛇形命名共存（以各接口参数规格为准）。

---

## 全平台 API 接口与权限对照总表

平台用户主要分为三大角色：
- **普通读者 (Reader)**：未登录访客及已注册学员，拥有全站已发布公开讲义的只读权限。
- **课程编者 (Editor)**：通过邀请码激活的知识创作者，对自身被分配授权的课程、章节与小节拥有完整的编辑、调序与依赖配置权限。
- **超级管理员 (Super Admin)**：全权管控系统，包括分类与课程基础骨架初始化、编者权限授权、邀请码派发及系统级用户运维。

下表详细汇总全平台接口在各角色下的调用权限：

| 业务模块 | 方法 | 接口路径 | 功能简述 | 普通读者 | 课程编者 | 超级管理员 |
|---|---|---|---|:---:|:---:|:---:|
| **系统基础** | `GET` | `/health` | 服务健康检查与数据库连通性探测 | ✅ | ✅ | ✅ |
| **认证与会话** | `POST` | `/api/auth/login` | 用户名密码登录，签发双 Token | ✅ | ✅ | ✅ |
| | `POST` | `/api/auth/register` | 使用邀请码注册编者账号 | ✅ | ✅ | ✅ |
| | `GET` | `/api/auth/check-invite` | 预核验邀请码有效性与分配角色 | ✅ | ✅ | ✅ |
| | `POST` | `/api/auth/refresh` | 使用 Refresh Token 换发新访问令牌 | ✅ | ✅ | ✅ |
| | `POST` | `/api/auth/logout` | 登出并注销当前会话与凭证 | - | ✅ | ✅ |
| | `GET` | `/api/auth/me` | 获取当前登录用户的个人资料与角色 | - | ✅ | ✅ |
| | `PATCH` | `/api/auth/profile` | 更新个人展示昵称 (displayName) | - | ✅ | ✅ |
| | `PATCH` | `/api/auth/password` | 修改当前账号密码 | - | ✅ | ✅ |
| | `GET` | `/api/auth/audit-logs` | 分页查阅个人名下的操作审计流水 | - | ✅ | ✅ |
| **分类管理** | `GET` | `/api/categories` | 获取学科分类全量列表 (含关联课程统计) | ✅ | ✅ | ✅ |
| | `GET` | `/api/categories/:id` | 获取指定分类基础信息 | ✅ | ✅ | ✅ |
| | `POST` | `/api/categories` | 创建新的学科分类 | - | - | ✅ |
| | `PATCH` | `/api/categories/:id` | 修改分类名称、标识与描述 | - | - | ✅ |
| | `DELETE` | `/api/categories/:id` | 删除分类 (若其下存在课程则拒绝删除) | - | - | ✅ |
| | `PUT` | `/api/categories/order` | 批量保存分类全局展示排序 `pos` | - | - | ✅ |
| **课程管理** | `GET` | `/api/courses` | 课程列表 (支持按分类与发布状态过滤) | ✅ | ✅ | ✅ |
| | `GET` | `/api/courses/:id` | 查询指定课程详情 | ✅ | ✅ | ✅ |
| | `GET` | `/api/courses/:id/tree` | 获取课程完整层级大纲树 (含章节与小节) | ✅ | ✅ | ✅ |
| | `POST` | `/api/courses` | 新建课程基础骨架 | - | - | ✅ |
| | `PATCH` | `/api/courses/:id` | 修改课程标题、简介、封面与状态 | - | ✅* | ✅ |
| | `PUT` | `/api/courses/:id/prereqs`| 设置宏观前置课程依赖 ID 数组 | - | ✅* | ✅ |
| | `PUT` | `/api/courses/order` | 批量更新课程在所属分类内的展示顺序 | - | ✅* | ✅ |
| | `DELETE` | `/api/courses/:id` | 删除单门课程及其关联层级 | - | - | ✅ |
| | `POST` | `/api/courses/batch-delete` | 批量删除多门课程 | - | - | ✅ |
| **章节管理** | `GET` | `/api/chapters` | 获取指定课程下的所有章节列表 | ✅ | ✅ | ✅ |
| | `GET` | `/api/chapters/:id` | 查询单一大章详情 | ✅ | ✅ | ✅ |
| | `POST` | `/api/chapters` | 在课程下创建新章节 | - | ✅* | ✅ |
| | `PATCH` | `/api/chapters/:id` | 更新章节序号标识、标题或导读 | - | ✅* | ✅ |
| | `PUT` | `/api/chapters/order` | 批量重排章节在该课程内的 `pos` 权重 | - | ✅* | ✅ |
| | `DELETE` | `/api/chapters/:id` | 删除单个章节 | - | ✅* | ✅ |
| | `POST` | `/api/chapters/batch-delete` | 批量删除章节 | - | ✅* | ✅ |
| **小节与讲义** | `GET` | `/api/sections` | 获取某章节下的小节目录列表 | ✅ | ✅ | ✅ |
| | `GET` | `/api/sections/:id` | 获取单节元数据与依赖属性 | ✅ | ✅ | ✅ |
| | `GET` | `/api/sections/:id/doc` | **获取讲义正文与前置依赖 (读者阅读核心)** | ✅ | ✅ | ✅ |
| | `POST` | `/api/sections` | 在章节下新建小节 | - | ✅* | ✅ |
| | `PATCH` | `/api/sections/:id` | 更新小节标题、序号、slug 标识 | - | ✅* | ✅ |
| | `PUT` | `/api/sections/:id/source`| **保存讲义 Typst 源码 (带版本哈希锁)** | - | ✅* | ✅ |
| | `PUT` | `/api/sections/:id/prereqs`| 编排小节 DAG 前置依赖数组 (防自环防闭环) | - | ✅* | ✅ |
| | `PUT` | `/api/sections/order` | 批量调整小节在该章节内的排布顺序 | - | ✅* | ✅ |
| | `POST` | `/api/sections/batch-move` | 跨章节批量移动小节 | - | ✅* | ✅ |
| | `POST` | `/api/sections/batch-copy` | 跨章节批量复制小节 | - | ✅* | ✅ |
| | `DELETE` | `/api/sections/:id` | 删除单个小节 | - | ✅* | ✅ |
| | `POST` | `/api/sections/batch-delete` | 批量删除小节 | - | ✅* | ✅ |
| **编者工作台** | `GET` | `/api/workbench/tree` | 获取当前用户拥有权限的完整讲义工作台目录树 | - | ✅ | ✅ |
| **课程协同指派** | `GET` | `/api/courses/:id/editors` | 查阅当前课程已被指派的编者成员列表 | - | ✅ | ✅ |
| | `POST` | `/api/courses/:id/editors` | 将指定编者绑定授权至该课程 | - | - | ✅ |
| | `DELETE` | `/api/courses/:id/editors/:userId` | 解除某编者对该课程的维护权限 | - | - | ✅ |
| **邀请码管理** | `POST` | `/api/invitations` | 生成新的编者入驻邀请码 | - | - | ✅ |
| | `GET` | `/api/invitations` | 分页检索邀请码列表、核销状态与额度 | - | - | ✅ |
| | `DELETE` | `/api/invitations/:id` | 作废/删除尚未使用的邀请码 | - | - | ✅ |
| **用户与系统** | `GET` | `/api/users` | 全平台用户列表与状态检索 | - | - | ✅ |
| | `POST` | `/api/users` | 管理员直接开通后台用户 | - | - | ✅ |
| | `PATCH` | `/api/users/:id` | 修改指定用户的角色、状态与重置密码 | - | - | ✅ |
| | `DELETE` | `/api/users/:id` | 移除用户账号 (不可注销自身) | - | - | ✅ |
| | `GET` | `/api/audit-logs` | 全局平台级操作审计流水检索 | - | - | ✅ |
| **全站检索推荐** | `GET` | `/api/search` | 跨课程、章节与小节正文的全文检索 | ✅ | ✅ | ✅ |
| | `GET` | `/api/search/recommendations` | 课程主页热门推荐小节列表 | ✅ | ✅ | ✅ |

> [!NOTE] 标记含义说明
> - `✅`：拥有全局调用权限。
> - `✅*`：课程编者可访问，但操作目标受自身被指派的课程权限（`requireCourseEditor`）范围约束。
> - `-`：无权限访问（调用时将返回 `401 Unauthorized` 或 `403 Forbidden`）。

---

## 通用响应结构与错误规范

### 1. 成功响应
标准接口均直接返回对应的数据实体或集合，部分写操作附带状态标记：
```json
{
  "ok": true,
  "data": { ... }
}
```

### 2. 统一错误响应
当请求参数非法、权限不足或产生版本冲突时，服务端统一返回带有语义化原因的 JSON：
```json
{
  "error": "具体错误提示描述",
  "code": "VALIDATION_FAILED"
}
```

### 3. 标准 HTTP 状态码约定
- `200 OK`：请求成功处理。
- `201 Created`：实体创建成功。
- `400 Bad Request`：参数缺失、格式非法或校验未通过。
- `401 Unauthorized`：未提供有效 Token 或登录凭证已过期失效。
- `403 Forbidden`：权限不足（非超级管理员或非本课程授权编者）。
- `404 Not Found`：请求的目标分类、课程、章节或小节不存在。
- `409 Conflict`：并发编辑冲突（`source_hash` 校验不一致）或唯一键冲突（如 slug 重复）。
- `429 Too Many Requests`：触发接口流控速率限制（单 IP 每分钟上限 300 次）。
- `500 Internal Server Error`：服务端内部异常。
