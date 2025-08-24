"use client";

import { EmptyState } from "@/components/ui/empty-state";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { useFilterStore } from "@/store/use-filter-store";
import { useViewStore } from "@/store/use-view-store";
import { TasksView } from "./tasks-view";

interface FilteredTasksWrapperProps {
	tasks: TaskWithTagsAndList[];
}

export function FilteredTasksWrapper({ tasks }: FilteredTasksWrapperProps) {
	const { viewType } = useViewStore();
	const { filters, hasActiveFilters } = useFilterStore();

	const isViewTypeGrid = viewType === "grid";

	// Return null if no filter is active
	if (!hasActiveFilters()) return null;

	// Filter tasks based on the selected filters
	const filteredTasks = tasks.filter((task) => {
		// Filter by status
		const matchStatus =
			filters.status.length === 0 || filters.status.includes(task.status);

		// Filter by priority
		const matchPriority =
			filters.priority.length === 0 || filters.priority.includes(task.priority);

		// Filter by tags (if tags exist)
		const matchLabels =
			filters.tags.length === 0 ||
			task.tags?.some((tag) => filters.tags.includes(tag.id));

		return matchStatus && matchPriority && matchLabels;
	});

	if (filteredTasks.length === 0) {
		return (
			<EmptyState
				icon="FilterX"
				title="No tasks match filters"
				description="Try adjusting your filter settings."
			/>
		);
	}

	return (
		<div className="flex size-full flex-col gap-2">
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<div className="h-px flex-1 bg-border" />
				<span>
					<span className="font-semibold text-foreground">
						{filteredTasks.length}
					</span>{" "}
					task{filteredTasks.length !== 1 && "s"} found
				</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<TasksView tasks={filteredTasks} isViewTypeGrid={isViewTypeGrid} />
		</div>
	);
}
