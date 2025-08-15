import { z } from "zod";

export const editTaskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	note: z.string().optional(),
	location: z.string().optional(),
	priority: z.enum(["none", "low", "medium", "high"]),
	status: z.enum(["todo", "in_progress", "paused", "completed"]),
	remindAt: z.date().nullable().optional(),
});

export type EditTaskFormValues = z.infer<typeof editTaskSchema>;
