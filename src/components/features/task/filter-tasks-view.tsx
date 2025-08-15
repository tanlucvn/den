"use client";

import { IconRenderer } from "@/components/icon-renderer";
import { EmptyState } from "@/components/ui/empty-state";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import { ALL_STATUS, STATUS_COLORS } from "@/lib/constants";
import { useFilterStore } from "@/store/use-filter-store";
import TaskSection from "./task-section";

export function FilteredTasksView() {
	const { data: tasks = [] } = useTasks();
	const { filters, hasActiveFilters } = useFilterStore();

	// Nếu không có filter nào thì không render
	if (!hasActiveFilters()) return null;

	// Lọc tasks theo filter đang chọn
	const filteredTasks = tasks.filter((task) => {
		// Lọc theo status
		const matchStatus =
			filters.status.length === 0 || filters.status.includes(task.status);

		// Lọc theo priority
		const matchPriority =
			filters.priority.length === 0 || filters.priority.includes(task.priority);

		// Lọc theo labels (nếu có tags)
		const matchLabels =
			filters.labels.length === 0 ||
			task.tags?.some((tag) => filters.labels.includes(tag.id));

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
		<div className="flex flex-col gap-2">
			<div className="text-foreground text-sm">
				Found <span className="font-medium">{filteredTasks.length}</span> task
				{filteredTasks.length !== 1 && "s"} matching filters
			</div>
			<div className="space-y-4">
				{ALL_STATUS.map(({ id, name, icon }) => {
					const tasksByStatus = filteredTasks.filter((t) => t.status === id);
					if (!tasksByStatus.length) return null;

					return (
						<TaskSection
							key={id}
							icon={<IconRenderer name={icon} className={STATUS_COLORS[id]} />}
							title={name}
							tasks={tasksByStatus}
							defaultOpen
						/>
					);
				})}
			</div>
		</div>
	);
}
