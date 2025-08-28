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

export const isRemindPast = (date: string | Date) => {
	const d = new Date(date);
	return d < new Date() && !isToday(d);
};

export const formatDate = (date: string | Date) => {
	const d = new Date(date);
	if (isToday(d)) return "today";
	if (isTomorrow(d)) return "tomorrow";
	return format(d, "MMMM do yyyy");
};

export function formatIconName(name: string) {
	return name
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function getURL(): string {
	if (typeof window !== "undefined") {
		// Client-side
		return window.location.origin;
	}

	// Server-side: get from local env NEXT_PUBLIC_APP_URL or fallback localhost
	const base =
		process.env.NEXT_PUBLIC_APP_URL ?? // eg. https://den-demo.vercel.app
		"http://localhost:3000";

	return base.startsWith("http") ? base : `https://${base}`;
}
