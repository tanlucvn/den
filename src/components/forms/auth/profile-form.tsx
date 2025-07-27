import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Session } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
	type NameFormValues,
	profileNameSchema,
} from "@/lib/validators/profile";

interface ProfileFormProps {
	session: Session;
	onFinish?: () => void;
}

export default function ProfileForm({ session, onFinish }: ProfileFormProps) {
	const form = useForm<NameFormValues>({
		resolver: zodResolver(profileNameSchema),
		defaultValues: {
			name: session.user.name ?? "",
		},
	});

	const handleSubmit = async (values: NameFormValues) => {
		await authClient.updateUser({ name: values.name });
		toast.success("Name updated successfully");

		form.reset();
		onFinish?.();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<IconRenderer
									name="UserPen"
									className={cn(
										"text-primary/60",
										form.formState.errors.name && "text-destructive",
									)}
								/>
								Display name
							</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Your full name" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full"
					disabled={!form.formState.isDirty || form.formState.isSubmitting}
				>
					{form.formState.isSubmitting && (
						<IconRenderer name="Loader2" className="mr-2 animate-spin" />
					)}
					Save
				</Button>
			</form>
		</Form>
	);
}
