# Rheo — Glossy Bright UI Themes (Spec v1.0)

**Goal:** Ship a glossy, bright‑but‑not‑too‑bright UI with diverse colors. This spec provides palettes, tokens, motion, and code stubs so Gemini CLI can implement fast using **Next.js + Tailwind + shadcn/ui + Framer Motion**.

---

## 1) Design principles

- **Glossy, not gaudy:** high‑key backgrounds, subtle glass, soft gradients, strong contrast for text.
- **Diverse accents:** multiple accent hues that rotate by context (Pipeline, Studio, Evidence, Connect, Packs, Agents).
- **Accessible:** WCAG AA for body text (≥4.5:1), large text ≥3:1. Avoid pure white on bright accents.
- **Depth:** one elevation system (shadows + borders) and one glass recipe (backdrop blur + 1px inside border).

---

## 2) Theme lineup (pick one default; all share core tokens)

**A. Rheo Aurora (cool, modern)** — blues ↔ purples. **B. Rheo Prism (balanced multicolor)** — rotating accents per module. **C. Rheo Sunset (warm, optimistic)** — oranges ↔ pinks. **D. Rheo Tropic (diverse, playful)** — teal/green/coral accents.

Each theme exposes the same CSS variables; only values change.

---

## 3) Core tokens (shared across themes)

```css
:root {
  /* Base neutrals */
  --rheo-bg: #f8fafc;            /* page */
  --rheo-surface: #ffffff;       /* cards */
  --rheo-text: #0f172a;          /* primary text */
  --rheo-subtle: #334155;        /* secondary text */
  --rheo-border: rgba(15,23,42,0.08);
  --rheo-ring: rgba(37,99,235,0.35);

  /* Glass recipe */
  --rheo-glass-bg: rgba(255,255,255,0.65);
  --rheo-glass-blur: 10px;
  --rheo-glass-border: rgba(255,255,255,0.6);
  --rheo-glass-shadow: 0 10px 25px rgba(2,6,23,0.08);

  /* Radii & motion */
  --rheo-radius-sm: 10px;
  --rheo-radius-md: 14px;
  --rheo-radius-lg: 20px;
  --rheo-ease: cubic-bezier(.2,.8,.2,1);
  --rheo-dur-fast: 150ms;
  --rheo-dur: 250ms;
}
```

---

## 4) Theme palettes (CSS variables)

### 4.1 Aurora (default)

```css
[data-theme="aurora"]{
  --rheo-accent: #2563eb; /* blue-600 */
  --rheo-accent-2: #7c3aed; /* violet-600 */
  --rheo-grad-1: linear-gradient(135deg,#93c5fd 0%,#c4b5fd 100%);
}
```

### 4.2 Prism (module‑based accents)

```css
[data-theme="prism"]{
  --rheo-accent: #2563eb; /* default */
  --rheo-pipeline: #2563eb; /* blue */
  --rheo-studio:   #22c55e; /* green */
  --rheo-evidence: #f59e0b; /* amber */
  --rheo-connect:  #06b6d4; /* cyan */
  --rheo-packs:    #a855f7; /* purple */
  --rheo-agents:   #ef4444; /* red */
}
```

### 4.3 Sunset

```css
[data-theme="sunset"]{
  --rheo-accent: #f97316; /* orange-500 */
  --rheo-accent-2: #ec4899; /* pink-500 */
  --rheo-grad-1: linear-gradient(135deg,#fed7aa 0%,#fbcfe8 100%);
}
```

### 4.4 Tropic

```css
[data-theme="tropic"]{
  --rheo-accent: #10b981; /* emerald-500 */
  --rheo-accent-2: #14b8a6; /* teal-500 */
  --rheo-grad-1: linear-gradient(135deg,#a7f3d0 0%,#99f6e4 100%);
}
```

---

## 5) Tailwind extensions

```ts
// tailwind.config.ts (add to theme.extend)
colors: {
  rheo: {
    bg: 'var(--rheo-bg)',
    surface: 'var(--rheo-surface)',
    text: 'var(--rheo-text)',
    subtle: 'var(--rheo-subtle)',
    border: 'var(--rheo-border)',
    accent: 'var(--rheo-accent)'
  }
},
borderRadius: {
  DEFAULT: 'var(--rheo-radius-md)',
  lg: 'var(--rheo-radius-lg)',
  md: 'var(--rheo-radius-md)',
  sm: 'var(--rheo-radius-sm)'
},
boxShadow: {
  rheo: '0 10px 25px rgba(2,6,23,0.08)',
  rheoLg: '0 25px 50px rgba(2,6,23,0.10)'
},
```

