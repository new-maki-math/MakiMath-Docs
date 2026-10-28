# 审核、分类与管理 API

表中使用完整路径，全部遵循[通用通信及错误约定](./overview.md)。除公开分类读取和搜索外，其余接口均要求管理员身份；非管理员返回 403，未登录返回 401。

## 审核

表内 `{id}` 为必填路径参数，取值为正整数；`{kind}` 的枚举以接口说明为准。Body 表示 JSON 请求体，Query 表示查询参数；未标“可选”的请求字段均必填。成功响应列说明 HTTP 状态和解密后的数据，完整字段见下文。

| 路径 | 方法 | 接口说明 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/reviews/{kind}/pending` | `GET` | 列出待审核版本 | 管理员 | Path：`kind`（必填，仅 `lecture`） | `200`：pending 版本行数组，按 submitted_at、id 排序 |
| `/api/reviews/{kind}/{id}` | `POST` | 审核指定内容版本 | 管理员 | Body：`decision`、`comment` | `201`：审核记录行 |

id 是讲义提交返回的 snapshot.id，不是工作草稿ID。decision 为 approved/rejected，comment 必填、可空、最长5000。响应审核行字段为 `id, lecture_revision_id, reviewer_id, decision, comment, created_at`。kind=knowledge返回400，不存在知识点审核流程。

审核记录与状态转换在同一事务内完成，数据库触发器把版本由 pending 改为 approved/rejected。重复审核或审核非 pending 版本返回 409，不存在为 404。approved 更新讲义公开指针并设publication_status=published，同时将来源工作草稿based_on_id跟进到该快照并递增草稿edit_version。rejected不改变当前公开版。归档讲义拒绝审核（409），须先恢复。

通过时检查 based_on_id 祖先链中最近的 approved 是否仍等于当前公开版本；不等为 409，作者需基于最新公开版整理新草稿。审核人不能修改提交内容。当前允许管理员自审，是否禁止待确认。

审核、发布、推荐是不同概念：讲义工作草稿为draft，审核快照状态为pending/approved/rejected；讲义上下架为 unpublished/published/withdrawn/archived；推荐为 is_recommended。初次审核不会自动推荐；已推荐讲义新版通过时保留原推荐值，不能写成“每次通过均默认关闭”。

## 分类与搜索

| 路径 | 方法 | 接口说明 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/categories/{kind}` | `GET` | 列出有效分类 | 无需认证 | Path：`kind`（必填，仅 `lecture`） | `200`：`[{ id, parent_id, slug, name, descr, pos }]`，仅 active |
| `/api/categories/{kind}` | `POST` | 创建分类 | 管理员 | Body：`slug`, `name`；可选 `parent_id`, `descr`, `pos` | `201`：分类行 |
| `/api/categories/{kind}/{id}` | `PUT` | 更新分类 | 管理员 | Body：`parent_id`, `name`, `descr`, `pos`, `status` | `200`：分类行 |
| `/api/search` | `GET` | 搜索公开知识点和讲义 | 无需认证 | Query：`q`（必填），`limit`（可选，默认 20） | `200`：`{ hits }`，两类结果结构见下文 |

知识分类和讲义分类独立。parent_id 为正 ID 或 null；创建缺省 null，descr 缺省空串，pos 缺省0。name 最长200、descr最长5000，pos为0–2147483647，status 为 active/archived。分类行另含 status, created_at, updated_at。分类不存在404，重复slug/无效外键/触发器成环409，参数及自引用检查约束400。

搜索 type 为 knowledge/lecture，查询公开内容；当前实现用大小写无关子串匹配，不能描述为已实现语义检索或中文分词。讲义匹配标题、简介及小节原始source，不展开引用知识点正文；知识点匹配标题与正文。知识点命中为`{ type: "knowledge", id, slug, title }`，讲义命中为`{ type: "lecture", id, slug, revision_id, title, descr }`。结果按 type,id 排序，不是相关度排序。旧 `/search/recommendations` 已移除。

## 邀请码、账号与审计

| 路径 | 方法 | 接口说明 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/invitations` | `POST` | 创建邀请码 | 管理员 | Body：`role`, `max_uses`；可选 `note`, `expires_at` | `201`：邀请码行 |
| `/api/invitations` | `GET` | 列出邀请码 | 管理员 | 无请求体 | `200`：邀请码行数组，最新200条 |
| `/api/invitations/{id}` | `DELETE` | 撤销邀请码 | 管理员 | 无请求体 | `200`：status=revoked 的邀请码行，不是204 |
| `/api/users` | `GET` | 列出用户 | 管理员 | 无请求体 | `200`：用户数组 |
| `/api/users/{id}/status` | `PATCH` | 更新用户状态 | 管理员 | Body：`status`=active / disabled | `200`：`{ id, username, display_name, role, status }` |
| `/api/audit-logs` | `GET` | 读取操作审计记录 | 管理员 | Query：`limit`（可选，默认 20） | `200`：审计行数组 |

role 为 editor/super_admin；max_uses为1–1000；note最长1000，可空；expires_at为可被 Date.parse 解析的字符串或null，缺省null。邀请码行字段 `id, code, role, created_by, max_uses, used_count, status, note, expires_at, created_at, updated_at`。用户数组字段 `id, username, display_name, role, status, last_login_at, created_at`。审计行字段 `id, user_id, username, user_role, method, path, status_code, duration_ms, ip_address, user_agent, payload, created_at`，payload经脱敏，审计不替代内容版本。

不能停用当前账号（409）；用户或邀请码不存在当前返回400。停用删除该用户全部会话。初始化schema没有默认管理员账号密码；首个管理员可在后端终端使用npm run admin:init交互创建，不提供匿名HTTP创建接口。

## 审核请求参数定义

适用于 `POST /api/reviews/{kind}/{id}`。

| 参数 | 位置 | 类型 | 必填 | 说明与约束 |
| --- | --- | --- | --- | --- |
| `kind` | Path | string | 是 | 仅 lecture |
| `id` | Path | integer | 是 | 待审核版本 ID，正整数 |
| `decision` | Body | string | 是 | approved 或 rejected |
| `comment` | Body | string | 是 | 可为空，最长 5000 字符 |
