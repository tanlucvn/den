"use client";

import { isToday } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { type DragSourceMonitor, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import TaskControlsDropdown from "@/components/features/tasks/task-dropdown-menu";
import TaskTagSelector from "@/components/features/tasks/task-tag-selector";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { PRIORITY_COLORS } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import TaskControlsContext from "./task-context-menu";
import TaskListSelector from "./task-list-selector";

export const DragType = "TASK";

interface TaskGridItemProps {
	task: TaskWithTagsAndList;
	className?: string;
}

export default function TaskGridItem({ task, className }: TaskGridItemProps) {
	const ref = useRef<HTMLDivElement>(null);

	const [{ isDragging }, drag, preview] = useDrag(() => ({
		type: DragType,
		item: task,
		collect: (monitor: DragSourceMonitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true });
	}, [preview]);

	drag(ref);

	const hasMetadata =
		task.remindAt ||
		task.location ||
		task.isPinned ||
		task.isArchived ||
		Boolean(task.note?.trim()) ||
		task.priority !== "none";

	return (
		<TaskControlsContext task={task}>
			<motion.div
				ref={ref}
				layoutId={task.id}
				className={cn(
					"group relative flex w-full cursor-default flex-col gap-2 rounded-lg border bg-card px-2 py-1.5 shadow-xs",
					"hover:border-ring hover:ring-[3px] hover:ring-ring/20",
					className,
				)}
				style={{
					opacity: isDragging ? 0.5 : 1,
					cursor: isDragging ? "grabbing" : "default",
				}}
			>
				<MainRow task={task} />
				{hasMetadata && <MetadataRow task={task} />}
			</motion.div>
		</TaskControlsContext>
	);
}

function MainRow({ task }: { task: TaskWithTagsAndList }) {
	return (
		<div className="flex items-center justify-between gap-2">
			{/* Left: list + title + desc */}
			<div className="flex min-w-0 flex-1 items-center gap-2">
				<TaskListSelector task={task} listId={task.listId} className="size-7" />

				<div className="flex min-w-0 max-w-[200px] flex-col overflow-hidden">
					<h3 className="truncate font-medium">{task.title}</h3>
					{task.description && (
						<p className="truncate text-muted-foreground text-xs">
							{task.description}
						</p>
					)}
				</div>
			</div>

			{/* Right: tags + controls */}
			<div className="flex shrink-0 items-center gap-1">
				<TaskTagSelector task={task} />

				<TaskControlsDropdown task={task}>
					<Button variant="ghost" className="size-7">
						<IconRenderer name="EllipsisVertical" />
					</Button>
				</TaskControlsDropdown>
			</div>
		</div>
	);
}

function MetadataRow({ task }: { task: TaskWithTagsAndList }) {
	const isRemindPast = (date: string | Date) => {
		const d = new Date(date);
		return d < new Date() && !isToday(d);
	};

	return (
		<div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
			{/* Left metadata */}
			<div className="flex items-center gap-2">
				{task.isPinned && <IconRenderer name="Pin" />}
				{task.isArchived && <IconRenderer name="Archive" />}
				{task.note?.trim() && <IconRenderer name="Notebook" />}
				{task.location && (
					<div className="flex min-w-0 max-w-20 items-center gap-1">
						<IconRenderer name="MapPin" className="shrink-0" />
						<span className="truncate">{task.location}</span>
					</div>
				)}
			</div>

			{/* Right metadata */}
			<div className="ml-auto flex items-center gap-2">
				{task.remindAt && (
					<span
						className={cn(
							"flex items-center gap-1 capitalize",
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
							PRIORITY_COLORS[task.priority],
						)}
					>
						<IconRenderer name="Flag" />
						{task.priority}
					</Badge>
				)}
			</div>
		</div>
	);
}
