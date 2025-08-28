"use client";

import { isThisMonth, isThisWeek, isToday } from "date-fns";
import { useMemo, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Task } from "@/db/schema";
import type { List } from "@/db/schema/lists";
import {
	DATE_FILTER_LABELS,
	DATE_FILTERS,
	type DateFilter,
	ENTITY_ICONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TaskListSummaryProps {
	lists: List[];
	tasks: Task[];
}

export function TaskListSummary({
	lists: taskLists,
	tasks,
}: TaskListSummaryProps) {
	const [filter, setFilter] = useState<DateFilter>("all");

	// Apply filter
	const filtered = useMemo(() => {
		return taskLists.filter((list) => {
			const date = new Date(list.createdAt);
			switch (filter) {
				case "today":
					return isToday(date);
				case "week":
					return isThisWeek(date);
				case "month":
					return isThisMonth(date);
				default:
					return true;
			}
		});
	}, [filter, taskLists]);

	// Count tasks per list
	const taskCount = useMemo(() => {
		const map: Record<string, number> = {};
		for (const task of tasks) {
			if (!task.listId) continue;
			map[task.listId] = (map[task.listId] || 0) + 1;
		}
		return map;
	}, [tasks]);

	// Stats
	const total = filtered.length;
	const withDescription = filtered.filter((l) => l.description?.trim()).length;
	const withNote = filtered.filter((l) => l.note?.trim()).length;
	const withTasks = filtered.filter((list) => taskCount[list.id]).length;
	const withoutTasks = total - withTasks;

	return (
		<div className="flex size-full flex-col gap-6">
			{/* Header */}
			<div className="flex items-center gap-2">
				<IconRenderer
					name={ENTITY_ICONS.lists}
					className="text-muted-foreground"
				/>
				<h2 className="font-medium">List Summary</h2>
			</div>

			{/* Filter */}
			<Select value={filter} onValueChange={(v) => setFilter(v as DateFilter)}>
				<SelectTrigger className="h-7 w-full text-xs capitalize">
					<SelectValue placeholder="Time Range" />
				</SelectTrigger>
				<SelectContent>
					{DATE_FILTERS.map((date) => (
						<SelectItem key={date} value={date} className="text-xs capitalize">
							{DATE_FILTER_LABELS[date] ?? date}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Overall */}
			<Section title="Overall">
				<SummaryRow label="Total Lists" value={total} />
				<SummaryRow label="With Description" value={withDescription} />
				<SummaryRow label="With Note" value={withNote} />
			</Section>

			{/* Tasks distribution */}
			<Section title="Tasks">
				<SummaryRow
					label="With Tasks"
					value={withTasks}
					color="text-emerald-400"
				/>
				<SummaryRow
					label="Without Tasks"
					value={withoutTasks}
					color="text-amber-400"
				/>
			</Section>
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1 text-sm">
			<h3 className="font-medium text-muted-foreground text-xs capitalize">
				{title}
			</h3>
			{children}
		</div>
	);
}

function SummaryRow({
	label,
	value,
	color,
}: {
	label: string;
	value: number;
	color?: string;
}) {
	return (
		<div className="flex justify-between">
			<span>{label}</span>
			<span className={cn("text-muted-foreground", color)}>{value}</span>
		</div>
	);
}
