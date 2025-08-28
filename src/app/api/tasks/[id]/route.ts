import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
	handleError,
	notFound,
	requireSession,
	successMessage,
} from "@/app/api/api-response";
import { db } from "@/db";
import { tasks, taskTags } from "@/db/schema";
import { taskSchema } from "@/lib/validators/task-schema";

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await requireSession();
		const { id } = await params;
		const body = await req.json();
		const parsed = taskSchema.parse(body);

		const [updated] = await db
			.update(tasks)
			.set({
				...parsed,
				updatedAt: new Date(),
				remindAt: parsed.remindAt ?? null,
			})
			.where(and(eq(tasks.userId, session.user.id), eq(tasks.id, id)))
			.returning();

		if (!updated) return notFound("Task not found");

		// Update tags if provided
		if (Array.isArray(body.tagIds)) {
			await db.delete(taskTags).where(eq(taskTags.taskId, id));
			if (body.tagIds.length > 0) {
				const inserts = body.tagIds.map((tagId: string) => ({
					taskId: id,
					tagId,
				}));
				await db.insert(taskTags).values(inserts);
			}
		}

		return successMessage("Task updated successfully");
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
			.delete(tasks)
			.where(and(eq(tasks.userId, session.user.id), eq(tasks.id, id)))
			.returning();

		if (!deleted) return notFound("Task not found");

		return successMessage("Task deleted successfully");
	} catch (error) {
		return handleError(error);
	}
}
