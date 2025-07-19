import { z } from "zod";

export const editTaskListSchema = z.object({
	title: z.string().min(1, "Title is required"),
});

export type EditTaskListValues = z.infer<typeof editTaskListSchema>;
