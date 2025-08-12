import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const taskLists = pgTable("task_lists", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("name").notNull(),
	userId: text("userId").notNull(),

	icon: text(),
	color: text(),

	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export type TaskList = typeof taskLists.$inferSelect;
export type NewTaskList = typeof taskLists.$inferInsert;
