import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { log } from '@/lib/logging';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const startTime = Date.now();
  let { orgId, projectId, userId, clientName, yourCompany, priceRange, docusignLink } = await request.json();

  try {
    if (!orgId || !projectId || !userId || !clientName || !yourCompany) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const templatePath = path.join(process.cwd(), 'src', 'templates', 'proposal_agency.md');
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    templateContent = templateContent
      .replace('{{clientName}}', clientName)
      .replace('{{yourCompany}}', yourCompany)
      .replace('{{priceRange}}', priceRange || 'Not specified')
      .replace('{{docusignLink}}', docusignLink || '#');

    const deliverable = {
      orgId,
      projectId,
      kind: 'proposal',
      title: `Proposal - ${clientName}`,
      contentMd: templateContent,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
    };

    const docRef = await addDoc(collection(db, 'deliverables'), deliverable);

    const durationMs = Date.now() - startTime;
    await log('deliverable.created', 'INFO', { deliverableId: docRef.id, kind: 'proposal' }, orgId, userId, projectId, undefined, durationMs);

    return NextResponse.json({ deliverableId: docRef.id, content: templateContent }, { status: 201 });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    console.error('Error creating deliverable:', error);
    await log('deliverable.created.error', 'ERROR', { error: error.message }, orgId, userId, projectId, error.message, durationMs);
    return NextResponse.json({ error: 'Failed to create deliverable' }, { status: 500 });
  }
}

