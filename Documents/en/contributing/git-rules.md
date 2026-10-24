# Git Rules & Commit Conventions

To maintain a clean, traceable, and automated Git history across the MakiMath ecosystem, all contributors must adhere to the following branching and commit conventions.

## Branching Strategy

MakiMath follows a streamlined trunk-based branching workflow:

```
main (Protected Trunk) ────────────────────────────────────> (Production)
       │                                            ▲
       ├─────> feature/dag-zoom-controls ───────────┤ (PR Merge)
       │                                            │
       └─────> fix/section-slug-duplicate ──────────┘
```

- **`main` Branch**: The primary protected branch. All releases are cut from `main`. **Direct pushes and force pushes are strictly disabled**.
- **Feature Branches (`feature/<feature-name>`)**: Branch from `main` to develop new capabilities (e.g. `feature/workbench-shortcuts`).
- **Fix Branches (`fix/<bug-name>`)**: Used for patch and bug fixes (e.g. `fix/audit-log-ip-parse`).
- **Docs Branches (`docs/<topic>`)**: Used for bilingual documentation updates (e.g. `docs/api-permissions-matrix`).
- **Refactor Branches (`refactor/<module>`)**: For architectural refactoring without functional changes (e.g. `refactor/d3-graph-layout`).

## Conventional Commits Specification

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) structure:

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### 1. Types

| Type | Description | Use Case |
|---|---|---|
| **`feat`** | New Feature | Introduces new functionality for users or API consumers. |
| **`fix`** | Bug Fix | Patches an issue or corrects unexpected behavior. |
| **`docs`** | Documentation | Updates to documentation, guides, README, or docstrings. |
| **`style`** | Code Formatting | White-space, semicolon formatting; zero functional impact. |
| **`refactor`** | Refactoring | Code restructuring without adding features or fixing bugs. |
| **`perf`** | Performance | Optimizations that improve speed or reduce memory consumption. |
| **`test`** | Testing | Adding or updating unit/integration tests. |
| **`chore`** | Maintenance | Tooling, build pipeline, dependency upgrades. |

### 2. Recommended Scopes

Common scopes include:
- `auth`: Authentication, JWT, and session management
- `courses`: Courses, outlines, and category metadata
- `sections`: Sections, Typst documents, and versions
- `dag`: Prerequisite graph deduction and rendering
- `workbench`: Collaborative authoring workspace
- `crypto`: Communication middlewares
- `deploy`: Nginx, PM2, and deployment scripts

### 3. Commit Examples

#### Good Examples
```
feat(sections): add batch copy endpoint across chapters
fix(auth): handle expired refresh token gracefully
docs(api): update master permission summary table
perf(typesetting): debounce live preview compiler to 300ms
refactor(pool): standardize database error mapping
```

#### Bad Examples
```
update code              # Too vague
fix bug                  # Does not specify the defect
WIP                      # Never merge WIP commits into main
feat: 12345              # Meaningless description
```

## Security Red Lines

> [!CAUTION] Strictly Prohibit Sensitive Credential Leaks
> - **Never commit `.env` files**: Local configurations, production database credentials, and JWT secrets must remain gitignored.
> - **Never commit certificates & private keys**: SSL/TLS keys (`.pem`, `.key`, `.crt`) must never enter version control.
> - If credentials are leaked accidentally, a simple revert commit is insufficient; immediately alert administrators to invalidate and rotate the affected secrets.
