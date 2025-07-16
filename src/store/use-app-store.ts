import { create } from "zustand";
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";

type AppStore = {
	editTask: Task | null;
	setEditTask: (task: Task | null) => void;

	editTaskList: TaskList | null;
	setEditTaskList: (taskList: TaskList | null) => void;

	searchTerm: string;
	setSearchTerm: (term: string) => void;
};

export const useAppStore = create<AppStore>((set) => ({
	editTask: null,
	setEditTask: (task) => set({ editTask: task }),

	editTaskList: null,
	setEditTaskList: (taskList) => set({ editTaskList: taskList }),

	searchTerm: "",
	setSearchTerm: (term) => set({ searchTerm: term }),
}));
