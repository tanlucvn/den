import { z } from "zod";

export const tagSchema = z.object({
	title: z.string().min(1, "Tag title is required"),
	color: z.string().nullable().optional(),
});

export type TagValues = z.infer<typeof tagSchema>;
