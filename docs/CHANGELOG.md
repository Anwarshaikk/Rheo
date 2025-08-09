# Changelog

## Sprint 1 - Day 1 (2025-08-09)

### Commits
- `chore: initial project setup`
- `feat: implement data schemas and seed script`

### Notable Changes
- Cloned the initial empty repository.
- Scaffolded the Next.js 14 application (`--ts`, `--tailwind`, `--app`, `--src-dir`).
- Installed all production dependencies (`firebase`, `react-hook-form`, `zod`, `shadcn/ui`, etc.).
- Installed all development dependencies (`firebase-tools`, `vitest`, `playwright`, `husky`, etc.).
- Configured `shadcn/ui` by creating `components.json` and adding all specified UI components.
- Manually configured Firebase by creating `.firebaserc` and `firebase.json` to enable Firestore and Hosting for Next.js (SSR).
- Created the initial `firestore.rules` file.
- Added the `.env.local` file with the provided API key.
- Created Zod schemas for all Firestore collections (`orgs`, `projects`, `stages`, `gates`, `deliverables`, `evidence`, `logs`).
- Created the initial seeder script (`scripts/seed.ts`) with the data for the initial project gates.