# 讲义 API

讲义包含一个工作草稿及独立审核快照。每个版本按章节、小节存储完整Typst source，没有blocks、知识点版本ID或动画字段。后端不解析引用，公开知识点更新可能改变再次阅读时的引用内容。通信约定见[接口约定](./overview.md)。

接口表使用完整路径；`{id}`/`{userId}`为正整数，slug最长100，只允许小写字母、数字和分隔连字符。Body未标可选字段均必填。

| 路径 | 方法 | 接口说明 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/lectures` | `GET` | 公开讲义列表 | 公开 | 无 | 200，公开摘要数组 |
| `/api/lectures/by-slug/{slug}` | `GET` | 读取指定讲义版本 | 公开或有权查看 | Query：revision_id可选 | 200，`{ lecture, revision, chapters }` |
| `/api/lectures/mine` | `GET` | 有权访问的讲义 | 登录 | 无 | 200，讲义身份行数组，管理员可见全部 |
| `/api/lectures/owned` | `GET` | 自己所有的讲义及版本架 | 登录 | 无 | 200，身份摘要与versions数组 |
| `/api/lectures` | `POST` | 创建讲义与工作草稿 | 登录 | Body：slug、title | 201，`{ lecture, revision }` |
| `/api/lectures/import` | `POST` | 导入为新讲义草稿 | 登录 | Body：可移植完整JSON | 201，`{ lecture, revision }` |
| `/api/lectures/{id}/revisions` | `GET` | 读取版本列表 | 查看权限 | 无 | 200，版本行数组 |
| `/api/lectures/{id}/revisions` | `POST` | 复制已提交版本为工作草稿 | 编辑权限 | Body：based_on_id | 201，`{ revision, chapters }` |
| `/api/lecture-revisions/{id}` | `GET` | 读取完整私有版本 | 查看权限 | 无 | 200，`{ revision, chapters }` |
| `/api/lecture-revisions/{id}/export` | `GET` | 导出单版本完整JSON | 公开当前版或查看权限 | 无 | 200，可移植JSON |
| `/api/lecture-revisions/{id}` | `PUT` | 替换完整草稿目录与源码 | 编辑权限 | Body：完整保存体 | 200，`{ revision, chapters }` |
| `/api/lecture-revisions/{id}/submit` | `POST` | 从工作草稿创建审核快照 | 编辑权限 | Body：edit_version | 200，`{ snapshot, draft_edit_version }` |
| `/api/lectures/{id}/collaborators` | `GET` | 协作者列表 | 查看权限 | 无 | 200，协作者数组 |
| `/api/lectures/{id}/collaborators/{userId}` | `PUT` | 设置协作者 | 所有者或管理员 | Body：permission=view/edit | 200，协作者行 |
| `/api/lectures/{id}/collaborators/{userId}` | `DELETE` | 移除协作者 | 所有者或管理员 | 无Body | 204，无响应体 |
| `/api/lectures/{id}/publication` | `PATCH` | 设置上下架/推荐 | 所有者或管理员；推荐仅管理员 | Body：publication_status、is_recommended均可选 | 200，讲义身份行 |
| `/api/lectures/{id}/restore` | `POST` | 恢复已归档讲义 | 所有者或管理员 | 无Body | 200，讲义身份行 |
| `/api/lectures/{id}` | `DELETE` | 永久删除已归档讲义 | 管理员 | 无Body | 204，无响应体 |

查看权限包括所有者、管理员及view/edit协作者；编辑权限不含view协作者。普通登录用户不会因讲义公开而获得私有版本权限。旧GET `/api/lectures/{id}`不再提供，阅读应按slug调用。

## slug与版本读取

不带revision_id：已发布讲义返回当前公开版；未发布/下架/归档讲义仅授权用户可读取，自动选唯一工作草稿。不能确定唯一草稿返回409，details含lecture_id和drafts数组，客户端应选择版本。不是details.draft_id。

带revision_id：必须属于该讲义；匿名或无私有查看权限的用户只能读当前已发布且approved版本，其余404。授权用户可以读取草稿和历史快照，包括归档内容。读取响应lecture仅含id、slug、public_revision_id、is_recommended，不含owner_id。slug读取、私有版本读取、owned与导出带Cache-Control: no-store。

身份行：`id, slug, owner_id, publication_status, public_revision_id, is_recommended, created_at, updated_at`。公开列表项：`id, slug, is_recommended, revision_id, title, subtitle, descr, category_id`。

owned只包含当前用户实际所有的讲义，管理员也不会在此接口拿到他人的讲义。每项为 `{ id, slug, publication_status, public_revision_id, versions }`，每个版本含revision_id、revision_no、kind（working_draft/snapshot）、status、title、subtitle、updated_at、is_public。管理范围用mine，不可混用owned。

## 完整保存体

所有顶层字段必填；下例为静态结构示例，未做数据库联调。知识点slug须替换为实际存在内容，但保存接口不会验证它。

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
    "slug": "chapter-1", "title": "极限",
    "sections": [{
      "slug": "section-1", "title": "数列极限",
      "source": "先阅读定义。\n#mm-knowledge(slug: \"sequence-limit\")"
    }]
  }]
}
```

