import { sql } from "drizzle-orm";
import {
	boolean,
	pgPolicy,
	pgRole,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

const authenticated = pgRole("authenticated");

export const users = pgTable(
	"users",
	{
		id: text().primaryKey(),
		name: text().notNull(),
		email: text().notNull().unique(),
		emailVerified: boolean().notNull(),
		normalizedEmail: text().unique(),
		image: text(),
		createdAt: timestamp().notNull(),
		updatedAt: timestamp().notNull(),
	},
	() => [
		pgPolicy("select_self", {
			for: "select",
			to: authenticated,
			using: sql`id = auth.uid()`,
		}),
		pgPolicy("update_self", {
			for: "update",
			to: authenticated,
			using: sql`id = auth.uid()`,
			withCheck: sql`id = auth.uid()`,
		}),
	],
).enableRLS();

export const sessions = pgTable("sessions", {
	id: text().primaryKey(),
	expiresAt: timestamp().notNull(),
	token: text().notNull().unique(),
	createdAt: timestamp().notNull(),
	updatedAt: timestamp().notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
	id: text().primaryKey(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp(),
	refreshTokenExpiresAt: timestamp(),
	scope: text(),
	password: text(),
	createdAt: timestamp().notNull(),
	updatedAt: timestamp().notNull(),
});

export const verifications = pgTable("verifications", {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp().notNull(),
	createdAt: timestamp().notNull(),
	updatedAt: timestamp().notNull(),
});
