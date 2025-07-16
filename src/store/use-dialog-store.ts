import { create } from "zustand";

interface DialogStore {
	/*
	 * App Interface
	 */
	isAppModalOpen: boolean;
	setIsAppModalOpen: (open: boolean) => void;

	/*
	 *Tasks Interface
	 */
	isNewTaskOpen: boolean;
	setIsNewTaskOpen: (open: boolean) => void;

	isEditTaskOpen: boolean;
	setIsEditTaskOpen: (open: boolean) => void;

	/*
	 *Task Lists Interface
	 */
	isNewTaskListOpen: boolean;
	setIsNewTaskListOpen: (open: boolean) => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
	/*
	 * App
	 */
	isAppModalOpen: false,
	setIsAppModalOpen: (open) => set({ isAppModalOpen: open }),

	/*
	 *Tasks
	 */
	isNewTaskOpen: false,
	setIsNewTaskOpen: (open) => set({ isNewTaskOpen: open }),

	isEditTaskOpen: false,
	setIsEditTaskOpen: (open) => set({ isEditTaskOpen: open }),

	/*
	 *Task Lists
	 */
	isNewTaskListOpen: false,
	setIsNewTaskListOpen: (open) => set({ isNewTaskListOpen: open }),
}));
