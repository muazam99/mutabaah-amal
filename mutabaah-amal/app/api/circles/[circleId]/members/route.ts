import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { circleMembers, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { circleId: string } }) {
  const circleId = parseInt(params.circleId);
  
  const members = await db
    .select({
      userId: users.userId,
      username: users.username,
      role: circleMembers.role
    })
    .from(circleMembers)
    .innerJoin(users, eq(circleMembers.userId, users.userId))
    .where(eq(circleMembers.circleId, circleId));
  
  return NextResponse.json(members);
}

