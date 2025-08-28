import { z } from "zod";

export const listSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z
		.string()
		.max(200, { message: "Max 200 characters" })
		.optional(),
	color: z.string().nullable().optional(),
	icon: z.string().nullable().optional(),
	note: z.string().nullable().optional(),
});

export type ListValues = z.infer<typeof listSchema>;
