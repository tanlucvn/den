import type { Task } from "@/db/schema/tasks";

export const useGroupedTasks = (tasks: Task[]) => {
	const pinned = tasks.filter(
		(task) => task.isPinned && !task.isCompleted && !task.isArchived,
	);
	const active = tasks.filter(
		(task) => !task.isPinned && !task.isCompleted && !task.isArchived,
	);
	const completed = tasks.filter(
		(task) => task.isCompleted && !task.isArchived,
	);
	const archive = tasks.filter((task) => task.isArchived);

	return {
		pinned,
		active,
		completed,
		archive,
	};
};
