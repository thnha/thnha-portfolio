# GitHub Pages Base Path Design

## Goal

Deploy the portfolio at `https://thnha.github.io/My-Portfolio/` without breaking
the existing local development URL at `http://localhost:3000/`.

## Design

Update `next.config.ts` so `basePath` is `/My-Portfolio` only when
`GITHUB_ACTIONS` is present. GitHub Actions provides this environment variable,
while normal local development does not.

The existing static export, trailing-slash, and unoptimized-image settings stay
unchanged. No application components or routes need modification.

## Verification

Run `npm run build` locally and confirm the static export succeeds. The local
build intentionally uses an empty base path. The deployment workflow's GitHub
Actions environment applies `/My-Portfolio` during its build.

## Scope

This change does not add custom-domain handling or alter the GitHub Actions
workflow.
