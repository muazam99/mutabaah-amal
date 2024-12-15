import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { circles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const { code } = await request.json();
  
  const circle = await db.select().from(circles).where(eq(circles.code, code)).limit(1);
  
  if (circle.length > 0) {
    return NextResponse.json({ valid: true, circleId: circle[0].circleId });
  } else {
    return NextResponse.json({ valid: false });
  }
}

