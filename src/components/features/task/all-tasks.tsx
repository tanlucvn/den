import { useState } from "react";
import QuickAddTask from "@/components/features/task/quick-add-task";
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
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/store/use-filter-store";
import { useSearchStore } from "@/store/use-search-store";
import { useViewStore } from "@/store/use-view-store";
import { FilteredTasksView } from "./filter-tasks-view";
import { SearchTasksView } from "./search-tasks-view";
import { TasksByStatusGrid } from "./tasks-by-status-grid";
import { TasksByStatusList } from "./tasks-by-status-list";

interface AllTasksProps {
	iconName?: string;
	title: string;
	description?: string;
	tasks: TaskWithTagsAndList[];
	isLoading: boolean;
	isFetched: boolean;
	listId?: string;
	className?: string;
}

export default function AllTasks({
	iconName = "",
	title = "",
	description,
	tasks,
	isLoading,
	isFetched,
	listId,
	className,
}: AllTasksProps) {
	const { viewType } = useViewStore();
	const { isSearchOpen, searchQuery } = useSearchStore();
	const { hasActiveFilters } = useFilterStore();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const isViewTypeGrid = viewType === "grid";
	const isSearching = isSearchOpen && searchQuery.trim() !== "";
	const isFiltering = hasActiveFilters();

	const showNoTasks =
		isFetched && !isLoading && tasks.length === 0 && !searchQuery.trim();

	if (isLoading) return <AllTasksSkeleton className={className} />;

	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 overflow-hidden font-normal text-sm">
					<IconRenderer name={iconName} className="text-muted-foreground" />
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
					) : isViewTypeGrid ? (
						<TasksByStatusGrid tasks={tasks} />
					) : (
						<TasksByStatusList tasks={tasks} />
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

export function AllTasksSkeleton({ className }: { className?: string }) {
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
