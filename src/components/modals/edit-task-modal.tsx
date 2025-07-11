"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modals";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTaskActions } from "@/hooks/use-task-actions";
import { cn } from "@/lib/utils";
import {
	type NewTaskFormValues,
	newTaskSchema,
} from "@/lib/validators/new-task";
import { useAppStore } from "@/store/use-app-store";
import { useDialogStore } from "@/store/use-dialog-store";

export default function EditTaskModal() {
	const { editTask } = useAppStore();
	const { isEditTaskOpen, setIsEditTaskOpen } = useDialogStore();

	const { onUpdate } = useTaskActions();

	const form = useForm<NewTaskFormValues>({
		resolver: zodResolver(newTaskSchema),
		defaultValues: {
			title: "",
			note: "",
			location: "",
			priority: "none",
			remindAt: null,
		},
	});

	// * Set initial values when opening modal
	useEffect(() => {
		if (editTask) {
			form.reset({
				title: editTask.title,
				note: editTask.note ?? "",
				location: editTask.location ?? "",
				priority: editTask.priority ?? "none",
				remindAt: editTask.remindAt ? new Date(editTask.remindAt) : null,
			});
		}
	}, [editTask, form]);

	const onSubmit = async (values: NewTaskFormValues) => {
		if (!editTask) return;

		await onUpdate({
			...editTask,
			...values,
			remindAt: values.remindAt ?? null,
		});

		form.reset();
		setIsEditTaskOpen(false);
	};

	if (!editTask) return null;

	return (
		<Modal open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
			<ModalContent className="sm:max-w-md">
				<ModalHeader>
					<ModalTitle>Edit Task</ModalTitle>
					<ModalDescription>Update your plan</ModalDescription>
				</ModalHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
										<Input placeholder="I want to..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="note"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<IconRenderer name="Captions" />
										Note
										<span className="text-muted-foreground text-xs">
											(optional)
										</span>
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Optional details..."
											{...field}
											className="max-h-20 resize-none"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<IconRenderer name="MapPin" />
										Location
										<span className="text-muted-foreground text-xs">
											(optional)
										</span>
									</FormLabel>
									<FormControl>
										<Input placeholder="e.g. Work, Home" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-3">
							{/* Priority Select */}
							<FormField
								control={form.control}
								name="priority"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Priority
											<span className="text-muted-foreground text-xs">
												(optional)
											</span>
										</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Set priority" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="high">
														<IconRenderer
															name="Flag"
															className="text-rose-500"
														/>
														High
													</SelectItem>
													<SelectItem value="medium">
														<IconRenderer
															name="Flag"
															className="text-amber-500"
														/>
														Medium
													</SelectItem>
													<SelectItem value="low">
														<IconRenderer
															name="Flag"
															className="text-emerald-500"
														/>
														Low
													</SelectItem>
													<SelectSeparator />
													<SelectItem value="none">None</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Date Picker */}
							<FormField
								control={form.control}
								name="remindAt"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>
											Remind me on
											<span className="text-muted-foreground text-xs">
												(optional)
											</span>
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full justify-start text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														<IconRenderer name="Calendar" />
														{field.value
															? format(field.value, "PPP")
															: "Pick a date"}
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={field.value ?? new Date()}
													fromDate={new Date()}
													onSelect={(date) => field.onChange(date ?? null)}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<ModalFooter>
							<ModalClose asChild>
								<Button variant="outline">Cancel</Button>
							</ModalClose>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								Add New
							</Button>
						</ModalFooter>
					</form>
				</Form>
			</ModalContent>
		</Modal>
	);
}
