import TaskSectionCollapsible from "@/components/features/task/task-section-collapsible";
import QuickAddTaskForm from "@/components/forms/quick-add-task-form";
import { IconRenderer } from "@/components/icon-renderer";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task } from "@/db/schema/tasks";
import { useGroupedTasks } from "@/hooks/use-grouped-tasks";
import { cn, filterTasks } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

interface GroupedTaskSectionProps {
	iconName?: string;
	title: string;
	tasks: Task[];
	isLoading: boolean;
	isFetched: boolean;
	className?: string;
}

export default function GroupedTaskSection({
	iconName = "",
	title,
	tasks,
	isLoading,
	isFetched,
	className,
}: GroupedTaskSectionProps) {
	const { searchTerm } = useAppStore();
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

	const showNoTasks =
		isFetched &&
		!isLoading &&
		totalTasks === 0 &&
		(!archive || archive.length === 0);

	return (
		<section
			className={cn(
				"flex flex-col gap-4 rounded-xl border bg-secondary/20 p-3",
				className,
			)}
		>
			{/* Header */}
			<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
				{iconName && (
					<IconRenderer name={iconName} className="!text-primary/60" />
				)}
				<span className="text-foreground">{title}</span>
				<NumberFlowBadge value={totalTasks} />
			</div>

			{/* Quick add form */}
			<QuickAddTaskForm />

			{/* Loading state */}
			{isLoading && (
				<div className="space-y-4">
					<Skeleton className="h-6 w-20" />
					<Skeleton className="h-28 w-full rounded-xl" />
					<Skeleton className="h-6 w-20" />
					<Skeleton className="h-28 w-full rounded-xl" />
				</div>
			)}

			{/* Task sections */}
			{!isLoading && totalTasks > 0 && (
				<div className="space-y-4">
					{sections.map(({ title, icon, tasks, defaultOpen }) =>
						tasks.length > 0 ? (
							<TaskSectionCollapsible
								key={title}
								icon={<IconRenderer name={icon} />}
								title={title}
								tasks={tasks}
								defaultOpen={defaultOpen}
							/>
						) : null,
					)}

					{/* Archive section */}
					{archive.length > 0 && (
						<div className="flex flex-col gap-4">
							<Separator />

							{archive.length > 0 && (
								<TaskSectionCollapsible
									key="archive"
									icon={<IconRenderer name="Archive" />}
									title="Archive"
									tasks={archive}
									defaultOpen
								/>
							)}
						</div>
					)}
				</div>
			)}

			{/* No tasks fallback */}
			{showNoTasks && (
				<p className="text-center text-muted-foreground text-sm">
					No tasks found.
				</p>
			)}
		</section>
	);
}