Add global classes:

```css
/* glossy card */
.rheo-glass { background: var(--rheo-glass-bg); backdrop-filter: blur(var(--rheo-glass-blur));
  -webkit-backdrop-filter: blur(var(--rheo-glass-blur)); border: 1px solid var(--rheo-glass-border);
  box-shadow: var(--rheo-glass-shadow); }

/* gradient header */
.rheo-hero { background: var(--rheo-grad-1); }
```

---

## 6) Example components (shadcn‑ready)

### 6.1 Button

```tsx
export function RheoButton({children,...props}){
  return (
    <button {...props} className="inline-flex items-center rounded-md px-4 py-2 font-medium text-white"
      style={{background: 'linear-gradient(180deg, var(--rheo-accent), rgba(0,0,0,0.2))', boxShadow:'0 6px 16px rgba(37,99,235,.35)'}}>
      {children}
    </button>
  )
}
```

### 6.2 Card (glass)

```tsx
export function RheoCard({title,children}:{title:string,children:React.ReactNode}){
  return (
    <div className="rheo-glass rounded-lg p-4">
      <div className="text-sm font-semibold text-rheo-subtle mb-2">{title}</div>
      <div>{children}</div>
    </div>
  )
}
```

### 6.3 Top bar

```tsx
export function RheoTopBar(){
  return (
    <header className="rheo-glass sticky top-0 z-50 flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        <img src="/rheo-r.svg" className="h-6 w-6"/>
        <span className="font-semibold">Rheo</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-sm px-3 py-1 rounded-md border" data-theme-switch>Theme</button>
      </div>
    </header>
  )
}
```

---

## 7) Motion & micro‑interactions

- **Cards:** fade+rise (8px) on mount (0.25s, `var(--rheo-ease)`).
- **Buttons:** press states translateY(1px) + reduce shadow.
- **Pipeline drag/hover:** 4px lift + subtle ring `var(--rheo-ring)`.
- **Toasts:** slide from top, 0.25s; stay ≤ 3s.

Framer Motion example:

```tsx
<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.25,ease:[0.2,0.8,0.2,1]}}>
  <RheoCard title="Stage: Validate">...</RheoCard>
</motion.div>
```

---

## 8) Theme switching (runtime)

Use a `data-theme` attribute on `<html>` and store preference in `localStorage`.

```ts
export function setTheme(name:'aurora'|'prism'|'sunset'|'tropic'){
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem('rheo-theme', name);
}
export function initTheme(){
  setTheme((localStorage.getItem('rheo-theme') as any) || 'aurora');
}
```

Call `initTheme()` in `_app` or layout client component.

---

## 9) Accessibility & contrast

- Body text on surfaces: contrast ≥ 7:1 preferred, 4.5:1 minimum.
- Accent buttons: ensure text contrast ≥ 4.5:1; add 1px inner highlight border `rgba(255,255,255,.25)` on dark accents.
- Provide **Reduce Motion** support via media query.

---

## 10) Assets & backgrounds

- Optional **grain overlay** (subtle): 6% opacity PNG on heroes.
- Background gradient bands for hero/empty states using `--rheo-grad-1`.
- Avoid heavy glass over busy photos; prefer gradient + glass cards.

---

## 11) Mapping accents to modules (Prism theme)

- Pipeline → `--rheo-pipeline` (blue)
- Studio → green
- Evidence → amber
- Connect → cyan
- Packs → purple
- Agents → red Use these as left rail indicators, tab highlights, and progress rings.

---

## 12) Acceptance criteria (UI theme)

- Aurora (default) renders with glossy cards and gradient hero.
- Toggle between Aurora/Prism/Sunset/Tropic at runtime; preference persists.
- All primary text and CTAs meet contrast; no washed‑out labels.
- Performance: LCP < 2.5s on a mid‑tier laptop; avoid oversized blur areas.

---

## 13) Tasks for Gemini CLI

1. Add the CSS variables and Tailwind extensions above.
2. Build `RheoTopBar`, `RheoCard`, and a primary `RheoButton` as shared components.
3. Implement theme switching with `data-theme` + persisted preference.
4. Audit contrast with aUI plugin or manual checks; fix any failures.
5. Record implementation notes and screenshots in `docs/UX.md`.

*End of spec — v1.0.*

