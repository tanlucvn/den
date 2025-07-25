import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Tag } from "@/db/schema/tags";
import { useTagActions } from "@/hooks/use-tag-actions";
import { cn } from "@/lib/utils";
import {
	type EditTagFormValues,
	editTagSchema,
} from "@/lib/validators/edit-tag";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { ColorInput } from "../ui/color-input";

interface EditTagFormProps {
	initialData: Tag;
	onFinish: () => void;
}

export default function EditTagForm({
	initialData,
	onFinish,
}: EditTagFormProps) {
	const { loading, onUpdate } = useTagActions();
	const [isCollapsed, setIsCollapsed] = useState(!!initialData.color);

	const form = useForm<EditTagFormValues>({
		resolver: zodResolver(editTagSchema),
		defaultValues: {
			title: initialData.title,
			color: initialData.color || "",
		},
	});

	const handleSubmit = async (values: EditTagFormValues) => {
		if (!initialData) return;

		await onUpdate({
			...initialData,
			...values,
			color: values.color?.trim() || null,
		});

		form.reset();
		onFinish?.();
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
										"text-primary/60",
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
					name="color"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<FormLabel>
										<IconRenderer name="Palette" className="text-primary/60" />
										Color
									</FormLabel>
								</div>

								<Button
									variant="outline"
									size="icon"
									type="button"
									onClick={() => setIsCollapsed(!isCollapsed)}
								>
									<IconRenderer
										name={isCollapsed ? "ChevronsDownUp" : "ChevronsUpDown"}
									/>
								</Button>
							</div>

							<Collapsible
								open={isCollapsed}
								onOpenChange={(open) => {
									setIsCollapsed(open);

									if (!open) {
										field.onChange("");
									}
								}}
							>
								<CollapsibleContent>
									<FormControl>
										<ColorInput
											defaultValue={field.value}
											onChange={(val) => field.onChange(val)}
										/>
									</FormControl>
								</CollapsibleContent>
							</Collapsible>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={loading}>
					{loading && <IconRenderer name="Loader2" className="animate-spin" />}
					Save
				</Button>
			</form>
		</Form>
	);
}
