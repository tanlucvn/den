"use client";

import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { List, Task } from "@/db/schema";
import { useFilterStore } from "@/store/use-filter-store";
import { ListItem } from "./list-item";

interface FilterListsWrapperProps {
	lists: List[];
	tasks: Task[];
}

export function FilterListsWrapper({
	lists: taskLists,
	tasks,
}: FilterListsWrapperProps) {
	const { entities, hasActiveFilters } = useFilterStore();

	const filters = entities.lists;

	// Return null if no filter is active
	if (!hasActiveFilters("lists")) return null;

	// Filter lists based on the selected filters
	const filteredLists = taskLists.filter((list) => {
		const matchColor =
			filters.color.length === 0 ||
			(list.color !== null && filters.color.includes(list.color));

		const matchIcon =
			filters.icon.length === 0 ||
			(list.icon !== null && filters.icon.includes(list.icon));

		return matchColor && matchIcon;
	});

	// No matching lists fallback
	if (filteredLists.length === 0) {
		return (
			<EmptyState
				icon="FilterX"
				title="No task lists match filters"
				description="Try adjusting your filter settings."
				className="h-full"
				contentClassName="h-full"
			/>
		);
	}

	return (
		<div className="flex size-full flex-col gap-2">
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<div className="h-px flex-1 bg-border" />
				<Badge variant="secondary" className="rounded-full">
					<IconRenderer
						name="ListFilter"
						className="size-3 text-muted-foreground"
					/>
					{filteredLists.length} list{filteredLists.length !== 1 && "s"} found
				</Badge>
				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,max-content))] gap-2">
				{filteredLists.map((list) => {
					const tasksInList = tasks.filter((t) => t.listId === list.id);

					return (
						<ListItem
							key={list.id}
							list={list}
							tasks={tasksInList}
							className="max-w-[250px]"
						/>
					);
				})}
			</div>
		</div>
	);
}
