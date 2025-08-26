import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { type TaskWithTagsAndList, tasks } from "@/db/schema/tasks";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const listId = searchParams.get("listId");

		const where = listId
			? and(eq(tasks.userId, session.user.id), eq(tasks.listId, listId))
			: eq(tasks.userId, session.user.id);

		const rows = await db.query.tasks.findMany({
			where,
			with: {
				list: true,
				taskTags: { with: { tag: true } },
			},
			orderBy: orderByPinnedAndPriority(),
		});

		const result = rows.map(formatTask);
		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("GET /api/tasks error:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();

		const [inserted] = await db
			.insert(tasks)
			.values({ ...body, userId: session.user.id })
			.returning();

		const row = await db.query.tasks.findFirst({
			where: eq(tasks.id, inserted.id),
			with: {
				list: true,
				taskTags: { with: { tag: true } },
			},
			orderBy: orderByPinnedAndPriority(),
		});

		if (!row) {
			return NextResponse.json(
				{ error: "Task not found after insert" },
				{ status: 404 },
			);
		}

		const result = formatTask(row);
		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		console.error("POST /api/tasks error:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

// Helper: order tasks
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
	${tasks.createdAt} DESC
  `;
}

function formatTask(row: any): TaskWithTagsAndList {
	return {
		...row,
		list: row.list ?? undefined,
		tags: row.taskTags?.map((tt: any) => tt.tag) ?? [],
	};
}
