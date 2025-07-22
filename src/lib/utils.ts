import { type ClassValue, clsx } from "clsx";
import { format, isToday, isTomorrow } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { Task } from "@/db/schema/tasks";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function filterTasks(tasks: Task[], searchTerm: string): Task[] {
	if (!searchTerm.trim()) return tasks;
	const lowerSearch = searchTerm.toLowerCase();

	return tasks.filter((task) => {
		return (
			task.title.toLowerCase().includes(lowerSearch) ||
			task.note?.toLowerCase().includes(lowerSearch)
		);
	});
}

export const formatDate = (date: string | Date) => {
	const d = new Date(date);
	if (isToday(d)) return "today";
	if (isTomorrow(d)) return "tomorrow";
	return format(d, "MMMM do yyyy");
};
