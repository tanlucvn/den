import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todosTable } from "@/db/schema";

export async function GET() {
	const user = await currentUser();
	if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

	const data = await db
		.select()
		.from(todosTable)
		.where(eq(todosTable.userId, user.id));
	return Response.json(data);
}
