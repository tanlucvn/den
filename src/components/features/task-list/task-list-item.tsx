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
import { useTaskListActions } from "@/hooks/use-task-list-actions";
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
	const { onSelect } = useTaskListActions();

	return (
		<Card
			className={cn(
				"relative size-full cursor-pointer rounded-md p-4 shadow-none",
				"hover:border-ring hover:ring-[3px] hover:ring-ring/20",
				className,
			)}
			onClick={() => onSelect(taskList)}
		>
			<CardHeader className="p-0">
				<CardTitle className="text-sm">{taskList.title}</CardTitle>
				<CardDescription className="text-xs">
					{taskCounts} {taskCounts === 1 ? "task" : "tasks"}
				</CardDescription>
				<CardAction>
					<div onClick={(e) => e.stopPropagation()}>
						<TaskListControlsDropdown taskList={taskList}>
							<Button variant="ghost" size="icon" className="size-6">
								<IconRenderer name="MoreHorizontal" />
							</Button>
						</TaskListControlsDropdown>
					</div>
				</CardAction>
			</CardHeader>
		</Card>
	);
}
