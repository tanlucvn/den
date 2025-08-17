import { z } from "zod";

export const newTaskListSchema = z.object({
	title: z.string().min(1, { message: "List title is required" }),
	description: z
		.string()
		.max(200, { message: "Max 200 characters" })
		.optional(),
	color: z.string().nullable().optional(),
	icon: z.string().nullable().optional(),
});

export type NewTaskListFormValues = z.infer<typeof newTaskListSchema>;
