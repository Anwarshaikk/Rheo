You’re hitting **Firestore PERMISSION\_DENIED** because the write is happening **without an allowed identity** under your current **security rules**. Two things are likely true:

1. Your `/api/projects` route is using the **client SDK** (`@firebase/firestore`) on the server, so it has **no user** (or no claims) attached.
2. Your rules expect **org membership claims** (e.g., `request.auth.token.orgs[orgId]`) that you haven’t set yet.

Fix it in two clean steps:

# A) Use Admin SDK in API routes (recommended)

Do privileged writes in the route (with the user’s ID token verified), not with the client SDK.

**1) Install & init admin**

```bash
npm i firebase-admin
```

`src/lib/firebaseAdmin.ts`

```ts
import { getApps, initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      // On Firebase Hosting/Cloud Run use applicationDefault().
      // For local dev you can set GOOGLE_APPLICATION_CREDENTIALS, or keep applicationDefault().
      credential: applicationDefault(),
    });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
```

**2) Verify the caller’s ID token and write with Admin**
`src/app/api/projects/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const authz = req.headers.get("authorization") || "";
    const idToken = authz.startsWith("Bearer ") ? authz.slice(7) : null;
    if (!idToken) return NextResponse.json({error:"Unauthorized"}, {status:401});

    const { uid, claims } = await adminAuth.verifyIdToken(idToken, true);

    const { name, orgId, vertical } = await req.json();
    if (!name || !orgId) return NextResponse.json({error:"Missing name/orgId"}, {status:400});

    // Create project & seed stages/gates
    const now = new Date();
    const prjRef = adminDb.collection("projects").doc();
    await prjRef.set({
      id: prjRef.id, name, orgId, vertical: vertical || "b2b-agency",
      createdAt: now, updatedAt: now, createdBy: uid,
      stageOrder: ["Validate","Plan","Set Up","Launch","Run"]
    });

    // example: create a stage and gates (simplified)
    const stagesCol = adminDb.collection("stages");
    const validate = stagesCol.doc();
    await validate.set({ id: validate.id, orgId, projectId: prjRef.id, name:"Validate",
      gateIds: [], createdAt: now, createdBy: uid });
    const gatesCol = adminDb.collection("gates");
    await gatesCol.doc().set({
      orgId, projectId: prjRef.id, stageId: validate.id,
      name:"ICP defined", requiredEvidence:["note"], passed:false,
      createdAt: now, createdBy: uid
    });
    // …seed remaining stages/gates…

    // Ensure the user has org membership for rules-based reads later:
    const newOrgs = { ...(claims?.orgs as Record<string, boolean> ?? {}), [orgId]: true };
    await adminAuth.setCustomUserClaims(uid, { ...(claims||{}), orgs: newOrgs });

    return NextResponse.json({ projectId: prjRef.id });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
```

**3) Send the ID token from the client**

```ts
const user = getAuth().currentUser;
const idToken = user && (await user.getIdToken());
await fetch("/api/projects", {
  method:"POST",
  headers:{ "Content-Type":"application/json", Authorization: `Bearer ${idToken}` },
  body: JSON.stringify({ name, orgId, vertical:"b2b-agency" }),
});
```

**Why this fixes it:** Admin SDK bypasses Firestore rules (on the server) **after** you verify the user. You also set the **custom claims** (`orgs[orgId]=true`) so subsequent client reads/writes pass your rules.

---

# B) Adjust rules to allow bootstrapping (keep them safe)

Keep your org-claims model, but allow the **creator** to create initial docs before claims are set.

`firestore.rules` (add these specific create allowances):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function inOrg(orgId) {
      return request.auth != null && request.auth.token.orgs[orgId] == true;
    }
    // Allow creating an org if you are authenticated and the creator
    match /orgs/{orgId} {
      allow create: if request.auth != null && request.resource.data.createdBy == request.auth.uid;
      allow read, update, delete: if inOrg(orgId);
    }
    // Allow creating a project if you're the creator; rest requires membership
    match /projects/{projectId} {
      allow create: if request.auth != null &&
        request.resource.data.createdBy == request.auth.uid;
      allow read, update, delete: if inOrg(resource.data.orgId);
    }
    // Other collections remain org-scoped
    match /{col}/{id} {
      allow read, write: if request.auth != null &&
        (inOrg(resource.data.orgId) || inOrg(request.resource.data.orgId));
    }
  }
}
```

Then:

```bash
firebase deploy --only firestore:rules
```

---

## Quick checklist to unblock you now

* [ ] Install **firebase-admin** and switch `/api/projects` (and logging) to use Admin SDK.
* [ ] Send **Authorization: Bearer <idToken>** from the client.
* [ ] Update **rules** with bootstrap creates (or keep strict and rely entirely on Admin).
* [ ] Redeploy rules, restart dev server, sign out/in to refresh custom claims.
* [ ] Retry “Create Project” → it should succeed; logs should write.

If you want, share your `/api/projects` route and `firestore.rules` snippets and I’ll mark up the exact diff you need.
