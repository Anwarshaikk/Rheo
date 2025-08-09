import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Add logic to create project, stages, and gates in Firestore
    console.log(body); // Placeholder for now

    return NextResponse.json({ message: 'Project created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
