# 知识点 API

知识点由管理员直接维护，不再提供知识点版本、草稿提交或审核接口。公开正文为当前 active 数据，引用不会固定旧版本。知识点的永久 id 仍用于前置关系与浏览器掌握状态。请求加密见[接口约定](./overview.md)。

接口表使用完整路径。`{id}` 为正整数，`{slug}` 为最长100的小写字母/数字及分隔连字符。请求对象拒绝未知字段，未标可选的字段必填。

| 路径 | 方法 | 接口说明 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/knowledge-points` | `GET` | 列出有效知识点 | 公开 | 无 | 200，`[{ id, slug, title }]` |
| `/api/knowledge-points/{id}` | `GET` | 按ID读取正文 | 公开 | Path：id | 200，公开详情 |
| `/api/knowledge-points/by-slug/{slug}` | `GET` | 按slug读取正文 | 公开 | Path：slug | 200，公开详情 |
| `/api/knowledge-map` | `GET` | 读取知识地图 | 公开 | Query：category_id可选 | 200，地图对象 |
| `/api/knowledge-points/manage` | `GET` | 管理列表 | 管理员 | 无 | 200，管理摘要数组 |
| `/api/knowledge-points/manage/{id}` | `GET` | 管理详情 | 管理员 | Path：id | 200，知识点行 |
| `/api/knowledge-points` | `POST` | 创建知识点 | 管理员 | Body：slug、title、source | 201，知识点行 |
| `/api/knowledge-points/{id}` | `PUT` | 修改标题和正文 | 管理员 | Body：title、source | 200，知识点行 |
| `/api/knowledge-points/import` | `POST` | 批量导入 | 管理员 | Body：category_id、data | 201，导入映射 |
| `/api/knowledge-points/{id}/status` | `PATCH` | 归档或恢复 | 管理员 | Body：status=active/archived | 200，知识点行 |
| `/api/knowledge-points/{id}/prerequisites` | `GET` | 读取有效直接前置 | 公开 | Path：id | 200，`[{ id, slug, title }]` |
| `/api/knowledge-points/{id}/prerequisites` | `PUT` | 替换前置关系 | 管理员 | Body：prerequisites，ID数组 | 200，`{ knowledge_point_id, prerequisites }` |
| `/api/knowledge-points/{id}/categories` | `PUT` | 替换分类关联 | 管理员 | Body：categories，ID数组 | 200，`{ knowledge_point_id, categories }` |
| `/api/knowledge-points/{id}` | `DELETE` | 永久删除知识点及关联 | 管理员 | 无Body | 204，无响应体 |
| `/api/categories/knowledge/{id}` | `DELETE` | 删除分类树及仅归属该树的知识点 | 管理员 | 无Body | 204，无响应体 |

公开详情为 `{ id, slug, title, source, categories }`，categories为 `[{ id, slug, name }]`；点非active或不存在均404。知识点列表、地图、管理读取及两种公开详情带 `Cache-Control: no-store`。知识点行字段为 `id, slug, title, source, status, created_by, updated_by, created_at, updated_at`；管理摘要不带source，增加category_ids数组。知识点状态只支持active/archived，不再支持disabled。

| 创建/修改字段 | 类型 | 必填 | 约束 |
| --- | --- | --- | --- |
| slug | string | 仅创建时必填 | 最长100，创建后无修改接口 |
| title | string | 是 | 非空，最长200 |
| source | string | 是 | 非空，最长200000；原样保存，不校验MM宏或单box结构 |

没有edit_version，不能宣称知识点更新支持乐观并发保护。前置与分类数组为整组替换，最多100个ID，不得重复；空数组清空。数据库防止前置成环。正文单box约定见[编写说明](../authoring/knowledge-reference.md)。

## 知识地图

category_id为可选正整数，给定时须是有效知识分类，否则404。nodes包括范围内active点，edges只包括两端都在结果中的边；方向是前置source → 后续target。categories始终返回全量有效分类，不是只返回筛选子树。响应：

```json
{
  "categories": [{ "id": 1, "parent_id": null, "slug": "analysis", "name": "分析", "pos": 0 }],
  "nodes": [{ "id": 11, "slug": "sequence-limit", "title": "数列极限", "category_ids": [1] }],
  "edges": [],
  "stats": { "category_count": 1, "node_count": 1, "edge_count": 0 },
  "filter": { "category_id": 1, "include_descendants": true }
}
```

此为结构示例，ID并非固定数据，未做运行验证。

## JSON批量导入

目标category_id须为active一级知识分类。data仅接受schema_version、categories、points、edges，局部ID是文件内非空字符串，不是数据库ID。分类根节点挂到目标分类；点未指定category_ids或为空时归入目标分类。导入为事务新增，不覆盖已有同slug记录。

```json
{
  "category_id": 1,
  "data": {
    "schema_version": 1,
    "categories": [{ "id": "c1", "parent_id": null, "slug": "limits", "name": "极限", "pos": 0 }],
    "points": [{ "id": "p1", "slug": "sequence-limit", "title": "数列极限", "source": "#mm-box-definition[定义正文]", "category_ids": ["c1"] }],
    "edges": []
  }
}
```

201返回 `{ category_id, counts: { categories, points, edges }, categories: [{ id, category_id }], points: [{ id, point_id }] }`。映射里的id为文件局部ID，其余为新数据库ID。

data序列化后最多2 MiB，最多150分类、1000点、6000边、10000分类关联，每点最多100分类；同时受整个加密请求体4 MiB限制。categories字段如示例全部必填；points仅category_ids可选。边为 `{ source, target }` 局部点ID，source为前置，target为后续。文件内引用须存在，关系不能成环。

## 删除与错误

删除知识点清理其分类及所有入/出前置关系；讲义源码不改写，相关引用可能显示缺失。本地掌握记录和批注不自动清理。删除分类会连同子分类一起删除，仅属于该范围的点被删除；还属于范围外分类的点保留。知识点删除不要求先归档。

主要错误：字段/类型/大小/重复关系400；未登录401；非管理员403；不存在或不可公开404；同slug、无效关联、导入目标非有效一级分类等409。导入错误可带details中的field/index/property/id/slug。网络失败时新增是否成功可能未知，先查列表，不直接重复导入。
