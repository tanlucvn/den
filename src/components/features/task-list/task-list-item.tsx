import Link from "next/link";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { TaskList } from "@/db/schema/task-lists";
import { cn } from "@/lib/utils";
import TaskListControlsDropdown from "./task-list-controls-dropdown";

interface TaskListItemProps {
	taskList: TaskList;
	taskCounts: number;
	className?: string;
}

export function TaskListItem({
	taskList,
	taskCounts,
	className,
}: TaskListItemProps) {
	return (
		<Card
			className={cn(
				"relative size-full rounded-md p-4 shadow-none",
				"hover:border-ring hover:ring-[3px] hover:ring-ring/20",
				className,
			)}
		>
			<CardHeader className="p-0">
				<Link
					href={`/tasks/${taskList.id}`}
					className="no-underline hover:no-underline"
				>
					<CardTitle className="text-sm">{taskList.title}</CardTitle>
					<CardDescription className="text-xs">
						{taskCounts} {taskCounts === 1 ? "task" : "tasks"}
					</CardDescription>
				</Link>

				<CardAction>
					<TaskListControlsDropdown taskList={taskList}>
						<Button variant="ghost" size="icon" className="size-6">
							<IconRenderer name="MoreHorizontal" />
						</Button>
					</TaskListControlsDropdown>
				</CardAction>
			</CardHeader>
		</Card>
	);
}
