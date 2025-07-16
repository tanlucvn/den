import { IconRenderer } from "@/components/icon-renderer";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/use-dialog-store";

interface Props {
	taskLists: TaskList[];
	tasks: Task[];
	onSelect?: (id: string) => void;
}

export function TaskListsSection({ taskLists, tasks, onSelect }: Props) {
	const { setIsNewTaskListOpen } = useDialogStore();

	return (
		<section className="flex flex-col gap-4 rounded-xl border bg-secondary/20 p-3">
			{/* Header */}
			<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
				<IconRenderer name="List" className="!text-primary/60" />
				<span className="text-foreground">All Lists</span>
				<NumberFlowBadge value={taskLists.length} />
			</div>

			<div className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-lg border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{taskLists.map((list) => {
					const taskCount = tasks.filter((t) => t.listId === list.id).length;

					return (
						<button
							type="button"
							key={list.id}
							onClick={() => onSelect?.(list.id)}
							className="bg-card p-4 text-left transition hover:bg-muted"
						>
							<p className="truncate font-medium text-foreground text-sm">
								{list.title}
							</p>
							<p className="mt-1 text-muted-foreground text-xs">
								{taskCount} {taskCount === 1 ? "task" : "tasks"}
							</p>
						</button>
					);
				})}

				<button
					type="button"
					onClick={() => setIsNewTaskListOpen(true)}
					className={cn(
						"flex flex-col items-center justify-center",
						"bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)]",
						"h-20 text-muted-foreground text-xs transition hover:bg-muted",
					)}
				>
					<IconRenderer name="Plus" className="mb-1" />
					New list
				</button>
			</div>
		</section>
	);
}
