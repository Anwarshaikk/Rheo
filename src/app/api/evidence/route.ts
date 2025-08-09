import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Add logic to create evidence in Firestore
    console.log(body); // Placeholder for now

    return NextResponse.json({ message: 'Evidence added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding evidence:', error);
    return NextResponse.json({ error: 'Failed to add evidence' }, { status: 500 });
  }
}
