"use client";

import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Command,
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
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { cn } from "@/lib/utils";

interface TaskListComboboxProps {
	value?: string;
	onValueChange?: (id: string) => void;
	showTrigger?: boolean;
}

export default function TaskListCombobox({
	value,
	onValueChange,
	showTrigger = true,
}: TaskListComboboxProps) {
	const { data: allLists, isPending, isFetched } = useTaskLists();
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const selectedList = allLists?.find((l) => l.id === value);

	const filteredLists = allLists?.filter((list) =>
		list.title.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			{showTrigger && (
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className={cn(
							"size-7",
							selectedList?.color &&
								`text-${selectedList?.color}-500 hover:text-${selectedList?.color}-500`,
						)}
					>
						<IconRenderer name={selectedList?.icon ?? "List"} />
					</Button>
				</PopoverTrigger>
			)}
			<PopoverContent className="w-56 p-0">
				<Command>
					<CommandInput
						value={search}
						onValueChange={setSearch}
						placeholder="Search lists..."
						className="text-sm"
					/>
					<CommandList className="max-h-[150px] overflow-y-auto">
						{isPending ? (
							<CommandGroup>
								{[...Array(5)].map((_, i) => (
									<div key={i} className="flex items-center gap-2 px-2 py-1.5">
										<div className="h-4 w-4 animate-pulse rounded bg-muted-foreground/20" />
										<div className="h-4 flex-1 animate-pulse rounded bg-muted-foreground/20" />
									</div>
								))}
							</CommandGroup>
						) : isFetched && filteredLists?.length === 0 ? (
							<EmptyState
								icon="SearchX"
								title="No lists found"
								description="Try another keyword."
								contentClassName="rounded-none border-none px-2"
							/>
						) : (
							<CommandGroup>
								{filteredLists?.map((list) => (
									<CommandItem
										key={list.id}
										value={list.id}
										onSelect={() => {
											onValueChange?.(list.id);
											setOpen(false);
										}}
										className="flex items-center gap-2"
									>
										{list.icon && (
											<IconRenderer
												name={list.icon}
												className={`text-${list.color}-500`}
											/>
										)}
										{list.title}
										{value === list.id && (
											<IconRenderer name="Check" className="ml-auto" />
										)}
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
