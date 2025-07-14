import { type ClassValue, clsx } from "clsx";
import { format, isToday, isTomorrow } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { Task } from "@/db/schema/tasks";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const parseTaskDates = (task: Task) => ({
	...task,
	createdAt: new Date(task.createdAt),
	updatedAt: new Date(task.updatedAt),
	remindAt: task.remindAt ? new Date(task.remindAt) : null,
	deletedAt: task.deletedAt ? new Date(task.deletedAt) : null,
});

export const parseTaskArrayDates = (tasks: Task[]): Task[] =>
	tasks.map(parseTaskDates);

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

export const getUserInitials = (name: string | null, email: string | null) => {
	if (name) {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}
	if (email) {
		return email[0].toUpperCase();
	}
	return "U";
};
