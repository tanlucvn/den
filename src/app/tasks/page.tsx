"use client";

import GroupedTaskSection from "@/components/features/task/grouped-task-section";
import { TaskListsSection } from "@/components/features/task-list/task-list-section";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useTaskLists } from "@/hooks/use-task-lists";
import { useTasks } from "@/hooks/use-tasks";

export default function Page() {
	const { data: allTaskLists = [] } = useTaskLists();
	const { data: allTasks = [], isLoading, isFetched } = useTasks();

	return (
		<div className="flex size-full flex-col gap-2 rounded-2xl border border-dashed p-1 shadow-xs">
			<Breadcrumb className="p-2">
				<BreadcrumbList>
					<BreadcrumbItem>Home</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<TaskListsSection
				iconName="Folders"
				title="All Lists"
				taskLists={allTaskLists}
				tasks={allTasks}
			/>

			<GroupedTaskSection
				iconName="Inbox"
				title="Inbox"
				tasks={allTasks.filter((t) => t.listId === null)}
				isLoading={isLoading}
				isFetched={isFetched}
			/>
		</div>
	);
}
