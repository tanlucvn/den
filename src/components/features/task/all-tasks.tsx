"use client";

import QuickAddTask from "@/components/features/task/quick-add-task";
import { IconRenderer } from "@/components/icon-renderer";
import { EmptyState } from "@/components/ui/empty-state";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { ENTITY_ICONS } from "@/lib/constants";
import { useFilterStore } from "@/store/use-filter-store";
import { useSearchStore } from "@/store/use-search-store";
import { useViewStore } from "@/store/use-view-store";
import { FilteredTasksWrapper } from "./filter-tasks-wrapper";
import { SearchTasksWrapper } from "./search-tasks-wrapper";
import { TasksView } from "./tasks-view";

interface AllTasksProps {
	iconName?: string;
	title: string;
	description?: string;
	tasks: TaskWithTagsAndList[];
	isLoading: boolean;
	listId?: string;
}

export default function AllTasks({
	iconName,
	title,
	description,
	tasks,
	isLoading,
	listId,
}: AllTasksProps) {
	const { viewType } = useViewStore();
	const { isSearchOpen, searchQuery } = useSearchStore();
	const { hasActiveFilters } = useFilterStore();

	const isViewTypeGrid = viewType === "grid";
	const isSearching = isSearchOpen && searchQuery.trim() !== "";
	const isFiltering = hasActiveFilters();

	if (isLoading) return <AllTasksSkeleton />;

	return (
		<section className="flex size-full flex-col gap-4 px-2">
			<Header
				iconName={iconName}
				title={title}
				description={description}
				taskCount={tasks.length}
			/>

			{!isViewTypeGrid && <QuickAddTask listId={listId} />}

			<TasksContent
				tasks={tasks}
				isViewTypeGrid={isViewTypeGrid}
				isSearching={isSearching}
				isFiltering={isFiltering}
				hasTasks={tasks.length > 0}
			/>
		</section>
	);
}

function Header({
	iconName,
	title,
	description,
	taskCount,
}: {
	iconName?: string;
	title: string;
	description?: string;
	taskCount: number;
}) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2 truncate">
				<IconRenderer
					name={iconName || ENTITY_ICONS.task}
					className="text-muted-foreground"
				/>
				<h2 className="truncate font-medium">{title}</h2>
				<NumberFlowBadge value={taskCount} />
			</div>
			{description && (
				<p className="truncate text-muted-foreground text-sm">{description}</p>
			)}
		</div>
	);
}

function TasksContent({
	tasks,
	isViewTypeGrid,
	isSearching,
	isFiltering,
	hasTasks,
}: {
	tasks: TaskWithTagsAndList[];
	isViewTypeGrid: boolean;
	isSearching: boolean;
	isFiltering: boolean;
	hasTasks: boolean;
}) {
	if (isSearching) return <SearchTasksWrapper tasks={tasks} />;
	if (isFiltering) return <FilteredTasksWrapper tasks={tasks} />;

	if (!hasTasks) {
		return (
			<EmptyState
				icon={ENTITY_ICONS.task}
				title="No tasks yet."
				description="Use the input above to quickly add a task."
				className="h-full"
				contentClassName="h-full"
			/>
		);
	}

	return <TasksView tasks={tasks} isViewTypeGrid={isViewTypeGrid} />;
}

export function AllTasksSkeleton() {
	return (
		<section className="flex size-full flex-col gap-4 px-2">
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<Skeleton className="size-5 rounded-full" />
					<Skeleton className="h-5 w-24" />
					<Skeleton className="size-5" />
				</div>
				<Skeleton className="h-5 w-40" />
			</div>

			<Skeleton className="h-9 w-full rounded-full" />

			{[...Array(3)].map((_, i) => (
				<div key={i} className="space-y-2">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-28 w-full rounded-md" />
				</div>
			))}
		</section>
	);
}
