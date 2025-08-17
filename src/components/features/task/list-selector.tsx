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
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import { type ColorId, TEXT_COLOR_CLASSES } from "@/lib/constants";
import { filterByLists } from "@/lib/helpers/filter-by";

interface TaskListComboboxProps {
	value?: string;
	onValueChange?: (id: string | null) => void;
}

export default function TaskListCombobox({
	value,
	onValueChange,
}: TaskListComboboxProps) {
	const { data: tasks = [] } = useTasks();
	const { data: allLists, isPending } = useTaskLists();
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const selectedList = allLists?.find((l) => l.id === value);

	const filteredLists = allLists?.filter((list) =>
		list.title.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size="icon" className="size-7">
					<IconRenderer
						name={selectedList?.icon ?? "ListPlus"}
						className={
							TEXT_COLOR_CLASSES[selectedList?.color as ColorId] ??
							"text-primary/60"
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
								icon="SearchX"
								title="No lists found"
								description="Try another keyword."
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
											onSelect={() => {
												onValueChange?.(list.id);
												setOpen(false);
											}}
											className="flex items-center justify-between"
										>
											<div className="flex items-center gap-2 overflow-hidden">
												<IconRenderer
													name={list.icon ?? "List"}
													className={
														TEXT_COLOR_CLASSES[list?.color as ColorId] ??
														"text-primary/60"
													}
												/>
												<span className="truncate">{list.title}</span>
											</div>
											{value === list.id && (
												<IconRenderer name="CheckIcon" className="ml-auto" />
											)}
											<span className="text-muted-foreground text-xs">
												{filterByLists(tasks, list.id).length}
											</span>
										</CommandItem>
									))}
								</CommandGroup>

								{value && (
									<>
										<CommandSeparator />
										<CommandGroup>
											<CommandItem
												key="no-list"
												value="no-list"
												onSelect={() => {
													onValueChange?.(null);
													setOpen(false);
												}}
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
