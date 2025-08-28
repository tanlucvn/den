"use client";

import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { EmptyState } from "@/components/ui/empty-state";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { TaskWithTagsAndList } from "@/db/schema";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { useLists } from "@/hooks/mutations/use-list-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import {
	type ColorId,
	ENTITY_ICONS,
	TEXT_COLOR_CLASSES,
} from "@/lib/constants";
import { filterByLists } from "@/lib/helpers/tasks-filter-by";
import { cn } from "@/lib/utils";

interface TaskListSelectorProps {
	task: TaskWithTagsAndList;
	listId?: string | null;
	className?: string;
}

export default function TaskListSelector({
	task,
	listId,
	className,
}: TaskListSelectorProps) {
	const { data: tasks = [] } = useTasks();
	const { data: allLists, isPending } = useLists();
	const { handleUpdate } = useTaskActions();

	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedListId, setSelectedListId] = useState<string | null>(
		listId ?? null,
	);

	const selectedList = allLists?.find((l) => l.id === selectedListId);

	const filteredLists = allLists?.filter((list) =>
		list.title.toLowerCase().includes(search.toLowerCase()),
	);

	const handleListChange = (listId: string | null) => {
		setSelectedListId(listId);
		setOpen(false);

		handleUpdate({ ...task, listId });
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size="icon" className={cn(className)}>
					<IconRenderer
						name={selectedList?.icon ?? "ListPlus"}
						className={
							TEXT_COLOR_CLASSES[selectedList?.color as ColorId] ??
							"text-muted-foreground"
						}
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-54 p-0">
				<Command>
					<CommandInput
						value={search}
						onValueChange={setSearch}
						placeholder="Search lists..."
						className="text-sm"
					/>
					<CommandList>
						<CommandEmpty className="p-0">
							<EmptyState
								title="No lists found"
								description="Please try another keyword."
							/>
						</CommandEmpty>

						{isPending ? (
							<ListSelectorSkeleton />
						) : (
							<>
								{/* Scrollable lists */}
								<CommandGroup className="max-h-[150px] overflow-y-auto">
									{filteredLists?.map((list) => (
										<CommandItem
											key={list.id}
											value={list.id}
											onSelect={() => handleListChange(list.id)}
											className="flex items-center justify-between"
										>
											<div className="flex items-center gap-2 overflow-hidden">
												<IconRenderer
													name={list.icon || ENTITY_ICONS.lists}
													className={
														TEXT_COLOR_CLASSES[list?.color as ColorId] ??
														"text-muted-foreground"
													}
												/>
												<span className="truncate">{list.title}</span>
											</div>
											{selectedListId === list.id && (
												<IconRenderer name="CheckIcon" className="ml-auto" />
											)}
											<span className="text-muted-foreground text-xs">
												{filterByLists(tasks, list.id).length}
											</span>
										</CommandItem>
									))}
								</CommandGroup>

								{selectedListId && (
									<>
										<CommandSeparator />
										<CommandGroup>
											<CommandItem
												key="no-list"
												value="no-list"
												onSelect={() => handleListChange(null)}
												className="!text-destructive flex items-center justify-between"
											>
												Remove from list
												<IconRenderer
													name="Trash"
													className="!text-destructive ml-auto"
												/>
											</CommandItem>
										</CommandGroup>
									</>
								)}
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function ListSelectorSkeleton() {
	return (
		<CommandGroup>
			{[...Array(5)].map((_, i) => (
				<div key={i} className="flex items-center gap-2 px-2 py-1.5">
					<div className="h-4 w-4 animate-pulse rounded bg-muted-foreground/20" />
					<div className="h-4 flex-1 animate-pulse rounded bg-muted-foreground/20" />
				</div>
			))}
		</CommandGroup>
	);
}
