import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { type Task, tasks } from "@/db/schema/tasks";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await req.json(); // Task[]

	if (!Array.isArray(body)) {
		return NextResponse.json({ error: "Invalid input" }, { status: 400 });
	}

	const results: Task[] = [];

	for (const task of body) {
		const updatedTask = {
			...task,
			createdAt: new Date(task.createdAt),
			updatedAt: new Date(task.updatedAt),
			remindAt: task.remindAt ? new Date(task.remindAt) : null,
			deletedAt: task.deletedAt ? new Date(task.deletedAt) : null,
		};

		const result = await db
			.update(tasks)
			.set(updatedTask)
			.where(
				and(eq(tasks.id, updatedTask.id), eq(tasks.userId, session.user.id)),
			)
			.returning();

		if (result[0]) results.push(result[0]);
	}

	return NextResponse.json(results);
}
