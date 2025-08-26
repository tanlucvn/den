import { sql } from "drizzle-orm";
import {
	boolean,
	pgPolicy,
	pgRole,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { type List, lists } from "@/db/schema/lists";
import type { Tag } from "./tags";

const authenticated = pgRole("authenticated");

export const tasks = pgTable(
	"tasks",
	{
		id: uuid().primaryKey().defaultRandom(),
		userId: text().notNull(),

		listId: uuid("listId").references(() => lists.id, {
			onDelete: "cascade",
		}),

		title: text().notNull(),
		description: text(),
		note: text(),
		location: text(),

		priority: text("priority", {
			enum: ["none", "low", "medium", "high"],
		})
			.notNull()
			.default("none"),

		status: text("status", {
			enum: ["todo", "in_progress", "paused", "completed"],
		})
			.notNull()
			.default("todo"),

		isCompleted: boolean().notNull().default(false),
		isPinned: boolean().notNull().default(false),
		isArchived: boolean().notNull().default(false),

		deletedAt: timestamp({ mode: "date" }),
		remindAt: timestamp({ mode: "date" }),

		createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
		updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
	},
	() => [
		pgPolicy("select_own_tasks", {
			for: "select",
			to: authenticated,
			using: sql`userId = auth.uid()`,
		}),
		pgPolicy("insert_own_tasks", {
			for: "insert",
			to: authenticated,
			withCheck: sql`userId = auth.uid()`,
		}),
		pgPolicy("update_own_tasks", {
			for: "update",
			to: authenticated,
			using: sql`userId = auth.uid()`,
			withCheck: sql`userId = auth.uid()`,
		}),
		pgPolicy("delete_own_tasks", {
			for: "delete",
			to: authenticated,
			using: sql`userId = auth.uid()`,
		}),
	],
).enableRLS();

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type TaskWithTags = Task & {
	tags?: Tag[];
};

export type TaskWithTagsAndList = Task & {
	tags?: Tag[];
	list?: List;
};
