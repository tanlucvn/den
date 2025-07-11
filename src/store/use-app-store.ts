import { create } from "zustand";
import type { Task } from "@/db/schema/tasks";

type AppStore = {
	editTask: Task | null;
	setEditTask: (task: Task | null) => void;

	searchTerm: string;
	setSearchTerm: (term: string) => void;
};

export const useAppStore = create<AppStore>((set) => ({
	editTask: null,
	setEditTask: (task) => set({ editTask: task }),

	searchTerm: "",
	setSearchTerm: (term) => set({ searchTerm: term }),
}));
