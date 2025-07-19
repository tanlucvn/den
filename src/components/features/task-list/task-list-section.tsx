import { IconRenderer } from "@/components/icon-renderer";
import NewTaskListModal from "@/components/modals/new-task-list-modal";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";
import { cn } from "@/lib/utils";
import { TaskListItem } from "./task-list-item";

interface Props {
	iconName?: string;
	title: string;
	tasks: Task[];
	taskLists: TaskList[];
}

export function TaskListsSection({
	iconName = "",
	title = "",
	taskLists,
	tasks,
}: Props) {
	return (
		<section className="flex flex-col gap-4 rounded-xl border bg-secondary/20 p-3">
			{/* Header */}
			<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
				<IconRenderer name={iconName} className="!text-primary/60" />
				<span className="text-foreground">{title}</span>
				<NumberFlowBadge value={taskLists.length} />
			</div>

			{/* Task List Item */}
			<div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{taskLists.map((list) => {
					const taskCount = tasks.filter((t) => t.listId === list.id).length;

					return (
						<TaskListItem
							key={list.id}
							taskList={list}
							taskCounts={taskCount}
						/>
					);
				})}

				{/* Create Task List Button */}
				<NewTaskListModal>
					<div
						className={cn(
							"flex cursor-pointer flex-col items-center justify-center rounded-md border",
							"bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)]",
							"h-20 text-muted-foreground text-xs transition hover:bg-muted hover:text-foreground",
						)}
					>
						<IconRenderer name="Plus" className="mb-1" />
						New list
					</div>
				</NewTaskListModal>
			</div>
		</section>
	);
}
