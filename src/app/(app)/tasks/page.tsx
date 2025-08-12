"use client";

import { AppQuickActions } from "@/components/common/app-quick-actions";
import GroupedTaskSection from "@/components/features/task/grouped-task-section";
import { TaskSummaryCard } from "@/components/features/task/task-summary-card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function TasksPage() {
	const { data: allTasks = [], isLoading, isFetched } = useTasks();

	return (
		<div className="flex flex-col px-4">
			<div className="flex h-16 items-center gap-2">
				<SidebarTrigger className="-ml-1" />

				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				<span className="text-sm">Tasks</span>
			</div>

			<div className="sticky top-2 z-10 mb-6 w-full rounded-full bg-background">
				<AppQuickActions />
			</div>

			<div className="mb-4 flex size-full flex-col gap-1 rounded-2xl border border-dashed p-1 shadow-xs">
				<TaskSummaryCard tasks={allTasks} isLoading={isLoading} />

				<GroupedTaskSection
					iconName="Inbox"
					title="All Tasks"
					description={[
						"Keep track of everything in one place.",
						"Time to get things done!",
						"Review and manage your tasks efficiently.",
						"Your productivity starts here.",
						"Let’s make progress today!",
						"All your tasks — neatly organized.",
					]}
					// Option: Just render task in list
					// tasks={allTasks.filter((t) => t.listId === null)}
					tasks={allTasks}
					isLoading={isLoading}
					isFetched={isFetched}
				/>
			</div>
		</div>
	);
}
