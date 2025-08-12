import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tags, taskTags } from "@/db/schema/tags";
import { taskLists } from "@/db/schema/task-lists";
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

		// Query task with list & tags
		const rows = await db
			.select({
				task: tasks,
				list: taskLists,
				tag: tags,
			})
			.from(tasks)
			.leftJoin(taskLists, eq(tasks.listId, taskLists.id))
			.leftJoin(taskTags, eq(taskTags.taskId, tasks.id))
			.leftJoin(tags, eq(taskTags.tagId, tags.id))
			.where(where);

		const map = new Map<string, TaskWithTagsAndList>();

		for (const { task, list, tag } of rows) {
			if (!map.has(task.id)) {
				map.set(task.id, { ...task, list: list ?? undefined, tags: [] });
			}
			if (tag?.id) {
				map.get(task.id)!.tags!.push(tag);
			}
		}

		return NextResponse.json(Array.from(map.values()));
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
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();

		// Insert task
		const inserted = await db
			.insert(tasks)
			.values({ ...body, userId: session.user.id })
			.returning();

		const taskId = inserted[0].id;

		// Query task with list & tags
		const rows = await db
			.select({
				task: tasks,
				list: taskLists,
				tag: tags,
			})
			.from(tasks)
			.leftJoin(taskLists, eq(tasks.listId, taskLists.id))
			.leftJoin(taskTags, eq(taskTags.taskId, tasks.id))
			.leftJoin(tags, eq(taskTags.tagId, tags.id))
			.where(eq(tasks.id, taskId));

		const map = new Map<string, TaskWithTagsAndList>();

		for (const { task, list, tag } of rows) {
			if (!map.has(task.id)) {
				map.set(task.id, { ...task, list: list ?? undefined, tags: [] });
			}
			if (tag?.id) {
				map.get(task.id)!.tags!.push(tag);
			}
		}

		return NextResponse.json(Array.from(map.values())[0]);
	} catch (error) {
		console.error("POST /api/tasks error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