| 字段 | 类型 | 必填 | 约束 |
| --- | --- | --- | --- |
| edit_version | integer | 是 | 最近读取的草稿并发号，至少1 |
| title | string | 是 | 非空，最长200 |
| subtitle / descr | string | 是 | 可空，最长分别500/5000 |
| category_id | integer/null | 是 | 讲义分类ID或null |
| typst_version | string | 是 | 非空，最长50；不表示服务端使用对应编译器 |
| metadata | object | 是 | 不可为数组/null |
| change_note | string | 是 | 可空，最长2000 |
| chapters | array | 是 | 完整树，最多100章 |

章必填slug、sections；节必填slug、source；两级可选occurrence_id、tag、title、summary。章/节slug非空且最长100，tag/title/summary可空最长5000，section.source可空最长200000。最多每章200节、全讲义2000节；在线写入仍受加密后整个请求体4 MiB限制，数量上限不保证任意长度源码都能装入。

完整保存删除旧树后按数组顺序插入，pos从0开始，缺失节点就是删除。保留章/节occurrence_id UUID；数据库行id、lecture_revision_id、chapter_id、pos和时间不是保存字段。新节点可省略occurrence_id由后端生成。没有块级occurrence_id，也没有引用展开字段。

版本行包含 `id, lecture_id, revision_no, based_on_id, source_draft_id, category_id, title, subtitle, descr, typst_version, metadata, change_note, created_by, edit_version, status, submitted_at, reviewed_at, created_at, updated_at`。章行有sections；节行直接有source。树的行ID可能因保存变化，不用于跨保存定位。

## 工作草稿与审核快照

每份讲义最多一个工作草稿（draft且source_draft_id=null）。创建讲义时自动生成；已有草稿时复制版本返回409，details.draft_id提示已有草稿ID。复制来源必须属于该讲义且非draft，复制保留章/节occurrence_id。

保存成功edit_version加一。提交携带最近并发号，但**不会把工作草稿变成pending，也不递增该草稿的并发号**；创建独立快照并返回snapshot，其status=pending，source_draft_id指向原草稿。审核使用snapshot.id，不是原草稿ID。全讲义最多一个pending快照；重复/并发提交返回409。提交要求有非空小节源码，数据库执行检查。

快照固定目录、作者源码与宏字符串，不固定知识点正文。原草稿可以继续编辑。审核通过更新公开入口、发布完整快照，并更新来源草稿based_on_id和edit_version；前端重新读取草稿，先保留未保存输入再处理冲突。驳回不改变公开版，也不删除工作草稿。

## 归档、恢复与永久删除

publication_status可写published/withdrawn/archived，published需已审核公开版本。下架或归档清除推荐；新版审核不自动清除已有推荐值。归档后仍可按私有权限查看，但保存、提交、复制、导出、协作者修改、普通publication修改和审核均返回409。

恢复使用独立restore接口：有历史公开指针则恢复为withdrawn，否则unpublished；均is_recommended=false，**不自动公开**。未归档调用restore为409。

管理员可永久删除整本已归档讲义，清理草稿、全部快照、目录、审核记录及协作者；不删除公共知识点或浏览器本地数据。非管理员403，未归档409，不存在404。前端的三步确认是交互保护，接口不要求三次调用或确认字符串。不能再描述为“归档后只允许恢复”。

导入/导出格式见[讲义JSON与小节导入](../authoring/import-export.md)。其他主要错误：字段400、未登录401、权限403、资源不可读404、并发号/来源/待审/唯一性/归档状态冲突409，超过总大小413。
