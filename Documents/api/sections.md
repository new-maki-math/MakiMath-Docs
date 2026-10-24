# 小节与讲义正文 API

小节（Section）是 MakiMath 平台讲义正文与数学公式的真正实体承载单元。本篇文档涵盖小节元数据查询、读者正文渲染接口、Typst 源码保存（带版本冲突锁）、前置依赖（DAG）以及批量管理接口。

---

## 1. 获取讲义正文与解析数据 (Core Reader API)
- **请求方法**：`GET`
- **接口路径**：`/api/sections/:id/doc`
- **权限要求**：`公开免登` (仅限已发布的 `live` 课程，未发布课程需登录编者账号)
- **说明**：读者访问讲义页面时调用的核心接口。返回小节的元数据、所属章节/课程信息、原始 Typst 源码以及预解析的结构化 AST 数据。

### 响应体 (Response)
```json
{
  "id": 1001,
  "chapter_id": 101,
  "course_id": 10,
  "slug": "equivalent-infinitesimal",
  "tag": "1.1",
  "title": "等价无穷小代换及其适用条件",
  "summary": "掌握核心代换公式与乘除条件下的代换法则",
  "pos": 0,
  "prereqs": [1000],
  "source": "#thm(\"等价无穷小代换定理\")[当 $x -> 0$ 时，若 $alpha(x) ~ alpha'(x)$...]",
  "source_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "chapter_title": "函数、极限与连续性",
  "chapter_tag": "第 1 章",
  "course_title": "高等数学强化精讲",
  "doc": {
    "title": "等价无穷小代换及其适用条件",
    "blocks": [
      {
        "type": "theorem",
        "title": "等价无穷小代换定理",
        "body": "当 $x -> 0$ 时..."
      }
    ]
  }
}
```

---

## 2. 获取章节下的小节目录列表
- **请求方法**：`GET`
- **接口路径**：`/api/sections?chapter_id=101`
- **权限要求**：`公开免登`
- **说明**：用于侧边栏导航加载，不返回冗长的 `source` 源码以节省网络带宽。

### 响应体 (Response)
```json
[
  {
    "id": 1001,
    "chapter_id": 101,
    "slug": "equivalent-infinitesimal",
    "tag": "1.1",
    "title": "等价无穷小代换及其适用条件",
    "pos": 0,
    "prereqs": [1000],
    "source_len": 1824,
    "has_source": true,
    "source_hash": "e3b0c442..."
  }
]
```

---

## 3. 保存讲义 Typst 源码 (带版本哈希锁)
- **请求方法**：`PUT`
- **接口路径**：`/api/sections/:id/source`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`
- **说明**：编者在工作台点击保存或按 `Ctrl + S` 时调取。服务端保存最新源码并重新计算 SHA-256 哈希。

### 请求体 (Body)
```json
{
  "source": "== 1.1 等价无穷小代换\n\n#thm(\"核心定理\")[当 $x -> 0$ 时...]"
}
```

### 响应体 (Response)
```json
{
  "id": 1001,
  "source_hash": "8f3b5c1a9e...",
  "source_len": 2410,
  "updated_at": "2026-10-24T12:00:00.000Z"
}
```

---

## 4. 编排小节前置依赖 (DAG Networks)
- **请求方法**：`PUT`
- **接口路径**：`/api/sections/:id/prereqs`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`
- **说明**：设置当前小节所必须前置掌握的小节 ID 数组。系统自动校验**严禁自环**（不能依赖自身）并验证依赖 ID 的合法性。

### 请求体 (Body)
```json
{
  "prereqs": [998, 999]
}
```

### 响应体 (Response)
```json
{
  "id": 1001,
  "prereqs": [998, 999]
}
```

---

## 5. 小节基础属性与元数据操作

### 5.1 创建新小节
- **请求方法**：`POST`
- **接口路径**：`/api/sections`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

#### 请求体 (Body)
```json
{
  "chapter_id": 101,
  "title": "泰勒公式及其展开技巧",
  "slug": "taylor-formula",
  "tag": "1.2",
  "summary": "佩亚诺余项与拉格朗日余项对比分析",
  "source": ""
}
```

### 5.2 修改小节元数据
- **请求方法**：`PATCH`
- **接口路径**：`/api/sections/:id`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

#### 请求体 (Body)
```json
{
  "title": "泰勒展开式核心应用与技巧",
  "summary": "新增考研真题题型归纳"
}
```

### 5.3 删除单节
- **请求方法**：`DELETE`
- **接口路径**：`/api/sections/:id`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

---

## 6. 批量管理接口群 (Batch Operations)

### 6.1 批量调整小节展示顺序
- **请求方法**：`PUT`
- **接口路径**：`/api/sections/order`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

#### 请求体 (Body)
```json
{
  "chapter_id": 101,
  "ids": [1002, 1001, 1003]
}
```

### 6.2 跨章节批量移动小节
- **请求方法**：`POST`
- **接口路径**：`/api/sections/batch-move`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`
- **说明**：在事务中执行，将指定小节移入目标章节末尾，并自动处理 slug 冲突。

#### 请求体 (Body)
```json
{
  "target_chapter_id": 102,
  "ids": [1005, 1006]
}
```

### 6.3 跨章节批量复制小节
- **请求方法**：`POST`
- **接口路径**：`/api/sections/batch-copy`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

#### 请求体 (Body)
```json
{
  "target_chapter_id": 102,
  "ids": [1001]
}
```

### 6.4 批量删除小节
- **请求方法**：`POST`
- **接口路径**：`/api/sections/batch-delete`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

#### 请求体 (Body)
```json
{
  "ids": [1010, 1011]
}
```
