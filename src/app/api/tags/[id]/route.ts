import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
	handleError,
	notFound,
	requireSession,
	success,
	successMessage,
} from "@/app/api/api-response";
import { db } from "@/db";
import { tags } from "@/db/schema/tags";
import { tagSchema } from "@/lib/validators/tag-schema";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await requireSession();
		const { id } = await params;

		const tag = await db.query.tags.findFirst({
			where: and(eq(tags.userId, session.user.id), eq(tags.id, id)),
		});

		if (!tag) return notFound("Tag not found");

		return success(tag);
	} catch (error) {
		return handleError(error);
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await requireSession();
		const { id } = await params;
		const body = await req.json();
		const parsed = tagSchema.parse(body);

		const [updated] = await db
			.update(tags)
			.set({ ...parsed, updatedAt: new Date() })
			.where(and(eq(tags.userId, session.user.id), eq(tags.id, id)))
			.returning();

		if (!updated) return notFound("Tag not found");

		return successMessage("Tag updated successfully");
	} catch (error) {
		return handleError(error);
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await requireSession();
		const { id } = await params;

		const [deleted] = await db
			.delete(tags)
			.where(and(eq(tags.userId, session.user.id), eq(tags.id, id)))
			.returning();

		if (!deleted) return notFound("Tag not found");

		return successMessage("Tag deleted successfully");
	} catch (error) {
		return handleError(error);
	}
}
