import { z } from "zod";

export const newTaskListSchema = z.object({
	title: z.string().min(1, { message: "List title is required" }),
	color: z.string().nullable().optional(),
	icon: z.string().nullable().optional(),
});

export type NewTaskListFormValues = z.infer<typeof newTaskListSchema>;
