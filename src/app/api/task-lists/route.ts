import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { taskLists } from "@/db/schema/task-lists";
import { auth } from "@/lib/auth";

export async function GET() {
	try {
		const session = await auth.api.getSession({ headers: await headers() });

		if (!session)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const lists = await db
			.select()
			.from(taskLists)
			.where(eq(taskLists.userId, session.user.id));

		return NextResponse.json(lists);
	} catch (error) {
		console.error("GET /task-lists error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });

		if (!session)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const body = await req.json();

		const result = await db
			.insert(taskLists)
			.values({
				...body,
				userId: session.user.id,
			})
			.returning();

		return NextResponse.json(result[0]);
	} catch (error) {
		console.error("POST /task-lists error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
