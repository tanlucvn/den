import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import type { NewTag } from "@/db/schema/tags";
import { useTagActions } from "@/hooks/actions/use-tag-actions";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { type NewTagValues, newTagSchema } from "@/lib/validators/new-tag";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";

interface NewTagFormProps {
	onFinish: () => void;
}

export default function NewTagForm({ onFinish }: NewTagFormProps) {
	const { data: session } = useSession();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const { loading, handleCreate } = useTagActions();

	const form = useForm<NewTagValues>({
		resolver: zodResolver(newTagSchema),
		defaultValues: {
			title: "",
			color: "", // Default color
		},
	});

	const handleSubmit = async (values: NewTagValues) => {
		if (!session) return;

		const newTag: NewTag = {
			...values,
			userId: session.user.id,
			color: values.color?.trim() || undefined,
		};

		await handleCreate(newTag);

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
									name="Tag"
									className={cn(
										"text-primary/60",
										form.formState.errors.title && "text-destructive",
									)}
								/>
								Title
							</FormLabel>
							<FormControl>
								<Input placeholder="New tag title.." {...field} />
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
								<FormLabel>
									<IconRenderer name="Palette" className="text-primary/60" />
									Color
								</FormLabel>

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
											defaultValue={field.value || "#ef4444"}
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
					{loading && (
						<IconRenderer name="Loader2" className="mr-2 animate-spin" />
					)}
					Save
				</Button>
			</form>
		</Form>
	);
}
