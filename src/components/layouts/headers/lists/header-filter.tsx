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
import { useLists } from "@/hooks/mutations/use-list-mutation";
import { ALL_COLORS, BG_COLOR_CLASSES } from "@/lib/constants";
import { cn, formatIconName } from "@/lib/utils";
import { type FilterType, useFilterStore } from "@/store/use-filter-store";

export function HeaderFilter() {
	const { data: taskLists = [] } = useLists();
	const [open, setOpen] = useState(false);
	const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

	const { entities, toggleFilter, clearFilters, getActiveFiltersCount } =
		useFilterStore();

	const filters = entities.lists;
	const activeCount = getActiveFiltersCount("lists");

	const usedIcons = Array.from(
		new Set(
			taskLists
				.map((list) => list.icon)
				.filter((icon): icon is string => !!icon),
		),
	);

	const countByColor = (color: string) =>
		taskLists.filter((list) => list.color === color).length;

	const countByIcon = (icon: string) =>
		taskLists.filter((list) => list.icon === icon).length;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button size="sm" variant="ghost" className="relative font-normal">
					<IconRenderer name="ListFilter" className="text-muted-foreground" />
					Filter
					{activeCount > 0 && (
						<span className="-top-1 -right-1 absolute flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
							{activeCount}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-0" align="start">
				{activeFilter === null ? (
					<Command>
						<CommandList>
							<CommandGroup>
								<CommandItem
									onSelect={() => setActiveFilter("color")}
									className="flex cursor-pointer items-center justify-between"
								>
									<span className="flex items-center gap-2">
										<IconRenderer
											name="Palette"
											className="mr-2 text-muted-foreground"
										/>
										Color
									</span>
									<div className="flex items-center">
										{filters.color.length > 0 && (
											<span className="mr-1 text-muted-foreground text-xs">
												{filters.color.length}
											</span>
										)}
										<IconRenderer
											name="ChevronRight"
											className="text-muted-foreground"
										/>
									</div>
								</CommandItem>
								<CommandItem
									onSelect={() => setActiveFilter("icon")}
									className="flex cursor-pointer items-center justify-between"
								>
									<span className="flex items-center gap-2">
										<IconRenderer
											name="Smile"
											className="mr-2 text-muted-foreground"
										/>
										Icon
									</span>
									<div className="flex items-center">
										{filters.icon.length > 0 && (
											<span className="mr-1 text-muted-foreground text-xs">
												{filters.icon.length}
											</span>
										)}
										<IconRenderer
											name="ChevronRight"
											className="text-muted-foreground"
										/>
									</div>
								</CommandItem>
							</CommandGroup>
							{activeCount > 0 && (
								<>
									<CommandSeparator />
									<CommandGroup>
										<CommandItem
											onSelect={() => clearFilters("lists")}
											className="text-destructive"
										>
											Clear all filters
										</CommandItem>
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				) : null}

				{activeFilter === "color" && (
					<Command>
						<div className="flex items-center border-b p-2">
							<Button
								variant="ghost"
								size="icon"
								className="size-6"
								onClick={() => setActiveFilter(null)}
							>
								<IconRenderer
									name="ChevronRight"
									className="rotate-180 text-muted-foreground"
								/>
							</Button>
							<span className="ml-2 font-medium text-sm">Colors</span>
						</div>
						<CommandInput placeholder="Search colors..." />
						<CommandList>
							<CommandEmpty>
								<EmptyState title="No colors found" />
							</CommandEmpty>
							<CommandGroup>
								{ALL_COLORS.map((color) => (
									<CommandItem
										key={color.id}
										value={color.id}
										onSelect={() => toggleFilter("lists", "color", color.id)}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2 capitalize">
											<div
												className={cn(
													"size-4 shrink-0 rounded-full",
													BG_COLOR_CLASSES[color.id],
												)}
											/>
											{color.name}
										</div>
										{filters.color.includes(color.id) && (
											<IconRenderer name="CheckIcon" className="ml-auto" />
										)}
										<span className="text-muted-foreground text-xs">
											{countByColor(color.id)}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				)}

				{activeFilter === "icon" && (
					<Command>
						<div className="flex items-center border-b p-2">
							<Button
								variant="ghost"
								size="icon"
								className="size-6"
								onClick={() => setActiveFilter(null)}
							>
								<IconRenderer
									name="ChevronRight"
									className="rotate-180 text-muted-foreground"
								/>
							</Button>
							<span className="ml-2 font-medium text-sm">Icons</span>
						</div>
						<CommandInput placeholder="Search icons..." />
						<CommandList>
							<CommandEmpty>
								<EmptyState title="No icons found" />
							</CommandEmpty>
							<CommandGroup>
								{usedIcons.map((icon) => (
									<CommandItem
										key={icon}
										value={icon}
										onSelect={() => toggleFilter("lists", "icon", icon)}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											<IconRenderer name={icon} />
											{formatIconName(icon)}
										</div>
										{filters.icon.includes(icon) && (
											<IconRenderer name="CheckIcon" className="ml-auto" />
										)}
										<span className="text-muted-foreground text-xs">
											{countByIcon(icon)}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				)}
			</PopoverContent>
		</Popover>
	);
}
