import type { List } from "@/db/schema";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";

export const filterByStatus = (
	tasks: TaskWithTagsAndList[],
	statusId: string,
) => {
	return tasks.filter((task) => task.status === statusId);
};

export const filterByPriority = (
	tasks: TaskWithTagsAndList[],
	priorityId: string,
) => {
	return tasks.filter((task) => task.priority === priorityId);
};

export const filterByTags = (tasks: TaskWithTagsAndList[], tagId: string) => {
	return tasks.filter((task) => task.tags?.some((tag) => tag.id === tagId));
};

export const filterByLists = (tasks: TaskWithTagsAndList[], listId: string) => {
	return tasks.filter((task) => task.listId === listId);
};

export const countByColor = (lists: List[], color: string) =>
	lists.filter((list) => list.color === color).length;

export const countByIcon = (lists: List[], icon: string) =>
	lists.filter((list) => list.icon === icon).length;

export const countByNote = (lists: List[], mode: "has" | "none") =>
	lists.filter((list) => (mode === "has" ? Boolean(list.note) : !list.note))
		.length;
