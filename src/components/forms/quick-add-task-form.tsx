"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTaskActions } from "@/hooks/use-task-actions";
import { useSession } from "@/lib/auth-client";
import {
	type QuickNewTaskFormValues,
	quickNewTaskSchema,
} from "@/lib/validators/quick-new-task";

interface QuickAddFormProps {
	formId: string;
	listId?: string;
	onFinish?: () => void;
}

export default function QuickAddTaskForm({
	formId,
	listId,
	onFinish,
}: QuickAddFormProps) {
	const { data } = useSession();
	const { onCreate } = useTaskActions();

	const form = useForm<QuickNewTaskFormValues>({
		resolver: zodResolver(quickNewTaskSchema),
		defaultValues: {
			title: "",
		},
	});

	const handleSubmit = async (values: QuickNewTaskFormValues) => {
		if (!data) return;

		await onCreate({
			listId,
			title: values.title.trim(),
			userId: data.user.id,
			isCompleted: false,
			isPinned: false,
			note: "",
			location: "",
			priority: "none",
		});

		form.reset();
		onFinish?.();
	};

	return (
		<Form {...form}>
			<form id={formId} onSubmit={form.handleSubmit(handleSubmit)}>
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
			</form>
		</Form>
	);
}
