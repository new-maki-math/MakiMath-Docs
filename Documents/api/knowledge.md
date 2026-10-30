# 知识点 API

知识点由管理员直接维护当前标题和正文，没有版本、审核、动画、简介或内容 metadata。公开入口仅返回 active 点，管理员要读归档点也须走管理入口。[知识库操作](../guide/admin.md#维护知识点)说明界面流程。

| 路径 | 方法 | 操作 | 权限 | 请求参数 | 成功响应 |
| --- | --- | --- | --- | --- | --- |
| `/api/knowledge-points` | GET | 有效点列表 | 公开 | 无 | 200，`[{ id, slug, title }]` |
| `/api/knowledge-points/{id}` | GET | 按 ID 读正文 | 公开 | Path：id | 200，公开详情 |
| `/api/knowledge-points/by-slug/{slug}` | GET | 按 slug 读正文 | 公开 | Path：slug | 200，公开详情 |
| `/api/knowledge-map` | GET | 地图数据 | 公开 | Query：category_id 可选 | 200，地图对象 |
| `/api/knowledge-points/manage` | GET | 管理列表 | 管理员 | 无 | 200，管理摘要数组 |
| `/api/knowledge-points/manage/{id}` | GET | 管理详情 | 管理员 | Path：id | 200，知识点行 |
| `/api/knowledge-points` | POST | 创建 | 管理员 | Body：slug、title、source | 201，知识点行 |
| `/api/knowledge-points/{id}` | PUT | 改标题和正文 | 管理员 | Body：title、source | 200，知识点行 |
| `/api/knowledge-points/import` | POST | 批量新增 | 管理员 | Body：category_id、data | 201，导入映射 |
| `/api/knowledge-points/{id}/status` | PATCH | 归档或恢复 | 管理员 | Body：status=active/archived | 200，知识点行 |
| `/api/knowledge-points/{id}/prerequisites` | GET | 有效直接前置 | 公开 | Path：id | 200，`[{ id, slug, title }]` |
| `/api/knowledge-points/{id}/prerequisites` | PUT | 替换前置 | 管理员 | Body：prerequisites，ID 数组 | 200，`{ knowledge_point_id, prerequisites }` |
| `/api/knowledge-points/{id}/categories` | PUT | 替换分类 | 管理员 | Body：categories，ID 数组 | 200，`{ knowledge_point_id, categories }` |
| `/api/knowledge-points/{id}` | DELETE | 永久删除点及关系 | 管理员 | 无 Body | 204 |
| `/api/categories/knowledge/{id}` | DELETE | 删除分类子树 | 管理员 | 无 Body | 204 |

路径使用完整 `/api`，ID 为正整数。创建的 slug 最长 100，title 非空最长 200，source 非空最长 200000；当前不提供修改 slug 的业务接口。PUT 只接受 title/source，没有 edit_version，并发写入以最后成功的结果为准。源码单 box 结构是编写约定，没有保存校验。

## 读取结构与关系

公开详情为 `{ id, slug, title, source, categories }`，categories 项为 `{ id, slug, name }`，仅有效分类。不存在或已归档返回 404。列表、详情、地图和管理读取设置 no-store。

知识点行另有 status、created_by、updated_by、created_at、updated_at。管理列表不带 source，增加 category_ids，含全部直接分类关联，包括已归档分类；公开分类列表中缺少某个 ID，不意味着应该删掉该关联。

分类和前置数组最长 100，不得重复，整组替换；空数组清空。数据库拒绝前置关系成环。删除点会清理入/出前置及分类关系，删除分类树只删除完全属于该树的点，仍关联范围外分类的点保留。两者都不改讲义源码或浏览器掌握记录。

地图返回 `{ categories, nodes, edges, stats, filter }`：categories 项含 id/parent_id/slug/name/pos；nodes 项含 id/slug/title/category_ids；边为 `{ source, target }`，从前置指向后续。category_id 给定时，点包含该分类及子分类范围，分类数组仍是全部有效分类；边的两端都必须在结果点中。stats 包含 category_count/node_count/edge_count，filter 为 `{ category_id, include_descendants: true }`。无效或归档分类过滤参数返回 404。

## 批量导入

category_id 必须指向 active 一级知识分类。data 内是文件局部字符串 ID，不是数据库数字 ID。字段未知、关系指向文件外、重复 ID 或成环均拒绝；导入只新增，同 slug 冲突不覆盖。

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

上例只是结构示意，category_id 要替换。categories 字段全部必填；points 的 category_ids 可省略或为空，此时点挂在目标分类；顶层文件分类挂到目标分类下。边为 `{ source, target }` 局部点 ID，source 是前置。

201 返回 `{ category_id, counts, categories, points }`。counts 包含 categories/points/edges 数量；映射数组分别为 `[{ id, category_id }]` 和 `[{ id, point_id }]`，id 是局部字符串，新数据库 ID 在后一个字段。

data 序列化最多 2 MiB；最多 150 分类、1000 点、6000 边、10000 分类关联，每点最多 100 分类；整个加密 HTTP 体仍受 4 MiB 限制。错误可能在 details 中带 field/index/property/id/slug。参数通常 400，未登录 401、权限 403、资源不存在 404，同 slug、目标分类不符或关联约束冲突 409。网络失败后先检查列表，不直接重发新增。
