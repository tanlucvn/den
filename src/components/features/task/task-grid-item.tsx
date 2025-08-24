"use client";

import { isToday } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { type DragSourceMonitor, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import TagChipCombobox from "@/components/features/tags/tag-combobox";
import TaskControlsDropdown from "@/components/features/task/task-controls-dropdown";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { PRIORITY_COLORS } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import TaskListCombobox from "./list-selector";
import TaskControlsContext from "./task-controls-context";

interface TaskGridItemProps {
	task: TaskWithTagsAndList;
	className?: string;
}

export const DragType = "TASK";

export default function TaskGridItem({ task, className }: TaskGridItemProps) {
	const { handleUpdateTags, handleUpdate } = useTaskActions();
	const ref = useRef<HTMLDivElement>(null);

	const [{ isDragging }, drag, preview] = useDrag(() => ({
		type: DragType,
		item: task,
		collect: (monitor: DragSourceMonitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	const isRemindPast = (date: string | Date) => {
		const d = new Date(date);
		return d < new Date() && !isToday(d);
	};

	const hasMetadata =
		task.remindAt ||
		task.location ||
		task.isPinned ||
		task.isArchived ||
		task.priority !== "none";

	// Use empty image as drag preview (we'll create a custom one with DragLayer)
	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true });
	}, [preview]);

	// Set up drop functionality.

	// Connect drag and drop to the element.
	drag(ref);

	return (
		<TaskControlsContext task={task}>
			<motion.div
				ref={ref}
				layoutId={`task-grid-${task.id}`}
				className={cn(
					"group relative flex w-full flex-col gap-2 rounded-lg border bg-card px-2 py-1.5 shadow-xs",
					"hover:border-ring hover:ring-[3px] hover:ring-ring/20",
					className,
				)}
				style={{
					opacity: isDragging ? 0.5 : 1,
					cursor: isDragging ? "grabbing" : "default",
				}}
			>
				{/* Main row */}
				<div className="flex items-center justify-between gap-2">
					{/* Left: Status + List + Title */}
					<div className="flex min-w-0 flex-1 items-center gap-2">
						<TaskListCombobox
							value={task.listId ?? undefined}
							onValueChange={(newListId) =>
								handleUpdate({ ...task, listId: newListId })
							}
							className="size-7"
						/>

						<div className="flex min-w-0 max-w-[200px] flex-col overflow-hidden">
							<h3 className="truncate font-medium">{task.title}</h3>
							{task.note && (
								<p className="truncate text-muted-foreground text-xs">
									{task.note}
								</p>
							)}
						</div>
					</div>

					{/* Right: Tags + Menu */}
					<div className="flex shrink-0 items-center gap-1">
						<TagChipCombobox
							tags={task.tags ?? []}
							selectedIds={task.tags?.map((t) => t.id)}
							onChange={(tagIds) => handleUpdateTags(task.id, tagIds)}
						/>

						<TaskControlsDropdown task={task}>
							<Button variant="ghost" size="icon" className="rounded-full">
								<IconRenderer name="EllipsisVertical" />
							</Button>
						</TaskControlsDropdown>
					</div>
				</div>

				{/* Metadata row */}
				{hasMetadata && (
					<div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
						{/* Left metadata */}
						<div className="flex items-center gap-2">
							{task.isPinned && <IconRenderer name="Pin" />}
							{task.isArchived && <IconRenderer name="Archive" />}

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
										PRIORITY_COLORS[task.priority],
									)}
								>
									<IconRenderer name="Flag" />
									{task.priority}
								</Badge>
							)}
						</div>
					</div>
				)}
			</motion.div>
		</TaskControlsContext>
	);
}
