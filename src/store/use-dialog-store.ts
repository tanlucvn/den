import { create } from "zustand";

interface DialogStore {
	isAppModalOpen: boolean;
	setIsAppModalOpen: (open: boolean) => void;

	isNewTaskOpen: boolean;
	setIsNewTaskOpen: (open: boolean) => void;

	isEditTaskOpen: boolean;
	setIsEditTaskOpen: (open: boolean) => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
	isAppModalOpen: false,
	setIsAppModalOpen: (open) => set({ isAppModalOpen: open }),

	isNewTaskOpen: false,
	setIsNewTaskOpen: (open) => set({ isNewTaskOpen: open }),

	isEditTaskOpen: false,
	setIsEditTaskOpen: (open) => set({ isEditTaskOpen: open }),
}));
