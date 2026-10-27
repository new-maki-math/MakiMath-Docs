# 审核、分类与管理 API

路径省略 `/api`，全部遵循[通用通信及错误约定](./overview.md)。本页写操作仅管理员可执行（除搜索与公开分类），非管理员返回 403，未登录返回 401。

## 审核

| 方法与路径 | 请求 | 成功响应 |
| --- | --- | --- |
| GET `/reviews/:kind/pending` | kind 为 knowledge / lecture | 200，pending 版本行数组，按 submitted_at、id 排序 |
| POST `/reviews/:kind/:id` | 必填 decision、comment | 201，审核记录行 |

id 是版本 ID，不是知识点/讲义 ID。decision 为 approved / rejected，comment 必须提供字符串，可空、最长 5000。知识点审核行字段 `id, knowledge_revision_id, reviewer_id, decision, comment, created_at`；讲义审核行用 lecture_revision_id 替代 knowledge_revision_id。

审核记录与状态转换在同一事务内完成，数据库触发器把版本由 pending 改为 approved/rejected。重复审核或审核非 pending 版本返回 409，不存在为 404。approved 会将知识点公开指针更新到该版，或将讲义公开指针更新到该版并设 publication_status=published。rejected 不改变当前公开版。

通过时检查 based_on_id 祖先链中最近的 approved 是否仍等于当前公开版本；不等为 409，作者需基于最新公开版整理新草稿。审核人不能修改提交内容。当前允许管理员自审，是否禁止待确认。

审核、发布、推荐是不同概念：版本审核状态为 draft/pending/approved/rejected；讲义上下架为 unpublished/published/withdrawn/archived；推荐为 is_recommended。初次审核不会自动推荐；已推荐讲义新版通过时保留原推荐值，不能写成“每次通过均默认关闭”。

## 分类与搜索

| 方法与路径 | 权限 | 请求 | 成功响应 |
| --- | --- | --- | --- |
| GET `/categories/:kind` | 公开 | kind=knowledge / lecture | 200，`[{ id, parent_id, slug, name, descr, pos }]`，仅 active |
| POST `/categories/:kind` | 管理员 | 必填 slug, name；可选 parent_id, descr, pos | 201，分类行 |
| PUT `/categories/:kind/:id` | 管理员 | 全部必填 parent_id, name, descr, pos, status | 200，分类行 |
| GET `/search?q=极限&limit=20` | 公开 | q 必填，最长100、非空；limit可选整数1–100，默认20 | 200，`{ hits: [{ type, id, slug, revision_id, title, descr }] }` |

知识分类和讲义分类独立。parent_id 为正 ID 或 null；创建缺省 null，descr 缺省空串，pos 缺省0。name 最长200、descr最长5000，pos为0–2147483647，status 为 active/archived。分类行另含 status, created_at, updated_at。分类不存在404，重复slug/无效外键/触发器成环409，参数及自引用检查约束400。

搜索 type 为 knowledge/lecture，查询公开内容；当前实现用大小写无关子串匹配，不能描述为已实现语义检索或中文分词。讲义匹配标题、简介及作者/引用正文，知识点匹配标题与正文。结果按 type,id 排序，不是相关度排序。旧 `/search/recommendations` 已移除。

## 邀请码、账号与审计

| 方法与路径 | 请求 | 成功响应 |
| --- | --- | --- |
| POST `/invitations` | 必填 role, max_uses；可选 note, expires_at | 201，邀请码行 |
| GET `/invitations` | 无 | 200，邀请码行数组，最新200条 |
| DELETE `/invitations/:id` | 无 | 200，status=revoked 的邀请码行，不是204 |
| GET `/users` | 无 | 200，用户数组 |
| PATCH `/users/:id/status` | 必填 status=active / disabled | 200，`{ id, username, display_name, role, status }` |
| GET `/audit-logs?limit=20` | limit可选整数1–100，默认20 | 200，审计行数组 |

role 为 editor/super_admin；max_uses为1–1000；note最长1000，可空；expires_at为可被 Date.parse 解析的字符串或null，缺省null。邀请码行字段 `id, code, role, created_by, max_uses, used_count, status, note, expires_at, created_at, updated_at`。用户数组字段 `id, username, display_name, role, status, last_login_at, created_at`。审计行字段 `id, user_id, username, user_role, method, path, status_code, duration_ms, ip_address, user_agent, payload, created_at`，payload经脱敏，审计不替代内容版本。

不能停用当前账号（409）；用户或邀请码不存在当前返回400。停用删除该用户全部会话。首个管理员须另行配置，初始化脚本没有默认账号密码，也未提供匿名管理员创建接口。
