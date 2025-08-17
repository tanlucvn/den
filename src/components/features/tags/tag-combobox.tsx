"use client";

import { useEffect, useState } from "react";
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
import type { Tag } from "@/db/schema/tags";
import { useTags } from "@/hooks/mutations/use-tag-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import {
	BG_COLOR_CLASSES,
	type ColorId,
	TEXT_COLOR_CLASSES,
} from "@/lib/constants";
import { filterByTags } from "@/lib/helpers/filter-by";
import { cn } from "@/lib/utils";

interface Props {
	tags: Tag[];
	max?: number;
	selectedIds?: string[];
	onChange?: (ids: string[]) => void;
	editable?: boolean;
}

export default function TagChipCombobox({
	tags,
	max = 3,
	selectedIds = [],
	onChange,
	editable = true,
}: Props) {
	const { data: tasks = [] } = useTasks();
	const { data: allTags, isPending } = useTags();

	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [localSelected, setLocalSelected] = useState<Set<string>>(
		new Set(selectedIds),
	);

	const visibleTags = Array.from(tags).slice(0, max);
	const excess = tags.length - max;

	const filteredTags = allTags?.filter((tag) =>
		tag.title.toLowerCase().includes(search.toLowerCase()),
	);

	const toggleTag = (id: string) => {
		const updated = new Set(localSelected);
		updated.has(id) ? updated.delete(id) : updated.add(id);
		setLocalSelected(updated);
	};

	const handleSave = () => {
		onChange?.(Array.from(localSelected));
		setOpen(false);
	};

	useEffect(() => {
		if (open) {
			setLocalSelected(new Set(selectedIds));
		}
	}, [open, selectedIds]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="hover:!bg-transparent mx-1 w-fit cursor-pointer p-0"
				>
					{tags.length > 0 ? (
						<>
							<div className="flex gap-1">
								{visibleTags.map((t) => (
									<div
										key={t.id}
										className={cn(
											"h-5 w-2 rounded-full",
											BG_COLOR_CLASSES[t?.color as ColorId] ?? "bg-muted",
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
						<CommandEmpty className="p-0">
							<EmptyState
								icon="SearchX"
								title="No tags found"
								description="Try another keyword or create a new tag."
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
												name="Tag"
												className={
													TEXT_COLOR_CLASSES[tag?.color as ColorId] ??
													"text-primary/60"
												}
											/>
											<span className="truncate">{tag.title}</span>
										</div>
										{localSelected.has(tag.id) && (
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
