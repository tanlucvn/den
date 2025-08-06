import { useMemo, useState } from "react";
import QuickAddTask from "@/components/features/task/quick-add-task";
import TaskSectionCollapsible from "@/components/features/task/task-section-collapsible";
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
	description?: string[];
	tasks: TaskWithTags[];
	isLoading: boolean;
	isFetched: boolean;
	listId?: string;
	className?: string;
}

export default function GroupedTaskSection({
	iconName = "",
	title = "",
	description = [],
	tasks,
	isLoading,
	isFetched,
	listId,
	className,
}: GroupedTaskSectionProps) {
	const { searchTerm } = useAppStore();
	const [isCollapsed, setIsCollapsed] = useState(false);

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

	const randomDescription = useMemo(() => {
		if (!description || description.length === 0) return "";
		const index = Math.floor(Math.random() * description.length);
		return description[index];
	}, [description]);

	if (isLoading) return <GroupedTaskSectionSkeleton className={className} />;

	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 font-normal text-sm">
					<IconRenderer name={iconName} className="text-primary/60" />
					<span>{title}</span>
					<NumberFlowBadge value={totalOriginalTasks} />
				</CardTitle>
				<CardDescription className="text-sm">
					{randomDescription}
				</CardDescription>
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
					{totalFilteredTasks > 0 && (
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

					{/* No results */}
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
