import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { taskLists } from "@/db/schema/task-lists";
import { tasks } from "@/db/schema/tasks";
import { auth } from "@/lib/auth";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { id } = await params;

	const result = await db
		.select()
		.from(tasks)
		.where(and(eq(tasks.userId, session.user.id), eq(tasks.listId, id)))
		.orderBy(tasks.createdAt);

	return NextResponse.json(result);
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { id } = await params;
	const body = await req.json();

	const result = await db
		.update(taskLists)
		.set({ ...body })
		.where(and(eq(taskLists.id, id), eq(taskLists.userId, session.user.id)))
		.returning();

	if (!result.length) {
		return NextResponse.json({ error: "List not found" }, { status: 404 });
	}

	return NextResponse.json(result[0]);
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { id } = await params;

	await db
		.delete(taskLists)
		.where(and(eq(taskLists.id, id), eq(taskLists.userId, session.user.id)));

	return NextResponse.json({ success: true });
}
