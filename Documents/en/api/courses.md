# Courses & Tree API

This module documents endpoints for managing subject categories, courses, chapters, and the hierarchical workbench knowledge tree.

---

## 1. Get Workbench Knowledge Tree
- **Method**: `GET`
- **Path**: `/api/workbench/tree`
- **Permission**: `Authenticated User (requireLogin)`
- **Description**: Invoked when an author enters the workbench. Returns the complete hierarchy (categories, courses, chapters, and sections) accessible to the caller.

### Response
```json
{
  "ok": true,
  "tree": [
    {
      "id": 1,
      "name": "Calculus",
      "slug": "calculus",
      "courses": [
        {
          "id": 10,
          "title": "Calculus I: Intensive Notes",
          "slug": "advanced-calculus",
          "status": "live",
          "chapters": [
            {
              "id": 101,
              "tag": "Chapter 1",
              "title": "Functions, Limits & Continuity",
              "sections": [
                {
                  "id": 1001,
                  "tag": "1.1",
                  "title": "Equivalent Infinitesimal Substitution",
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

## 2. Categories API

### 2.1 List All Categories
- **Method**: `GET`
- **Path**: `/api/categories`
- **Permission**: `Public (No Auth)`

#### Response
```json
[
  {
    "id": 1,
    "name": "Calculus",
    "slug": "calculus",
    "descr": "Differential, integral calculus and series",
    "pos": 10,
    "courses_count": 4
  }
]
```

### 2.2 Create Category
- **Method**: `POST`
- **Path**: `/api/categories`
- **Permission**: `Super Admin (requireAdmin)`

#### Request Body
```json
{
  "name": "Linear Algebra",
  "slug": "linear-algebra",
  "descr": "Matrices, vector spaces, and eigenvalues",
  "pos": 20
}
```

### 2.3 Batch Reorder Categories
- **Method**: `PUT`
- **Path**: `/api/categories/order`
- **Permission**: `Super Admin (requireAdmin)`

#### Request Body
```json
{
  "ids": [2, 1, 3]
}
```

---

## 3. Courses API

### 3.1 List Courses
- **Method**: `GET`
- **Path**: `/api/courses`
- **Permission**: `Public (No Auth)`

#### Query Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `category_id` | number | No | Filter by category ID |
| `status` | string | No | Filter by lifecycle status (`draft`, `live`, `hidden`, `archived`) |

### 3.2 Get Course Details & Outline Tree
- **Method**: `GET`
- **Path**: `/api/courses/:id/tree`
- **Permission**: `Public (No Auth)`

### 3.3 Create New Course
- **Method**: `POST`
- **Path**: `/api/courses`
- **Permission**: `Super Admin (requireAdmin)`

#### Request Body
```json
{
  "category_id": 1,
  "title": "Linear Algebra Masterclass",
  "slug": "linear-algebra-master",
  "subtitle": "Proof techniques & applications",
  "descr": "Comprehensive guide to spectral decomposition",
  "status": "draft"
}
```

### 3.4 Update Course
- **Method**: `PATCH`
- **Path**: `/api/courses/:id`
- **Permission**: `Course Editor (requireCourseEditor)`

### 3.5 Set Course Prerequisites
- **Method**: `PUT`
- **Path**: `/api/courses/:id/prereqs`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "prereqs": [10, 12]
}
```

### 3.6 Batch Reorder Courses
- **Method**: `PUT`
- **Path**: `/api/courses/order`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "category_id": 1,
  "ids": [105, 101, 102]
}
```

---

## 4. Chapters API

### 4.1 List Chapters by Course
- **Method**: `GET`
- **Path**: `/api/chapters?course_id=10`
- **Permission**: `Public (No Auth)`

### 4.2 Create Chapter
- **Method**: `POST`
- **Path**: `/api/chapters`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "course_id": 10,
  "tag": "Chapter 2",
  "title": "Differential Calculus",
  "slug": "chapter-2-differentiation",
  "summary": "Core theorems and geometric applications of derivatives"
}
```

### 4.3 Batch Reorder Chapters
- **Method**: `PUT`
- **Path**: `/api/chapters/order`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "course_id": 10,
  "ids": [101, 102, 103]
}
```

### 4.4 Batch Delete Chapters
- **Method**: `POST`
- **Path**: `/api/chapters/batch-delete`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "ids": [104, 105]
}
```
