"use client";

import TaskItem from "@/components/features/task/task-item";
import TaskSection from "@/components/features/task/task-section";
import QuickAddTaskForm from "@/components/forms/quick-add-task-form";
import { IconRenderer } from "@/components/icon-renderer";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGroupedTasks } from "@/hooks/use-grouped-tasks";
import { useTasks } from "@/hooks/use-tasks";
import { filterTasks } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export default function Page() {
	const { searchTerm } = useAppStore();
	const { data: tasks = [], isLoading: isTasksLoading } = useTasks();

	const { pinned, active, completed, archive } = useGroupedTasks(tasks);

	const filteredPinnedTasks = filterTasks(pinned, searchTerm);
	const filteredActiveTasks = filterTasks(active, searchTerm);
	const filteredCompletedTasks = filterTasks(completed, searchTerm);

	const totalTasks =
		filteredPinnedTasks.length +
		filteredActiveTasks.length +
		filteredCompletedTasks.length;

	const sections = [
		{ title: "Pinned", icon: "Pin", tasks: filteredPinnedTasks },
		{
			title: "Active",
			icon: "Flame",
			tasks: filteredActiveTasks,
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
		<div className="flex flex-col gap-6">
			<div className="flex size-full flex-col gap-4 rounded-2xl border border-dashed p-3 shadow-xs">
				<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
					<IconRenderer name="List" className="!text-primary/60" />
					<span className="text-foreground">All Tasks</span>
					<NumberFlowBadge value={totalTasks} />
				</div>

				<QuickAddTaskForm />

				{isTasksLoading ? (
					<div className="space-y-4">
						<Skeleton className="h-6 w-20" />
						<Skeleton className="h-28 w-full rounded-xl" />
						<Skeleton className="h-6 w-20" />
						<Skeleton className="h-28 w-full rounded-xl" />
					</div>
				) : tasks.length > 0 ? (
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

			{archive.length > 0 && (
				<div className="flex size-full flex-col gap-4 rounded-2xl border border-dashed p-3 shadow-xs">
					<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
						<IconRenderer name="Archive" className="!text-primary/60" />
						<Tooltip>
							<TooltipTrigger asChild>
								<span className="text-foreground">Archive Tasks</span>
							</TooltipTrigger>
							<TooltipContent side="top">
								Archived tasks stay here. Restore them anytime.
							</TooltipContent>
						</Tooltip>
						<NumberFlowBadge value={archive.length} />
					</div>

					<div className="space-y-4">
						{archive.map((task) => (
							<TaskItem key={task.id} task={task} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}
