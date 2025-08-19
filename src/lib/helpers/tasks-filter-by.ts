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
