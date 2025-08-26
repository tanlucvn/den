import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tags } from "@/db/schema/tags";
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

		const tag = await db.query.tags.findFirst({
			where: and(eq(tags.userId, session.user.id), eq(tags.id, id)),
		});

		if (!tag) {
			return NextResponse.json({ error: "Tag not found" }, { status: 404 });
		}

		return NextResponse.json(tag, { status: 200 });
	} catch (error) {
		console.error("GET /api/tags/[id] error:", error);
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
			.update(tags)
			.set(updatedData)
			.where(and(eq(tags.id, id), eq(tags.userId, session.user.id)))
			.returning();

		if (!updated) {
			return NextResponse.json({ error: "Tag not found" }, { status: 404 });
		}

		return NextResponse.json(updated, { status: 200 });
	} catch (error) {
		console.error("PUT /api/tags/[id] error:", error);
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
			.delete(tags)
			.where(and(eq(tags.id, id), eq(tags.userId, session.user.id)))
			.returning();

		if (!deleted) {
			return NextResponse.json({ error: "Tag not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("DELETE /api/tags/[id] error:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
