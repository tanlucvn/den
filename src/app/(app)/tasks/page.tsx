"use client";

import { FilterPopover } from "@/components/features/task/filter-popover";
import GroupedTaskSection from "@/components/features/task/grouped-task-section";
import { TaskSummaryCard } from "@/components/features/task/task-summary-card";
import AppLayout from "@/components/layouts/app-layout";
import HeaderNav from "@/components/layouts/headers/tasks/header-nav";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function TasksPage() {
	const { data: allTasks = [], isLoading, isFetched } = useTasks();

	return (
		<AppLayout header={<HeaderNav />}>
			<div className="space-y-1 rounded-2xl border border-dashed p-1 shadow-xs">
				<FilterPopover />
				<GroupedTaskSection
					iconName="Inbox"
					title="All Tasks"
					description="Keep track of everything in one place."
					// Option: Just render task in list
					// tasks={allTasks.filter((t) => t.listId === null)}
					tasks={allTasks}
					isLoading={isLoading}
					isFetched={isFetched}
				/>

				<TaskSummaryCard tasks={allTasks} isLoading={isLoading} />
			</div>
		</AppLayout>
	);
}
