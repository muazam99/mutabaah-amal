import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { tasks, userTaskCompletions, circleMembers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId);
  
  const userTasks = await db
    .select({
      taskId: tasks.taskId,
      name: tasks.name,
      frequencyType: tasks.frequencyType,
      frequencyCount: tasks.frequencyCount,
      description: tasks.description,
      quantityCompleted: userTaskCompletions.quantityCompleted,
      updatedAt: userTaskCompletions.updatedAt
    })
    .from(tasks)
    .innerJoin(circleMembers, eq(tasks.circleId, circleMembers.circleId))
    .leftJoin(
      userTaskCompletions,
      and(
        eq(userTaskCompletions.taskId, tasks.taskId),
        eq(userTaskCompletions.userId, userId)
      )
    )
    .where(eq(circleMembers.userId, userId));
  
  return NextResponse.json(userTasks);
}

