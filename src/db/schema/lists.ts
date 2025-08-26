import { sql } from "drizzle-orm";
import {
	pgPolicy,
	pgRole,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

const authenticated = pgRole("authenticated");

export const lists = pgTable(
	"lists",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: text("userId").notNull(),

		title: text("name").notNull(),
		description: text(),

		note: text(),
		icon: text(),
		color: text(),

		createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
		updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
	},
	() => [
		pgPolicy("select_own_lists", {
			for: "select",
			to: authenticated,
			using: sql`userId = auth.uid()`,
		}),
		pgPolicy("insert_own_lists", {
			for: "insert",
			to: authenticated,
			withCheck: sql`userId = auth.uid()`,
		}),
		pgPolicy("update_own_lists", {
			for: "update",
			to: authenticated,
			using: sql`userId = auth.uid()`,
			withCheck: sql`userId = auth.uid()`,
		}),
		pgPolicy("delete_own_lists", {
			for: "delete",
			to: authenticated,
			using: sql`userId = auth.uid()`,
		}),
	],
).enableRLS();

export type List = typeof lists.$inferSelect;
export type NewList = typeof lists.$inferInsert;
