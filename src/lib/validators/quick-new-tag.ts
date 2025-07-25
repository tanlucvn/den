import { z } from "zod";

export const quickNewTagSchema = z.object({
	title: z.string().min(1, "Tag title is required"),
});

export type QuickNewTagValues = z.infer<typeof quickNewTagSchema>;
