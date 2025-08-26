import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json(); // Task[]
		if (!Array.isArray(body)) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}

		const results = await Promise.all(
			body.map(async (task) => {
				const updatedData = {
					...task,
					createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
					updatedAt: new Date(),
					remindAt: task.remindAt ? new Date(task.remindAt) : null,
					deletedAt: task.deletedAt ? new Date(task.deletedAt) : null,
				};

				const [updated] = await db
					.update(tasks)
					.set(updatedData)
					.where(and(eq(tasks.id, task.id), eq(tasks.userId, session.user.id)))
					.returning({ id: tasks.id });

				return updated;
			}),
		);

		return NextResponse.json(results, { status: 200 });
	} catch (error) {
		console.error("PUT /api/tasks/batch error:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
