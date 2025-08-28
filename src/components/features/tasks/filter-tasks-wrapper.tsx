"use client";

import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { useFilterStore } from "@/store/use-filter-store";
import { useViewStore } from "@/store/use-view-store";
import { TasksView } from "./tasks-view";

interface FilterTasksWrapperProps {
	tasks: TaskWithTagsAndList[];
}

export function FilterTasksWrapper({ tasks }: FilterTasksWrapperProps) {
	const { viewType } = useViewStore();
	const { entities, hasActiveFilters } = useFilterStore();

	const filters = entities.tasks;
	const isViewTypeGrid = viewType === "grid";

	// Return null if no filter is active
	if (!hasActiveFilters("tasks")) return null;

	// Filter tasks based on the selected filters
	const filteredTasks = tasks.filter((task) => {
		const matchStatus =
			filters.status.length === 0 || filters.status.includes(task.status);

		const matchPriority =
			filters.priority.length === 0 || filters.priority.includes(task.priority);

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
					{filteredTasks.length} task{filteredTasks.length !== 1 && "s"} found
				</Badge>
				<div className="h-px flex-1 bg-border" />
			</div>

			<TasksView tasks={filteredTasks} isViewTypeGrid={isViewTypeGrid} />
		</div>
	);
}
