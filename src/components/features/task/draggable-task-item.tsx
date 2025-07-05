"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isToday, isTomorrow } from "date-fns";
import { MoreHorizontalIcon } from "lucide-react";
import TaskControlsContext from "@/components/features/task/task-controls-context";
import TaskControlsDropdown from "@/components/features/task/task-controls-dropdown";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTaskActions } from "@/hooks/use-task-actions";
import type { Task } from "@/lib/models";
import { cn } from "@/lib/utils";

type Props = {
	task: Task;
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

	const isRemindPast = (dateStr: string) => {
		const d = new Date(dateStr);
		return d < new Date() && !isToday(d);
	};

	const formatRemindDate = (date: string) => {
		const d = new Date(date);
		if (isToday(d)) return "today";
		if (isTomorrow(d)) return "tomorrow";
		return format(d, "MMMM do yyyy");
	};

	const hasMetadata = task.remindAt || task.location || task.isPinned;

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			<TaskControlsContext task={task}>
				<div
					className={cn(
						"group relative flex w-full flex-col gap-2 rounded-xl border bg-card/60 shadow-xs hover:border-primary",
						hasMetadata && "pb-2",
					)}
				>
					{/* Main row */}
					<div className="flex items-center justify-between gap-2 rounded-xl bg-card px-2 py-1">
						<div className="flex w-full items-center gap-2 overflow-hidden">
							<div className="flex items-center gap-2">
								<div
									{...listeners}
									{...attributes}
									className="cursor-grab active:cursor-grabbing"
								>
									<IconRenderer
										name="GripVertical"
										className="text-muted-foreground hover:text-primary"
									/>
								</div>

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

						<TaskControlsDropdown task={task}>
							<Button variant="ghost" size="icon">
								<MoreHorizontalIcon />
							</Button>
						</TaskControlsDropdown>
					</div>

					{/* Metadata row */}
					{hasMetadata && (
						<div className="flex flex-wrap items-center gap-3 px-2 text-muted-foreground text-xs">
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
										{formatRemindDate(task.remindAt)}
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
