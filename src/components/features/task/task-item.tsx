"use client";

import { format, isToday, isTomorrow } from "date-fns";
import { MoreHorizontalIcon } from "lucide-react";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/use-task-actions";
import { cn } from "@/lib/utils";
import TaskControlsContext from "./task-controls-context";
import TaskControlsDropdown from "./task-controls-dropdown";

interface TaskItemProps {
	task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
	const { onToggle } = useTaskActions();

	const isRemindPast = (date: string | Date) => {
		const d = new Date(date);
		return d < new Date() && !isToday(d);
	};

	const formatRemindDate = (date: string | Date) => {
		const d = new Date(date);
		if (isToday(d)) return "today";
		if (isTomorrow(d)) return "tomorrow";
		return format(d, "MMMM do yyyy");
	};

	const hasMetadata =
		task.remindAt ||
		task.location ||
		task.note ||
		task.priority !== "none" ||
		task.isPinned;

	return (
		<TaskControlsContext task={task}>
			<div
				className={cn(
					"group relative flex w-full select-none flex-col gap-1 rounded-xl border bg-card px-2 py-1 shadow-xs hover:border-ring hover:ring-[3px] hover:ring-ring/20",
					hasMetadata && "pb-2",
				)}
			>
				{/* Main row */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex w-full items-center gap-2 overflow-hidden">
						<Checkbox
							checked={task.isCompleted}
							onCheckedChange={() => onToggle(task)}
							className="size-6 rounded-full"
						/>

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
	);
}
