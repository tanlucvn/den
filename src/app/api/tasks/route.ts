import { and, eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
	handleError,
	requireSession,
	success,
	successMessage,
} from "@/app/api/api-response";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { taskSchema } from "@/lib/validators/task-schema";

export async function GET(req: NextRequest) {
	try {
		const session = await requireSession();
		const { searchParams } = new URL(req.url);
		const listId = searchParams.get("listId");

		const where = listId
			? and(eq(tasks.userId, session.user.id), eq(tasks.listId, listId))
			: eq(tasks.userId, session.user.id);

		const rows = await db.query.tasks.findMany({
			where,
			with: { list: true, taskTags: { with: { tag: true } } },
			orderBy: orderByPinnedAndPriority(),
		});

		const results = rows.map((row) => ({
			...row,
			list: row.list ?? null,
			tags: row.taskTags?.map((tt: any) => tt.tag) ?? [],
		}));

		return success(results);
	} catch (error) {
		return handleError(error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await requireSession();
		const body = await req.json();
		const parsed = taskSchema.parse(body);

		await db
			.insert(tasks)
			.values({ ...parsed, userId: session.user.id })
			.returning();

		return successMessage("Task created successfully", 201);
	} catch (error) {
		return handleError(error);
	}
}

function orderByPinnedAndPriority() {
	return sql`
    CASE WHEN ${tasks.isPinned} = true THEN 1 ELSE 0 END DESC,
    CASE ${tasks.priority}
      WHEN 'high' THEN 3
      WHEN 'medium' THEN 2
      WHEN 'low' THEN 1
      WHEN 'none' THEN 0
      ELSE 0
    END DESC,
    ${tasks.updatedAt} DESC
  `;
}
