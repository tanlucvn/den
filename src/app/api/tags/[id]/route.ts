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

		const result = await db
			.select()
			.from(tags)
			.where(and(eq(tags.userId, session.user.id), eq(tags.id, id)));

		if (!result.length) {
			return NextResponse.json({ error: "Tag not found" }, { status: 404 });
		}

		return NextResponse.json(result[0]);
	} catch (error) {
		console.error("GET /api/tags/[id] error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
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
			title: body.title,
			color: body.color ?? null,
			updatedAt: new Date(),
		};

		const result = await db
			.update(tags)
			.set(updatedData)
			.where(and(eq(tags.id, id), eq(tags.userId, session.user.id)))
			.returning();

		if (!result.length) {
			return NextResponse.json({ error: "Tag not found" }, { status: 404 });
		}

		return NextResponse.json(result[0]);
	} catch (error) {
		console.error("PUT /api/tags/[id] error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
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

		await db
			.delete(tags)
			.where(and(eq(tags.id, id), eq(tags.userId, session.user.id)));

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("DELETE /api/tags/[id] error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
