import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { lists } from "@/db/schema/lists";
import { auth } from "@/lib/auth";

export async function GET() {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const result = await db.query.lists.findMany({
			where: eq(lists.userId, session.user.id),
		});

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("GET /api/lists error:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : String(error),
			},
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

		const [inserted] = await db
			.insert(lists)
			.values({
				...body,
				userId: session.user.id,
			})
			.returning();

		return NextResponse.json(inserted, { status: 201 });
	} catch (error) {
		console.error("POST /api/lists error:", error);
		return NextResponse.json(
			{
				error: "Internal Server Error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
