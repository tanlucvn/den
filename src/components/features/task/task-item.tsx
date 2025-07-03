"use client";

import { format, isToday, isTomorrow } from "date-fns";
import { MoreHorizontalIcon } from "lucide-react";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTaskActions } from "@/hooks/use-task-actions";
import type { Task } from "@/lib/models";
import { cn } from "@/lib/utils";
import TaskControlsContext from "./task-controls-context";
import TaskControlsDropdown from "./task-controls-dropdown";

interface TaskItemProps {
	task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
	const { onToggle } = useTaskActions();

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
					"group relative flex w-full flex-col gap-2 rounded-xl border bg-card/60 shadow-xs hover:border-primary/60",
					hasMetadata && "pb-2",
					task.isCompleted && "opacity-60",
				)}
			>
				{/* Main row */}
				<div className="flex items-center justify-between gap-2 rounded-xl bg-card px-2 py-1">
					<div className="flex w-full items-center gap-2 overflow-hidden">
						<Checkbox
							checked={task.isCompleted}
							onCheckedChange={() => onToggle(task)}
							className="size-6 rounded-full"
						/>

						<div className="flex max-w-full flex-col overflow-hidden">
							<span className="truncate font-medium">{task.title}</span>
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
						<div className="flex flex-wrap items-center gap-3">
							{task.isPinned && (
								<span className="flex items-center gap-1">
									<IconRenderer name="Pin" />
								</span>
							)}

							{task.location && (
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="flex items-center gap-1">
											<IconRenderer name="MapPin" />
										</span>
									</TooltipTrigger>
									<TooltipContent>{task.location}</TooltipContent>
								</Tooltip>
							)}

							{task.note && (
								<span className="flex items-center gap-1">
									<IconRenderer name="PencilLine" />
								</span>
							)}

							{task.priority !== "none" && (
								<span className="flex items-center gap-1">
									<IconRenderer name="ArrowUpWideNarrow" />
								</span>
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
