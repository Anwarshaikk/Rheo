# Rheo API Documentation (Sprint 1)

This document details the API endpoints created during Sprint 1.

## Base URL
All routes are prefixed with `/api`.

---

### 1. Create Project

- **Route:** `POST /api/projects`
- **Description:** Creates a new project along with its default stages and gates in a single transaction.
- **Request Body:**
  ```json
  {
    "name": "string",
    "orgId": "string",
    "vertical": "string (e.g., 'b2b-agency')",
    "userId": "string"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "projectId": "string"
  }
  ```
- **Error Response (400/500):**
  ```json
  {
    "error": "string"
  }
  ```

---

### 2. Create Deliverable

- **Route:** `POST /api/deliverables`
- **Description:** Creates a new deliverable (e.g., a proposal) from a template.
- **Request Body:**
  ```json
  {
    "orgId": "string",
    "projectId": "string",
    "userId": "string",
    "clientName": "string",
    "yourCompany": "string",
    "priceRange": "string",
    "docusignLink": "string"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "deliverableId": "string",
    "content": "string (The generated markdown)"
  }
  ```

---

### 3. Add Evidence

- **Route:** `POST /api/evidence`
- **Description:** Adds a new piece of evidence to a project.
- **Request Body:**
  ```json
  {
    "orgId": "string",
    "projectId": "string",
    "userId": "string",
    "kind": "'note' | 'invoice_url' | 'signed_link'",
    "url": "string (optional)",
    "note": "string (optional)"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "evidenceId": "string"
  }
  ```

---

### 4. Evaluate Gates

- **Route:** `POST /api/evaluate`
- **Description:** Evaluates all pending gates for a project against the available evidence and updates their status.
- **Request Body:**
  ```json
  {
    "orgId": "string",
    "projectId": "string",
    "userId": "string"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "passedGates": "number"
  }
  ```
