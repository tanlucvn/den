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
import { useTodoActions } from "@/hooks/use-todo-actions";
import type { Todo } from "@/lib/models";
import { cn } from "@/lib/utils";
import { TodoControlsContext } from "./todo-controls-context";
import { TodoControlsDropdown } from "./todo-controls-dropdown";

interface TodoItemProps {
	todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
	const { onToggle } = useTodoActions();

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
		todo.remindAt ||
		todo.location ||
		todo.note ||
		todo.priority !== "none" ||
		todo.isPinned;

	return (
		<TodoControlsContext todo={todo}>
			<div
				className={cn(
					"group relative flex w-full flex-col gap-2 rounded-xl border bg-card/60 shadow-xs hover:border-primary/60",
					hasMetadata && "pb-2",
					todo.isCompleted && "opacity-60",
				)}
			>
				{/* Main row */}
				<div className="flex items-center justify-between gap-2 rounded-xl bg-card px-2 py-1">
					<div className="flex w-full items-center gap-2 overflow-hidden">
						<Checkbox
							checked={todo.isCompleted}
							onCheckedChange={() => onToggle(todo)}
							className="size-6 rounded-full"
						/>

						<div className="flex max-w-full flex-col overflow-hidden">
							<span className="truncate font-medium">{todo.title}</span>
							{todo.note && (
								<p className="truncate text-muted-foreground text-xs">
									{todo.note}
								</p>
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
				{hasMetadata && (
					<div className="flex flex-wrap items-center gap-3 px-2 text-muted-foreground text-xs">
						{/* Left-side metadata */}
						<div className="flex flex-wrap items-center gap-3">
							{todo.isPinned && (
								<span className="flex items-center gap-1">
									<IconRenderer name="Pin" />
								</span>
							)}

							{todo.location && (
								<Tooltip>
									<TooltipTrigger asChild>
										<span className="flex items-center gap-1">
											<IconRenderer name="MapPin" />
										</span>
									</TooltipTrigger>
									<TooltipContent>{todo.location}</TooltipContent>
								</Tooltip>
							)}

							{todo.note && (
								<span className="flex items-center gap-1">
									<IconRenderer name="PencilLine" />
								</span>
							)}

							{todo.priority !== "none" && (
								<span className="flex items-center gap-1">
									<IconRenderer name="ArrowUpWideNarrow" />
								</span>
							)}
						</div>

						{/* Right-side metadata (always at end) */}
						<div className="ml-auto flex items-center gap-2">
							{todo.remindAt && (
								<span
									className={cn(
										"flex items-center gap-1",
										isRemindPast(todo.remindAt) && "text-destructive",
									)}
								>
									<IconRenderer name="Calendar" />
									{formatRemindDate(todo.remindAt)}
								</span>
							)}

							{todo.priority !== "none" && (
								<Badge
									variant="secondary"
									className={cn(
										"rounded-full text-[10px] capitalize",
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
					</div>
				)}
			</div>
		</TodoControlsContext>
	);
}
