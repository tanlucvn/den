"use client";

import { useParams } from "next/navigation";
import AllTasks from "@/components/features/task/all-tasks";
import { TaskSummaryCard } from "@/components/features/task/task-summary-card";
import AppLayout from "@/components/layouts/app-layout";
import HeaderNav from "@/components/layouts/headers/task-lists/list/header-nav";
import HeaderOptions from "@/components/layouts/headers/tasks/header-options";
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasksByListId } from "@/hooks/mutations/use-task-mutation";

export default function TaskListPage() {
	const { id } = useParams() as { id: string };

	const { data: taskLists = [] } = useTaskLists();
	const currentList = taskLists.find((list) => list.id === id);

	const { data: tasks = [], isLoading, isFetched } = useTasksByListId(id);

	if (!currentList) return null;

	return (
		<AppLayout header={<HeaderNav taskList={currentList} />}>
			<div className="space-y-1 rounded-2xl border border-dashed p-1 shadow-xs">
				<HeaderOptions />
				<AllTasks
					iconName={currentList.icon ?? "List"}
					title={currentList.title}
					description={currentList.description ?? undefined}
					tasks={tasks}
					isLoading={isLoading}
					isFetched={isFetched}
					listId={id}
				/>

				<TaskSummaryCard tasks={tasks} isLoading={isLoading} />
			</div>
		</AppLayout>
	);
}
