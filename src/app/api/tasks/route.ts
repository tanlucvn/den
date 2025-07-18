import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema/tasks";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { searchParams } = new URL(req.url);
	const listId = searchParams.get("listId");

	const conditions = listId
		? and(eq(tasks.userId, session.user.id), eq(tasks.listId, listId))
		: eq(tasks.userId, session.user.id);

	const data = await db.select().from(tasks).where(conditions);

	return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await req.json();

	const result = await db
		.insert(tasks)
		.values({ ...body, userId: session.user.id })
		.returning();

	return NextResponse.json(result[0]);
}
