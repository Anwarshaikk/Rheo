import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { log } from '@/lib/logging';

export async function POST(request: Request) {
  const startTime = Date.now();
  let { orgId, projectId, userId } = await request.json();

  try {
    if (!orgId || !projectId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch all evidence for the project
    const evidenceQuery = query(collection(db, 'evidence'), where('projectId', '==', projectId));
    const evidenceSnapshot = await getDocs(evidenceQuery);
    const projectEvidenceKinds = new Set(evidenceSnapshot.docs.map(doc => doc.data().kind));

    // 2. Fetch all gates for the project that are not yet passed
    const gatesQuery = query(
      collection(db, 'gates'),
      where('projectId', '==', projectId),
      where('passed', '==', false)
    );
    const gatesSnapshot = await getDocs(gatesQuery);

    if (gatesSnapshot.empty) {
      return NextResponse.json({ message: 'No pending gates to evaluate.' }, { status: 200 });
    }

    // 3. Evaluate and update gates
    const batch = writeBatch(db);
    let passedGatesCount = 0;

    gatesSnapshot.forEach(gateDoc => {
      const gate = gateDoc.data();
      const requiredEvidence = gate.requiredEvidence || [];
      const hasAllEvidence = requiredEvidence.every((kind: string) => projectEvidenceKinds.has(kind));

      if (hasAllEvidence) {
        const gateRef = doc(db, 'gates', gateDoc.id);
        batch.update(gateRef, { passed: true });
        passedGatesCount++;
      }
    });

    if (passedGatesCount > 0) {
      await batch.commit();
    }

    const durationMs = Date.now() - startTime;
    await log('stage.evaluated', 'INFO', { passedGatesCount }, orgId, userId, projectId, undefined, durationMs);

    return NextResponse.json({ passedGates: passedGatesCount }, { status: 200 });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error('Error evaluating gates:', error);
    await log('stage.evaluated.error', 'ERROR', { error: error.message }, orgId, userId, projectId, error.message, durationMs);
    return NextResponse.json({ error: 'Failed to evaluate gates' }, { status: 500 });
  }
}

