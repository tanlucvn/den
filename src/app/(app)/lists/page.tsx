"use client";

import { TaskListSection } from "@/components/features/task-list/task-list-section";
import { TaskListSummaryCard } from "@/components/features/task-list/task-list-summary-card";
import AppLayout from "@/components/layouts/app-layout";
import HeaderNav from "@/components/layouts/headers/task-lists/header-nav";
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function ListsPage() {
	const { data: allTaskLists = [], isLoading, isFetched } = useTaskLists();
	const { data: allTasks = [] } = useTasks();

	return (
		<AppLayout header={<HeaderNav />}>
			<div className="space-y-1 rounded-2xl border border-dashed p-1 shadow-xs">
				<TaskListSection
					iconName="Folders"
					title="All Lists"
					description="Organize and track your tasks across multiple lists."
					taskLists={allTaskLists}
					tasks={allTasks}
					isLoading={isLoading}
					isFetched={isFetched}
				/>

				<TaskListSummaryCard
					taskLists={allTaskLists}
					tasks={allTasks}
					isLoading={isLoading}
				/>
			</div>
		</AppLayout>
	);
}
