import { cache } from "react";
import { db } from "./db";
import { circleMembers, tasks, users, userTaskCompletions } from "./schema";
import { and, eq, sql } from "drizzle-orm";
import { Task, UserTask } from "@/types/userTaskModel";

export const getCircleMembers = cache( async (circleId: number) => {
    const members = await db.select({
      userId: users.userId,
      username: users.username,
      email: users.email,
      role: circleMembers.role
    })
    .from(circleMembers)
    .innerJoin(users, eq(circleMembers.userId, users.userId))
    .where(eq(circleMembers.circleId, circleId));
    
    return members;
});

export const getCircleTasks = cache( async (circleId: number) => {
  const taskList = await db.select().from(tasks).where(eq(tasks.circleId, circleId));
  // transform to TaskModel

  const result = <Task[]>[];

  for (let i = 0; i < taskList.length; i++) {
    const task = taskList[i];
    result.push({ 
      taskId: task.taskId,
      circleId: task.circleId,
      name: task.name,
      frequencyType: task.frequencyType,
      frequencyCount: task.frequencyCount,
      description: task.description,
    });
  }

  return result;
})

export const getUserTasks = cache( async (userId: number, fromDate: any, toDate: any) => {
  // const userTasks = await db.query.userTaskCompletions.findMany({
  //   with: {
  //     task: true,
  //     user: true,
  //   },
  //   where: and(
  //     eq(userTaskCompletions.userId, userId),
  //     eq(userTaskCompletions.taskDateFrom, fromDate),
  //     eq(userTaskCompletions.taskDateTo, toDate),
  //   )
  // });

  const userTasks = await db
  .select({
    completionId: userTaskCompletions.completionId,
    taskId: tasks.taskId,
    name: tasks.name,
    frequencyType: tasks.frequencyType,
    frequencyCount: tasks.frequencyCount,
    description: tasks.description,
    quantityCompleted: userTaskCompletions.quantityCompleted,
    updatedAt: userTaskCompletions.updatedAt,
    taskDateFrom: userTaskCompletions.taskDateFrom,
    taskDateTo: userTaskCompletions.taskDateTo
  })
  .from(tasks)
  .innerJoin(circleMembers, eq(tasks.circleId, circleMembers.circleId))
  .leftJoin(
    userTaskCompletions,
    and(
      eq(userTaskCompletions.taskId, tasks.taskId),
      eq(userTaskCompletions.userId, userId),
      eq(userTaskCompletions.taskDateFrom, fromDate),
      eq(userTaskCompletions.taskDateTo, toDate)
    ))
    .where(eq(circleMembers.userId, userId));
  
  return userTasks;
});

export const submitUserTasks = cache( async (userId: number, tasks: UserTask[]) => {

  const values = tasks.map((task) => {
    return {
      ...(task.completionId !== null ? { completionId: task.completionId } : {}),
      userId: userId,
      taskId: task.taskId,
      quantityCompleted: task.quantityCompleted,
      updatedAt: task.updatedAt!,
      taskDateFrom: task.taskDateFrom!,
      taskDateTo: task.taskDateTo!,
    }
  });
  

  const userTasks = await db
  .insert(userTaskCompletions)
  .values(values)
  .onConflictDoUpdate({
    target: [userTaskCompletions.completionId],
    set: {
      quantityCompleted: sql.raw(`excluded.${userTaskCompletions.quantityCompleted.name}`),
    }
  })
  .returning();

  return userTasks;
});


// get user name by id
export const getUserById = cache( async (userId: number) => {
  const user = await db.select({  
    userId: users.userId,
    email: users.email,
    username: users.username})
  .from(users).where(eq(users.userId, userId));

  return user[0];
});