import { z } from "zod";

export const newTaskListSchema = z.object({
	title: z.string().min(1, { message: "List name is required" }),
});

export type NewTaskListFormValues = z.infer<typeof newTaskListSchema>;
