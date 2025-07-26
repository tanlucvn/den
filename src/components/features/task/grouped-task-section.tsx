import QuickAddTask from "@/components/features/task/quick-add-task";
import TaskSectionCollapsible from "@/components/features/task/task-section-collapsible";
import { IconRenderer } from "@/components/icon-renderer";
import { EmptyState } from "@/components/ui/empty-state";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskWithTags } from "@/db/schema/tasks";
import { useGroupedTasks } from "@/hooks/use-grouped-tasks";
import { useSections } from "@/hooks/use-sections";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

interface GroupedTaskSectionProps {
	iconName?: string;
	title: string;
	tasks: TaskWithTags[];
	isLoading: boolean;
	isFetched: boolean;
	listId?: string;
	className?: string;
}

export default function GroupedTaskSection({
	iconName = "",
	title = "",
	tasks,
	isLoading,
	isFetched,
	listId,
	className,
}: GroupedTaskSectionProps) {
	const { searchTerm } = useAppStore();

	const { filtered } = useSections(tasks, searchTerm);
	const { pinned, active, completed, archive } = useGroupedTasks(tasks);

	const totalOriginalTasks =
		pinned.length + active.length + completed.length + archive.length;

	const totalFilteredTasks =
		filtered.pinned.length +
		filtered.active.length +
		filtered.completed.length +
		filtered.archive.length;

	const showNoResults =
		isFetched &&
		!isLoading &&
		totalOriginalTasks > 0 &&
		totalFilteredTasks === 0;

	const showNoTasks =
		isFetched &&
		!isLoading &&
		totalOriginalTasks === 0 &&
		searchTerm.trim() === "";

	const sections = [
		{ title: "Pinned", icon: "Pin", tasks: filtered.pinned },
		{
			title: "Active",
			icon: "Flame",
			tasks: filtered.active,
			defaultOpen: true,
		},
		{
			title: "Completed",
			icon: "CircleCheck",
			tasks: filtered.completed,
			defaultOpen: true,
		},
	];

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
				<NumberFlowBadge value={totalFilteredTasks} />
			</div>

			{/* Quick add */}
			<QuickAddTask listId={listId} />

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
			{!isLoading && totalFilteredTasks > 0 && (
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
					{filtered.archive.length > 0 && (
						<div className="flex flex-col gap-4">
							<Separator />

							<TaskSectionCollapsible
								key="archive"
								icon={<IconRenderer name="Archive" />}
								title="Archive"
								tasks={filtered.archive}
								defaultOpen
							/>
						</div>
					)}
				</div>
			)}

			{/* No results  */}
			{showNoResults && (
				<EmptyState
					icon="SearchX"
					title="No matching tasks"
					description="Try a different keyword."
				/>
			)}

			{/* No tasks */}
			{showNoTasks && (
				<EmptyState
					title="No tasks yet."
					description="Add a task using the input above."
				/>
			)}
		</section>
	);
}
