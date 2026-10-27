# 知识点 API

知识点是可独立引用的公共知识实体；版本保存其某次确定的内容。路径省略 `/api`。字段未标可选的均必填。通用规则见[接口约定](./overview.md)。

| 方法与路径 | 权限 | 请求 | 成功响应 |
| --- | --- | --- | --- |
| GET `/knowledge-points` | 公开 | 无 | 200，`[{ id, slug, status, revision_id, title, summary }]` |
| GET `/knowledge-points/:id` | 公开 | 无 | 200，当前公开详情 |
| GET `/knowledge-points/:id/revisions/:revisionId` | 公开 | 无 | 200，指定 approved 版本详情，无 categories |
| POST `/knowledge-points` | 登录 | slug, title, source | 201，`{ point, revision }` |
| GET `/knowledge-revisions/mine` | 登录 | 无 | 200，自己的版本摘要数组 |
| GET `/knowledge-revisions/:id` | 登录；非 approved 限贡献者/管理员 | 无 | 200，版本行 |
| POST `/knowledge-points/:id/revisions` | 登录；非 approved 来源限贡献者/管理员 | based_on_id | 201，新草稿版本行 |
| PUT `/knowledge-revisions/:id` | 贡献者/管理员 | 完整保存体 | 200，版本行 |
| POST `/knowledge-revisions/:id/submit` | 贡献者/管理员 | edit_version | 200，pending 版本行 |
| GET `/knowledge-points/:id/prerequisites` | 公开 | 无 | 200，`[{ id, slug, revision_id, title }]` |
| PUT `/knowledge-points/:id/prerequisites` | 管理员 | prerequisites：ID 数组 | 200，`{ knowledge_point_id, prerequisites }` |
| PUT `/knowledge-points/:id/categories` | 管理员 | categories：ID 数组 | 200，`{ knowledge_point_id, categories }` |
| PATCH `/knowledge-points/:id/status` | 管理员 | status：active / disabled / archived | 200，知识点身份行 |

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

复制的 based_on_id 必须属于同一知识点且非 draft；允许复制有权限的 pending/rejected 或任意 approved。新贡献者为当前用户。知识点非 active 时创建新版本返回 409；现有草稿保存/提交未同样检查身份状态，见核对记录。

前置关系与分类关联为整组替换，数组最长 100，不可重复；空数组清空。数据库检查知识点前置及分类父子关系成环。公开前置列表过滤不可公开的前置点。

主要错误：参数/重复数组 400；权限 403；不存在或不可公开 404；重复 slug、旧并发号、非草稿操作、复制草稿、外键/成环等冲突 409（自引用检查约束可能为 400）。
