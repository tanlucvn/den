import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { ColorInput } from "@/components/ui/color-input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import type { NewTaskList } from "@/db/schema/task-lists";
import { useTaskListActions } from "@/hooks/actions/use-task-list-actions";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
	type NewTaskListFormValues,
	newTaskListSchema,
} from "@/lib/validators/new-task-list";

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
			icon: null,
			color: null,
		},
	});

	const onSubmit = async (values: NewTaskListFormValues) => {
		if (!session) return;

		const newList: NewTaskList = {
			...values,
			userId: session.user.id,
			icon: values.icon,
			color: values.color,
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

				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="icon"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<IconRenderer name="Smile" className="text-primary/60" />
									Icon
									<span className="font-normal text-muted-foreground text-xs">
										(optional)
									</span>
								</FormLabel>
								<FormControl>
									<IconPicker
										selectedIcon={field.value}
										onIconSelect={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="color"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<IconRenderer name="Palette" className="text-primary/60" />
									Color
									<span className="font-normal text-muted-foreground text-xs">
										(optional)
									</span>
								</FormLabel>

								<FormControl>
									<ColorInput
										value={field.value}
										onChange={(val) => field.onChange(val)}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit" className="w-full" disabled={loading}>
					{loading && <IconRenderer name="Loader2" className="animate-spin" />}
					Create
				</Button>
			</form>
		</Form>
	);
}
