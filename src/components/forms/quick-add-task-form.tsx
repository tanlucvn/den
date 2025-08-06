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
	const { loading, handleCreate } = useTaskActions();

	const form = useForm<QuickNewTaskFormValues>({
		resolver: zodResolver(quickNewTaskSchema),
		defaultValues: {
			title: "",
		},
	});

	const handleSubmit = async (values: QuickNewTaskFormValues) => {
		if (!data) return;

		await handleCreate({
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

				<Button
					size="sm"
					type="submit"
					form={formId}
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
