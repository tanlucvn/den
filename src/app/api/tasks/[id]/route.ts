import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { auth } from "@/lib/auth";
import { parseTaskDates } from "@/lib/utils";

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
		.update(tasks)
		.set(parseTaskDates(body))
		.where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
		.returning();

	if (!result.length) {
		return NextResponse.json({ error: "Task not found" }, { status: 404 });
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

	await db.delete(tasks).where(eq(tasks.id, id));
	return NextResponse.json({ success: true });
}
