"use client";

import { useMemo, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { EmptyState } from "@/components/ui/empty-state";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { TaskWithTags } from "@/db/schema";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { useTags } from "@/hooks/mutations/use-tag-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import {
	BG_COLOR_CLASSES,
	type ColorId,
	ENTITY_ICONS,
	TEXT_COLOR_CLASSES,
} from "@/lib/constants";
import { filterByTags } from "@/lib/helpers/tasks-filter-by";
import { cn } from "@/lib/utils";

interface TaskTagSelectorProps {
	task: TaskWithTags;
	max?: number;
	editable?: boolean;
	className?: string;
}

export default function TaskTagSelector({
	task,
	max = 3,
	editable = true,
	className,
}: TaskTagSelectorProps) {
	const { data: tasks = [] } = useTasks();
	const { data: allTags, isPending } = useTags();
	const { handleUpdateTags } = useTaskActions();

	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<string[]>(
		task.tags?.map((t) => t.id) ?? [],
	);

	// Reset state
	const handleClose = () => {
		setSelected(task.tags?.map((t) => t.id) ?? []);
		setOpen(false);
	};

	const toggleTag = (id: string) =>
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);

	const handleSave = () => {
		handleUpdateTags(task, selected);
		setOpen(false);
	};

	const selectedTags = useMemo(
		() => allTags?.filter((t) => selected.includes(t.id)) ?? [],
		[allTags, selected],
	);

	const visibleTags = selectedTags.slice(0, max);
	const excess = selectedTags.length - max;

	const filteredTags = useMemo(
		() =>
			allTags?.filter((tag) =>
				tag.title.toLowerCase().includes(search.toLowerCase()),
			),
		[allTags, search],
	);

	return (
		<Popover
			open={open}
			onOpenChange={(state) => (state ? setOpen(true) : handleClose())}
		>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="hover:!bg-transparent mx-1 w-fit cursor-pointer p-0"
				>
					{selectedTags.length > 0 ? (
						<>
							<div className="flex gap-[1px]">
								{visibleTags.map((tag) => (
									<div
										key={tag.id}
										className={cn(
											"h-5 w-2 rounded-full border",
											BG_COLOR_CLASSES[tag.color as ColorId] ??
												"bg-muted-foreground",
											className,
										)}
									/>
								))}
							</div>
							{excess > 0 && (
								<span className="pr-1 text-[10px] text-muted-foreground">
									+{excess}
								</span>
							)}
						</>
					) : (
						<div className="h-5 w-2 rounded-full bg-muted" />
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-54 p-0">
				<Command>
					<CommandInput
						value={search}
						onValueChange={setSearch}
						placeholder="Search tags..."
						className="text-sm"
					/>
					<CommandList className="max-h-[150px] overflow-y-auto">
						<CommandEmpty>
							<EmptyState
								title="No tags found"
								description="Please try another keyword."
							/>
						</CommandEmpty>
						{isPending ? (
							<TagComboboxSkeleton />
						) : (
							<CommandGroup>
								{filteredTags?.map((tag) => (
									<CommandItem
										key={tag.id}
										value={tag.id}
										onSelect={() => toggleTag(tag.id)}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2 overflow-hidden">
											<IconRenderer
												name={ENTITY_ICONS.tags}
												className={
													TEXT_COLOR_CLASSES[tag.color as ColorId] ??
													"text-muted-foreground"
												}
											/>
											<span className="truncate">{tag.title}</span>
										</div>
										{selected.includes(tag.id) && (
											<IconRenderer name="CheckIcon" className="ml-auto" />
										)}
										<span className="text-muted-foreground text-xs">
											{filterByTags(tasks, tag.id).length}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>

					{editable && (
						<div className="p-1">
							<Button
								className="w-full"
								size="sm"
								variant="outline"
								onClick={handleSave}
							>
								Save
							</Button>
						</div>
					)}
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function TagComboboxSkeleton() {
	return (
		<CommandGroup>
			{[...Array(5)].map((_, i) => (
				<div key={i} className="flex items-center gap-2 px-2 py-1.5">
					<div className="h-4 w-4 animate-pulse rounded-full bg-muted-foreground/20" />
					<div className="h-4 flex-1 animate-pulse rounded bg-muted-foreground/20" />
				</div>
			))}
		</CommandGroup>
	);
}
