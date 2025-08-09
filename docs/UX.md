# Rheo UX & UI Documentation (Sprint 1)

This document outlines the User Experience (UX) and User Interface (UI) components and design tokens implemented in the first sprint.

## 1. Core UI Philosophy

The UI is built on the "Glossy Bright" theme, which emphasizes:
- **Clarity:** High-contrast text and clean, spacious layouts.
- **Depth:** Subtle shadows and "glass" effects to create a sense of dimension.
- **Motion:** Purposeful animations to provide feedback and guide the user.
- **Theming:** A flexible theme system to allow for visual customization. The default theme is "Aurora".

## 2. Component Map

The following custom components were built, located in `src/components/rheo/`:

- **`RheoCard`**: The primary container for content blocks. It uses the `rheo-glass` class for a semi-transparent, blurred background effect.
- **`RheoButton`**: The main call-to-action button, featuring a gradient background and a subtle shadow.
- **`GateChip`**: A status indicator for pipeline gates. It changes color and icon based on the `passed` prop (`✓` for passed, `•` for pending).
- **`DeliverableFactory`**: A dedicated panel containing a form to generate new proposals.
- **`EvidenceDrawer`**: A panel for users to submit new evidence (notes, URLs) to the project.
- **`withAuth`**: A Higher-Order Component (HOC) that wraps pages to protect them from unauthenticated access.

Standard components are provided by **`shadcn/ui`**.

## 3. Layout & Structure

The main application layout (`/`) is structured as follows:

- **Container:** A centered, max-width container (`max-w-[1400px]`) ensures the content is readable on large screens.
- **Two-Column Grid:**
    - **Left Column (Main Content):** A responsive grid that holds the `RheoCard` components for each pipeline stage.
    - **Right Column (Sidebar):** A fixed-width sidebar (`360px`) that contains the `DeliverableFactory` and `EvidenceDrawer` panels. On smaller screens, this stacks below the main content.
- **Hero Header:** The page background uses the `rheo-hero` class, which applies a soft gradient defined by the current theme.

## 4. Motion & Micro-interactions

Motion is handled by `framer-motion` to create a fluid user experience:

- **Card Entrance:** Stage cards fade and rise into view on mount (`opacity: 0 -> 1`, `y: 8 -> 0`). The animation is staggered for each card to create a pleasant cascade effect.
- **Button States:** The `RheoButton` has a disabled state (`isEvaluating`) to prevent multiple clicks during API calls.
- **Hover States:** (Future) Cards will have a subtle lift effect on hover to indicate interactivity.

## 5. Color & Theme Tokens

All colors and styles are controlled by CSS variables defined in `src/app/globals.css` and consumed by Tailwind CSS.

- **Default Theme:** `data-theme="aurora"` is applied to the `<html>` tag.
- **Core Variables:**
    - `--rheo-bg`: Page background
    - `--rheo-surface`: Card background
    - `--rheo-text`: Primary text color
    - `--rheo-accent`: The primary accent color for buttons and highlights.
- **Glass Effect:** The `.rheo-glass` class combines `background`, `backdrop-filter`, `border`, and `box-shadow` to create the signature glossy look.
