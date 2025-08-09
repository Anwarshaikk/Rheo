# Rheo - The Venture OS

This is the official repository for the Rheo application, built during a 7-day sprint.

## Getting Started

To run the development server, follow these steps:

### 1. Prerequisites

- Node.js (v20.x or later)
- npm
- Firebase Account

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Anwarshaikk/Rheo.git
cd Rheo
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root of the project and add your Firebase project configuration. You can get these values from your Firebase project settings.

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You will be redirected to the login page. Sign in with a Google account to access the application.

## Sprint 1 Documentation

All documentation for the first sprint is located in the `/docs` directory:

- **`ARCHITECTURE.md`**: High-level overview of the tech stack and application structure.
- **`API.md`**: Details on all backend API endpoints.
- **`UX.md`**: Information on the UI/UX, component library, and theming.
- **`LOGGING.md`**: The structured logging specification.
- **`CHANGELOG.md`**: A log of all work completed during the sprint.
