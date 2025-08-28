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
import { lists } from "@/db/schema/lists";
import { listSchema } from "@/lib/validators/list-schema";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await requireSession();
		const { id } = await params;

		const list = await db.query.lists.findFirst({
			where: and(eq(lists.userId, session.user.id), eq(lists.id, id)),
		});

		if (!list) return notFound("List not found");

		return success(list);
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
		const parsed = listSchema.parse(body);

		const [updated] = await db
			.update(lists)
			.set({ ...parsed, updatedAt: new Date() })
			.where(and(eq(lists.userId, session.user.id), eq(lists.id, id)))
			.returning();

		if (!updated) return notFound("List not found");

		return successMessage("List updated successfully");
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
			.delete(lists)
			.where(and(eq(lists.userId, session.user.id), eq(lists.id, id)))
			.returning();

		if (!deleted) return notFound("List not found");

		return successMessage("List deleted successfully");
	} catch (error) {
		return handleError(error);
	}
}
