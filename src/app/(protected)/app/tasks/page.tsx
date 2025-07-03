"use client";

import QuickAddTaskForm from "@/components/features/task/quick-add-task-form";
import TaskSection from "@/components/features/task/task-section";
import { IconRenderer } from "@/components/icon-renderer";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { useGroupedTasks } from "@/hooks/use-grouped-tasks";
import { useTaskStore } from "@/store/use-task-store";

export default function Page() {
	const { tasks } = useTaskStore();
	const { pinned, recent, completed } = useGroupedTasks(tasks);

	const sections = [
		{ title: "Pinned", icon: "Pin", tasks: pinned },
		{ title: "Recent", icon: "History", tasks: recent, defaultOpen: true },
		{
			title: "Completed",
			icon: "CircleCheck",
			tasks: completed,
			defaultOpen: true,
		},
	];

	return (
		<div className="flex size-full flex-col gap-4 rounded-2xl border border-dashed p-3 shadow-xs">
			<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
				<IconRenderer name="List" className="!text-primary/60" />
				<span className="text-foreground">All Tasks</span>
				<NumberFlowBadge value={tasks.length} />
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
