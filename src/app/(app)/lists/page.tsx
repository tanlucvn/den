"use client";

import { AppQuickActions } from "@/components/common/app-quick-actions";
import { TaskListSection } from "@/components/features/task-list/task-list-section";
import { TaskListSummaryCard } from "@/components/features/task-list/task-list-summary-card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function ListsPage() {
	const { data: allTaskLists = [], isLoading, isFetched } = useTaskLists();
	const { data: allTasks = [] } = useTasks();

	return (
		<div className="flex flex-col px-4">
			<div className="flex h-16 items-center gap-2">
				<SidebarTrigger className="-ml-1" />

				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				<span className="text-sm">Lists</span>
			</div>

			<div className="sticky top-2 z-10 mb-6 w-full rounded-full bg-background">
				<AppQuickActions />
			</div>

			<div className="mb-4 flex size-full flex-col gap-1 rounded-2xl border border-dashed p-1 shadow-xs">
				<TaskListSummaryCard
					taskLists={allTaskLists}
					tasks={allTasks}
					isLoading={isLoading}
				/>

				<TaskListSection
					iconName="Folders"
					title="All Lists"
					description="Organize and track your tasks across multiple lists."
					taskLists={allTaskLists}
					tasks={allTasks}
					isLoading={isLoading}
					isFetched={isFetched}
				/>
			</div>
		</div>
	);
}
