"use client";

import AllTasks from "@/components/features/task/all-tasks";
import { TaskSummaryCard } from "@/components/features/task/task-summary-card";
import AppLayout from "@/components/layouts/app-layout";
import HeaderNav from "@/components/layouts/headers/tasks/header-nav";
import HeaderOptions from "@/components/layouts/headers/tasks/header-options";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function TasksPage() {
	const { data: allTasks = [], isLoading, isFetched } = useTasks();

	return (
		<AppLayout header={<HeaderNav />}>
			<div className="space-y-1 rounded-2xl border border-dashed p-1 shadow-xs">
				<HeaderOptions />
				<AllTasks
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
