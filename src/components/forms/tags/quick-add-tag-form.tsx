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
import { useTagActions } from "@/hooks/actions/use-tag-actions";
import { useSession } from "@/lib/auth-client";
import { type TagValues, tagSchema } from "@/lib/validators/tag-schema";

export default function QuickAddTagForm() {
	const { data } = useSession();
	const { loading, handleCreate } = useTagActions();

	const form = useForm<TagValues>({
		resolver: zodResolver(tagSchema),
		defaultValues: {
			title: "",
		},
	});

	const handleSubmit = async (values: TagValues) => {
		if (!data) return;

		await handleCreate({
			title: values.title.trim(),
			userId: data.user.id,
		});

		form.reset();
	};

	return (
		<Form {...form}>
			<form id="quick-add-tag-form" onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									{...field}
									placeholder="Add a tag..."
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
					form="quick-add-tag-form"
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
