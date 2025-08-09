import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { log } from "@/lib/logging";

const seedGates = [
  { stageName: 'Validate', gate: { name: 'ICP defined', requiredEvidence: ['note'] } },
  { stageName: 'Plan', gate: { name: 'Offer & price', requiredEvidence: ['note'] } },
  { stageName: 'Launch', gate: { name: 'Proposal sent', requiredEvidence: ['signed_link'] } },
  { stageName: 'Run', gate: { name: 'Invoice paid', requiredEvidence: ['invoice_url'] } },
];

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const authz = req.headers.get("authorization") || "";
    const idToken = authz.startsWith("Bearer ") ? authz.slice(7) : null;
    if (!idToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { uid, claims } = await adminAuth.verifyIdToken(idToken, true);

    const { name, orgId, vertical } = await req.json();
    if (!name || !orgId) return NextResponse.json({ error: "Missing name/orgId" }, { status: 400 });

    const now = new Date();
    const prjRef = adminDb.collection("projects").doc();
    await prjRef.set({
      id: prjRef.id, name, orgId, vertical: vertical || "b2b-agency",
      createdAt: now, updatedAt: now, createdBy: uid,
      stageOrder: ["Validate", "Plan", "Launch", "Run"]
    });

    for (const stageData of seedGates) {
      const stageRef = adminDb.collection("stages").doc();
      await stageRef.set({
        id: stageRef.id, orgId, projectId: prjRef.id, name: stageData.stageName,
        gateIds: [], createdAt: now, createdBy: uid
      });
      const gateRef = adminDb.collection("gates").doc();
      await gateRef.set({
        ...stageData.gate,
        orgId, projectId: prjRef.id, stageId: stageRef.id,
        passed: false, createdAt: now, createdBy: uid
      });
    }

    const newOrgs = { ...(claims?.orgs as Record<string, boolean> ?? {}), [orgId]: true };
    await adminAuth.setCustomUserClaims(uid, { ...(claims || {}), orgs: newOrgs });

    const durationMs = Date.now() - startTime;
    await log('project.created', 'INFO', { name, vertical }, orgId, uid, prjRef.id, undefined, durationMs);

    return NextResponse.json({ projectId: prjRef.id });
  } catch (e: any) {
    const durationMs = Date.now() - startTime;
    console.error("Error creating project:", e);
    // Note: We don't have user/org info here if token verification fails
    await log('project.created.error', 'ERROR', { error: e?.message || "Server error" }, 'unknown', 'unknown', undefined, e?.message, durationMs);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}



