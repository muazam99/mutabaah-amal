import { pgTable, serial, varchar, text, timestamp, integer, numeric, date, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow()
});

export const circles = pgTable("circles", {
  circleId: serial("circle_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  code: varchar("code", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const circleMembers = pgTable("circle_members", {
  circleId: integer("circle_id").references(() => circles.circleId),
  userId: integer("user_id").references(() => users.userId),
  joinedAt: timestamp("joined_at").defaultNow(),
  role: varchar("role", { length: 50 }).default("member")
}, (table) => {
  return {
    pk: primaryKey(table.circleId, table.userId)
  }
});

export const tasks = pgTable("tasks", {
  taskId: serial("task_id").primaryKey(),
  circleId: integer("circle_id").references(() => circles.circleId),
  name: varchar("name", { length: 200 }).notNull(),
  frequencyType: varchar("frequency_type", { length: 20 }).notNull(),
  frequencyCount: integer("frequency_count").notNull(),
  description: text("description")
});

export const userTaskCompletions = pgTable("user_task_completions", {
  completionId: serial("completion_id").primaryKey(),
  userId: integer("user_id").references(() => users.userId),
  taskId: integer("task_id").references(() => tasks.taskId),
  completedDate: date("completed_date").notNull(),
  quantityCompleted: numeric("quantity_completed")
}, (table) => {
  return {
    unq: uniqueIndex("user_task_date_unique").on(table.userId, table.taskId, table.completedDate)
  }
});

