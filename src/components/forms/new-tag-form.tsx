import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { ColorInput } from "@/components/ui/color-input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { NewTag } from "@/db/schema/tags";
import { useTagActions } from "@/hooks/actions/use-tag-actions";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { type NewTagValues, newTagSchema } from "@/lib/validators/new-tag";

interface NewTagFormProps {
	onFinish: () => void;
}

export default function NewTagForm({ onFinish }: NewTagFormProps) {
	const { data: session } = useSession();

	const { loading, handleCreate } = useTagActions();

	const form = useForm<NewTagValues>({
		resolver: zodResolver(newTagSchema),
		defaultValues: {
			title: "",
			color: null,
		},
	});

	const handleSubmit = async (values: NewTagValues) => {
		if (!session) return;

		const newTag: NewTag = {
			...values,
			userId: session.user.id,
			color: values.color,
		};

		await handleCreate(newTag);

		form.reset();
		onFinish?.();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<IconRenderer
									name="Tag"
									className={cn(
										"text-primary/60",
										form.formState.errors.title && "text-destructive",
									)}
								/>
								Title
							</FormLabel>
							<FormControl>
								<Input placeholder="New tag title.." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="color"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<IconRenderer name="Palette" className="text-primary/60" />
								Color
								<span className="font-normal text-muted-foreground text-xs">
									(optional)
								</span>
							</FormLabel>

							<FormControl>
								<ColorInput
									value={field.value}
									onChange={(val) => field.onChange(val)}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={loading}>
					{loading && (
						<IconRenderer name="Loader2" className="mr-2 animate-spin" />
					)}
					Save
				</Button>
			</form>
		</Form>
	);
}
