# 知识点 API

知识点是可独立引用的公共知识实体；版本保存其某次确定的内容。表中使用完整路径。字段未标可选的均必填。通用规则见[接口约定](./overview.md)。

表内 `{id}`、`{revisionId}` 为必填路径参数，取值为正整数。Body 表示 JSON 请求体，Query 表示查询参数；未标“可选”的请求字段均必填。成功响应列说明 HTTP 状态和解密后的数据，完整字段见下文。

| 路径 | 方法 | 接口说明 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/knowledge-points` | `GET` | 列出公开知识点 | 无需认证 | 无请求体 | `200`：`[{ id, slug, status, revision_id, title, summary }]` |
| `/api/knowledge-points/{id}` | `GET` | 读取当前公开知识点版本 | 无需认证 | 无请求体 | `200`：当前公开详情 |
| `/api/knowledge-points/{id}/revisions/{revisionId}` | `GET` | 读取指定已审核版本 | 无需认证 | 无请求体 | `200`：指定 approved 版本详情，无 categories |
| `/api/knowledge-points` | `POST` | 创建知识点和首个草稿 | 已登录用户 | Body：`slug`, `title`, `source` | `201`：`{ point, revision }` |
| `/api/knowledge-revisions/mine` | `GET` | 列出自己的知识点版本 | 已登录用户 | 无请求体 | `200`：自己的版本摘要数组 |
| `/api/knowledge-revisions/{id}` | `GET` | 读取知识点版本 | 登录；非 approved 限版本贡献者或管理员 | 无请求体 | `200`：版本行 |
| `/api/knowledge-points/{id}/revisions` | `POST` | 复制已提交版本为草稿 | 登录；非 approved 来源限版本贡献者或管理员 | Body：`based_on_id` | `201`：新草稿版本行 |
| `/api/knowledge-revisions/{id}` | `PUT` | 完整保存知识点草稿 | 版本贡献者或管理员 | Body：完整保存体，见下文（全部顶层字段必填） | `200`：版本行 |
| `/api/knowledge-revisions/{id}/submit` | `POST` | 提交知识点版本审核 | 版本贡献者或管理员 | Body：`edit_version` | `200`：pending 版本行 |
| `/api/knowledge-points/{id}/prerequisites` | `GET` | 读取公开前置知识点 | 无需认证 | 无请求体 | `200`：`[{ id, slug, revision_id, title }]` |
| `/api/knowledge-points/{id}/prerequisites` | `PUT` | 替换前置知识点关系 | 管理员 | Body：`prerequisites`：ID 数组 | `200`：`{ knowledge_point_id, prerequisites }` |
| `/api/knowledge-points/{id}/categories` | `PUT` | 替换知识点分类关联 | 管理员 | Body：`categories`：ID 数组 | `200`：`{ knowledge_point_id, categories }` |
| `/api/knowledge-points/{id}/status` | `PATCH` | 更新知识点状态 | 管理员 | Body：`status`：active / disabled / archived | `200`：知识点身份行 |

公开接口要求知识点 active，所读版本 approved。当前详情字段为 `id, slug, revision_id, revision_no, title, summary, source, animation, metadata, categories`，categories 为 `[{ id, slug, name }]`。指定版本可以不是当前公开版，但须属于该知识点并审核通过。

知识点身份行：`id, slug, status, public_revision_id, created_by, created_at, updated_at`。

版本行：`id, knowledge_point_id, revision_no, based_on_id, title, summary, source, animation, metadata, change_note, contributor_id, edit_version, status, submitted_at, reviewed_at, created_at, updated_at`。首版 revision_no=1、edit_version=1、status=draft；summary/change_note 为空，animation/based_on_id/审核时间为 null，metadata 为 `{}`。

mine 返回 `id, knowledge_point_id, revision_no, title, status, edit_version, submitted_at, updated_at`，管理员也只返回自己的版本。

## 完整保存体

所有顶层字段必填。示例已静态核对，未做真实数据库请求。

```json
{
  "edit_version": 1,
  "title": "数列极限的定义",
  "summary": "数列收敛的定义",
  "source": "== 数列极限\n数列收敛的定义正文。",
  "animation": null,
  "metadata": {},
  "change_note": "补充定义"
}
```

保存和提交都必须带最近读到的 edit_version，成功都会加一。提交体仅 `{ "edit_version": 2 }`；提交要求非空正文。只有 draft 可保存、提交；pending/approved/rejected 不可继续编辑，要复制为新草稿。

复制的 based_on_id 必须属于同一知识点且非 draft；允许复制有权限的 pending/rejected 或任意 approved。新贡献者为当前用户。知识点非 active 时创建新版本返回 409；现有草稿保存/提交未同样检查身份状态，是否应阻断这类操作仍待确认。

前置关系与分类关联为整组替换，数组最长 100，不可重复；空数组清空。数据库检查知识点前置及分类父子关系成环。公开前置列表过滤不可公开的前置点。

主要错误：参数/重复数组 400；权限 403；不存在或不可公开 404；重复 slug、旧并发号、非草稿操作、复制草稿、外键/成环等冲突 409（自引用检查约束可能为 400）。

## 草稿保存参数定义

适用于 `PUT /api/knowledge-revisions/{id}`；以下字段均位于 Body。提交接口只接受 `edit_version`，不能携带其余字段。

| 参数 | 类型 | 必填 | 说明与约束 |
| --- | --- | --- | --- |
| `edit_version` | integer | 是 | 最近读取的并发号，至少 1 |
| `title` | string | 是 | 非空，最长 200 字符 |
| `summary` | string | 是 | 可为空，最长 5000 字符 |
| `source` | string | 是 | 草稿可为空，最长 200000 字符 |
| `animation` | object / null | 是 | 不允许可执行场景字段 |
| `metadata` | object | 是 | 不能是数组或 null |
| `change_note` | string | 是 | 可为空，最长 2000 字符 |
