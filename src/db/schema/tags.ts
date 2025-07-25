import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";

export const tags = pgTable("tags", {
	id: uuid().primaryKey().defaultRandom(),
	userId: text().notNull(),

	title: text().notNull(),
	color: text(),
	createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
});

export const taskTags = pgTable("task_tags", {
	taskId: uuid("task_id")
		.notNull()
		.references(() => tasks.id, { onDelete: "cascade" }),
	tagId: uuid("tag_id")
		.notNull()
		.references(() => tags.id, { onDelete: "cascade" }),
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
