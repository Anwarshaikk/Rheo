import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, yourCompany, priceRange, docusignLink } = body;

    // Read the proposal template
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'proposal_agency.md');
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    // Replace tokens
    templateContent = templateContent
      .replace('{{clientName}}', clientName)
      .replace('{{yourCompany}}', yourCompany)
      .replace('{{priceRange}}', priceRange)
      .replace('{{docusignLink}}', docusignLink);

    // TODO: Save the deliverable to Firestore

    return NextResponse.json({ message: 'Proposal created successfully', content: templateContent }, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 });
  }
}
