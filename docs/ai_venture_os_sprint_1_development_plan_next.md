# AI Venture OS — Sprint 1 Development Plan (Next.js + Firestore + GCP)

**Audience:** Gemini CLI acting as the sole developer. Treat these instructions as the source of truth. Produce code, logs, and docs exactly as specified.

**Goal (7 days):** Ship a multi‑tenant web app (Next.js 14 + Firestore) that can:

1. Create an **Org** and **Project**.
2. Render a **Stage Pipeline** (Validate → Plan → Set Up → Launch → Run) with **gate** checklists.
3. Generate a **Proposal deliverable** (markdown stored in Firestore; PDF export later).
4. Add **Evidence** (invoice URL, signed link, note) and **evaluate gates**.
5. Maintain structured **logs** and **clear documentation** for every step.

We intentionally **cap connectors at 4 (stubs)**: HubSpot *or* Pipedrive (pick one), Stripe (payment link), Google (Drive), DocuSign. Full OAuth is deferred; create stubs and interface contracts.

---

## 0) Engineering Principles

- **Action > chat.** Every feature includes: schema → UI → API/Server action → log → docs.
- **Evidence‑gated:** Never mark a gate “passed” without required evidence kinds present.
- **Range‑based estimates; exact logging.**
- **Security by default:** Firebase Auth required, Firestore rules enforced, secrets only via env or Secret Manager.

---

## 1) Tech Stack & Versions

- **Runtime:** Node.js 20.x, TypeScript 5.x
- **Web:** Next.js 14 (App Router), Tailwind CSS, **shadcn/ui**, Framer Motion, TanStack Query, React Hook Form, Zod
- **Data:** Firebase Auth, Firestore, Cloud Storage (for future PDFs)
- **Infra:** Firebase Hosting (SSR) *or* Cloud Run (choose Hosting first for speed)
- **QA:** Vitest + Testing Library (unit), Playwright (smoke E2E)
- **Lint/Format:** ESLint + Prettier, Husky pre‑commit hooks

---

## 2) Repository Layout

```
venture-os/
├─ src/                          # Next.js (app router)
│  ├─ app/
│  │  ├─ (auth)/login/page.tsx   # Firebase Auth UI
│  │  ├─ app/(dash)/layout.tsx   # Authenticated layout
│  │  ├─ app/(dash)/projects/[id]/page.tsx  # Pipeline board
│  │  ├─ api/                    # Route handlers
│  │  │  ├─ projects/route.ts    # POST create project
│  │  │  ├─ evidence/route.ts    # POST add evidence
│  │  │  └─ evaluate/route.ts    # POST evaluate gates
│  ├─ components/                # UI components (shadcn based)
│  ├─ lib/                       # firebase.ts, firestore.ts, logging.ts
│  ├─ schemas/                   # zod types mirror Firestore docs
│  └─ styles/                    # globals.css
├─ docs/                         # living documentation (see §9)
├─ scripts/                      # seed, exports
├─ tests/                        # unit/e2e tests
├─ firebase.json                 # Hosting config
├─ firestore.rules               # Security rules
├─ .env.local.example
└─ package.json
```

---

## 3) Firestore Data Model (v1)

**Collections & fields** (all docs include: `orgId`, `createdAt`, `updatedAt`, `createdBy`):

- `orgs/{orgId}`: { name, billingTier }
- `projects/{projectId}`: { orgId, name, vertical: 'b2b-agency', stageOrder: ["Validate","Plan","Set Up","Launch","Run"] }
- `stages/{stageId}`: { orgId, projectId, name, gateIds: [] }
- `gates/{gateId}`: { orgId, projectId, stageId, name, requiredEvidence: ["note"|"invoice\_url"|"signed\_link"], passed: false }
- `deliverables/{deliverableId}`: { orgId, projectId, kind: 'proposal'|'sow'|'onboarding', title, contentMd }
- `evidence/{evidenceId}`: { orgId, projectId, kind, url?, note? }
- `logs/{logId}`: { orgId, projectId?, actor, event, level:'INFO'|'WARN'|'ERROR', payload, durationMs?, error? }

**Seed gates (for new projects):**

- Validate → Gate: "ICP defined" requires `note`
- Plan → "Offer & price" requires `note`
- Launch → "Proposal sent" requires `signed_link`
- Run → "Invoice paid" requires `invoice_url`

**Sample document (deliverable):**

```json
{
  "orgId":"org_123","projectId":"prj_123","kind":"proposal",
  "title":"Proposal — Pipeline Starter Pack","contentMd":"# Proposal..."
}
```

---

## 4) Security Rules (minimum viable)

`firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function inOrg(orgId) { return request.auth != null && request.auth.token.orgs[orgId] == true; }

    match /orgs/{orgId} {
      allow read, write: if inOrg(orgId);
    }
    match /{colName}/{docId} {
      allow read, write: if request.auth != null &&
        (resource.data.orgId in request.auth.token.orgs || request.resource.data.orgId in request.auth.token.orgs);
    }
  }
}
```

---

## 5) Environment & Config

`.env.local.example`

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Init commands (Windows‑friendly):**

```powershell
npx create-next-app@latest venture-os --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
cd venture-os
npm i framer-motion @tanstack/react-query zod react-hook-form @hookform/resolvers lucide-react recharts firebase
npx shadcn@latest init -y
npx shadcn@latest add button card input textarea dialog dropdown-menu checkbox badge toast tooltip tabs separator sheet alert progress
npm i -D firebase-tools vitest @testing-library/react @testing-library/jest-dom @types/node @types/react prettier eslint-config-next husky lint-staged
```

**Firebase setup**

```powershell
firebase login
firebase init firestore hosting
```

---

## 6) UI/UX Scope (Sprint 1)

**Pages**

- `/login` — Google sign‑in (Firebase UI), redirect to `/app/projects/new` or last project
- `/app/projects/[id]` — **Pipeline Board** with:
  - Stage columns (Validate, Plan, Set Up, Launch, Run)
  - Gate chips: label + status (Pending/Passed)
  - **Evaluate** button (server action) that checks evidence kinds
  - **Deliverable Factory** panel (create Proposal → writes to `deliverables`)
  - **Evidence Drawer** (add invoice URL, signed link, note)

**Components (shadcn)**

- `StageColumn`, `GateChip`, `DeliverableFactory`, `EvidenceForm`, `TopNav`, `Toast`

**Acceptance Criteria (UI)**

- Creating a project seeds stages/gates; board renders within 200ms from Firestore cache
- Adding evidence updates chips after evaluate action
- Proposal creation persists to Firestore and shows a toast with doc ID

---

## 7) Server Actions / Route Handlers

**Create Project** `POST /api/projects`

- Input: `{ name, orgId, vertical }`
- Behavior: create project, 4 stages, seed gates; log `project.created`
- Output: `{ projectId }`

**Add Evidence** `POST /api/evidence`

- Input: `{ orgId, projectId, kind, url?, note? }`
- Behavior: write doc; log `evidence.added`

**Evaluate Gates** `POST /api/evaluate`

- Input: `{ projectId, stageId }`
- Behavior: fetch stage gates and project evidence; set `passed` when all required kinds present; log `stage.evaluated`
- Output: `{ passedGates: number }`

**Logging Helper** `lib/logging.ts`

```ts
export async function log(event:string, level:'INFO'|'WARN'|'ERROR', payload:any, orgId:string, projectId?:string){ /* write to /logs */ }
```

---

## 8) Deliverable Factory (Proposal v1)

- Template file: `src/templates/proposal_agency.md`
- Server action fills tokens: `{ clientName, yourCompany, priceRange, docusignLink }`
- Stores markdown in `deliverables` with `kind='proposal'`
- Acceptance: doc created; link displayed; log `deliverable.created`

Template starter:

```md
# Proposal — Pipeline Starter Pack (30 Days)
**Client:** {{clientName}}
**Prepared by:** {{yourCompany}}

## Scope
- ICP definition workshop
- Outbound sequences (email + LinkedIn)
- HubSpot pipeline & booking setup
- Proposal + e‑sign + Stripe payment link

## Proof‑of‑Value
Pay only if an invoice is collected in ≤30 days (see SOW).
```

---

## 9) Documentation Requirements (Gemini must produce)

Create and maintain the following files during Sprint 1:

- `docs/README.md` — how to run locally, env setup, Firebase steps
- `docs/ARCHITECTURE.md` — modules, data model, request flow, auth
- `docs/UX.md` — screenshots/GIFs, component map, motion tokens
- `docs/API.md` — each route handler: request/response, examples
- `docs/LOGGING.md` — event names, log schema, sampling
- `docs/CHANGELOG.md` — **keep daily entries** (date, commits, notable changes)
- `docs/DECISIONS/ADR-0001.md` — "Choose Firebase Hosting SSR for v1"

Each commit **must** update relevant docs. Missing docs = task incomplete.

---

## 10) Logging & Telemetry Spec

**Event schema**

```json
{
  "timestamp": "ISO8601",
  "orgId": "org_123",
  "projectId": "prj_123",
  "actor": "uid_abc",
  "event": "project.created|deliverable.created|evidence.added|stage.evaluated",
  "level": "INFO|WARN|ERROR",
  "payload": {"durationMs": 42, "count": 1, "notes": "..."},
  "error": null
}
```

