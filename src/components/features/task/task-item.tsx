"use client";

import { isToday } from "date-fns";
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
import { TaskStatusSelector } from "./status-selector";
import TaskControlsContext from "./task-controls-context";

interface TaskItemProps {
	task: TaskWithTagsAndList;
}

export default function TaskItem({ task }: TaskItemProps) {
	const { handleUpdateTags, handleUpdate } = useTaskActions();

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

	return (
		<TaskControlsContext task={task}>
			<div
				className={cn(
					"group relative flex w-full select-none flex-col gap-2 rounded-xl border bg-card px-2 py-1 shadow-xs hover:border-ring hover:ring-[3px] hover:ring-ring/20",
					hasMetadata && "pb-2",
				)}
			>
				{/* Main row */}
				<div className="flex items-center justify-between">
					<div className="flex w-full items-center gap-2 overflow-hidden">
						<div className="flex items-center gap-1">
							<TaskStatusSelector task={task} />

							<TaskListCombobox
								value={task.listId ?? undefined}
								onValueChange={(newListId) =>
									handleUpdate({ ...task, listId: newListId })
								}
								showTrigger={!!task.listId}
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
						{/* Left-side metadata */}
						<div className="flex flex-wrap items-center gap-2">
							{task.isPinned && <IconRenderer name="Pin" />}
							{task.isArchived && <IconRenderer name="Archive" />}

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
			</div>
		</TaskControlsContext>
	);
}
