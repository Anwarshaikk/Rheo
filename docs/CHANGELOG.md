# Changelog

This log tracks all major changes and milestones for the Rheo project.

---

## Sprint 1: Foundation & Core Loop (2025-08-09)

### Key Outcomes
- Shipped a multi-tenant web app with a functional core loop: **Create Project → Add Evidence → Evaluate Gates**.
- Implemented a "Glossy Bright" UI theme with custom components.
- Established a full suite of project documentation (`API`, `ARCHITECTURE`, `UX`, etc.).
- Set up Firebase for auth, database, and hosting.

### Commits
- `chore: initial project setup`
- `feat: implement data schemas and seed script`
- `feat: create initial API route handlers`
- `fix: suppress hydration warnings caused by browser extensions`
- `refactor: apply UI/UX improvements from feedback`
- `feat: implement deliverable factory for proposals`
- `feat: implement evidence drawer and gate evaluation`
- `feat: implement auth guard and deploy firestore rules`
- `feat: implement all API routes and connect to frontend`
- `docs: update all documentation for sprint 1`

### Notable Changes
- **Scaffolding:** Initialized Next.js 14, installed all dependencies, and configured `shadcn/ui`.
- **Firebase:** Set up Firebase Auth, Firestore (with rules), and Hosting. Manually configured `.firebaserc` and `firebase.json`.
- **UI/UX:**
    - Implemented the "Glossy Bright" theme with CSS variables and a `RheoCard` glass component.
    - Created custom `RheoButton` and `GateChip` components.
    - Built the main two-column layout for the pipeline board and side panels.
    - Added `framer-motion` for entrance animations.
- **Backend:**
    - Implemented API routes for creating projects, deliverables, and evidence.
    - Built the core gate evaluation logic in the `/api/evaluate` endpoint.
    - Created a centralized logging helper to record events to Firestore.
- **Frontend:**
    - Connected the UI to the backend API routes.
    - Implemented real-time data fetching from Firestore using `onSnapshot`.
    - Added a `withAuth` HOC and `useAuth` hook to protect routes.
- **Bug Fixes:**
    - Resolved multiple module-not-found errors by installing missing dependencies (`class-variance-authority`, `clsx`, `tailwind-merge`).
    - Fixed a React hydration error by adding `suppressHydrationWarning`.
    - Corrected a `ReferenceError` for an undefined `useToast` hook.
- **Documentation:** Created and populated all required project documents.

