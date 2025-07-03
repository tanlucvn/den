import { z } from "zod";

export const quickNewTaskSchema = z.object({
	title: z.string().min(1, "Task title is required").max(100),
});

export type QuickNewTaskFormValues = z.infer<typeof quickNewTaskSchema>;
