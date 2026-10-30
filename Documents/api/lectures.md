# 讲义 API

先读[通信和并发约定](./overview.md)。查看权限指所有者、管理员及 view/edit 协作者；编辑权限不含 view 协作者。公开身份不会自动带来私有版本权限。讲义按版本存目录，小节 source 和封面分别读取。

## 读取目录、正文和封面

ID 均为正整数，章/节 slug 是非空且最长 100 的字符串。

| 路径 | 方法 | 操作 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/lectures` | GET | 公开列表 | 公开 | 无 | 200，公开摘要数组 |
| `/api/lectures/mine` | GET | 可访问讲义身份 | 登录 | 无 | 200，身份行数组；管理员可见全部 |
| `/api/lectures/owned` | GET | 自己的版本书架 | 登录 | 无 | 200，讲义项及 versions 数组；仅实际所有者 |
| `/api/lectures/manage` | GET | 全站管理摘要 | 管理员 | 无 | 200，管理数组 |
| `/api/lectures/by-slug/{slug}/outline` | GET | 选版并读取目录 | 公开或查看权限 | Query：revision_id 可选 | 200，`{ lecture, revision, chapters }`，不含小节 source |
| `/api/lectures/by-slug/{slug}/revisions/{revisionId}/chapters/{chapterSlug}/sections/{sectionSlug}` | GET | 读取一个小节正文 | 同版本读取权限 | Query：edit_version 必填 | 200，`{ revision_id, edit_version, occurrence_id, source }` |
| `/api/lectures/{id}/revisions` | GET | 私有版本列表 | 查看权限 | 无 | 200，版本行数组 |
| `/api/lecture-revisions/{id}/cover` | GET | 读取版本封面 | 同版本读取权限 | 无 | 200，`{ revision_id, cover, cover_hash }` |
| `/api/lecture-revisions/{id}/export` | GET | 导出完整单版本 | 当前公开版或查看权限 | 无 | 200，[可移植 JSON](../authoring/import-export.md)；归档拒绝 |

不带 revision_id 时，已发布讲义优先返回当前公开版；其他状态只允许授权用户自动选择唯一工作草稿。无法选唯一草稿返回 409，details 为 `{ lecture_id, drafts }`。带 revision_id 时须属于该讲义；匿名或无私有权限者只可读当前 published/approved 版本，其他情况 404。工作草稿和历史快照可供授权用户读取，归档不阻止私有阅读。目录、正文、封面、owned、manage 和导出设置 no-store。

正文请求必须使用刚读到的目录 edit_version，不匹配返回 409，须重新读目录；不是把目录中的旧行 ID 发给单节端点。页面地址也使用章和节 slug：`/lecture/online/{slug}/doc/{chapterSlug}/{sectionSlug}`；本地把 online 换成 local。

常用返回结构：

| 对象 | 字段 |
| --- | --- |
| 讲义身份行 | id、slug、owner_id、publication_status、public_revision_id、is_recommended、created_at、updated_at |
| 公开摘要 | id、slug、is_recommended、revision_id、title、subtitle、descr、category_id、has_cover、cover_hash |
| 目录中的 lecture | id、slug、public_revision_id、is_recommended，不返回 owner_id |
| 目录中的 revision | id、lecture_id、revision_no、based_on_id、source_draft_id、category_id、title、subtitle、descr、typst_version、metadata、change_note、created_by、edit_version、status、submitted_at、reviewed_at、created_at、updated_at；另有 has_cover、cover_hash，metadata 去掉 cover |
| 章/节目录 | 行 ID、所属版本/父级、occurrence_id、slug、tag、title、summary、pos、时间；章嵌套 sections，节不带 source |
| owned 项 | id、slug、publication_status、public_revision_id、versions；版本项有 revision_id/revision_no/kind/status/title/subtitle/descr/updated_at/has_cover/cover_hash/is_public |
| manage 项 | id、slug、owner_id、owner_username、publication_status、public_revision_id、latest_revision；最新项含 revision_id/revision_no/status/kind/title，可能为 null |

kind 为 working_draft 或 snapshot。封面 hash 是内容 SHA-256，不是权限凭证；没有封面可为 null。封面缺失返回 404，旧封面格式无法读取可返回 409。

## 创建与保存

| 路径 | 方法 | 操作 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/lectures` | POST | 新建身份与工作草稿 | 登录 | Body：slug、title | 201，`{ lecture, revision }` |
| `/api/lectures/import` | POST | 导入为新讲义 | 登录 | Body：完整可移植 JSON | 201，`{ lecture, revision }` |
| `/api/lectures/{id}/revisions` | POST | 复制已提交版为草稿 | 编辑权限 | Body：based_on_id | 201，目录结构，不含 source |
| `/api/lecture-revisions/{id}` | PUT | 替换目录及指定正文 | 编辑权限 | Body：完整保存体 | 200，更新后的目录结构 |
| `/api/lecture-revisions/{id}/sections/{occurrenceId}` | PUT | 保存已有单节 | 编辑权限 | Body：edit_version、slug、tag、title、summary、source，全部必填 | 200，`{ section, edit_version }`，section 为更新行，含 source |
| `/api/lecture-revisions/{id}/cover` | PUT | 设置草稿封面 | 编辑权限 | Body：edit_version、cover | 200，封面保存结果 |
| `/api/lecture-revisions/{id}/cover` | DELETE | 删除草稿封面 | 编辑权限 | Query：edit_version 必填，无 Body | 200，封面保存结果，**不是 204** |

