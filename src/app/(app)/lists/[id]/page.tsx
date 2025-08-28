"use client";

import { useParams } from "next/navigation";
import AllTasks from "@/components/features/tasks/all-tasks";
import AppLayout from "@/components/layouts/app-layout";
import Header from "@/components/layouts/headers/lists/list/header";
import { useListId } from "@/hooks/mutations/use-list-mutation";
import { useTasksByListId } from "@/hooks/mutations/use-task-mutation";
import { ENTITY_ICONS } from "@/lib/constants";

export default function TaskListPage() {
	const { id } = useParams() as { id: string };

	const { data: currentList, isLoading: listLoading } = useListId(id);
	const { data: tasks = [], isLoading: tasksLoading } = useTasksByListId(id);

	if (!currentList) return <div>Loading...</div>;

	return (
		<AppLayout header={<Header list={currentList} />} headersNumber={2}>
			<AllTasks
				iconName={currentList.icon || ENTITY_ICONS.lists}
				title={currentList.title || undefined}
				description={currentList.description || undefined}
				tasks={tasks}
				isLoading={listLoading || tasksLoading}
				listId={id}
			/>
		</AppLayout>
	);
}
