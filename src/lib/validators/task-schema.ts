import { z } from "zod";

export const taskSchema = z.object({
	id: z.string().optional(),
	listId: z.string().uuid().nullable().optional(),
	title: z
		.string()
		.min(1, "Title is required")
		.max(200, { message: "Max 200 characters" }),
	description: z
		.string()
		.max(200, { message: "Max 200 characters" })
		.nullable()
		.optional(),
	note: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
	priority: z.enum(["none", "low", "medium", "high"]),
	status: z.enum(["todo", "in_progress", "paused", "completed"]),
	// isCompleted: z.boolean().default(false),
	// isPinned: z.boolean().default(false),
	// isArchived: z.boolean().default(false),
	remindAt: z.coerce.date().nullable().optional(),
});

export type TaskValues = z.infer<typeof taskSchema>;
