````md
# Contributing to TinyTasks

Thanks for contributing to TinyTasks! This document explains how to set up the project locally, how we work with Git, and what standards we expect for commits and pull requests.

> **Important:** All pushes are reviewed via Pull Requests. Direct pushes to protected branches are not allowed (or should be avoided where protection isn’t available yet).

---

## Table of Contents

- [Getting Started](#getting-started)
- [Local Setup](#local-setup)
  - [Prerequisites](#prerequisites)
  - [Install Dependencies (Yarn or npm)](#install-dependencies-yarn-or-npm)
  - [Environment Variables](#environment-variables)
  - [Run the Project](#run-the-project)
- [Branching & Workflow](#branching--workflow)
- [Commit Conventions](#commit-conventions)
- [Pull Requests & Reviews](#pull-requests--reviews)
- [Code Quality](#code-quality)
- [Reporting Issues](#reporting-issues)

---

## Getting Started

Before you begin:
1. Read the PRD to understand the platform goals and constraints.
2. Pick an issue or task from the tracker (or ask for one).
3. Create a new branch from `develop` (or the current main development branch).

---

## Local Setup

### Prerequisites

Make sure you have:
- **Node.js** (LTS recommended)
- **Git**
- **Yarn** (optional) or **npm**
- **PostgreSQL** (for database)
- **Redis** (for caching, sessions, queues)

Optional but recommended:
- Docker (if the repo includes docker-compose later)

---

### Install Dependencies (Yarn or npm)

From the project root:

#### Using Yarn
```bash
yarn install
````

#### Using npm

```bash
npm install
```

> Use **one** package manager consistently in your local environment to avoid lockfile conflicts (`yarn.lock` vs `package-lock.json`).

---

### Environment Variables

Create a `.env` and using the `.env.example` you will get to add all the variables needed. Also take not that as we are building this project more variables may be added .


**Never commit `.env` files.** Use `.env.example` if you need to document required variables.

---

### Run the Project

Depending on repo structure, you may have separate commands for backend/frontend. Common examples:

#### Using Yarn

```bash
yarn dev
```

#### Using npm

```bash
npm run dev
```

---

## Branching & Workflow

### Protected Branches

* `main` — stable / release-ready
* `develop` — integration branch for active development (if used)

### Branch Naming

Use descriptive names:

* `feat/<short-description>` — new features
* `fix/<short-description>` — bug fixes
* `chore/<short-description>` — tooling/infra tasks
* `refactor/<short-description>` — refactors only

Examples:

* `feat/task-posting`
* `fix/paystack-webhook-verification`
* `chore/add-eslint-rules`

---

## Commit Conventions

We use **Conventional Commits** for clear history and easier changelogging.

**Format**

```
type(scope): short summary
```

### Types

* `feat` — a new feature
* `fix` — a bug fix
* `docs` — documentation changes only
* `chore` — tooling, configs, dependencies
* `refactor` — code change that neither fixes a bug nor adds a feature
* `test` — adding/fixing tests
* `perf` — performance improvements

### Scopes (examples)

Use a scope when relevant:

* `auth`, `tasks`, `payments`, `escrow`, `messaging`, `admin`, `verification`, `db`, `infra`

Examples:

* `feat(tasks): add task application endpoint`
* `fix(payments): handle duplicate paystack webhook events`
* `docs(readme): update local setup steps`
* `refactor(auth): simplify refresh token rotation`
* `test(tasks): add coverage for task selection lock`

### Commit Message Tips

* Keep the subject line **imperative**: “add”, “fix”, “update”
* Keep it short and specific
* Avoid “misc changes” or “updates”

---

## Pull Requests & Reviews

### All pushes are reviewed

* Open a PR for every change.
* At least **one reviewer approval** is required before merge.
* PRs should be small and focused. Prefer multiple small PRs over one giant PR.

### PR Checklist

Before requesting review:

* [ ] The code builds and runs locally
* [ ] Tests added/updated (where relevant)
* [ ] Linting passes (where configured)
* [ ] No secrets committed
* [ ] PR description explains **what** and **why**
* [ ] Screenshots included for UI changes (if applicable)

### PR Description Template

Use this structure in your PR description:

* **What changed**
* **Why it changed**
* **How to test**
* **Screenshots** (if UI)
* **Related issues** (e.g., `Closes #12`)

---

## Code Quality

* Follow existing patterns in the codebase
* Prefer readable code over clever code
* Keep business logic out of controllers where possible
* Use consistent error handling conventions
* Validate inputs (especially for auth, payments, and file uploads)
* Add tests for high-risk areas (payments, escrow, verification)

---

## Reporting Issues

If you find bugs or have feature ideas:

* Search existing issues first
* Include steps to reproduce
* Include logs/screenshots when possible
* Tag the relevant area: `auth`, `tasks`, `payments`, etc.

---

## Thank You

TinyTasks is a trust-first platform. Contributions should reflect that: correct behavior, safe defaults, and predictable systems.

```
```
