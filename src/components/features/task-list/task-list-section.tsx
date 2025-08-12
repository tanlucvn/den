import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import NewTaskListModal from "@/components/modals/new-task-list-modal";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";
import { cn } from "@/lib/utils";
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

	if (isLoading) return <TaskListSectionSkeleton />;

	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 font-normal text-sm">
					<IconRenderer name={iconName} className="text-primary/60" />
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
				<>
					{/* Task List Items */}
					<CardContent
						className="grid gap-2 p-0"
						style={{
							gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
						}}
					>
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
									"flex cursor-pointer flex-col items-center justify-center rounded-xl border",
									"bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)]",
									"h-28 text-muted-foreground text-xs transition hover:bg-muted hover:text-foreground",
								)}
							>
								<IconRenderer name="Plus" className="mb-1" />
								New list
							</div>
						</NewTaskListModal>
					</CardContent>
				</>
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

			<CardContent
				className="grid gap-2 p-0"
				style={{
					gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
				}}
			>
				<Skeleton className="h-28 w-full rounded-xl" />
				<Skeleton className="h-28 w-full rounded-xl" />
				<Skeleton className="h-28 w-full rounded-xl" />
				<Skeleton className="h-28 w-full rounded-xl" />
			</CardContent>
		</Card>
	);
}
