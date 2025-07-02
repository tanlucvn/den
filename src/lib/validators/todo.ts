import { z } from "zod";

export const newTodoSchema = z.object({
	title: z.string().min(1, "Title is required"),
	note: z.string().optional(),
	location: z.string().optional(),
	priority: z.enum(["none", "low", "medium", "high"]),
	remindAt: z.date().nullable().optional(),
});

export type NewTodoFormValues = z.infer<typeof newTodoSchema>;
