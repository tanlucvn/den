import { type ClassValue, clsx } from "clsx";
import { format, isToday, isTomorrow } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { Task } from "@/db/schema/tasks";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const filterTasks = (tasks: Task[], query: string): Task[] => {
	const q = query.trim().toLowerCase();

	return tasks.filter((task) => {
		const title = task.title?.toLowerCase();
		const matchesSearch = q ? title.includes(q) : true;

		return matchesSearch;
	});
};

export const formatDate = (date: string | Date) => {
	const d = new Date(date);
	if (isToday(d)) return "today";
	if (isTomorrow(d)) return "tomorrow";
	return format(d, "MMMM do yyyy");
};
