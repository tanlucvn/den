import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tags } from "@/db/schema/tags";
import { auth } from "@/lib/auth";

export async function GET() {
	try {
		const session = await auth.api.getSession({ headers: await headers() });

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const data = await db
			.select()
			.from(tags)
			.where(eq(tags.userId, session.user.id));

		return NextResponse.json(data);
	} catch (error) {
		console.error("GET /api/tags error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
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

		const newTag = await db
			.insert(tags)
			.values({
				...body,
				userId: session.user.id,
			})
			.returning();

		return NextResponse.json(newTag[0]);
	} catch (error) {
		console.error("POST /api/tags error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
