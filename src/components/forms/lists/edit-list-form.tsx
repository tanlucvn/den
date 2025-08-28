import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-input";
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
import type { List } from "@/db/schema/lists";
import { useTaskListActions } from "@/hooks/actions/use-list-actions";
import type { ColorId } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { type ListValues, listSchema } from "@/lib/validators/list-schema";

interface EditListFormProps {
	initialData: List;
	onSubmit: () => void;
}

export default function EditListForm({
	initialData,
	onSubmit,
}: EditListFormProps) {
	const { loading, handleUpdate } = useTaskListActions();

	const form = useForm<ListValues>({
		resolver: zodResolver(listSchema),
		defaultValues: {
			title: initialData.title,
			description: initialData.description ?? "",
			icon: initialData.icon ?? null,
			color: initialData.color ?? null,
		},
	});

	const handleSubmit = async (values: ListValues) => {
		if (!initialData) return;

		await handleUpdate({
			...initialData,
			...values,
			description: values.description ?? "",
			icon: values.icon ?? null,
			color: values.color ?? null,
		});

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
									name="Pencil"
									className={cn(
										"text-muted-foreground",
										form.formState.errors.title && "text-destructive",
									)}
								/>
								Title
							</FormLabel>
							<FormControl>
								<Input placeholder="New task list title.." {...field} />
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
								<Input placeholder="List description..." {...field} />
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
									<IconRenderer
										name="Smile"
										className="text-muted-foreground"
									/>
									Icon
									<span className="font-normal text-muted-foreground text-xs">
										(optional)
									</span>
								</FormLabel>
								<FormControl>
									<IconPicker
										value={field.value}
										onValueChange={field.onChange}
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
									<IconRenderer
										name="Palette"
										className="text-muted-foreground"
									/>
									Color
									<span className="font-normal text-muted-foreground text-xs">
										(optional)
									</span>
								</FormLabel>

								<FormControl>
									<ColorPicker
										value={field.value as ColorId}
										onChange={(val) => field.onChange(val)}
									/>
								</FormControl>

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
