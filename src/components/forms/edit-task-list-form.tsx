import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import type { TaskList } from "@/db/schema/task-lists";
import { useTaskListActions } from "@/hooks/actions/use-task-list-actions";
import type { ColorId } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
	type EditTaskListValues,
	editTaskListSchema,
} from "@/lib/validators/edit-task-list";

interface EditTaskListFormProps {
	initialData: TaskList;
	onFinish: (reset: () => void) => void;
}

export default function EditTaskListForm({
	initialData,
	onFinish,
}: EditTaskListFormProps) {
	const { loading, handleUpdate } = useTaskListActions();

	const form = useForm<EditTaskListValues>({
		resolver: zodResolver(editTaskListSchema),
		defaultValues: {
			title: initialData.title,
			icon: initialData.icon ?? null,
			color: initialData.color ?? null,
		},
	});

	const handleSubmit = async (values: EditTaskListValues) => {
		if (!initialData) return;

		await handleUpdate({
			...initialData,
			...values,
			icon: values.icon ?? null,
			color: values.color ?? null,
		});

		onFinish(() => form.reset());
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

				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="icon"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<IconRenderer name="Smile" className="text-primary/60" />
									Icon
									<span className="font-normal text-muted-foreground text-xs">
										(optional)
									</span>
								</FormLabel>
								<FormControl>
									<IconPicker
										selectedIcon={field.value}
										onIconSelect={field.onChange}
									/>
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
									<ColorPicker
										value={field.value as ColorId}
										onChange={(val) => field.onChange(val)}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

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
