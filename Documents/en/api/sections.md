# Sections & Typst Source API

Sections are the core operational units delivering Typst lecture notes, theorem environments, and mathematical proofs. This document outlines metadata retrieval, reading endpoints, version-locked Typst persistence, DAG prerequisite networks, and batch operations.

---

## 1. Get Lecture Document & Pre-Parsed AST (Core Reader API)
- **Method**: `GET`
- **Path**: `/api/sections/:id/doc`
- **Permission**: `Public (No Auth)` (for `live` published courses; unpublished drafts require editor login)
- **Description**: The primary endpoint for students reading lecture material. Returns metadata, outline hierarchy, raw Typst source, and pre-parsed AST JSON.

### Response
```json
{
  "id": 1001,
  "chapter_id": 101,
  "course_id": 10,
  "slug": "equivalent-infinitesimal",
  "tag": "1.1",
  "title": "Equivalent Infinitesimal Substitution",
  "summary": "Master core substitution formulas and multiplication/division criteria",
  "pos": 0,
  "prereqs": [1000],
  "source": "#thm(\"Fundamental Substitution Theorem\")[As $x -> 0$, if $alpha(x) ~ alpha'(x)$...]",
  "source_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "chapter_title": "Functions, Limits & Continuity",
  "chapter_tag": "Chapter 1",
  "course_title": "Calculus I: Intensive Notes",
  "doc": {
    "title": "Equivalent Infinitesimal Substitution",
    "blocks": [
      {
        "type": "theorem",
        "title": "Fundamental Substitution Theorem",
        "body": "As $x -> 0$..."
      }
    ]
  }
}
```

---

## 2. List Sections by Chapter
- **Method**: `GET`
- **Path**: `/api/sections?chapter_id=101`
- **Permission**: `Public (No Auth)`
- **Description**: Used by navigation sidebars; omits large raw `source` strings to conserve bandwidth.

### Response
```json
[
  {
    "id": 1001,
    "chapter_id": 101,
    "slug": "equivalent-infinitesimal",
    "tag": "1.1",
    "title": "Equivalent Infinitesimal Substitution",
    "pos": 0,
    "prereqs": [1000],
    "source_len": 1824,
    "has_source": true,
    "source_hash": "e3b0c442..."
  }
]
```

---

## 3. Save Typst Source (Concurrency Version Lock)
- **Method**: `PUT`
- **Path**: `/api/sections/:id/source`
- **Permission**: `Course Editor (requireCourseEditor)`
- **Description**: Triggered when authors press `Ctrl + S` in the workbench. Saves raw Typst content and recalculates the SHA-256 digest.

### Request Body
```json
{
  "source": "== 1.1 Equivalent Infinitesimal Substitution\n\n#thm(\"Core Theorem\")[As $x -> 0$...]"
}
```

### Response
```json
{
  "id": 1001,
  "source_hash": "8f3b5c1a9e...",
  "source_len": 2410,
  "updated_at": "2026-10-24T12:00:00.000Z"
}
```

---

## 4. Set Section DAG Prerequisites
- **Method**: `PUT`
- **Path**: `/api/sections/:id/prereqs`
- **Permission**: `Course Editor (requireCourseEditor)`
- **Description**: Specifies the array of prerequisite section IDs necessary to understand this section. The system rejects self-prerequisites and non-existent IDs.

### Request Body
```json
{
  "prereqs": [998, 999]
}
```

### Response
```json
{
  "id": 1001,
  "prereqs": [998, 999]
}
```

---

## 5. Metadata Operations

### 5.1 Create Section
- **Method**: `POST`
- **Path**: `/api/sections`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "chapter_id": 101,
  "title": "Taylor Polynomials & Expansions",
  "slug": "taylor-formula",
  "tag": "1.2",
  "summary": "Peano vs. Lagrange remainder comparison",
  "source": ""
}
```

### 5.2 Update Section Metadata
- **Method**: `PATCH`
- **Path**: `/api/sections/:id`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "title": "Taylor Polynomials & Series Expansions",
  "summary": "Includes recent proof techniques"
}
```

### 5.3 Delete Section
- **Method**: `DELETE`
- **Path**: `/api/sections/:id`
- **Permission**: `Course Editor (requireCourseEditor)`

---

## 6. Batch Operations

### 6.1 Batch Reorder Sections
- **Method**: `PUT`
- **Path**: `/api/sections/order`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "chapter_id": 101,
  "ids": [1002, 1001, 1003]
}
```

### 6.2 Batch Move Sections to Target Chapter
- **Method**: `POST`
- **Path**: `/api/sections/batch-move`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "target_chapter_id": 102,
  "ids": [1005, 1006]
}
```

### 6.3 Batch Copy Sections
- **Method**: `POST`
- **Path**: `/api/sections/batch-copy`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "target_chapter_id": 102,
  "ids": [1001]
}
```

### 6.4 Batch Delete Sections
- **Method**: `POST`
- **Path**: `/api/sections/batch-delete`
- **Permission**: `Course Editor (requireCourseEditor)`

#### Request Body
```json
{
  "ids": [1010, 1011]
}
```
