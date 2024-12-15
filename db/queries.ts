import { cache } from "react";
import { db } from "./db";
import { circleMembers, tasks, users, userTaskCompletions } from "./schema";
import { and, eq } from "drizzle-orm";


export const getCircleMembers = cache( async (circleId: number) => {
    const members = await db.select({
      userId: users.userId,
      username: users.username,
      role: circleMembers.role
    })
    .from(circleMembers)
    .innerJoin(users, eq(circleMembers.userId, users.userId))
    .where(eq(circleMembers.circleId, circleId));
    
    return members;
});

export const getUserTasks = cache( async (userId: number) => {
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
  
  return userTasks;
});