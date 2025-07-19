import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconRenderer } from "@/components/icon-renderer";
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
import { useTaskListActions } from "@/hooks/use-task-list-actions";
import {
	type EditTaskListValues,
	editTaskListSchema,
} from "@/lib/validators/edit-task-list";

interface EditTaskListFormProps {
	formId: string;
	initialData: TaskList;
	onFinish: (reset: () => void) => void;
}

export default function EditTaskListForm({
	formId,
	initialData,
	onFinish,
}: EditTaskListFormProps) {
	const { onUpdate } = useTaskListActions();

	const form = useForm<EditTaskListValues>({
		resolver: zodResolver(editTaskListSchema),
		defaultValues: {
			title: initialData.title,
		},
	});

	const handleSubmit = async (values: EditTaskListValues) => {
		if (!initialData) return;

		await onUpdate({
			...initialData,
			...values,
		});

		onFinish(() => form.reset());
	};

	return (
		<Form {...form}>
			<form
				id={formId}
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-4"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<IconRenderer name="PencilLine" />
								Title
							</FormLabel>
							<FormControl>
								<Input placeholder="New task list title.." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
