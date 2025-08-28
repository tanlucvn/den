import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
	handleError,
	requireSession,
	success,
	successMessage,
} from "@/app/api/api-response";
import { db } from "@/db";
import { lists } from "@/db/schema/lists";
import { listSchema } from "@/lib/validators/list-schema";

export async function GET() {
	try {
		const session = await requireSession();
		const results = await db.query.lists.findMany({
			where: eq(lists.userId, session.user.id),
			orderBy: (lists, { asc }) => asc(lists.updatedAt),
		});
		return success(results);
	} catch (error) {
		return handleError(error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await requireSession();
		const body = await req.json();
		const parsed = listSchema.parse(body);

		await db.insert(lists).values({
			...parsed,
			userId: session.user.id,
			updatedAt: new Date(),
		});

		return successMessage("List created successfully", 201);
	} catch (error) {
		return handleError(error);
	}
}
