"use client";

import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import NewTaskListModal from "@/components/modals/task-lists/new-task-list-modal";
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
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/use-search-store";
import { SearchTaskListView } from "./search-lists";
import { TaskListItem } from "./task-list-item";

interface TaskListSectionProps {
	iconName?: string;
	title: string;
	description?: string;
	tasks: Task[];
	taskLists: TaskList[];
	isLoading: boolean;
	isFetched: boolean;
	className?: string;
}

export function TaskListSection({
	iconName = "List",
	title = "",
	description,
	taskLists,
	tasks,
	isLoading,
	className,
}: TaskListSectionProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const { isSearchOpen, searchQuery } = useSearchStore();

	const isSearching = isSearchOpen && searchQuery.trim() !== "";
	const hasLists = taskLists.length > 0;

	if (isLoading) return <TaskListSectionSkeleton />;

	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 font-normal text-sm">
					<IconRenderer name={iconName} className="text-muted-foreground" />
					<span>{title}</span>
					<NumberFlowBadge value={taskLists.length} />
				</CardTitle>
				{description && (
					<CardDescription className="text-sm">{description}</CardDescription>
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
					{/* Search view */}
					{isSearching ? (
						<SearchTaskListView taskLists={taskLists} tasks={tasks} />
					) : hasLists ? (
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
								<div
									className={cn(
										"flex cursor-pointer flex-col items-center justify-center rounded-xl border",
										"bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)]",
										"h-28 min-w-[200px] text-muted-foreground text-sm transition hover:bg-muted hover:text-foreground",
									)}
								>
									<IconRenderer name="Plus" className="mb-1" />
									New list
								</div>
							</NewTaskListModal>
						</div>
					) : (
						<EmptyState
							icon="List"
							title="No lists created yet"
							description="Create your first list below."
						>
							<NewTaskListModal>
								<Button
									variant="outline"
									size="sm"
									className="rounded-full font-normal text-foreground"
								>
									<IconRenderer name="Plus" className="text-muted-foreground" />
									New list
								</Button>
							</NewTaskListModal>
						</EmptyState>
					)}
				</CardContent>
			)}
		</Card>
	);
}

export function TaskListSectionSkeleton({ className }: { className?: string }) {
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

			<CardContent className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 p-0">
				<Skeleton className="h-28 w-full min-w-[200px] rounded-xl" />
				<Skeleton className="h-28 w-full min-w-[200px] rounded-xl" />
				<Skeleton className="h-28 w-full min-w-[200px] rounded-xl" />
				<Skeleton className="h-28 w-full min-w-[200px] rounded-xl" />
			</CardContent>
		</Card>
	);
}
