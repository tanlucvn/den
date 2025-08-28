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
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import {
	DATE_FILTER_LABELS,
	DATE_FILTERS,
	type DateFilter,
	ENTITY_ICONS,
	PRIORITY_COLORS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TaskSummaryProps {
	tasks: TaskWithTagsAndList[];
}

export function TaskSummary({ tasks }: TaskSummaryProps) {
	const [filter, setFilter] = useState<DateFilter>("all");

	// Apply filter
	const filtered = useMemo(() => {
		return tasks.filter((task) => {
			const date = new Date(task.createdAt);
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
	}, [filter, tasks]);

	// Stats
	const byStatus = {
		todo: filtered.filter((t) => t.status === "todo").length,
		inProgress: filtered.filter((t) => t.status === "in_progress").length,
		paused: filtered.filter((t) => t.status === "paused").length,
		completed: filtered.filter((t) => t.status === "completed").length,
	};

	const byPriority = {
		high: filtered.filter((t) => t.priority === "high").length,
		medium: filtered.filter((t) => t.priority === "medium").length,
		low: filtered.filter((t) => t.priority === "low").length,
	};

	const total = filtered.length;
	const active = total - byStatus.completed;

	const pinned = filtered.filter((t) => t.isPinned).length;
	const archived = filtered.filter((t) => t.isArchived).length;

	const completedPercent = total
		? Math.round((byStatus.completed / total) * 100)
		: 0;

	const now = new Date();
	const overdue = filtered.filter(
		(t) => t.remindAt && new Date(t.remindAt) < now && !t.isCompleted,
	).length;
	const dueSoon = filtered.filter((t) => {
		if (!t.remindAt) return false;
		const d = new Date(t.remindAt);
		return d >= now && d <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
	}).length;

	return (
		<div className="flex size-full flex-col gap-6">
			{/* Header */}
			<div className="flex items-center gap-2">
				<IconRenderer
					name={ENTITY_ICONS.task}
					className="text-muted-foreground"
				/>
				<h2 className="font-medium">Task Summary</h2>
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
			<div className="flex flex-col gap-1 text-sm">
				<SummaryRow label="Active" value={active} />
				<SummaryRow label="Completed" value={byStatus.completed} />
			</div>

			{/* Status */}
			<Section title="By Status">
				<SummaryRow label="Todo" value={byStatus.todo} />
				<SummaryRow label="In Progress" value={byStatus.inProgress} />
				<SummaryRow label="Paused" value={byStatus.paused} />
				<SummaryRow label="Completed" value={byStatus.completed} />
			</Section>

			{/* Priority */}
			<Section title="By Priority">
				<SummaryRow
					label="High"
					value={byPriority.high}
					color={PRIORITY_COLORS.high}
				/>
				<SummaryRow
					label="Medium"
					value={byPriority.medium}
					color={PRIORITY_COLORS.medium}
				/>
				<SummaryRow
					label="Low"
					value={byPriority.low}
					color={PRIORITY_COLORS.low}
				/>
			</Section>

			{/* Extra */}
			<Section title="Other">
				<SummaryRow label="Pinned" value={pinned} />
				<SummaryRow label="Archived" value={archived} />
			</Section>

			{/* Timeline */}
			<Section title="Timeline">
				<SummaryRow label="Overdue" value={overdue} color="text-rose-400" />
				<SummaryRow label="Due Soon" value={dueSoon} color="text-amber-400" />
			</Section>

			{/* Completion */}
			<div className="flex items-center justify-between text-sm">
				<span>Completion</span>
				<span>{completedPercent}%</span>
			</div>
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
