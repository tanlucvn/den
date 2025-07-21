"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { isToday } from "date-fns";
import TaskControlsDropdown from "@/components/features/task/task-controls-dropdown";
import { IconRenderer } from "@/components/icon-renderer";
import { PomodoroTimerDialog } from "@/components/modals/pomodoro-timer-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/use-task-actions";
import { cn, formatDate } from "@/lib/utils";
import TaskControlsContext from "./task-controls-context";

type Props = {
	task: Task;
	noContext?: boolean;
};

export default function DraggableTaskItem({ task }: Props) {
	const { onToggle } = useTaskActions();

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: task.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		touchAction: "manipulation",
		opacity: isDragging ? 0.35 : 1,
		zIndex: isDragging ? 1 : 0,
	};

	const isRemindPast = (date: string | Date) => {
		const d = new Date(date);
		return d < new Date() && !isToday(d);
	};

	const hasMetadata = task.remindAt || task.location || task.isPinned;

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<TaskControlsContext task={task}>
				<div
					className={cn(
						"group relative flex w-full select-none flex-col gap-1 rounded-xl border bg-card px-2 py-1 shadow-xs hover:border-ring hover:ring-[3px] hover:ring-ring/20",
						hasMetadata && "pb-2",
					)}
				>
					{/* Main row */}
					<div className="flex items-center justify-between">
						<div className="flex w-full items-center gap-2 overflow-hidden">
							<div className="flex items-center gap-1">
								<button
									className="cursor-grab touch-none active:cursor-grabbing"
									{...listeners}
									{...attributes}
								>
									<IconRenderer
										name="GripVertical"
										className="text-muted-foreground hover:text-primary"
									/>
								</button>

								<Checkbox
									checked={task.isCompleted}
									onCheckedChange={() => onToggle(task)}
									className="size-6 rounded-full"
								/>
							</div>

							<div className="flex flex-col overflow-hidden">
								<h3 className="truncate font-medium">{task.title}</h3>
								{task.note && (
									<p className="truncate text-muted-foreground text-xs">
										{task.note}
									</p>
								)}
							</div>
						</div>

						<div className="flex items-center gap-1">
							<PomodoroTimerDialog
								title={task.title}
								onFinish={() => onToggle({ ...task, isCompleted: true })}
							>
								<Button variant="ghost" size="icon" className="rounded-full">
									<IconRenderer name="Timer" />
								</Button>
							</PomodoroTimerDialog>

							<TaskControlsDropdown task={task}>
								<Button variant="ghost" size="icon" className="rounded-full">
									<IconRenderer name="MoreHorizontal" />
								</Button>
							</TaskControlsDropdown>
						</div>
					</div>

					{/* Metadata row */}
					{hasMetadata && (
						<div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
							{/* Left-side metadata */}
							<div className="flex flex-wrap items-center gap-2">
								{task.isPinned && <IconRenderer name="Pin" />}

								{task.location && (
									<div className="flex min-w-0 max-w-20 items-center gap-0.5">
										<IconRenderer name="MapPin" className="shrink-0" />
										<span className="truncate">{task.location}</span>
									</div>
								)}
							</div>

							{/* Right-side metadata */}
							<div className="ml-auto flex items-center gap-2">
								{task.remindAt && (
									<span
										className={cn(
											"flex items-center gap-1",
											isRemindPast(task.remindAt) && "text-destructive",
										)}
									>
										<IconRenderer name="Calendar" />
										{formatDate(task.remindAt)}
									</span>
								)}

								{task.priority !== "none" && (
									<Badge
										variant="secondary"
										className={cn(
											"rounded-full text-[10px] capitalize",
											task.priority === "low" && "text-emerald-500",
											task.priority === "medium" && "text-orange-500",
											task.priority === "high" && "text-rose-700",
										)}
									>
										<IconRenderer name="Flag" />
										{task.priority}
									</Badge>
								)}
							</div>
						</div>
					)}
				</div>
			</TaskControlsContext>
		</div>
	);
}
