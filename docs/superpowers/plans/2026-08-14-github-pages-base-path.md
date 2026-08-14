# GitHub Pages Base Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the exported Next.js site work under `/My-Portfolio` on GitHub Pages while preserving the root URL during local development.

**Architecture:** Let Next.js derive its base path from the environment already supplied by GitHub Actions. Keep all existing static-export settings unchanged and verify the configuration through the production build.

**Tech Stack:** Next.js 16, TypeScript, GitHub Actions

## Global Constraints

- Use `/My-Portfolio` only when `GITHUB_ACTIONS` is present.
- Keep local development at `http://localhost:3000/`.
- Do not add dependencies or modify application components.
- Do not commit changes unless explicitly requested.

---

### Task 1: Configure the GitHub Pages base path

**Files:**
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: GitHub Actions' built-in `GITHUB_ACTIONS` environment variable.
- Produces: Next.js `basePath` configuration with the value `/My-Portfolio` in GitHub Actions and an empty string elsewhere.

- [ ] **Step 1: Record the current baseline**

Run:

```bash
rg -n 'basePath' next.config.ts
```

Expected: no matches, confirming that the required configuration is absent.

- [ ] **Step 2: Add the minimal configuration**

Add this property to the existing `nextConfig` object:

```ts
basePath: process.env.GITHUB_ACTIONS ? "/My-Portfolio" : "",
```

- [ ] **Step 3: Verify the production build**

Run:

```bash
npm run build
```

Expected: the Next.js static export completes successfully and writes `out/`.

- [ ] **Step 4: Inspect the focused diff**

Run:

```bash
git diff --check
git diff -- next.config.ts
```

Expected: no whitespace errors and only the intended `basePath` configuration change in `next.config.ts`.
