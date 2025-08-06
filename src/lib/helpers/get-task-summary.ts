import { isThisMonth, isThisWeek, isToday } from "date-fns";
import type { Task } from "@/db/schema/tasks";

export function getTaskSummary(tasks: Task[], filter: string) {
	//* Filter tasks by selected time range (all, today, week, month)
	const filtered = tasks.filter((task) => {
		const createdAt = new Date(task.createdAt);
		switch (filter) {
			case "today":
				return isToday(createdAt);
			case "week":
				return isThisWeek(createdAt);
			case "month":
				return isThisMonth(createdAt);
			default:
				return true;
		}
	});

	//* Basic statistics
	const total = filtered.length;
	const completed = filtered.filter((task) => task.isCompleted).length;
	const pinned = filtered.filter((task) => task.isPinned).length;
	const archived = filtered.filter((task) => task.isArchived).length;
	const remaining = total - completed;

	//* Calculate completion rate (0–100%)
	const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

	//* Pie chart data
	const pieData = [
		{ status: "completed", tasks: completed, fill: "var(--chart-5)" },
		{ status: "remaining", tasks: remaining, fill: "var(--chart-1)" },
	];

	//* Labels and colors for chart legend
	const chartConfig = {
		tasks: { label: "Tasks" },
		completed: { label: "Completed", color: "var(--chart-3)" },
		remaining: { label: "Remaining", color: "var(--chart-1)" },
	} as const;

	return {
		filtered,
		total,
		completed,
		remaining,
		pinned,
		archived,
		rate,
		pieData,
		chartConfig,
	};
}
