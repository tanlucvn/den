import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import type { TaskList } from "@/db/schema/task-lists";
import { useTaskListActions } from "@/hooks/actions/use-task-list-actions";
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
		},
	});

	const handleSubmit = async (values: EditTaskListValues) => {
		if (!initialData) return;

		await handleUpdate({
			...initialData,
			...values,
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
