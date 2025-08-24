"use client";

import { IconRenderer } from "@/components/icon-renderer";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { ENTITY_ICONS, PRIORITY_COLORS } from "@/lib/constants";

interface TaskSummaryProps {
	tasks: TaskWithTagsAndList[];
}

export function TaskSummary({ tasks }: TaskSummaryProps) {
	const byStatus = {
		todo: tasks.filter((t) => t.status === "todo").length,
		inProgress: tasks.filter((t) => t.status === "in_progress").length,
		paused: tasks.filter((t) => t.status === "paused").length,
		completed: tasks.filter((t) => t.status === "completed").length,
	};

	const byPriority = {
		high: tasks.filter((t) => t.priority === "high").length,
		medium: tasks.filter((t) => t.priority === "medium").length,
		low: tasks.filter((t) => t.priority === "low").length,
	};

	const total = tasks.length;
	const active = total - byStatus.completed;

	const pinned = tasks.filter((t) => t.isPinned).length;
	const archived = tasks.filter((t) => t.isArchived).length;

	// const percent = total ? Math.round((byStatus.completed / total) * 100) : 0;

	return (
		<div className="flex size-full flex-col gap-6">
			{/* Header */}
			<div className="flex items-center gap-2">
				<IconRenderer
					name={ENTITY_ICONS.task}
					className="text-muted-foreground"
				/>
				<h2 className="font-medium">Summary</h2>
			</div>

			{/* Calendar */}

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
			<span className={color}>{label}</span>
			<span className="text-muted-foreground">{value}</span>
		</div>
	);
}
