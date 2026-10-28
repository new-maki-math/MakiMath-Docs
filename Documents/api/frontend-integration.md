# 前端接入流程

::: info 代码基线
后端 `refactor/remove-unused-typst-parser`：`ea63e51`；前端 `feature/lecture-renderer`：`64cc122`（2026-10-29）。本页按这些提交静态核对，未运行构建、测试或浏览器联调。
:::

## 当前模型

知识点由管理员维护当前title/source，只有active/archived，没有知识点版本和审核。讲义每节保存完整source；前端解析 `#mm-knowledge(slug: "...")`，从公开slug接口读取当前知识点。后台不再解析Typst或固定引用版本。旧knowledge-revisions和固定版本blocks协议均不可继续使用。

认证仍按[认证API](./auth.md)：登录/刷新返回user、access_token、refresh_token，me返回 `{ user }`，注册后单独登录。注销携带最新refresh_token，改密携带old_password/new_password，成功均204。加密2xx解密后再处理，错误JSON不解密；所有接口表已包含/api，不能重复拼接。

以下JSON为加密前请求或解密后**响应片段**，省略时间等字段，ID均示意；没有真实数据库验证。完整结构见[知识点](./knowledge.md)和[讲义](./lectures.md)。

## 1. 管理员创建公共知识点

管理员Bearer调用 `POST /api/knowledge-points`：

```json
{ "slug": "sequence-limit", "title": "数列极限", "source": "#mm-box-definition[数列极限的定义正文。]" }
```

201直接返回知识点行，片段为 `{ "id": 11, "slug": "sequence-limit", "status": "active" }`。没有point/revision包裹，也不需要提交知识点审核。随后按需通过categories/prerequisites接口维护关系。

GET `/api/knowledge-points/by-slug/sequence-limit`可验证公开读取，200为 `{ id, slug, title, source, categories }`。知识点slug用于源码，永久id用于本地掌握记录。

## 2. 编者创建讲义与保存

编者登录后 `POST /api/lectures`：

```json
{ "slug": "limits-intro", "title": "极限入门" }
```

201片段：

```json
{ "lecture": { "id": 31, "slug": "limits-intro", "publication_status": "unpublished" }, "revision": { "id": 41, "status": "draft", "source_draft_id": null, "edit_version": 1 } }
```

对revision.id=41用[完整保存体](./lectures.md#完整保存体)保存，作者文字和知识点宏共同写在section.source。200返回 `{ revision, chapters }`，取revision.edit_version更新本地并发号；保存体只取白名单字段，保留章/节occurrence_id。

## 3. 提交独立快照并审核

若保存后edit_version=2，调用 `POST /api/lecture-revisions/41/submit`：

```json
{ "edit_version": 2 }
```

200响应片段：

```json
{ "snapshot": { "id": 42, "lecture_id": 31, "source_draft_id": 41, "status": "pending" }, "draft_edit_version": 2 }
```

原工作草稿41仍draft，可继续保存。管理员从GET `/api/reviews/lecture/pending`读取，再 `POST /api/reviews/lecture/42`，注意审核的是42：

```json
{ "decision": "approved", "comment": "目录及源码已核对" }
```

201返回审核记录，片段为 `{ "lecture_revision_id": 42, "decision": "approved" }`。通过即发布42，同时改变工作草稿41的based_on_id与edit_version。前端重新读取41；有未保存输入先保留并提示冲突，不自动覆盖。

## 4. 读取公开讲义

匿名GET `/api/lectures/by-slug/limits-intro`返回 `{ lecture, revision, chapters }`，此时revision.id=42、status=approved；每节source仍是原字符串。渲染器识别引用后另请求知识点slug接口。引用404只显示缺失占位，其他失败允许重试，不阻断整份讲义。知识点内引用不递归展开。

页面路由是 `/lecture/online/limits-intro` 与 `/lecture/online/limits-intro/doc/{sectionId}`。有私有权限时可带 `?revision_id=41` 查看草稿或指定快照；匿名仅可读当前公开版。无revision_id且无公开版时，授权用户自动读取唯一工作草稿；409选版错误里的候选是details.drafts。创建草稿重复错误才使用details.draft_id。

本地讲义使用 `/lecture/local/{slug}`，数据从浏览器IndexedDB读取，不把本地UUID传给在线API。我的书架可用owned获取自己的线上版本架，不能用mine替代其所有权语义。

## 接入时保留的边界

- 保存是整树替换，不是局部patch；edit_version只用于讲义草稿，不用于当前知识点更新。
- 审核快照冻结源码，不冻结引用的公共正文；知识点改变后再次读取可得到新内容。
- 归档阻断编辑、提交、导出、协作者修改与审核；所有者/管理员恢复后仍未公开；管理员另可永久删除。
- 导入为新讲义和单个工作草稿，不恢复权限、历史、审核记录、发布状态或掌握记录；详情见[导入导出](../authoring/import-export.md)。
- MM仅支持前端已适配的语法，不能将其称为完整Typst编译；没有新动画字段/接口，也不执行旧scenes_code。
