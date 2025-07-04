"use client";

import TaskSection from "@/components/features/task/task-section";
import QuickAddTaskForm from "@/components/forms/quick-add-task-form";
import { IconRenderer } from "@/components/icon-renderer";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { useGroupedTasks } from "@/hooks/use-grouped-tasks";
import { filterTasks } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { useTaskStore } from "@/store/use-task-store";

export default function Page() {
	const { searchTerm } = useAppStore();
	const { tasks } = useTaskStore();

	const { pinned, recent, completed } = useGroupedTasks(tasks);

	const filteredPinnedTasks = filterTasks(pinned, searchTerm);
	const filteredRecentTasks = filterTasks(recent, searchTerm);
	const filteredCompletedTasks = filterTasks(completed, searchTerm);

	const totalTasks =
		filteredPinnedTasks.length +
		filteredRecentTasks.length +
		filteredCompletedTasks.length;

	const sections = [
		{ title: "Pinned", icon: "Pin", tasks: filteredPinnedTasks },
		{
			title: "Recent",
			icon: "History",
			tasks: filteredRecentTasks,
			defaultOpen: true,
		},
		{
			title: "Completed",
			icon: "CircleCheck",
			tasks: filteredCompletedTasks,
			defaultOpen: true,
		},
	];

	return (
		<div className="flex size-full flex-col gap-4 rounded-2xl border border-dashed p-3 shadow-xs">
			<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
				<IconRenderer name="List" className="!text-primary/60" />
				<span className="text-foreground">All Tasks</span>
				<NumberFlowBadge value={totalTasks} />
			</div>

			<QuickAddTaskForm />

			{tasks.length > 0 ? (
				<div className="space-y-4">
					{sections.map(({ title, icon, tasks, defaultOpen }) => (
						<TaskSection
							key={title}
							icon={<IconRenderer name={icon} />}
							title={title}
							tasks={tasks}
							defaultOpen={defaultOpen}
						/>
					))}
				</div>
			) : (
				<p className="text-center text-muted-foreground text-sm">
					No tasks found.
				</p>
			)}
		</div>
	);
}
