import type { Task } from "@/lib/models";

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
