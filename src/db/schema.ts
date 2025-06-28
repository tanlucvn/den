import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
	id: serial("id").primaryKey(),
	userId: text("user_id").notNull(),

	task: text("task").notNull(),
	note: text("note").notNull(),

	priority: text("priority", {
		enum: ["none", "low", "medium", "high"],
	})
		.notNull()
		.default("none"),

	location: text("location"), // optional field

	isComplete: boolean("is_complete").notNull().default(false),
	isPin: boolean("is_pin").notNull().default(false),

	deletedAt: timestamp("deleted_at", { mode: "date" }).notNull(),
	createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "date" })
		.notNull()
		.$onUpdate(() => new Date()),
	remindAt: timestamp("remind_at", { mode: "date" }).notNull(),
});
