import type { Task } from "@/db/schema/tasks";

export type TaskSortOption =
	| "created-desc"
	| "created-asc"
	| "updated-desc"
	| "updated-asc"
	| "remind-asc"
	| "remind-desc"
	| "priority-asc"
	| "priority-desc"
	| "title-asc"
	| "title-desc"
	| "sortIndex-asc"
	| "sortIndex-desc";

export const sortTasks = (tasks: Task[], option: TaskSortOption) => {
	const priorityMap = {
		none: 0,
		low: 1,
		medium: 2,
		high: 3,
	};

	return [...tasks].sort((a, b) => {
		switch (option) {
			case "created-desc":
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);

			case "created-asc":
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);

			case "updated-desc":
				return (
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
				);

			case "updated-asc":
				return (
					new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
				);

			case "remind-asc":
				return (
					new Date(a.remindAt || 0).getTime() -
					new Date(b.remindAt || 0).getTime()
				);

			case "remind-desc":
				return (
					new Date(b.remindAt || 0).getTime() -
					new Date(a.remindAt || 0).getTime()
				);

			case "priority-asc":
				return (priorityMap[a.priority] ?? 0) - (priorityMap[b.priority] ?? 0);

			case "priority-desc":
				return (priorityMap[b.priority] ?? 0) - (priorityMap[a.priority] ?? 0);

			case "title-asc":
				return (a.title || "").localeCompare(b.title || "");

			case "title-desc":
				return (b.title || "").localeCompare(a.title || "");

			case "sortIndex-asc":
				return (a.sortIndex ?? 0) - (b.sortIndex ?? 0);

			case "sortIndex-desc":
				return (b.sortIndex ?? 0) - (a.sortIndex ?? 0);

			default:
				return 0;
		}
	});
};
