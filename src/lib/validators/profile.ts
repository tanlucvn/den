import { z } from "zod";

export const profileNameSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
});

export const profileEmailSchema = z.object({
	email: z.string().email("Please enter a valid email"),
});

export type NameFormValues = z.infer<typeof profileNameSchema>;
export type EmailFormValues = z.infer<typeof profileEmailSchema>;
