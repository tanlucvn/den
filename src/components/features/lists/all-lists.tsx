"use client";

import { IconRenderer } from "@/components/icon-renderer";
import NewTaskListModal from "@/components/modals/lists/new-task-list-modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { List } from "@/db/schema/lists";
import type { Task } from "@/db/schema/tasks";
import { ENTITY_ICONS } from "@/lib/constants";
import { useFilterStore } from "@/store/use-filter-store";
import { useSearchStore } from "@/store/use-search-store";
import { FilterListsWrapper } from "./filter-lists-wrapper";
import { ListItem } from "./list-item";
import { SearchListsWrapper } from "./search-lists-wrapper";

interface AllListsProps {
	iconName?: string;
	title: string;
	description?: string;
	tasks: Task[];
	lists: List[];
	isLoading: boolean;
}

export default function AllLists({
	iconName,
	title,
	description,
	lists: taskLists,
	tasks,
	isLoading,
}: AllListsProps) {
	const { isSearchOpen, searchQuery } = useSearchStore();
	const { hasActiveFilters } = useFilterStore();

	const isSearching = isSearchOpen && searchQuery.trim() !== "";
	const isFiltering = hasActiveFilters("lists");
	const hasLists = taskLists.length > 0;

	if (isLoading) return <AllTaskListsSkeleton />;

	return (
		<section className="flex size-full flex-col gap-4">
			<Header
				iconName={iconName}
				title={title}
				description={description}
				listCount={taskLists.length}
			/>

			<TaskListsContent
				lists={taskLists}
				tasks={tasks}
				isSearching={isSearching}
				isFiltering={isFiltering}
				hasLists={hasLists}
			/>
		</section>
	);
}

function Header({
	iconName,
	title,
	description,
	listCount,
}: {
	iconName?: string;
	title: string;
	description?: string;
	listCount: number;
}) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2 truncate">
				<IconRenderer
					name={iconName || ENTITY_ICONS.lists}
					className="text-muted-foreground"
				/>
				<h2 className="truncate font-medium">{title}</h2>
				<NumberFlowBadge value={listCount} />
			</div>
			{description && (
				<p className="truncate text-muted-foreground text-sm">{description}</p>
			)}
		</div>
	);
}

function TaskListsContent({
	lists: taskLists,
	tasks,
	isSearching,
	isFiltering,
	hasLists,
}: {
	lists: List[];
	tasks: Task[];
	isSearching: boolean;
	isFiltering: boolean;
	hasLists: boolean;
}) {
	if (isSearching) {
		return <SearchListsWrapper lists={taskLists} tasks={tasks} />;
	}

	if (isFiltering) {
		return <FilterListsWrapper lists={taskLists} tasks={tasks} />;
	}

	if (!hasLists) {
		return (
			<EmptyState
				icon={ENTITY_ICONS.lists}
				title="No lists created yet"
				description="Create your first list below."
				className="h-full"
				contentClassName="h-full"
			>
				<NewTaskListModal>
					<Button
						variant="outline"
						size="sm"
						className="rounded-full text-foreground backdrop-blur-lg"
					>
						<IconRenderer name="Plus" className="text-muted-foreground" />
						New list
					</Button>
				</NewTaskListModal>
			</EmptyState>
		);
	}

	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
			{taskLists.map((list) => {
				const tasksInList = tasks.filter((t) => t.listId === list.id);

				return <ListItem key={list.id} list={list} tasks={tasksInList} />;
			})}

			<NewTaskListModal>
				<div className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)] text-muted-foreground text-sm transition hover:bg-muted hover:text-foreground">
					<IconRenderer name="Plus" className="mb-1" />
					New list
				</div>
			</NewTaskListModal>
		</div>
	);
}

export function AllTaskListsSkeleton() {
	return (
		<section className="flex size-full flex-col gap-4">
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<Skeleton className="size-5 rounded-full" />
					<Skeleton className="h-5 w-24" />
					<Skeleton className="size-5" />
				</div>
				<Skeleton className="h-5 w-40" />
			</div>

			<div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-28 w-full rounded-xl" />
				))}
			</div>
		</section>
	);
}
