import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
	handleError,
	requireSession,
	successMessage,
} from "@/app/api/api-response";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { taskSchema } from "@/lib/validators/task-schema";

export async function PUT(req: NextRequest) {
	try {
		const session = await requireSession();
		const body = await req.json();

		if (!Array.isArray(body) || body.length === 0) {
			return handleError(
				new Error("Invalid input, expected a non-empty array"),
			);
		}

		await Promise.all(
			body.map(async (task) => {
				const parsed = taskSchema.parse(task);
				await db
					.update(tasks)
					.set({
						...parsed,
						updatedAt: new Date(),
						remindAt: parsed.remindAt ?? null,
					})
					.where(and(eq(tasks.id, task.id), eq(tasks.userId, session.user.id)));
			}),
		);

		return successMessage("Tasks updated successfully");
	} catch (error) {
		return handleError(error);
	}
}
