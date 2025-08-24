"use client";

import AllTaskLists from "@/components/features/task-list/all-task-lists";
import { TaskListSummaryCard } from "@/components/features/task-list/task-list-summary-card";
import AppLayout from "@/components/layouts/app-layout";
import HeaderNav from "@/components/layouts/headers/task-lists/header-nav";
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function ListsPage() {
	const { data: allTaskLists = [], isLoading } = useTaskLists();
	const { data: allTasks = [] } = useTasks();

	return (
		<AppLayout header={<HeaderNav />}>
			<AllTaskLists
				iconName="Folders"
				title="All Lists"
				description="Organize and track your tasks across multiple lists."
				taskLists={allTaskLists}
				tasks={allTasks}
				isLoading={isLoading}
			/>

			<TaskListSummaryCard
				taskLists={allTaskLists}
				tasks={allTasks}
				isLoading={isLoading}
			/>
		</AppLayout>
	);
}
