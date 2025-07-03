import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Task } from "./models";

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
