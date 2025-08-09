import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { log } from '@/lib/logging';

export async function POST(request: Request) {
  const startTime = Date.now();
  let { orgId, projectId, userId, kind, url, note } = await request.json();

  try {
    if (!orgId || !projectId || !userId || !kind) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const evidence = {
      orgId,
      projectId,
      kind,
      url: url || null,
      note: note || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
    };

    const docRef = await addDoc(collection(db, 'evidence'), evidence);

    const durationMs = Date.now() - startTime;
    await log('evidence.added', 'INFO', { evidenceId: docRef.id, kind }, orgId, userId, projectId, undefined, durationMs);

    return NextResponse.json({ evidenceId: docRef.id }, { status: 201 });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error('Error adding evidence:', error);
    await log('evidence.added.error', 'ERROR', { error: error.message }, orgId, userId, projectId, error.message, durationMs);
    return NextResponse.json({ error: 'Failed to add evidence' }, { status: 500 });
  }
}

