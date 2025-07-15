"use client";

import GroupedTaskSection from "@/components/features/task/grouped-task-section";
import { useTasks } from "@/hooks/use-tasks";

export default function Page() {
	const { data: allTasks = [], isLoading, isFetched } = useTasks();

	return (
		<div className="flex flex-col gap-6">
			<div className="flex size-full flex-col gap-4 rounded-2xl border border-dashed p-1 shadow-xs">
				{/* TODO: Add task list here */}
				<div>Task List</div>

				<GroupedTaskSection
					iconName="List"
					title="All Tasks"
					tasks={allTasks}
					isLoading={isLoading}
					isFetched={isFetched}
				/>
			</div>
		</div>
	);
}
