import { isThisMonth, isThisWeek, isToday } from "date-fns";
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";

export function getTaskListSummary(
	taskLists: TaskList[],
	tasks: Task[],
	filter: string,
) {
	//* Filter lists by selected time range (all, today, week, month)
	const filtered = taskLists.filter((list) => {
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

	//* Basic statistics
	const total = filtered.length;

	//* Get task IDs from the filtered task lists
	const listIds = new Set(filtered.map((list) => list.id));

	//* Filter tasks that belong to the filtered task lists
	const filteredTasks = tasks.filter(
		(task) => task.listId && listIds.has(task.listId),
	);

	//* Count number of tasks per task list
	const taskCount: Record<string, number> = {};
	for (const task of filteredTasks) {
		if (!task.listId) continue;
		taskCount[task.listId] = (taskCount[task.listId] || 0) + 1;
	}

	//* Task lists that have at least one task
	const withTasks = filtered.filter((list) => taskCount[list.id]).length;

	//* Task lists that have no tasks
	const withoutTasks = filtered.filter((list) => !taskCount[list.id]).length;

	//* Find the task list with the most tasks
	let largestList: TaskList | undefined;
	let maxCount = 0;
	for (const list of filtered) {
		const count = taskCount[list.id] || 0;
		if (count > maxCount) {
			maxCount = count;
			largestList = list;
		}
	}

	return {
		filtered,
		total,
		withTasksCount: withTasks,
		withoutTasksCount: withoutTasks,
		largestList,
		largestCount: maxCount,
	};
}
