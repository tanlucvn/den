import { z } from "zod";

export const editTagSchema = z.object({
	title: z.string().min(1, "Tag title is required"),
	color: z.string().nullable().optional(),
});

export type EditTagFormValues = z.infer<typeof editTagSchema>;
