import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { circles } from '@/db/schema';

export async function GET() {
  const allCircles = await db.select().from(circles);
  return NextResponse.json(allCircles);
}

export async function POST(request: Request) {
  const { pin, name } = await request.json();
  const newCircle = await db.insert(circles).values({ pin, name }).returning();
  return NextResponse.json(newCircle[0]);
}

