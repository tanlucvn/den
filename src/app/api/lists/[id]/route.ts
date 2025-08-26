import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { lists } from "@/db/schema/lists";
import { tasks } from "@/db/schema/tasks";
import { auth } from "@/lib/auth";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		const result = await db.query.tasks.findMany({
			where: and(eq(tasks.userId, session.user.id), eq(tasks.listId, id)),
			orderBy: (tasks, { asc }) => asc(tasks.createdAt),
		});

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("GET /api/lists/[id] error:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

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
			updatedAt: new Date(),
		};

		const [updated] = await db
			.update(lists)
			.set(updatedData)
			.where(and(eq(lists.id, id), eq(lists.userId, session.user.id)))
			.returning();

		if (!updated) {
			return NextResponse.json({ error: "List not found" }, { status: 404 });
		}

		return NextResponse.json(updated, { status: 200 });
	} catch (error) {
		console.error("PUT /api/lists/[id] error:", error);
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
			.delete(lists)
			.where(and(eq(lists.id, id), eq(lists.userId, session.user.id)))
			.returning();

		if (!deleted) {
			return NextResponse.json({ error: "List not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("DELETE /api/lists/[id] error:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
