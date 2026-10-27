# 前端接入流程

本页对应后端 `df87ca0`，完整依据及验证边界见[核对记录](./verification.md)。以下示例为静态核对的协议示例，**没有运行真实数据库全流程**。JSON 均在加解密适配层内使用；HTTP 实际发送须加密，见[接口约定](./overview.md)。响应片段明确省略了时间等字段，完整字段以接口参考为准。

## 先改请求层和数据模型

| 原使用方式 | 当前接入方式 |
| --- | --- |
| 登录读取 token；me按用户本体处理 | 登录/刷新读取 access_token、refresh_token；me读取 response.user |
| 注册后直接当作已登录 | 注册只返回user，之后单独登录 |
| 注销不传body；改密用 current_password | 注销传最新refresh_token；改密传old_password、new_password；成功均204 |
| /courses、/courses/:id/tree、/chapters、/sections、/workbench/tree | 已移除，无兼容层；改为lectures与lecture-revisions的完整树 |
| 小节源码即公共知识正文 | 公共正文走knowledge-points/knowledge-revisions；讲义小节承载作者块及固定版本引用 |
| /sections/:id/source局部保存，source_hash并发 | 两种草稿均按edit_version并发；讲义完整替换树 |
| /courses/:id/editors | /lectures/:id/collaborators/:userId，区分view/edit及所有者 |
| 分类统一/categories | /categories/knowledge与/categories/lecture |
| /sections/:id/animation、scenes_code执行 | 旧端点移除；animation对象暂禁可执行场景字段，需另行适配 |
| 小节前置关系、章节上卷边 | 公共知识前置走/knowledge-points/:id/prerequisites；讲义响应不再提供旧edges |
| 搜索推荐端点 | 旧端点移除；公开讲义列表含is_recommended，搜索返回knowledge/lecture类型 |

不应只把旧URL中的courses改成lectures：数据身份、编辑粒度和发布流程均已变化。掌握记录关联知识点永久ID；引用实例关联某次出现的occurrence_id，二者不能混用。免登录个人讲义、批注和掌握记录由浏览器本地保存，本轮无相应云端同步接口。

## 1. 登录

先取得公钥、准备加密适配。编辑者调用 `POST /api/auth/login`：

```json
{ "username": "editor-demo", "password": "example-pass-2026" }
```

200返回 `{ user, access_token, refresh_token }`。保存两种令牌；后续编辑带Bearer访问令牌。管理员用另一个账号同样登录，审核步骤使用管理员的访问令牌。账号须预先通过邀请码注册，不能假设数据库带默认账号。

## 2. 创建并保存知识点

`POST /api/knowledge-points`：

```json
{ "slug": "sequence-limit", "title": "数列极限", "source": "== 数列极限\n数列极限的定义正文。" }
```

201返回 `{ point, revision }`，取 `point.id` 为 K、`revision.id` 为 KR、`revision.edit_version` 为 KV。响应片段（数字仅为示意）：

```json
{ "point": { "id": 11, "public_revision_id": null }, "revision": { "id": 21, "knowledge_point_id": 11, "status": "draft", "edit_version": 1 } }
```

如需编辑，`PUT /api/knowledge-revisions/21`，实际路径用KR：

```json
{ "edit_version": 1, "title": "数列极限", "summary": "定义", "source": "== 数列极限\n数列极限的定义正文。", "animation": null, "metadata": {}, "change_note": "初稿" }
```

200直接返回版本行，从 `response.edit_version` 更新KV（本例为2）。注意不是 response.revision.edit_version。

## 3. 提交并审核知识点

编辑者 `POST /api/knowledge-revisions/21/submit`，传最近KV：

```json
{ "edit_version": 2 }
```

200返回版本行片段 `{ "id": 21, "status": "pending", "edit_version": 3 }`。管理员可先GET `/api/reviews/knowledge/pending`，再 `POST /api/reviews/knowledge/21`：

```json
{ "decision": "approved", "comment": "定义核对通过" }
```

201返回审核记录片段 `{ "knowledge_revision_id": 21, "decision": "approved" }`，不是知识点详情。此后GET `/api/knowledge-points/11/revisions/21` 验证可公开读取，再使用这一对ID引用。approved指固定版本，不是“跟随最新”。

## 4. 创建并保存讲义

编辑者 `POST /api/lectures`：

```json
{ "slug": "limits-intro", "title": "极限入门" }
```

201返回 `{ lecture, revision }`，取lecture.id为L、revision.id为LR、revision.edit_version为LV。示例分别为31、41、1。讲义仍unpublished。

`PUT /api/lecture-revisions/41` 使用[讲义完整保存体](./lectures.md#完整保存体)，其中 knowledge_point_id=K、knowledge_revision_id=KR、edit_version=LV。本例引用11/21。保存200返回 `{ revision, chapters }`，从 `response.revision.edit_version` 更新LV（本例2）；保存返回的章、节、块都含occurrence_id。

后续每次读取后编辑，应将节点转换为保存DTO：只留允许字段，保留每级occurrence_id，引用块去掉knowledge_title、knowledge_source等联查字段。缺失节点意味着删除。用户新增另一处引用时使用新的occurrence_id。不能把作者块编辑操作写进公共知识点版本，也不能将引用正文复制进保存体。

## 5. 提交并审核完整讲义

编辑者 `POST /api/lecture-revisions/41/submit`：

```json
{ "edit_version": 2 }
```

200直接返回pending版本行（本例edit_version=3）。管理员 `POST /api/reviews/lecture/41`：

```json
{ "decision": "approved", "comment": "编排及引用核对通过" }
```

201返回审核记录片段 `{ "lecture_revision_id": 41, "decision": "approved" }`。此操作将公开指针设为41并发布；首次推荐仍false。无需再发一次publication请求才可阅读。

## 6. 读取公开讲义

读者无需Bearer，仍通过加解密适配请求 `GET /api/lectures/31`。200响应结构片段：

```json
{
  "lecture": { "id": 31, "slug": "limits-intro", "public_revision_id": 41, "is_recommended": false },
  "revision": { "id": 41, "lecture_id": 31, "status": "approved", "edit_version": 3 },
  "chapters": [{
    "occurrence_id": "11111111-1111-4111-8111-111111111111",
    "slug": "chapter-1",
    "sections": [{
      "occurrence_id": "22222222-2222-4222-8222-222222222222",
      "slug": "section-1",
      "blocks": [
        { "occurrence_id": "33333333-3333-4333-8333-333333333333", "block_type": "author", "source": "先观察数列，再阅读定义。", "knowledge_source": null },
        { "occurrence_id": "44444444-4444-4444-8444-444444444444", "block_type": "knowledge_reference", "source": null, "knowledge_point_id": 11, "knowledge_revision_id": 21, "knowledge_title": "数列极限", "knowledge_source": "== 数列极限\n数列极限的定义正文。" }
      ]
    }]
  }]
}
```

这里UUID是结构示意，实际使用服务端生成值。作者块渲染source，引用块渲染knowledge_source；本接口不返回旧section doc AST，前端须适配渲染输入。未发布/已下架读公开接口为404。

## 失败后的处理

保存或提交409时保留本地编辑，重新GET对应版本，比较并发号和内容，由编辑者解决冲突。提交后不可原地修改；需POST知识点或讲义的revisions接口，based_on_id指向已提交版本。审核时公开版本发生变化也会409，应基于最新公开版本整理新草稿，不能只刷新edit_version后重试审核。
