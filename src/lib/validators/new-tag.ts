import { z } from "zod";

export const newTagSchema = z.object({
	title: z.string().min(1, "Tag title is required"),
	color: z.string().optional().or(z.literal("")),
});

export type NewTagValues = z.infer<typeof newTagSchema>;
