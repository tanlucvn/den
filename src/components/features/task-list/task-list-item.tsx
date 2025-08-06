import { Link } from "next-view-transitions";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

	return (
		<Card
			className={cn(
				"relative size-full h-24 gap-2 rounded-md p-4 shadow-none",
				"hover:border-ring hover:ring-[3px] hover:ring-ring/20",
				className,
			)}
		>
			<CardHeader className="p-0">
				<Link
					href={`/lists/${taskList.id}`}
					className="group no-underline hover:no-underline"
				>
					<CardTitle className="text-sm underline-offset-2 group-hover:underline">
						{taskList.title}
					</CardTitle>
					<CardDescription className="text-xs">
						{totalCount} {totalCount === 1 ? "task" : "tasks"}
					</CardDescription>
				</Link>

				<CardAction>
					<TaskListControlsDropdown taskList={taskList}>
						<Button variant="ghost" size="icon" className="size-6">
							<IconRenderer name="EllipsisVertical" />
						</Button>
					</TaskListControlsDropdown>
				</CardAction>
			</CardHeader>
			<CardFooter className="p-0">
				{totalCount > 0 && (
					<div className="flex w-full items-center gap-2">
						<Progress value={progress} className="h-1 flex-1" />
						<span className="w-[32px] text-right text-muted-foreground text-xs tabular-nums">
							{progress}%
						</span>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
