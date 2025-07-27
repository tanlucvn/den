"use client";

import { AppQuickActions } from "@/components/common/app-quick-actions";
import GroupedTaskSection from "@/components/features/task/grouped-task-section";
import { TaskListsSection } from "@/components/features/task-list/task-list-section";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function Page() {
	const {
		data: allTaskLists = [],
		isLoading: listLoading,
		isFetched: listFetched,
	} = useTaskLists();
	const {
		data: allTasks = [],
		isLoading: taskLoading,
		isFetched: taskFetched,
	} = useTasks();

	return (
		<div className="flex flex-col px-4">
			<div className="flex h-16 items-center gap-2">
				<SidebarTrigger className="-ml-1" />

				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				<span className="text-sm">Home</span>
			</div>

			<div className="sticky top-2 z-10 mb-6 w-full rounded-full bg-background">
				<AppQuickActions />
			</div>

			<div className="mb-4 flex size-full flex-col gap-2 rounded-2xl border border-dashed p-1 shadow-xs">
				<TaskListsSection
					iconName="Folders"
					title="All Lists"
					taskLists={allTaskLists}
					tasks={allTasks}
					isLoading={listLoading}
					isFetched={listFetched}
				/>

				<GroupedTaskSection
					iconName="Inbox"
					title="Inbox"
					tasks={allTasks.filter((t) => t.listId === null)}
					isLoading={taskLoading}
					isFetched={taskFetched}
				/>
			</div>
		</div>
	);
}
