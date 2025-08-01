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
import type { NewTaskList } from "@/db/schema/task-lists";
import { useTaskListActions } from "@/hooks/actions/use-task-list-actions";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
	type NewTaskListFormValues,
	newTaskListSchema,
} from "@/lib/validators/new-task-list";
import { Button } from "../ui/button";

interface NewTaskListFormProps {
	onFinish: () => void;
}

export default function NewTaskListForm({ onFinish }: NewTaskListFormProps) {
	const { data: session } = useSession();

	const { loading, handleCreate } = useTaskListActions();

	const form = useForm<NewTaskListFormValues>({
		resolver: zodResolver(newTaskListSchema),
		defaultValues: {
			title: "",
		},
	});

	const onSubmit = async (values: NewTaskListFormValues) => {
		if (!session) return;

		const newList: NewTaskList = {
			...values,
			userId: session.user.id,
		};

		await handleCreate(newList);

		form.reset();
		onFinish?.();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
								<Input placeholder="New list title" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={loading}>
					{loading && <IconRenderer name="Loader2" className="animate-spin" />}
					Create
				</Button>
			</form>
		</Form>
	);
}