**Where:** write to Firestore `logs` and `console`. Add a daily export script in `scripts/` that dumps logs to JSON.

---

## 11) Testing

- **Unit (Vitest):** schemas, route handlers
- **E2E (Playwright):** create project → add evidence → evaluate gates → create proposal
- CI step must run `npm run test` and report pass/fail

---

## 12) CI/CD & Deploy

**Firebase Hosting (SSR)** (preferred v1)

```
firebase experiments:enable webframeworks
firebase deploy
```

**Cloud Run (optional):** add `Dockerfile`, build & deploy via `gcloud run deploy`.

**Git rules**

- Conventional Commits (`feat:`, `fix:`, `docs:`).
- PR title = task id + summary. (Solo dev still uses PRs to generate docs.)

---

## 13) Day‑by‑Day Plan (Sprint 1)

**Day 1** — Scaffold project, auth, Tailwind/shadcn, Firebase init; write `README.md`.\
**Day 2** — Data model + route handlers; seed stages/gates; `ARCHITECTURE.md`.\
**Day 3** — Pipeline board UI; evaluate action; `UX.md` with screenshots.\
**Day 4** — Deliverable Factory (proposal); logs for all actions; `API.md`.\
**Day 5** — Evidence drawer + evaluate; unit tests (Vitest); polish.\
**Day 6** — E2E smoke (Playwright); deploy to Firebase Hosting; `DEPLOYMENT` section in README.\
**Day 7** — Buffer, bugfixes, refactor, finalize docs; demo script.

---

## 14) Definition of Done (Sprint 1)

- ✅ Auth works and guards all app routes
- ✅ Create Project → stages/gates seeded
- ✅ Pipeline board renders with gate status
- ✅ Add Evidence → Evaluate marks gates correctly
- ✅ Create Proposal deliverable saved in Firestore
- ✅ Logs written for all critical events
- ✅ Docs complete; tests passing; deployed preview URL available

---

## 15) Out‑of‑Scope (Sprint 1)

- Full OAuth for connectors (keep stubs)
- PDF export of proposal (Sprint 2)
- QuickBooks integration, dashboard charts, marketplace

---

## 16) Machine‑Readable Task List (for Gemini)

```json
{
  "sprint": 1,
  "objectives": ["Stage pipeline with gates","Deliverable Factory (proposal)","Evidence + evaluate","Auth + Firestore rules","Logging + docs"],
  "tasks": [
    {"id":"S1-001","title":"Scaffold Next.js app & Firebase","type":"chore","acceptance":"App boots locally; Firebase initialized; README updated"},
    {"id":"S1-002","title":"Implement data schemas & seeders","type":"feat","acceptance":"Creating project seeds stages/gates; unit tests pass"},
    {"id":"S1-003","title":"Route handlers: projects/evidence/evaluate","type":"feat","acceptance":"POST endpoints return expected shapes; logs written"},
    {"id":"S1-004","title":"Pipeline board UI","type":"feat","acceptance":"Stages render; gate chips reflect status; evaluate updates state"},
    {"id":"S1-005","title":"Deliverable Factory (proposal)","type":"feat","acceptance":"Proposal doc saved; toast contains ID; log event emitted"},
    {"id":"S1-006","title":"Evidence drawer & evaluation","type":"feat","acceptance":"Adding invoice URL and signed link satisfies gates"},
    {"id":"S1-007","title":"Auth guard & Firestore rules","type":"sec","acceptance":"Unauthenticated access blocked in routes and UI"},
    {"id":"S1-008","title":"Testing & deploy","type":"qa","acceptance":"Vitest + Playwright pass in CI; deployed preview URL; docs updated"}
  ]
}
```

---

## 17) Demo Script (for review)

1. Sign in → create project → see stages.
2. Open Deliverable Factory → create proposal → log shows `deliverable.created`.
3. Add `signed_link` evidence → Evaluate **Launch** gate → status flips to Passed.
4. Add `invoice_url` evidence → Evaluate **Run** gate → Passed.
5. Open Logs page (or export JSON) and show structured entries.

---

**Gemini CLI — Operating Rules**

- After each task, **append a log** entry to `docs/CHANGELOG.md` and commit using Conventional Commits.
- If a decision is made (library, API shape), create an **ADR** in `docs/DECISIONS/`.
- Keep code comments concise and practical; reference `docs/API.md` for route shapes.
- Any crash or error must produce a log with stack snippet and remediation notes in `docs/LOGGING.md`.

