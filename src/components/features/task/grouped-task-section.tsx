import { useState } from "react";
import QuickAddTask from "@/components/features/task/quick-add-task";
import TaskSection from "@/components/features/task/task-section";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { ALL_STATUS, STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/store/use-filter-store";
import { useSearchStore } from "@/store/use-search-store";
import { FilteredTasksView } from "./filter-tasks-view";
import { SearchTasksView } from "./search-tasks-view";

interface GroupedTaskSectionProps {
	iconName?: string;
	title: string;
	description?: string;
	tasks: TaskWithTagsAndList[];
	isLoading: boolean;
	isFetched: boolean;
	listId?: string;
	className?: string;
}

export default function GroupedTaskSection({
	iconName = "",
	title = "",
	description,
	tasks,
	isLoading,
	isFetched,
	listId,
	className,
}: GroupedTaskSectionProps) {
	const { isSearchOpen, searchQuery } = useSearchStore();
	const { hasActiveFilters } = useFilterStore();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const isSearching = isSearchOpen && searchQuery.trim() !== "";
	const isFiltering = hasActiveFilters();

	const tasksByStatus = ALL_STATUS.map((status) => ({
		...status,
		tasks: tasks.filter((task) => task.status === status.id),
	}));

	const showNoTasks =
		isFetched && !isLoading && tasks.length === 0 && !searchQuery.trim();

	if (isLoading) return <GroupedTaskSectionSkeleton className={className} />;

	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 overflow-hidden font-normal text-sm">
					<IconRenderer name={iconName} className="text-primary/60" />
					<span className="truncate">{title}</span>
					<NumberFlowBadge value={tasks.length} />
				</CardTitle>
				{description && (
					<CardDescription className="truncate">{description}</CardDescription>
				)}
				<CardAction>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full text-muted-foreground"
						onClick={() => setIsCollapsed(!isCollapsed)}
					>
						<IconRenderer
							name={isCollapsed ? "ChevronsUpDown" : "ChevronsDownUp"}
						/>
					</Button>
				</CardAction>
			</CardHeader>

			{!isCollapsed && (
				<CardContent className="space-y-4 p-0">
					{/* Quick add */}
					<QuickAddTask listId={listId} />

					{/* Task sections */}
					{isSearching ? (
						<SearchTasksView tasks={tasks} />
					) : isFiltering ? (
						<FilteredTasksView tasks={tasks} />
					) : (
						tasksByStatus.map(
							(status) =>
								tasks.length > 0 && (
									<TaskSection
										key={status.id}
										icon={
											<IconRenderer
												name={status.icon}
												className={STATUS_COLORS[status.id]}
											/>
										}
										title={status.name}
										tasks={status.tasks}
										defaultOpen={
											status.id === "todo" || status.id === "in_progress"
										}
									/>
								),
						)
					)}

					{/* No tasks */}
					{showNoTasks && (
						<EmptyState
							title="No tasks yet."
							description="Add a task using the input above."
						/>
					)}
				</CardContent>
			)}
		</Card>
	);
}

export function GroupedTaskSectionSkeleton({
	className,
}: {
	className?: string;
}) {
	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			<CardHeader className="space-y-1 p-0">
				<CardTitle className="flex items-center gap-2 font-normal text-sm">
					<Skeleton className="size-4 rounded-full" />
					<Skeleton className="h-6 w-20" />
					<Skeleton className="size-6" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="h-6 w-44" />
				</CardDescription>
				<CardAction>
					<Skeleton className="size-7 rounded-full" />
				</CardAction>
			</CardHeader>

			<CardContent className="space-y-4 p-0">
				{/* Quick add */}
				<Skeleton className="h-9 w-full rounded-full" />

				{/* Task section collapsible */}
				<Skeleton className="h-6 w-24" />
				<Skeleton className="h-28 w-full rounded-xl" />
				<Skeleton className="h-6 w-24" />
				<Skeleton className="h-28 w-full rounded-xl" />
			</CardContent>
		</Card>
	);
}
