# Community Contributing Guide

Welcome to the MakiMath open-source community! Whether you are fixing bugs, proposing new features, authoring mathematics lectures, or improving bilingual documentation, we appreciate your contributions.

---

## Contribution Workflow

### 1. Standard Code Contribution Flow
1. **Fork the Repository**: Fork the target repo to your GitHub account:
   - Frontend: [MakiMath-Frontend](https://github.com/new-maki-math/MakiMath-Frontend)
   - Backend: [MakiMath-Backend](https://github.com/new-maki-math/MakiMath-Backend)
   - Documentation: [MakiMath-Docs](https://github.com/new-maki-math/MakiMath-Docs)
2. **Clone Locally**:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/MakiMath-Frontend.git
   cd MakiMath-Frontend
   ```
3. **Create a Working Branch**:
   ```bash
   git checkout -b feature/interactive-dag-controls
   # or for bug fixes:
   git checkout -b fix/editor-save-conflict
   ```
4. **Development & Verification**:
   - Install dependencies with `pnpm install`.
   - Run the local dev server (`pnpm dev`) for interactive verification.
   - Run test suites (`pnpm test`) to ensure regressions are caught.
5. **Commit Changes**:
   Follow the [Git Rules & Commit Conventions](./git-rules.md).
6. **Push & Open a Pull Request**:
   Push your branch and submit a PR against `main` on the official repository.

---

## Local Development Setup

### 1. Frontend SPA (`maki-math-frontend`)
```bash
cd maki-math-frontend
pnpm install
pnpm dev
```
Serves locally at `http://localhost:5173`.

### 2. Backend Service (`maki-math-backend`)
```bash
cd maki-math-backend
pnpm install

# Ensure PostgreSQL is running and .env configured
pnpm dev
# Run test suite
pnpm test
```
Serves at `http://localhost:3000` with native hot-reloading.

### 3. Documentation Site (`maki-math-docs`)
```bash
cd maki-math-docs
pnpm install
pnpm run docs:dev
# Verify build
pnpm run docs:build
```
Documentation dev server runs at `http://localhost:5173`.

---

## Reporting Issues & Feedback

Before creating an issue, search closed and ongoing issues:
- **Bug Reports**: Provide minimal reproducible steps, OS, browser version, and terminal/console logs.
- **Feature Requests**: Outline clear user stories, proposed workflows, and pedagogical benefits.

---

## Code of Conduct

MakiMath fosters an inclusive, professional, and respectful environment:
- Be respectful and constructive during technical reviews and discussions.
- We do not tolerate harassment, discriminatory language, or exclusionary behavior.
- Help us build better open-source tools for mathematical learning.
