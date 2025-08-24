"use client";

import { IconRenderer } from "@/components/icon-renderer";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { ENTITY_ICONS } from "@/lib/constants";

interface TaskSummaryProps {
	tasks: TaskWithTagsAndList[];
}

export function TaskSummary({ tasks }: TaskSummaryProps) {
	const total = tasks.length;
	const completed = tasks.filter((t) => t.isCompleted).length;
	const active = total - completed;

	const byStatus = {
		todo: tasks.filter((t) => t.status === "todo").length,
		inProgress: tasks.filter((t) => t.status === "in_progress").length,
		paused: tasks.filter((t) => t.status === "paused").length,
		completed,
	};

	const byPriority = {
		high: tasks.filter((t) => t.priority === "high").length,
		medium: tasks.filter((t) => t.priority === "medium").length,
		low: tasks.filter((t) => t.priority === "low").length,
	};

	return (
		<aside className="flex flex-col gap-6 p-2">
			{/* Header */}
			<div className="flex items-center gap-2">
				<IconRenderer
					name={ENTITY_ICONS.task}
					className="text-muted-foreground"
				/>
				<h2 className="font-medium">Summary</h2>
				<NumberFlowBadge value={total} />
			</div>

			{/* Overall */}
			<div className="flex flex-col gap-1 text-sm">
				<div className="flex justify-between">
					<span className="text-muted-foreground">Active</span>
					<span>{active}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Completed</span>
					<span>{completed}</span>
				</div>
			</div>

			{/* Status */}
			<div className="flex flex-col gap-1 text-sm">
				<h3 className="font-medium text-muted-foreground text-xs uppercase">
					By Status
				</h3>
				<SummaryRow label="Todo" value={byStatus.todo} />
				<SummaryRow label="In Progress" value={byStatus.inProgress} />
				<SummaryRow label="Paused" value={byStatus.paused} />
				<SummaryRow label="Completed" value={byStatus.completed} />
			</div>

			{/* Priority */}
			<div className="flex flex-col gap-1 text-sm">
				<h3 className="font-medium text-muted-foreground text-xs uppercase">
					By Priority
				</h3>
				<SummaryRow label="High" value={byPriority.high} />
				<SummaryRow label="Medium" value={byPriority.medium} />
				<SummaryRow label="Low" value={byPriority.low} />
			</div>
		</aside>
	);
}

function SummaryRow({ label, value }: { label: string; value: number }) {
	return (
		<div className="flex justify-between">
			<span>{label}</span>
			<span className="text-muted-foreground">{value}</span>
		</div>
	);
}
