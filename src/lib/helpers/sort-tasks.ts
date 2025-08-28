import type { TaskWithTagsAndList } from "@/db/schema";

export function sortTasks(tasks: TaskWithTagsAndList[]) {
	return [...tasks].sort((a, b) => {
		if (a.isPinned && !b.isPinned) return -1;
		if (!a.isPinned && b.isPinned) return 1;

		const priorityMap = { high: 3, medium: 2, low: 1, none: 0 };
		if (priorityMap[a.priority] > priorityMap[b.priority]) return -1;
		if (priorityMap[a.priority] < priorityMap[b.priority]) return 1;

		return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
	});
}
