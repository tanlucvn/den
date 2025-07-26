import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { taskTags } from "@/db/schema/tags";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({ headers: await headers() });

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { taskId, tagIds } = await req.json();

		if (!taskId || !Array.isArray(tagIds)) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}

		// Remove old tags
		await db.delete(taskTags).where(eq(taskTags.taskId, taskId));

		// Insert new tags
		const inserts = tagIds.map((tagId: string) => ({ taskId, tagId }));
		if (inserts.length > 0) {
			await db.insert(taskTags).values(inserts);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("POST /api/task-tags error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
