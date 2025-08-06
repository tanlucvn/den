import { IconRenderer } from "@/components/icon-renderer";
import NewTaskListModal from "@/components/modals/new-task-list-modal";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";
import { cn } from "@/lib/utils";
import { TaskListItem } from "./task-list-item";

interface TaskListsProps {
	iconName?: string;
	title: string;
	tasks: Task[];
	taskLists: TaskList[];
	isLoading: boolean;
	isFetched: boolean;
	className?: string;
}

export function TaskListsSection({
	iconName = "List",
	title = "",
	taskLists,
	tasks,
	isLoading,
	className,
}: TaskListsProps) {
	if (isLoading) return <TaskListsSectionSkeleton />;

	return (
		<section
			className={cn(
				"flex flex-1 flex-col gap-4 rounded-xl border bg-secondary/20 p-3",
				className,
			)}
		>
			{/* Header */}
			<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
				<IconRenderer name={iconName} className="!text-primary/60" />
				<span className="text-foreground">{title}</span>
				<NumberFlowBadge value={taskLists.length} />
			</div>

			{/* Task List Items */}
			<div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
				{taskLists.length > 0 &&
					taskLists.map((list) => {
						const listTasks = tasks.filter((t) => t.listId === list.id);
						const totalCount = listTasks.length;
						const completedCount = listTasks.filter(
							(t) => t.isCompleted,
						).length;

						return (
							<TaskListItem
								key={list.id}
								taskList={list}
								totalCount={totalCount}
								completedCount={completedCount}
							/>
						);
					})}

				{/* Create Task List Button */}
				<NewTaskListModal>
					<div
						className={cn(
							"flex cursor-pointer flex-col items-center justify-center rounded-md border",
							"bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)]",
							"h-24 text-muted-foreground text-xs transition hover:bg-muted hover:text-foreground",
						)}
					>
						<IconRenderer name="Plus" className="mb-1" />
						New list
					</div>
				</NewTaskListModal>
			</div>
		</section>
	);
}

export function TaskListsSectionSkeleton() {
	return (
		<div className="flex flex-col gap-4 rounded-xl border bg-secondary/20 p-3">
			<Skeleton className="h-5 w-32" />
			<div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-24 w-full rounded-md" />
				))}
			</div>
		</div>
	);
}
