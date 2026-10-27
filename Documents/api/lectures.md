# 讲义 API

讲义有独立身份、版本和所有者；版本按“章节 → 小节 → 内容块”组织作者内容与公共知识点引用。路径省略 `/api`。通用规则见[接口约定](./overview.md)。

| 方法与路径 | 权限 | 请求 | 成功响应 |
| --- | --- | --- | --- |
| GET `/lectures` | 公开 | 无 | 200，`[{ id, slug, is_recommended, revision_id, title, subtitle, descr, category_id }]` |
| GET `/lectures/:id` | 公开 | 无 | 200，`{ lecture, revision, chapters }` |
| GET `/lectures/mine` | 登录 | 无 | 200，有权访问的身份行数组；管理员返回全部 |
| POST `/lectures` | 登录 | 必填 slug, title | 201，`{ lecture, revision }` |
| GET `/lectures/:id/revisions` | 查看权限 | 无 | 200，版本行数组，revision_no 倒序 |
| POST `/lectures/:id/revisions` | 编辑权限 | 必填 based_on_id | 201，`{ revision, chapters }` |
| GET `/lecture-revisions/:id` | 查看权限 | 无 | 200，`{ revision, chapters }` |
| PUT `/lecture-revisions/:id` | 编辑权限 | 完整保存体 | 200，`{ revision, chapters }` |
| POST `/lecture-revisions/:id/submit` | 编辑权限 | 必填 edit_version | 200，pending 版本行，不含 chapters |
| GET `/lectures/:id/collaborators` | 查看权限 | 无 | 200，`[{ user_id, permission, created_at, username, display_name }]` |
| PUT `/lectures/:id/collaborators/:userId` | 所有者/管理员 | 必填 permission：view / edit | 200，`{ lecture_id, user_id, permission, invited_by, created_at }` |
| DELETE `/lectures/:id/collaborators/:userId` | 所有者/管理员 | 无 | 204 |
| PATCH `/lectures/:id/publication` | 所有者/管理员；推荐仅管理员 | 可选 publication_status, is_recommended | 200，讲义身份行 |

查看权限包括所有者、管理员、view/edit 协作者；编辑权限包括所有者、管理员和 edit 协作者。普通登录用户不因讲义公开而获得私有版本查看权限。删除不存在的协作者也为 204；给所有者重复授权为 409；目标用户必须 active，否则 404。

身份行：`id, slug, owner_id, publication_status, public_revision_id, is_recommended, created_at, updated_at`。初态 unpublished、公开版本 null、推荐 false。

版本行：`id, lecture_id, revision_no, based_on_id, category_id, title, subtitle, descr, typst_version, metadata, change_note, created_by, edit_version, status, submitted_at, reviewed_at, created_at, updated_at`。初稿 draft、edit_version=1、revision_no=1。公开响应的 lecture 只含 `id, slug, public_revision_id, is_recommended`。

## 完整保存体

顶层字段全部必填。示例已静态核对，ID 替换为运行时返回值，未做数据库联调。

```json
{
  "edit_version": 1,
  "title": "极限入门",
  "subtitle": "",
  "descr": "从定义开始",
  "category_id": null,
  "typst_version": "0.15.1",
  "metadata": {},
  "change_note": "初稿",
  "chapters": [{
    "slug": "chapter-1",
    "title": "极限",
    "sections": [{
      "slug": "section-1",
      "title": "数列极限",
      "blocks": [
        { "block_type": "author", "source": "先观察数列，再阅读定义。" },
        { "block_type": "knowledge_reference", "knowledge_point_id": 11, "knowledge_revision_id": 21 }
      ]
    }]
  }]
}
```

章必填 slug, sections；节必填 slug, blocks；两级可选 occurrence_id, tag, title, summary，文案省略为空、最长 5000。occurrence_id 是 UUID 字符串，省略由服务端生成。最多 100 章、每章 200 节、每节 500 块、全讲义 2000 块。

作者块必填 block_type=author, source，可选 occurrence_id、对象 animation（可省略或 null）；source 可空，不可含非 null 知识点 ID。引用块必填 block_type=knowledge_reference, knowledge_point_id, knowledge_revision_id，可选 occurrence_id；不可带非 null 正文/动画副本。点与版本须匹配，版本必须 approved，否则 409。新版知识点不自动替换固定引用。

保存在事务中删除原树后按数组顺序插入，pos 从 0 开始。**缺失节点被删除，不是局部 PATCH。** 保存返回新树和加一的 revision.edit_version；提交用该值。空树可保存但不可提交。

## 读取后再保存

章返回 `id, lecture_revision_id, occurrence_id, slug, tag, title, summary, pos, created_at, updated_at, sections`。节另带 chapter_id，嵌套 blocks。块包含 `id, lecture_revision_id, section_id, occurrence_id, block_type, source, knowledge_point_id, knowledge_revision_id, animation, pos, created_at, updated_at`；另有联查字段 `knowledge_title, knowledge_summary, knowledge_source, knowledge_animation, knowledge_metadata`，作者块这些字段为 null，引用块 source/animation 为 null。

前端显式构造保存 DTO，只取允许字段；删除行 ID、父行 ID、时间、pos 和 knowledge_* 展示字段，保留章、节、块的 **occurrence_id**。行 ID 保存后可能变化，不能跨保存定位。复制已提交讲义会保留实例 UUID；新增同一点的另一次出现须使用新 UUID，不能复用原引用实例。

提交后不可修改；复制来源须属于本讲义且非 draft，新草稿 edit_version=1。409 时重新读取并处理冲突。

publication_status 可写 published / withdrawn / archived，不能设回创建初态 unpublished。published 需已有审核公开版本，不能指定 public_revision_id。下架/归档清除推荐。审核通过发布对应完整版本；推荐初始 false，但新版审核不会自动重置已有 true。

主要错误：结构/类型/动画字段 400；权限 403；不存在/不可公开 404；旧并发号、非草稿操作、空树提交、复制草稿、无效引用、实例/slug 重复、无已审核版本上架为 409。
