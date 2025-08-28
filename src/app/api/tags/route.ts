import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
	handleError,
	requireSession,
	success,
	successMessage,
} from "@/app/api/api-response";
import { db } from "@/db";
import { tags } from "@/db/schema/tags";
import { tagSchema } from "@/lib/validators/tag-schema";

export async function GET() {
	try {
		const session = await requireSession();

		const results = await db.query.tags.findMany({
			where: eq(tags.userId, session.user.id),
			orderBy: (tags, { asc }) => asc(tags.updatedAt),
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
		const parsed = tagSchema.parse(body);

		await db
			.insert(tags)
			.values({ ...parsed, userId: session.user.id, updatedAt: new Date() })
			.returning();

		return successMessage("Tag created successfully", 201);
	} catch (error) {
		return handleError(error);
	}
}