完整保存体示例：

```json
{
  "edit_version": 1,
  "title": "极限入门", "subtitle": "", "descr": "从定义开始",
  "category_id": null, "typst_version": "0.15.1", "metadata": {}, "change_note": "初稿",
  "chapters": [{
    "slug": "chapter-1", "title": "极限",
    "sections": [{ "slug": "section-1", "title": "数列极限", "source": "#mm-knowledge(slug: \"sequence-limit\")" }]
  }]
}
```

顶层字段全部必填。title 非空最长 200；subtitle/descr/change_note 可空，最长 500/5000/2000；category_id 为讲义分类 ID 或 null；typst_version 非空最长 50，只是元数据；metadata 为对象。最多 100 章、每章 200 节、全讲义 2000 节，仍受整个加密体 4 MiB 限制。

章必填 slug/sections，节必填 slug；两级可选 occurrence_id/tag/title/summary。slug 非空最长 100，三个文案字段可空最长 5000，source 最长 200000。**新节必须提供 source**；已有节可带原 occurrence_id 并省略 source，后端保留该节原正文，找不到实例返回 409。

这仍是整树替换：没有放回 chapters/sections 的节点会被删除。保留章/节 occurrence_id，不回传行 ID、时间和 pos；省略 source 不是省略整个节。普通保存不会通过 metadata.cover 更换封面，要调用独立封面端点。保存成功使 edit_version 加一，响应目录不再携带正文。

封面 PUT 的 cover 是 PNG/JPEG/WebP Data URL，解码最多 524288 字节，后端检查 MIME、Base64 和文件头。保存/删除返回 `{ revision_id, edit_version, has_cover, cover_hash }`，并发号会增加。只允许未归档工作草稿；封面随复制和提交快照复制，不覆盖历史公开版本。

## 提交和审核快照

| 路径 | 方法 | 操作 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/lecture-revisions/{id}/submit` | POST | 从工作草稿创建快照 | 编辑权限 | Body：edit_version | 200，`{ snapshot, draft_edit_version }` |

每讲义最多一个工作草稿、一个 pending 快照。已有草稿再复制返回 409，details.draft_id 给出已有草稿；这与目录选版错误里的 details.drafts 数组不同。

提交复制已保存目录、源码和封面为新 pending 快照，原草稿仍是 draft，提交本身不增加其 edit_version。至少要有一个非空小节源码。审核使用返回的 snapshot.id，不是原草稿 ID。只读快照不能继续改写。

管理员通过[审核 API](./review.md)批准后，公开入口指向快照，来源草稿 based_on_id 和 edit_version 同时更新。驳回不改变公开版。提交和通过审核时均检查来源与当前公开版的关系，冲突为 409。快照不包含公共知识点正文，引用读取仍可变化。

## 协作者、上下架和删除

| 路径 | 方法 | 操作 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/lectures/{id}/collaborators` | GET | 协作者列表 | 查看权限 | 无 | 200，`[{ user_id, permission, created_at, username, display_name }]` |
| `/api/lectures/{id}/collaborators/{userId}` | PUT | 设置 view/edit 权限 | 所有者或管理员 | Body：permission | 200，`{ lecture_id, user_id, permission, invited_by, created_at }` |
| `/api/lectures/{id}/collaborators/{userId}` | DELETE | 移除协作者 | 所有者或管理员 | 无 Body | 204 |
| `/api/lectures/{id}/publication` | PATCH | 上下架或推荐 | 所有者或管理员；推荐仅管理员 | Body：publication_status、is_recommended 均可选 | 200，身份行 |
| `/api/lectures/{id}/restore` | POST | 恢复归档 | 所有者或管理员 | 无 Body | 200，身份行 |
| `/api/lectures/{id}` | DELETE | 永久删除归档讲义 | 管理员 | 无 Body | 204 |

publication_status 可写 published/withdrawn/archived；published 必须已有审核公开版本，不能直接指定 public_revision_id。下架、归档清除推荐；已有推荐不因新版审核自动清除。归档阻断保存、提交、复制、导出、修改协作者、普通 publication 修改及审核。

恢复后，有公开指针则变 withdrawn，否则 unpublished，均不推荐、不自动公开。管理员永久删除只允许 archived，会清理身份、目录、封面、版本、审核和协作者，不删除公共知识点及本地副本。三步确认属于前端交互，接口没有确认字符串或三次请求协议。

参数错误 400，未登录 401、权限 403、不可读或不存在 404，并发、归档、唯一性、来源或待审冲突 409。协作者必须为 active 用户（否则 404），不能给所有者重复授权（409）；删除不存在的协作者仍返回 204。
