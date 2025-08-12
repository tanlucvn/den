import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { type TaskList, taskLists } from "@/db/schema/task-lists";
import type { Tag } from "./tags";

export const tasks = pgTable("tasks", {
	id: uuid().primaryKey().defaultRandom(),
	userId: text().notNull(),

	listId: uuid("listId").references(() => taskLists.id, {
		onDelete: "cascade",
	}),

	title: text().notNull(),
	note: text(),

	priority: text("priority", {
		enum: ["none", "low", "medium", "high"],
	})
		.notNull()
		.default("none"),

	location: text(),
	sortIndex: integer().notNull().default(0),

	isCompleted: boolean().notNull().default(false),
	isPinned: boolean().notNull().default(false),
	isArchived: boolean().notNull().default(false),

	deletedAt: timestamp({ mode: "date" }),
	remindAt: timestamp({ mode: "date" }),

	createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp({ mode: "date" }).notNull().defaultNow(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type TaskWithTags = Task & {
	tags?: Tag[];
};

export type TaskWithTagsAndList = Task & {
	tags?: Tag[];
	list?: TaskList;
};
