# Rheo Logging Specification (Sprint 1)

This document defines the structured logging strategy for the Rheo application.

## 1. Objective

To capture critical application events in a structured, queryable format. This allows for effective debugging, monitoring, and auditing of user and system actions.

## 2. Storage

All logs are stored in the `logs` collection in Firestore.

## 3. Log Schema

Each log document follows this schema:

```json
{
  "createdAt": "Timestamp",
  "orgId": "string",
  "projectId": "string (optional)",
  "actor": "string (The UID of the user performing the action)",
  "event": "string (e.g., 'project.created', 'stage.evaluated.error')",
  "level": "'INFO' | 'WARN' | 'ERROR'",
  "payload": "object (Context-specific data about the event)",
  "durationMs": "number (optional, for performance monitoring)",
  "error": "string (optional, the error message)"
}
```

## 4. Log Helper

A centralized `log()` function is located at `src/lib/logging.ts`. This helper should be used for all logging to ensure consistency.

**Usage:**
```typescript
import { log } from '@/lib/logging';

await log(
  'project.created',          // event
  'INFO',                     // level
  { name: "New Project" },    // payload
  'org_123',                  // orgId
  'user_abc',                 // actor (userId)
  'project_xyz',              // projectId
  undefined,                  // error
  150                         // durationMs
);
```

## 5. Key Events (Sprint 1)

The following events are currently being logged:

- **`project.created`**: Fired when a new project is successfully created.
  - `payload`: `{ "name": "string", "vertical": "string" }`
- **`project.created.error`**: Fired on failure.
- **`deliverable.created`**: Fired when a proposal is generated.
  - `payload`: `{ "deliverableId": "string", "kind": "proposal" }`
- **`deliverable.created.error`**: Fired on failure.
- **`evidence.added`**: Fired when a user submits new evidence.
  - `payload`: `{ "evidenceId": "string", "kind": "string" }`
- **`evidence.added.error`**: Fired on failure.
- **`stage.evaluated`**: Fired when the gate evaluation process runs.
  - `payload`: `{ "passedGatesCount": "number" }`
- **`stage.evaluated.error`**: Fired on failure.
