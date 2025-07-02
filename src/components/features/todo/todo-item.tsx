"use client";

import { format, isToday, isTomorrow } from "date-fns";
import {
	ArrowUpWideNarrowIcon,
	CalendarIcon,
	MapPinIcon,
	MoreHorizontalIcon,
	PencilLineIcon,
} from "lucide-react";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTodoActions } from "@/hooks/use-todo-actions";
import type { Todo } from "@/lib/models";
import { cn } from "@/lib/utils";
import { TodoControlsContext } from "./todo-controls-context";
import { TodoControlsDropdown } from "./todo-controls-dropdown";

interface TodoItemProps {
	todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
	const { onUpdate } = useTodoActions();

	const handleToggleComplete = () => {
		onUpdate({ ...todo, isCompleted: !todo.isCompleted });
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

	return (
		<TodoControlsContext todo={todo}>
			<div
				className={cn(
					"group relative flex flex-col gap-2 rounded-xl border p-1 shadow-xs hover:border-primary/60",
					todo.isCompleted && "opacity-60",
				)}
			>
				<div className="flex items-center justify-between rounded-lg bg-card px-2 py-1">
					<div className="flex items-center gap-2">
						<Checkbox
							checked={todo.isCompleted}
							onCheckedChange={handleToggleComplete}
							className="size-6 rounded-full"
						/>

						<div className="flex flex-col">
							<p className="font-medium">{todo.title}</p>
							{todo.note && (
								<p className="text-muted-foreground text-xs">{todo.note}</p>
							)}
						</div>
					</div>

					<TodoControlsDropdown todo={todo}>
						<Button variant="ghost" size="icon">
							<MoreHorizontalIcon />
						</Button>
					</TodoControlsDropdown>
				</div>

				{/* Metadata row */}
				{(todo.remindAt ||
					todo.location ||
					todo.note ||
					todo.priority !== "none" ||
					todo.isPinned) && (
					<div className="flex flex-wrap items-center gap-3 px-2 text-muted-foreground text-xs">
						{todo.remindAt && (
							<span
								className={cn(
									"inline-flex items-center gap-1",
									isRemindPast(todo.remindAt) && "text-destructive",
								)}
							>
								<CalendarIcon className="size-3" />
								{formatRemindDate(todo.remindAt)}
							</span>
						)}

						{location && (
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="inline-flex items-center gap-1">
										<MapPinIcon className="size-3" />
									</span>
								</TooltipTrigger>
								<TooltipContent>{todo.location}</TooltipContent>
							</Tooltip>
						)}
						{todo.note && (
							<span className="inline-flex items-center gap-1">
								<PencilLineIcon className="size-3" />
							</span>
						)}
						{todo.priority !== "none" && (
							<span className="inline-flex items-center gap-1">
								<ArrowUpWideNarrowIcon className="size-3" />
							</span>
						)}
						{todo.priority !== "none" && (
							<Badge
								variant="secondary"
								className={cn(
									"ml-auto rounded-full text-[10px] capitalize",
									todo.priority === "low" && "text-emerald-500",
									todo.priority === "medium" && "text-orange-500",
									todo.priority === "high" && "text-rose-700",
								)}
							>
								<IconRenderer name="Flag" />
								{todo.priority}
							</Badge>
						)}
					</div>
				)}
			</div>
		</TodoControlsContext>
	);
}
