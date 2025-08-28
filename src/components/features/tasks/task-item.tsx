"use client";

import { motion } from "framer-motion";
import TaskDropdownMenu from "@/components/features/tasks/task-dropdown-menu";
import TaskTagSelector from "@/components/features/tasks/task-tag-selector";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { PRIORITY_COLORS } from "@/lib/constants";
import { cn, formatDate, isRemindPast } from "@/lib/utils";
import TaskContextMenu from "./task-context-menu";
import TaskListSelector from "./task-list-selector";
import { TaskStatusSelector } from "./task-status-selector";

interface TaskItemProps {
	task: TaskWithTagsAndList;
	className?: string;
}

export default function TaskItem({ task, className }: TaskItemProps) {
	const hasMetadata =
		task.remindAt ||
		task.location ||
		task.isPinned ||
		task.isArchived ||
		Boolean(task.note?.trim()) ||
		task.priority !== "none";

	return (
		<TaskContextMenu task={task}>
			<motion.div
				layoutId={task.id}
				className={cn(
					"group relative flex w-full cursor-default flex-col gap-2 rounded-lg border bg-card px-2 py-1.5 shadow-xs",
					"hover:border-ring hover:ring-[3px] hover:ring-ring/20",
					className,
				)}
			>
				<MainRow task={task} />
				{hasMetadata && <MetadataRow task={task} />}
			</motion.div>
		</TaskContextMenu>
	);
}

function MainRow({ task }: { task: TaskWithTagsAndList }) {
	return (
		<div className="flex items-center justify-between gap-2">
			{/* Left: status + list + title/desc */}
			<div className="flex min-w-0 flex-1 items-center gap-2">
				<TaskStatusSelector task={task} />

				<TaskListSelector task={task} listId={task.listId} />

				<div className="flex min-w-0 flex-col overflow-hidden">
					<h3 className="truncate font-medium text-sm">{task.title}</h3>
					{task.description && (
						<p className="truncate text-muted-foreground text-xs">
							{task.description}
						</p>
					)}
				</div>
			</div>

			{/* Right: tags + menu */}
			<div className="flex shrink-0 items-center gap-1">
				<TaskTagSelector task={task} />

				<TaskDropdownMenu task={task}>
					<Button variant="ghost" size="icon" className="size-8">
						<IconRenderer name="EllipsisVertical" />
					</Button>
				</TaskDropdownMenu>
			</div>
		</div>
	);
}

function MetadataRow({ task }: { task: TaskWithTagsAndList }) {
	return (
		<div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
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
							"rounded-full text-xs capitalize",
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
