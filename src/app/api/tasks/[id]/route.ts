import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tags, taskTags } from "@/db/schema";
import { tasks } from "@/db/schema/tasks";
import { auth } from "@/lib/auth";

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const body = await req.json();

		const updatedData = {
			...body,
			createdAt: body.createdAt ? new Date(body.createdAt) : null,
			updatedAt: new Date(),
			remindAt: body.remindAt ? new Date(body.remindAt) : null,
		};

		// Update task
		const [updated] = await db
			.update(tasks)
			.set(updatedData)
			.where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
			.returning();

		if (!updated) {
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}

		// Update tags
		if (Array.isArray(body.tagIds)) {
			// Remove old tags
			await db.delete(taskTags).where(eq(taskTags.taskId, id));

			// Add new tags
			if (body.tagIds.length > 0) {
				const inserts = body.tagIds.map((tagId: string) => ({
					taskId: id,
					tagId,
				}));
				await db.insert(taskTags).values(inserts);
			}
		}

		const taskTagsJoined = await db
			.select({
				id: tags.id,
				title: tags.title,
				color: tags.color,
			})
			.from(taskTags)
			.leftJoin(tags, eq(taskTags.tagId, tags.id))
			.where(eq(taskTags.taskId, id));

		return NextResponse.json(
			{ ...updated, tags: taskTagsJoined },
			{ status: 200 },
		);
	} catch (error) {
		console.error("PUT /api/tasks/[id] error:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		const [deleted] = await db
			.delete(tasks)
			.where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
			.returning();

		if (!deleted) {
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("DELETE /api/tasks/[id] error:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
