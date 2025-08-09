import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { log } from '@/lib/logging';

const seedGates = [
  { stageName: 'Validate', gate: { name: 'ICP defined', requiredEvidence: ['note'] } },
  { stageName: 'Plan', gate: { name: 'Offer & price', requiredEvidence: ['note'] } },
  { stageName: 'Launch', gate: { name: 'Proposal sent', requiredEvidence: ['signed_link'] } },
  { stageName: 'Run', gate: { name: 'Invoice paid', requiredEvidence: ['invoice_url'] } },
];

export async function POST(request: Request) {
  const startTime = Date.now();
  let { name, orgId, vertical, userId } = await request.json();

  try {
    if (!name || !orgId || !vertical || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create Project
    const projectRef = await addDoc(collection(db, 'projects'), {
      name,
      orgId,
      vertical,
      stageOrder: ['Validate', 'Plan', 'Launch', 'Run'],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
    });
    const projectId = projectRef.id;

    // 2. Create Stages and Gates
    for (const stageData of seedGates) {
      const stageRef = await addDoc(collection(db, 'stages'), {
        projectId,
        orgId,
        name: stageData.stageName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId,
      });
      const stageId = stageRef.id;

      await addDoc(collection(db, 'gates'), {
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

    const durationMs = Date.now() - startTime;
    await log('project.created', 'INFO', { name, vertical }, orgId, userId, projectId, undefined, durationMs);

    return NextResponse.json({ projectId }, { status: 201 });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error('Error creating project:', error);
    await log('project.created.error', 'ERROR', { error: error.message }, orgId || 'unknown', userId || 'unknown', undefined, error.message, durationMs);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}


