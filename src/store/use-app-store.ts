import { create } from "zustand";
import type { Tag } from "@/db/schema/tags";
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";

type AppStore = {
	editTask: Task | null;
	setEditTask: (task: Task | null) => void;

	editTaskList: TaskList | null;
	setEditTaskList: (taskList: TaskList | null) => void;

	editTag: Tag | null;
	setEditTag: (tag: Tag | null) => void;

	searchTerm: string;
	setSearchTerm: (term: string) => void;
};

export const useAppStore = create<AppStore>((set) => ({
	editTask: null,
	setEditTask: (task) => set({ editTask: task }),

	editTaskList: null,
	setEditTaskList: (taskList) => set({ editTaskList: taskList }),

	editTag: null,
	setEditTag: (tag) => set({ editTag: tag }),

	searchTerm: "",
	setSearchTerm: (term) => set({ searchTerm: term }),
}));
