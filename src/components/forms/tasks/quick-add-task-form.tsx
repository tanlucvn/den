"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { useSession } from "@/lib/auth-client";
import { type TaskValues, taskSchema } from "@/lib/validators/task-schema";

interface QuickAddFormProps {
	listId?: string;
}

export default function QuickAddTaskForm({ listId }: QuickAddFormProps) {
	const { data } = useSession();
	const { loading, handleCreate } = useTaskActions();

	const form = useForm<TaskValues>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: "",
			priority: "none",
			status: "todo",
		},
	});

	const handleSubmit = async (values: TaskValues) => {
		if (!data) return;

		// For optimistic UI
		const id = crypto.randomUUID();

		await handleCreate({
			...values,
			id: id,
			listId,
			title: values.title.trim(),
			userId: data.user.id,
		});

		form.reset();
	};

	return (
		<Form {...form}>
			<form id="quick-add-task-form" onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									placeholder="Add a quick task..."
									className="rounded-full"
								/>
							</FormControl>
							<FormMessage className="ml-2 text-xs" />
						</FormItem>
					)}
				/>

				<Button
					size="sm"
					type="submit"
					form="quick-add-task-form"
					className="absolute top-1 right-1 h-7 gap-1 rounded-full text-xs"
					disabled={loading}
				>
					Add
					{loading ? (
						<IconRenderer name="Loader2" className="size-3.5 animate-spin" />
					) : (
						<IconRenderer name="Plus" className="size-3.5" />
					)}
				</Button>
			</form>
		</Form>
	);
}
