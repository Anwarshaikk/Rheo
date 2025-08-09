# Rheo — Brand & Naming Rollout (v1.0)

*A crisp plan to adopt the new name everywhere and ship a professional brand, fast.*

---

## 1) Brand Core

**Name:** Rheo (from “flow”) — outcome‑focused, modern, pronounceable.

**Tagline options**

- From idea to invoice.
- Make revenue flow.
- Plan. Ship. Repeat.

**Product lexicon**

- **Rheo Pipeline** (stage‑gated workflow)
- **Rheo Packs** (vertical playbooks)
- **Rheo Studio** (Deliverable Factory)
- **Rheo Evidence Locker** (proof & artifacts)
- **Rheo Control Tower** (dashboard)
- **Rheo Connect** (integrations)
- **Rheo Agents** (orchestrated assistants)

---

## 2) Visual Identity (v1)

**Colors** (accessible, neutral + bold accent)

- Rheo Charcoal — `#0F172A`
- Rheo Ink — `#111827`
- Rheo Cloud — `#E5E7EB`
- Rheo Accent — `#2563EB` (alt: `#7C3AED` if you want purple)

**Typography**

- Headings: **Inter** or **Plus Jakarta Sans** (600/700)
- Body: **Inter** (400/500)
- Mono (code): **JetBrains Mono**

**Radius & motion**

- Corners: `rounded-2xl` for cards, `rounded-md` for inputs
- Motion: entrance/exit 0.25–0.35s, subtle spring; hover 0.15s

---

## 3) Wordmark & Monogram (inline SVG)

**Monogram R (SVG)** — drop into `/public/rheo-r.svg`

```svg
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="32" fill="#0F172A"/>
  <path d="M76 196V60h66c27 0 46 18 46 40 0 19-13 35-34 39l35 57h-32l-33-54H108v54H76zm32-80h34c12 0 20-8 20-16 0-9-8-16-20-16h-34v32z" fill="url(#g)"/>
</svg>
```

**Wordmark (SVG)** — drop into `/public/rheo-wordmark.svg`

```svg
<svg width="640" height="160" viewBox="0 0 640 160" xmlns="http://www.w3.org/2000/svg">
  <g fill="#0F172A">
    <text x="0" y="112" font-family="'Plus Jakarta Sans', Inter, sans-serif" font-size="112" font-weight="700">rheo</text>
  </g>
</svg>
```

---

## 4) Copy & Messaging (v1)

**Elevator:** *Rheo is the venture OS that makes revenue flow—agents, playbooks, and stage‑gated execution that get you from idea to invoice.*

**Homepage hero:**

- H1: *From idea to invoice.*
- H2: *Rheo sets up your stack, generates proposals, and runs GTM—backed by evidence‑based stage gates.*

**Component names in UI:** Pipeline ▸ Studio ▸ Evidence Locker ▸ Control Tower ▸ Connect ▸ Packs ▸ Agents.

---

## 5) Domain & Handles (to check)

> Availability not verified here—run your registrar and social checks.

- **rheo.app**, **userheo.com**, **getrheo.com**, **rheoos.com**, **rheo.run**
- Socials: `@rheoapp`, `@rheo_os`, `@rheoHQ`

---

## 6) Rollout Plan (Find/Replace + Artifacts)

**A. Codebase & Docs (Day 0)**

1. Rename repo: `venture-os` → `rheo` (or `rheo-app`).
2. Global find/replace:
   - "AI Venture OS" → "Rheo"
   - "Venture OS" → "Rheo"
   - `VentureOS` → `Rheo` (identifiers)
3. Update app metadata (Next.js): title/description, favicon, SVGs above.
4. Update docs: README, ARCHITECTURE, UX, API, LOGGING, CHANGELOG, ADRs.
5. Update canvas document titles in this workspace.

**B. Firestore & Auth (Day 0–1)**

- No collection rename needed; brand is UI‑level.
- Update email templates (invite/reset) to "Rheo".

**C. Marketing (Day 1–2)**

- Landing hero copy (above), brand images (SVGs), favicon.
- Case study template: switch to Rheo name & colors.

**D. Product UI (Day 1–3)**

- Replace labels: Pipeline, Studio, Evidence Locker, Control Tower, Connect, Packs, Agents.
- Accent color to `#2563EB` (or your chosen accent).

---

## 7) CLI‑Ready Rename Commands

**macOS/Linux (git + sed)**

```bash
# repo rename is manual on Git hosting; locally:
git remote rename origin origin-old
# find/replace (review with git diff afterwards)
grep -rl "AI Venture OS" . | xargs sed -i '' 's/AI Venture OS/Rheo/g'
grep -rl "Venture OS" . | xargs sed -i '' 's/Venture OS/Rheo/g'
```

**Windows PowerShell**

```powershell
Get-ChildItem -Recurse -File | ForEach-Object {
  (Get-Content $_.FullName) -replace 'AI Venture OS','Rheo' -replace 'Venture OS','Rheo' | Set-Content $_.FullName
}
```

---

## 8) UI Tokens (drop into Tailwind theme)

```ts
// tailwind.config.ts (extend)
colors: {
  rheo: {
    charcoal: '#0F172A',
    ink: '#111827',
    cloud: '#E5E7EB',
    accent: '#2563EB',
  }
},
borderRadius: { 'xl': '1rem', '2xl': '1.25rem' },
transitionDuration: { 'fast': '150ms', 'normal': '250ms', 'slow': '350ms' },
```

---

## 9) Acceptance Criteria for Rollout

- All UI strings and docs say **Rheo** (no "Venture OS").
- New favicon + SVGs in place; hero updated.
- README/ARCHITECTURE updated; CHANGELOG logs rename.
- Deployed preview uses Rheo wordmark and accent color.

---

## 10) Next Steps

- Lock domain + social handles.
- Merge rename PR.
- Update canvas documents’ titles and contents to **Rheo** on next edit pass.
- Start using **Rheo** in outreach sequences and proposal templates.

*End of rollout — v1.0.*

