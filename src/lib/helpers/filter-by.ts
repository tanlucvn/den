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
