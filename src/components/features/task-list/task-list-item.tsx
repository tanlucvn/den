import { Link } from "next-view-transitions";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TaskList } from "@/db/schema/task-lists";
import { cn } from "@/lib/utils";
import TaskListControlsDropdown from "./task-list-controls-dropdown";

interface TaskListItemProps {
	taskList: TaskList;
	totalCount: number;
	completedCount: number;
	className?: string;
}

export function TaskListItem({
	taskList,
	totalCount,
	completedCount,
	className,
}: TaskListItemProps) {
	const progress =
		totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

	const progressColor =
		progress < 50
			? "text-rose-300"
			: progress < 80
				? "text-amber-300"
				: "text-emerald-300";

	const renderProgress = () => {
		if (totalCount <= 0) return "No tasks";
		return (
			<>
				{completedCount}/{totalCount} completed
				<span className={cn("ml-auto", progressColor)}>({progress}%)</span>
			</>
		);
	};

	return (
		<Card
			className={cn(
				"relative size-full h-28 gap-2 rounded-xl p-4 shadow-none",
				"hover:border-ring hover:ring-[3px] hover:ring-ring/20",
				className,
			)}
		>
			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					size="icon"
					className={cn(
						"size-9 rounded-lg",
						taskList.color && `text-${taskList.color}-500`,
					)}
				>
					<IconRenderer name={taskList.icon ?? "List"} />
				</Button>

				<TaskListControlsDropdown taskList={taskList}>
					<Button variant="ghost" size="icon" className="ml-auto size-6">
						<IconRenderer name="EllipsisVertical" />
					</Button>
				</TaskListControlsDropdown>
			</div>

			<Link
				href={`/lists/${taskList.id}`}
				className="group space-y-1 no-underline hover:no-underline"
			>
				<p className="font-medium text-sm underline-offset-2 group-hover:underline">
					{taskList.title}
				</p>
				<div className="flex items-center gap-1 text-muted-foreground text-xs">
					{renderProgress()}
				</div>
			</Link>
		</Card>
	);
}
