import type { Task } from "@/lib/models";

export const useGroupedTasks = (tasks: Task[]) => {
	const pinned = tasks.filter((task) => task.isPinned && !task.isCompleted);
	const recent = tasks.filter((task) => !task.isPinned && !task.isCompleted);
	const completed = tasks.filter((task) => task.isCompleted);

	return {
		pinned,
		recent,
		completed,
	};
};
