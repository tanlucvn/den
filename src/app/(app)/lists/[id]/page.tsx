"use client";

import { useParams } from "next/navigation";
import { FilterPopover } from "@/components/features/task/filter-popover";
import GroupedTaskSection from "@/components/features/task/grouped-task-section";
import { TaskSummaryCard } from "@/components/features/task/task-summary-card";
import AppLayout from "@/components/layouts/app-layout";
import HeaderNav from "@/components/layouts/headers/task-lists/list-header-nav";
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasksByListId } from "@/hooks/mutations/use-task-mutation";

export default function TaskListPage() {
	const { id } = useParams() as { id: string };

	const { data: taskLists = [], isFetched: listFetched } = useTaskLists();
	const currentList = taskLists.find((list) => list.id === id);

	const { data: tasks = [], isLoading, isFetched } = useTasksByListId(id);

	if (!currentList && listFetched && isFetched) {
		return (
			<p className="text-center text-muted-foreground text-sm">
				Task list not found.
			</p>
		);
	}

	return (
		<AppLayout header={<HeaderNav />}>
			<div className="space-y-1 rounded-2xl border border-dashed p-1 shadow-xs">
				<FilterPopover />
				<GroupedTaskSection
					iconName="Folder"
					title={currentList?.title ?? "Untitled"}
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
