"use client";

import { BarChart3, CheckIcon, ChevronRight, CircleCheck } from "lucide-react";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import {
	ALL_PRIORITY,
	ALL_STATUS,
	PRIORITY_COLORS,
	STATUS_COLORS,
} from "@/lib/constants";
import { filterByPriority, filterByStatus } from "@/lib/helpers/filter-by";
import { useFilterStore } from "@/store/use-filter-store";

// Define filter types
type FilterType = "status" | "priority";

export function FilterPopover() {
	const { data: tasks = [] } = useTasks();
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
										<CircleCheck className="size-4 text-muted-foreground" />
										Status
									</span>
									<div className="flex items-center">
										{filters.status.length > 0 && (
											<span className="mr-1 text-muted-foreground text-xs">
												{filters.status.length}
											</span>
										)}
										<ChevronRight className="size-4" />
									</div>
								</CommandItem>
								<CommandItem
									onSelect={() => setActiveFilter("priority")}
									className="flex cursor-pointer items-center justify-between"
								>
									<span className="flex items-center gap-2">
										<BarChart3 className="size-4 text-muted-foreground" />
										Priority
									</span>
									<div className="flex items-center">
										{filters.priority.length > 0 && (
											<span className="mr-1 text-muted-foreground text-xs">
												{filters.priority.length}
											</span>
										)}
										<ChevronRight className="size-4" />
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
								<ChevronRight className="size-4 rotate-180" />
							</Button>
							<span className="ml-2 font-medium text-sm">Status</span>
						</div>
						<CommandInput placeholder="Search status..." />
						<CommandList>
							<CommandEmpty>No status found.</CommandEmpty>
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
											<CheckIcon size={16} className="ml-auto" />
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
								<ChevronRight className="size-4 rotate-180" />
							</Button>
							<span className="ml-2 font-medium text-sm">Priority</span>
						</div>
						<CommandInput placeholder="Search priority..." />
						<CommandList>
							<CommandEmpty>No priorities found.</CommandEmpty>
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
											<CheckIcon size={16} className="ml-auto" />
										)}
										<span className="text-muted-foreground text-xs">
											{filterByPriority(tasks, item.id).length}
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
