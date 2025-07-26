import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { type Tag, tags, taskTags } from "@/db/schema/tags";
import { type Task, type TaskWithTags, tasks } from "@/db/schema/tasks";
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

		const rawData = await db
			.select({
				task: tasks,
				tag: tags,
			})
			.from(tasks)
			.leftJoin(taskTags, eq(taskTags.taskId, tasks.id))
			.leftJoin(tags, eq(taskTags.tagId, tags.id))
			.where(where);

		const grouped: Record<string, { task: Task; tags: Tag[] }> = {};

		for (const row of rawData) {
			const taskId = row.task.id;
			if (!grouped[taskId]) {
				grouped[taskId] = {
					task: row.task,
					tags: [],
				};
			}
			if (row.tag?.id) {
				grouped[taskId].tags.push(row.tag);
			}
		}

		const result: TaskWithTags[] = Object.values(grouped).map((item) => ({
			...item.task,
			tags: item.tags,
		}));
		return NextResponse.json(result);
	} catch (error) {
		console.error("GET /api/tasks error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });

		if (!session)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const body = await req.json();

		const result = await db
			.insert(tasks)
			.values({ ...body, userId: session.user.id })
			.returning();

		return NextResponse.json(result[0]);
	} catch (error) {
		console.error("POST /api/tasks error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
