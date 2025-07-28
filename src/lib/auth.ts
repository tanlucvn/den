import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailHarmony } from "better-auth-harmony";
import mailchecker from "mailchecker";
import { db } from "@/db";
import * as schema from "@/db/schema/auth";
import { getURL } from "./utils";

export const auth = betterAuth({
	appName: "Den",
	baseURL: getURL(),

	// Database adapter using Drizzle ORM with PostgreSQL
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
		usePlural: true,
	}),

	// Session configuration
	session: {
		freshAge: 0,
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
		},
	},

	// Enable email/password authentication
	emailAndPassword: {
		enabled: true,
	},

	// Social login providers (OAuth)
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},
	plugins: [
		// Integrate with Next.js App Router for cookie/session support
		nextCookies(),
		// Handles normalization and validation of email
		emailHarmony({
			allowNormalizedSignin: true,
			validator: (email) => {
				console.log("check", mailchecker.isValid(email));
				// Reject emails from disposable/spam domains using mailchecker
				// https://github.com/FGRibreau/mailchecker/blob/HEAD/list.txt
				return mailchecker.isValid(email);
			},
		}),
	],
});

export type Session = typeof auth.$Infer.Session;
