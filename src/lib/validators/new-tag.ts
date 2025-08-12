import { z } from "zod";

export const newTagSchema = z.object({
	title: z.string().min(1, "Tag title is required"),
	color: z.string().nullable().optional(),
});

export type NewTagValues = z.infer<typeof newTagSchema>;
