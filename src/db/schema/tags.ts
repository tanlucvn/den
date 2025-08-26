import { sql } from "drizzle-orm";
import {
	pgPolicy,
	pgRole,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { tasks } from "./tasks";

const authenticated = pgRole("authenticated");

export const tags = pgTable("tags", {
	id: uuid().primaryKey().defaultRandom(),
	userId: text().notNull(),

	title: text().notNull(),
	color: text(),

	createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
});

export const taskTags = pgTable(
	"task_tags",
	{
		taskId: uuid("task_id")
			.notNull()
			.references(() => tasks.id, { onDelete: "cascade" }),
		tagId: uuid("tag_id")
			.notNull()
			.references(() => tags.id, { onDelete: "cascade" }),
	},
	() => [
		pgPolicy("select_own_task_tags", {
			for: "select",
			to: authenticated,
			using: sql`
        EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.userId = auth.uid())
        AND EXISTS (SELECT 1 FROM tags WHERE tags.id = task_tags.tag_id AND tags.userId = auth.uid())
      `,
		}),
		pgPolicy("insert_own_task_tags", {
			for: "insert",
			to: authenticated,
			withCheck: sql`
        EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.userId = auth.uid())
        AND EXISTS (SELECT 1 FROM tags WHERE tags.id = task_tags.tag_id AND tags.userId = auth.uid())
      `,
		}),
		pgPolicy("delete_own_task_tags", {
			for: "delete",
			to: authenticated,
			using: sql`
        EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_tags.task_id AND tasks.userId = auth.uid())
        AND EXISTS (SELECT 1 FROM tags WHERE tags.id = task_tags.tag_id AND tags.userId = auth.uid())
      `,
		}),
	],
).enableRLS();

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
