import { z } from "zod";

export const editTaskListSchema = z.object({
	title: z.string().min(1, "Title is required"),
	color: z.string().nullable().optional(),
	icon: z.string().nullable().optional(),
});

export type EditTaskListValues = z.infer<typeof editTaskListSchema>;
