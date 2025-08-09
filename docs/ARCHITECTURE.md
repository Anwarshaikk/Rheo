# Rheo Architecture (Sprint 1)

This document describes the high-level architecture of the Rheo application as of the end of Sprint 1.

## 1. Tech Stack

- **Frontend:** Next.js 14 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS with `shadcn/ui` components and a custom "Glossy Bright" theme system.
- **Backend:** Next.js API Routes (Serverless Functions)
- **Database:** Google Firestore
- **Authentication:** Firebase Authentication (Google Sign-In)
- **Deployment:** Firebase Hosting (SSR with Web Frameworks support)

## 2. Project Structure

The repository follows the standard Next.js App Router structure. Key directories include:

- **`src/app/`**: Contains all application routes.
  - **`(auth)/login`**: Route group for authentication pages.
  - **`api/`**: Location of all backend API route handlers.
- **`src/components/`**:
  - **`ui/`**: Holds the unmodified `shadcn/ui` components.
  - **`rheo/`**: Contains custom, project-specific components (`RheoCard`, `GateChip`, etc.).
- **`src/lib/`**: Core utility files.
  - **`firebase.ts`**: Firebase initialization and service exports.
  - **`logging.ts`**: Centralized logging helper for Firestore.
  - **`utils.ts`**: Tailwind CSS class name merging utility.
- **`src/schemas/`**: Zod schemas for data validation, mirroring the Firestore data model.
- **`src/hooks/`**: Custom React hooks, such as `useAuth`.
- **`docs/`**: All project documentation, including this file.
- **`firebase/`**: Firebase configuration files (`firebase.json`, `firestore.rules`).

## 3. Data Model (Firestore)

The data is structured in a denormalized fashion to optimize for reads on the frontend.

- **`projects`**: The central document for a user's venture.
- **`stages`**: Defines the columns in the pipeline (e.g., Validate, Plan).
- **`gates`**: The checklist items within each stage. Their `passed` status is the core of the evidence-gated workflow.
- **`evidence`**: Records of proof (notes, URLs) linked to a project.
- **`deliverables`**: Generated assets, such as proposals.
- **`logs`**: A collection for structured application and event logs.

All documents are linked via `projectId` and `orgId`.

## 4. Authentication Flow

1.  **Route Guarding:** The `withAuth` Higher-Order Component (HOC) wraps protected pages.
2.  **`useAuth` Hook:** This hook checks the user's authentication state via Firebase's `onAuthStateChanged` listener.
3.  **Redirection:** If a user is not authenticated, the `withAuth` HOC redirects them to the `/login` page.
4.  **Sign-In:** The login page uses the Firebase SDK to initiate a Google Sign-In popup flow.
5.  **Session:** Once signed in, Firebase manages the user's session, and the `useAuth` hook provides the user object to the application.

## 5. Request Flow (Example: Evaluate Gates)

1.  **User Action:** The user clicks the "Evaluate Gates" button in the UI.
2.  **Frontend:** The `onClick` handler in the `Home` component calls `fetch('/api/evaluate', ...)`, sending the `projectId`, `orgId`, and `userId`.
3.  **Backend (API Route):** The `evaluate/route.ts` handler receives the request.
4.  **Firestore Interaction:**
    - It queries the `evidence` collection for all documents matching the `projectId`.
    - It queries the `gates` collection for all non-passed gates for that `projectId`.
    - It iterates through the gates, checks if the required evidence exists, and creates a `writeBatch` to update the `passed` status of all qualifying gates.
5.  **Logging:** An event is sent to the `logs` collection in Firestore via the `log()` helper.
6.  **Response:** The API route returns a JSON response to the client with the number of gates that passed.
7.  **UI Update:** The frontend receives the response and displays a success toast. The `onSnapshot` listeners automatically update the UI to show the new `passed` status of the gates.
