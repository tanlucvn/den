"use client";

import { useParams } from "next/navigation";
import AllTasks from "@/components/features/task/all-tasks";
import AppLayout from "@/components/layouts/app-layout";
import Header from "@/components/layouts/headers/task-lists/list/header";
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasksByListId } from "@/hooks/mutations/use-task-mutation";
import { ENTITY_ICONS } from "@/lib/constants";

export default function TaskListPage() {
	const { id } = useParams() as { id: string };

	const { data: taskLists = [] } = useTaskLists();
	const currentList = taskLists.find((list) => list.id === id);

	const { data: tasks = [], isLoading } = useTasksByListId(id);

	if (!currentList) return null;

	return (
		<AppLayout header={<Header taskList={currentList} />} headersNumber={2}>
			<AllTasks
				iconName={currentList.icon || ENTITY_ICONS.taskList}
				title={currentList.title}
				description={currentList.description ?? undefined}
				tasks={tasks}
				isLoading={isLoading}
				listId={id}
			/>
		</AppLayout>
	);
}
