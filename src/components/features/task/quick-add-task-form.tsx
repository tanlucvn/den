"use client";

import { useUser } from "@clerk/nextjs";
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
import { Input, InputSuffix, InputWrapper } from "@/components/ui/input";
import { useTaskActions } from "@/hooks/use-task-actions";
import {
	type QuickNewTaskFormValues,
	quickNewTaskSchema,
} from "@/lib/validators/quick-new-task";
import { useDialogStore } from "@/store/use-dialog-store";

export default function QuickAddTaskForm() {
	const { user } = useUser();
	const { onCreate } = useTaskActions();
	const { setIsNewTaskOpen } = useDialogStore();

	const form = useForm<QuickNewTaskFormValues>({
		resolver: zodResolver(quickNewTaskSchema),
		defaultValues: {
			title: "",
		},
	});

	const onSubmit = async (values: QuickNewTaskFormValues) => {
		if (!user) return;

		await onCreate({
			title: values.title.trim(),
			userId: user.id,
			isCompleted: false,
			isPinned: false,
			note: "",
			location: "",
			priority: "none",
		});

		form.reset();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<InputWrapper>
									<Input
										{...field}
										placeholder="Add a quick task..."
										className="rounded-full pr-24 text-foreground"
										aria-invalid={!!form.formState.errors.title}
									/>

									<InputSuffix className="right-1 flex items-center gap-1">
										<Button
											variant="ghost"
											size="icon"
											className="size-7 rounded-full text-muted-foreground"
											onClick={() => setIsNewTaskOpen(true)}
										>
											<IconRenderer name="Maximize2" />
										</Button>

										<Button
											size="sm"
											type="submit"
											className="h-7 gap-1 rounded-full text-xs"
										>
											Add
											<IconRenderer name="Plus" className="size-3.5" />
										</Button>
									</InputSuffix>
								</InputWrapper>
							</FormControl>
							<FormMessage className="ml-2 text-xs" />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
