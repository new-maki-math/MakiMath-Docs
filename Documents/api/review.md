# 审核与管理 API

除公开分类读取和搜索外，本页均要求管理员登录。接口表路径已含 `/api`，请求均使用[通信封装](./overview.md)。

## 审核讲义

| 路径 | 方法 | 操作 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- |
| `/api/reviews/{kind}/pending` | GET | 待审快照列表 | Path：kind 只接受 lecture | 200，快照行数组，另带 lecture_slug |
| `/api/reviews/{kind}/{id}` | POST | 审核快照 | kind=lecture；Body：decision、comment 必填 | 201，审核行 |

id 为提交返回的 snapshot.id。decision 是 approved/rejected，comment 是可空、最长 5000 的字符串。审核行字段为 id、lecture_revision_id、reviewer_id、decision、comment、created_at。

只能审核 pending 快照；重复审核、归档讲义或来源公开版冲突返回 409。通过会发布该快照并更新来源工作草稿的并发号，驳回不改变公开版本。当前管理员可以自审；kind=knowledge 返回 400，没有知识点审核流程。

## 分类与搜索

| 路径 | 方法 | 操作 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/categories/{kind}` | GET | 有效分类列表 | 公开 | kind=knowledge/lecture | 200，`[{ id, parent_id, slug, name, descr, pos }]` |
| `/api/categories/{kind}` | POST | 新建分类 | 管理员 | Body：slug、name；parent_id/descr/pos 可选 | 201，分类行 |
| `/api/categories/{kind}/{id}` | PUT | 更新分类 | 管理员 | Body：parent_id、name、descr、pos、status 全部必填 | 200，分类行 |
| `/api/search` | GET | 搜索公开内容 | 公开 | Query：q 必填，limit 可选 | 200，`{ hits }` |

知识分类与讲义分类独立。parent_id 为正 ID 或 null；name 非空最长 200，descr 可空最长 5000，pos 为非负整数，status 为 active/archived。分类行在列表字段外增加 status、created_at、updated_at。创建默认 parent_id=null、descr 空串、pos=0。知识分类删除及范围见[知识点 API](./knowledge.md)。

q 非空、最长 100；limit 为 1–100 的整数，默认 20。知识点命中项是 `{ type: "knowledge", id, slug, title }`，讲义命中项是 `{ type: "lecture", id, slug, revision_id, title, descr }`。按大小写无关子串匹配，结果按 type/id 排序，不是相关度排序。知识点查标题与正文；讲义查标题、简介和原始小节源码，不展开引用点正文。

## 邀请码、用户和审计

| 路径 | 方法 | 操作 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- |
| `/api/invitations` | POST | 生成邀请码 | Body：role、max_uses；note、expires_at 可选 | 201，邀请码行 |
| `/api/invitations` | GET | 最新邀请码 | 无 | 200，最多 200 行 |
| `/api/invitations/{id}` | DELETE | 撤销邀请码 | 无 Body | 200，status=revoked 的行，不是 204 |
| `/api/users` | GET | 用户列表 | 无 | 200，用户摘要数组 |
| `/api/users/{id}/status` | PATCH | 停用/启用账号 | Body：status=active/disabled | 200，用户摘要 |
| `/api/audit-logs` | GET | 审计列表 | Query：limit 可选，1–100，默认 20 | 200，审计行数组 |

role 仅 editor/super_admin，max_uses 为 1–1000；note 可空、最长 1000，expires_at 为可解析日期字符串或 null，默认 null。邀请码行含 id/code/role/created_by/max_uses/used_count/status/note/expires_at/created_at/updated_at。

用户列表含 id/username/display_name/role/status/last_login_at/created_at；更新状态返回前五项。不能停用当前账号（409），用户或邀请码不存在当前返回 400，停用会删除该账号全部会话。

审计行含 id/user_id/username/user_role/method/path/status_code/duration_ms/ip_address/user_agent/payload/created_at。payload 经字段脱敏，异步记录失败不会成为内容版本回滚。普通越权 403，未登录 401，其他格式及关联错误见公共约定。
