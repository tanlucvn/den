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
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { cn } from "@/lib/utils";
import {
	type EditTaskFormValues,
	editTaskSchema,
} from "@/lib/validators/edit-task";

interface EditTaskFormProps {
	initialData: Task;
	onFinish: (reset: () => void) => void;
}

export default function EditTaskForm({
	initialData,
	onFinish,
}: EditTaskFormProps) {
	const { loading, handleUpdate } = useTaskActions();

	const form = useForm<EditTaskFormValues>({
		resolver: zodResolver(editTaskSchema),
		defaultValues: {
			title: initialData.title,
			note: initialData.note ?? "",
			location: initialData.location ?? "",
			priority: initialData.priority,
			remindAt: initialData.remindAt,
		},
	});

	const handleSubmit = async (values: EditTaskFormValues) => {
		if (!initialData) return;

		await handleUpdate({
			...initialData,
			...values,
			remindAt: values.remindAt ?? null,
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
									name="Pen"
									className={cn(
										"text-primary/60",
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
					name="note"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								<IconRenderer name="Captions" className="text-primary/60" />
								Note
								<span className="font-normal text-muted-foreground text-xs">
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
								<IconRenderer name="MapPin" className="text-primary/60" />
								Location
								<span className="font-normal text-muted-foreground text-xs">
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
									<span className="font-normal text-muted-foreground text-xs">
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
												<IconRenderer name="Flag" className="text-rose-500" />
												High
											</SelectItem>
											<SelectItem value="medium">
												<IconRenderer name="Flag" className="text-amber-500" />
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
