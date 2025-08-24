"use client";

import { IconRenderer } from "@/components/icon-renderer";
import NewTaskListModal from "@/components/modals/task-lists/new-task-list-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";
import { ENTITY_ICONS } from "@/lib/constants";
import { useSearchStore } from "@/store/use-search-store";
import { SearchTaskListWrapper } from "./search-task-lists-wrapper";
import { TaskListItem } from "./task-list-item";

interface AllTaskListsProps {
	iconName?: string;
	title: string;
	description?: string;
	tasks: Task[];
	taskLists: TaskList[];
	isLoading: boolean;
}

export default function AllTaskLists({
	iconName,
	title,
	description,
	taskLists,
	tasks,
	isLoading,
}: AllTaskListsProps) {
	const { isSearchOpen, searchQuery } = useSearchStore();

	const isSearching = isSearchOpen && searchQuery.trim() !== "";
	const hasLists = taskLists.length > 0;

	if (isLoading) return <AllTaskListsSkeleton />;

	return (
		<section className="flex size-full flex-col gap-4 px-2">
			<Header
				iconName={iconName}
				title={title}
				description={description}
				listCount={taskLists.length}
			/>

			<TaskListsContent
				taskLists={taskLists}
				tasks={tasks}
				isSearching={isSearching}
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
					name={iconName || ENTITY_ICONS.taskList}
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
	taskLists,
	tasks,
	isSearching,
	hasLists,
}: {
	taskLists: TaskList[];
	tasks: Task[];
	isSearching: boolean;
	hasLists: boolean;
}) {
	if (isSearching) {
		return <SearchTaskListWrapper taskLists={taskLists} tasks={tasks} />;
	}

	if (!hasLists) {
		return (
			<EmptyState
				icon={ENTITY_ICONS.taskList}
				title="No lists created yet"
				description="Create your first list below."
			>
				<NewTaskListModal>
					<div className="flex h-28 min-w-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)] text-muted-foreground text-sm transition hover:bg-muted hover:text-foreground">
						<IconRenderer name="Plus" className="mb-1" />
						New list
					</div>
				</NewTaskListModal>
			</EmptyState>
		);
	}

	return (
		<div className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
			{taskLists.map((list) => {
				const listTasks = tasks.filter((t) => t.listId === list.id);
				const totalCount = listTasks.length;
				const completedCount = listTasks.filter(
					(t) => t.status === "completed",
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

			{/* Create button */}
			<NewTaskListModal>
				<div className="flex h-28 min-w-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)] text-muted-foreground text-sm transition hover:bg-muted hover:text-foreground">
					<IconRenderer name="Plus" className="mb-1" />
					New list
				</div>
			</NewTaskListModal>
		</div>
	);
}

export function AllTaskListsSkeleton() {
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

			<div className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-28 w-full min-w-[200px] rounded-xl" />
				))}
			</div>
		</section>
	);
}
