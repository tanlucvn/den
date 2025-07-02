import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("userId").notNull(),

	title: text("title").notNull(),
	note: text("note"),

	priority: text("priority", {
		enum: ["none", "low", "medium", "high"],
	})
		.notNull()
		.default("none"),

	location: text("location"), // optional field

	isCompleted: boolean("isCompleted").notNull().default(false),
	isPinned: boolean("isPinned").notNull().default(false),

	deletedAt: timestamp("deletedAt", { mode: "date" }),
	remindAt: timestamp("remindAt", { mode: "date" }),

	createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});
