import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import type { NewTask, Task } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { useSession } from "@/lib/auth-client";
import { PRIORITY_COLORS, STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { type TaskValues, taskSchema } from "@/lib/validators/task-schema";

interface NewTaskFormProps {
	initialData?: Partial<Task>;
	onSubmit: () => void;
}

export default function NewTaskForm({
	initialData,
	onSubmit,
}: NewTaskFormProps) {
	const { data } = useSession();

	const { loading, handleCreate } = useTaskActions();

	const form = useForm<TaskValues>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: initialData?.title || "",
			description: initialData?.description || "",
			location: initialData?.location || "",
			priority: initialData?.priority || "none",
			status: initialData?.status || "todo",
			remindAt: initialData?.remindAt || null,
		},
	});

	const handleSubmit = async (values: TaskValues) => {
		if (!data) return;

		// For optimistic UI
		const id = crypto.randomUUID();

		const newTask: NewTask = {
			...values,
			id: id,
			userId: data.user.id,
			isCompleted: false,
			isPinned: false,
			remindAt: values.remindAt,
		};

		await handleCreate(newTask);
		form.reset();

		onSubmit();
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
									name="Pen"
									className={cn(
										"text-muted-foreground",
										form.formState.errors.title && "text-destructive",
									)}
								/>
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
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<IconRenderer
									name="PenLine"
									className="text-muted-foreground"
								/>
								Description
								<span className="font-normal text-muted-foreground text-xs">
									(optional)
								</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Quick description..."
									{...field}
									value={field.value ?? ""}
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
								<IconRenderer name="MapPin" className="text-muted-foreground" />
								Location
								<span className="font-normal text-muted-foreground text-xs">
									(optional)
								</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g. Work, Home"
									{...field}
									value={field.value ?? ""}
								/>
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
									<span className="font-normal text-muted-foreground text-xs">
										(optional)
									</span>
								</FormLabel>
								<Select
									value={field.value === "none" ? "" : field.value}
									onValueChange={(val) => field.onChange(val || "none")}
								>
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
													className={PRIORITY_COLORS.high}
												/>
												High
											</SelectItem>
											<SelectItem value="medium">
												<IconRenderer
													name="Flag"
													className={PRIORITY_COLORS.medium}
												/>
												Medium
											</SelectItem>
											<SelectItem value="low">
												<IconRenderer
													name="Flag"
													className={PRIORITY_COLORS.low}
												/>
												Low
											</SelectItem>
											<SelectSeparator />
											<SelectItem value="none" className={PRIORITY_COLORS.none}>
												None
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Status Select */}
					<FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Status
									<span className="font-normal text-muted-foreground text-xs">
										(optional)
									</span>
								</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Set status" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="todo">
												<IconRenderer
													name="Circle"
													className={STATUS_COLORS.todo}
												/>
												Todo
											</SelectItem>
											<SelectItem value="in_progress">
												<IconRenderer
													name="CircleDot"
													className={STATUS_COLORS.in_progress}
												/>
												In Progress
											</SelectItem>
											<SelectItem value="paused">
												<IconRenderer
													name="CircleSlash"
													className={STATUS_COLORS.paused}
												/>
												Paused
											</SelectItem>
											<SelectItem value="completed">
												<IconRenderer
													name="CircleCheck"
													className={STATUS_COLORS.completed}
												/>
												Completed
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Date Picker */}
				<FormField
					control={form.control}
					name="remindAt"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>
								Remind me on
								<span className="font-normal text-muted-foreground text-xs">
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
											{field.value ? format(field.value, "PPP") : "Pick a date"}
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

				<Button type="submit" className="w-full" disabled={loading}>
					{loading && <IconRenderer name="Loader2" className="animate-spin" />}
					Add
				</Button>
			</form>
		</Form>
	);
}
