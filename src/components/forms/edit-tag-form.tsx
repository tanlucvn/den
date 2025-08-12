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
import type { Tag } from "@/db/schema/tags";
import { useTagActions } from "@/hooks/actions/use-tag-actions";
import { cn } from "@/lib/utils";
import {
	type EditTagFormValues,
	editTagSchema,
} from "@/lib/validators/edit-tag";

interface EditTagFormProps {
	initialData: Tag;
	onFinish: () => void;
}

export default function EditTagForm({
	initialData,
	onFinish,
}: EditTagFormProps) {
	const { loading, handleUpdate } = useTagActions();

	const form = useForm<EditTagFormValues>({
		resolver: zodResolver(editTagSchema),
		defaultValues: {
			title: initialData.title,
			color: initialData.color ?? null,
		},
	});

	const handleSubmit = async (values: EditTagFormValues) => {
		if (!initialData) return;

		await handleUpdate({
			...initialData,
			...values,
			color: values.color ?? null,
		});

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
									name="Pencil"
									className={cn(
										"text-primary/60",
										form.formState.errors.title && "text-destructive",
									)}
								/>
								Title
							</FormLabel>
							<FormControl>
								<Input placeholder="New task list title.." {...field} />
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

				<Button
					type="submit"
					className="w-full"
					disabled={loading || !form.formState.isDirty}
				>
					{loading && <IconRenderer name="Loader2" className="animate-spin" />}
					Save
				</Button>
			</form>
		</Form>
	);
}
