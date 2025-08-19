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
import { useTags } from "@/hooks/mutations/use-tag-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import {
	ALL_PRIORITY,
	ALL_STATUS,
	type ColorId,
	PRIORITY_COLORS,
	STATUS_COLORS,
	TEXT_COLOR_CLASSES,
} from "@/lib/constants";
import {
	filterByPriority,
	filterByStatus,
	filterByTags,
} from "@/lib/helpers/tasks-filter-by";
import { type FilterType, useFilterStore } from "@/store/use-filter-store";

export function HeaderFilter() {
	const { data: tasks = [] } = useTasks();
	const { data: tags = [] } = useTags();
	const [open, setOpen] = useState<boolean>(false);
	const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

	const { filters, toggleFilter, clearFilters, getActiveFiltersCount } =
		useFilterStore();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					size="sm"
					variant="ghost"
					className="relative w-fit font-normal"
				>
					<IconRenderer name="ListFilter" className="text-primary/60" />
					Filter
					{getActiveFiltersCount() > 0 && (
						<span className="-top-1 -right-1 absolute flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
							{getActiveFiltersCount()}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-60 p-0" align="start">
				{activeFilter === null ? (
					<Command>
						<CommandList>
							<CommandGroup>
								<CommandItem
									onSelect={() => setActiveFilter("status")}
									className="flex cursor-pointer items-center justify-between"
								>
									<span className="flex items-center gap-2">
										<IconRenderer
											name="CircleCheck"
											className="text-primary/60"
										/>
										Status
									</span>
									<div className="flex items-center">
										{filters.status.length > 0 && (
											<span className="mr-1 text-muted-foreground text-xs">
												{filters.status.length}
											</span>
										)}
										<IconRenderer name="ChevronRight" />
									</div>
								</CommandItem>
								<CommandItem
									onSelect={() => setActiveFilter("priority")}
									className="flex cursor-pointer items-center justify-between"
								>
									<span className="flex items-center gap-2">
										<IconRenderer name="Flag" className="text-primary/60" />
										Priority
									</span>
									<div className="flex items-center">
										{filters.priority.length > 0 && (
											<span className="mr-1 text-muted-foreground text-xs">
												{filters.priority.length}
											</span>
										)}
										<IconRenderer name="ChevronRight" />
									</div>
								</CommandItem>
								<CommandItem
									onSelect={() => setActiveFilter("tags")}
									className="flex cursor-pointer items-center justify-between"
								>
									<span className="flex items-center gap-2">
										<IconRenderer
											name="Tags"
											className="size-4 text-muted-foreground"
										/>
										Tags
									</span>
									<div className="flex items-center">
										{filters.tags.length > 0 && (
											<span className="mr-1 text-muted-foreground text-xs">
												{filters.tags.length}
											</span>
										)}
										<IconRenderer name="ChevronRight" />
									</div>
								</CommandItem>
							</CommandGroup>
							{getActiveFiltersCount() > 0 && (
								<>
									<CommandSeparator />
									<CommandGroup>
										<CommandItem
											onSelect={() => clearFilters()}
											className="text-destructive"
										>
											Clear all filters
										</CommandItem>
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				) : activeFilter === "status" ? (
					<Command>
						<div className="flex items-center border-b p-2">
							<Button
								variant="ghost"
								size="icon"
								className="size-6"
								onClick={() => setActiveFilter(null)}
							>
								<IconRenderer name="ChevronRight" className="rotate-180" />
							</Button>
							<span className="ml-2 font-medium text-sm">Status</span>
						</div>
						<CommandInput placeholder="Search status..." />
						<CommandList>
							<CommandEmpty className="p-0">
								<EmptyState
									icon="SearchX"
									title="No status found"
									description="Try another keyword."
								/>
							</CommandEmpty>
							<CommandGroup>
								{ALL_STATUS.map((item) => (
									<CommandItem
										key={item.id}
										value={item.id}
										onSelect={() => toggleFilter("status", item.id)}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<IconRenderer
												name={item.icon}
												className={STATUS_COLORS[item.id]}
											/>
											{item.name}
										</div>
										{filters.status.includes(item.id) && (
											<IconRenderer name="CheckIcon" className="ml-auto" />
										)}
										<span className="text-muted-foreground text-xs">
											{filterByStatus(tasks, item.id).length}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				) : activeFilter === "priority" ? (
					<Command>
						<div className="flex items-center border-b p-2">
							<Button
								variant="ghost"
								size="icon"
								className="size-6"
								onClick={() => setActiveFilter(null)}
							>
								<IconRenderer name="ChevronRight" className="rotate-180" />
							</Button>
							<span className="ml-2 font-medium text-sm">Priority</span>
						</div>
						<CommandInput placeholder="Search priority..." />
						<CommandList>
							<CommandEmpty className="p-0">
								<EmptyState
									icon="SearchX"
									title="No priorities found"
									description="Try another keyword."
								/>
							</CommandEmpty>
							<CommandGroup>
								{ALL_PRIORITY.map((item) => (
									<CommandItem
										key={item.id}
										value={item.id}
										onSelect={() => toggleFilter("priority", item.id)}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<IconRenderer
												name={item.icon}
												className={PRIORITY_COLORS[item.id]}
											/>
											{item.name}
										</div>
										{filters.priority.includes(item.id) && (
											<IconRenderer name="CheckIcon" className="ml-auto" />
										)}
										<span className="text-muted-foreground text-xs">
											{filterByPriority(tasks, item.id).length}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				) : activeFilter === "tags" ? (
					<Command>
						<div className="flex items-center border-b p-2">
							<Button
								variant="ghost"
								size="icon"
								className="size-6"
								onClick={() => setActiveFilter(null)}
							>
								<IconRenderer name="ChevronRight" className="rotate-180" />
							</Button>
							<span className="ml-2 font-medium text-sm">Tags</span>
						</div>
						<CommandInput placeholder="Search tags..." />
						<CommandList>
							<CommandEmpty className="p-0">
								<EmptyState
									icon="SearchX"
									title="No tags found"
									description="Try another keyword or create a new tag."
								/>
							</CommandEmpty>
							<CommandGroup>
								{tags.map((item) => (
									<CommandItem
										key={item.id}
										value={item.title}
										onSelect={() => toggleFilter("tags", item.id)}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<IconRenderer
												name="Tag"
												className={
													TEXT_COLOR_CLASSES[item?.color as ColorId] ??
													"text-primary/60"
												}
											/>
											{item.title}
										</div>
										{filters.tags.includes(item.id) && (
											<IconRenderer name="CheckIcon" className="ml-auto" />
										)}
										<span className="text-muted-foreground text-xs">
											{filterByTags(tasks, item.id).length}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				) : null}
			</PopoverContent>
		</Popover>
	);
}
