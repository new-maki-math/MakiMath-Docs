# 课程与目录树 API

本模块涵盖学科分类、课程管理、大章结构以及编者工作台目录树的获取与批量调序接口。

---

## 1. 获取工作台完整知识树 (Workbench Tree)
- **请求方法**：`GET`
- **接口路径**：`/api/workbench/tree`
- **权限要求**：`登录用户 (requireLogin)`
- **说明**：编者进入工作台时调用，返回当前编者拥有权限编辑的所有分类、课程、章节与小节完整树状层级。

### 响应体 (Response)
```json
{
  "ok": true,
  "tree": [
    {
      "id": 1,
      "name": "高等数学",
      "slug": "calculus",
      "courses": [
        {
          "id": 10,
          "title": "高等数学强化精讲",
          "slug": "advanced-calculus",
          "status": "live",
          "chapters": [
            {
              "id": 101,
              "tag": "第 1 章",
              "title": "函数、极限与连续性",
              "sections": [
                {
                  "id": 1001,
                  "tag": "1.1",
                  "title": "等价无穷小代换及其适用条件",
                  "source_hash": "a1b2c3d4...",
                  "prereqs": []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 2. 分类管理接口群 (Categories)

### 2.1 获取全量分类列表
- **请求方法**：`GET`
- **接口路径**：`/api/categories`
- **权限要求**：`公开免登`

#### 响应体 (Response)
```json
[
  {
    "id": 1,
    "name": "高等数学",
    "slug": "calculus",
    "descr": "包含微积分、级数与微分方程",
    "pos": 10,
    "courses_count": 4
  }
]
```

### 2.2 创建分类
- **请求方法**：`POST`
- **接口路径**：`/api/categories`
- **权限要求**：`超级管理员 (requireAdmin)`

#### 请求体 (Body)
```json
{
  "name": "线性代数",
  "slug": "linear-algebra",
  "descr": "矩阵、行列式与线性空间",
  "pos": 20
}
```

### 2.3 批量重排分类权重
- **请求方法**：`PUT`
- **接口路径**：`/api/categories/order`
- **权限要求**：`超级管理员 (requireAdmin)`

#### 请求体 (Body)
```json
{
  "ids": [2, 1, 3]
}
```

---

## 3. 课程管理接口群 (Courses)

### 3.1 检索课程列表
- **请求方法**：`GET`
- **接口路径**：`/api/courses`
- **权限要求**：`公开免登`

#### 请求参数 (Query)
| 参数名 | 类型 | 必填 | 描述 |
|---|---|---|---|
| `category_id` | number | 否 | 按学科分类 ID 筛选 |
| `status` | string | 否 | 按发布状态过滤 (`draft`, `live`, `hidden`, `archived`) |

### 3.2 获取课程详情与大纲树
- **请求方法**：`GET`
- **接口路径**：`/api/courses/:id/tree`
- **权限要求**：`公开免登`
- **说明**：读者访问课程首页（`/course/:id`）时调取，包含课程基本信息、关联的大章列表与小节列表。

### 3.3 创建新课程
- **请求方法**：`POST`
- **接口路径**：`/api/courses`
- **权限要求**：`超级管理员 (requireAdmin)`

#### 请求体 (Body)
```json
{
  "category_id": 1,
  "title": "线性代数精讲",
  "slug": "linear-algebra-advanced",
  "subtitle": "核心概念与证明精粹",
  "descr": "深入讲解特征值与对角化理论",
  "status": "draft"
}
```

### 3.4 更新课程信息
- **请求方法**：`PATCH`
- **接口路径**：`/api/courses/:id`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

### 3.5 设置宏观前置课程依赖
- **请求方法**：`PUT`
- **接口路径**：`/api/courses/:id/prereqs`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

#### 请求体 (Body)
```json
{
  "prereqs": [10, 12]
}
```

### 3.6 批量重排课程顺序
- **请求方法**：`PUT`
- **接口路径**：`/api/courses/order`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

#### 请求体 (Body)
```json
{
  "category_id": 1,
  "ids": [105, 101, 102]
}
```

---

## 4. 章节管理接口群 (Chapters)

### 4.1 获取课程下的章节列表
- **请求方法**：`GET`
- **接口路径**：`/api/chapters?course_id=10`
- **权限要求**：`公开免登`

### 4.2 创建大章
- **请求方法**：`POST`
- **接口路径**：`/api/chapters`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

#### 请求体 (Body)
```json
{
  "course_id": 10,
  "tag": "第 2 章",
  "title": "一元微分学与导数应用",
  "slug": "chapter-2-differentiation",
  "summary": "本章重点考查拉格朗日中值定理与导数几何应用"
}
```

### 4.3 批量重排章节顺序
- **请求方法**：`PUT`
- **接口路径**：`/api/chapters/order`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

#### 请求体 (Body)
```json
{
  "course_id": 10,
  "ids": [101, 102, 103]
}
```

### 4.4 批量删除章节
- **请求方法**：`POST`
- **接口路径**：`/api/chapters/batch-delete`
- **权限要求**：`登录用户 / 课程编者 (requireCourseEditor)`

#### 请求体 (Body)
```json
{
  "ids": [104, 105]
}
```
