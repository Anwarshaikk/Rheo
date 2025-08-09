import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { log } from '@/lib/logging';

const seedGates = [
  { stageName: 'Validate', gate: { name: 'ICP defined', requiredEvidence: ['note'] } },
  { stageName: 'Plan', gate: { name: 'Offer & price', requiredEvidence: ['note'] } },
  { stageName: 'Launch', gate: { name: 'Proposal sent', requiredEvidence: ['signed_link'] } },
  { stageName: 'Run', gate: { name: 'Invoice paid', requiredEvidence: ['invoice_url'] } },
];

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const { name, orgId, vertical, userId } = await request.json();

    if (!name || !orgId || !vertical || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const batch = writeBatch(db);

    // 1. Create Project
    const projectRef = doc(collection(db, 'projects'));
    const projectId = projectRef.id;
    batch.set(projectRef, {
      name,
      orgId,
      vertical,
      stageOrder: ['Validate', 'Plan', 'Launch', 'Run'],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
    });

    // 2. Create Stages and Gates
    for (const stageData of seedGates) {
      const stageRef = doc(collection(db, 'stages'));
      const stageId = stageRef.id;
      batch.set(stageRef, {
        projectId,
        orgId,
        name: stageData.stageName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId,
      });

      const gateRef = doc(collection(db, 'gates'));
      batch.set(gateRef, {
        ...stageData.gate,
        projectId,
        stageId,
        orgId,
        passed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId,
      });
    }

    await batch.commit();

    const durationMs = Date.now() - startTime;
    await log('project.created', 'INFO', { name, vertical }, orgId, userId, projectId, undefined, durationMs);

    return NextResponse.json({ projectId }, { status: 201 });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error('Error creating project:', error);
    // Assuming you have a way to get orgId, userId from the request even on failure
    // For now, logging without them if they are not available.
    await log('project.created.error', 'ERROR', { error: error.message }, 'unknown', 'unknown', undefined, error.message, durationMs);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

