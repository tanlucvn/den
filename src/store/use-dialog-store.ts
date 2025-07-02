import { create } from "zustand";

interface DialogStore {
	isAppModalOpen: boolean;
	setIsAppModalOpen: (open: boolean) => void;

	isSignInOpen: boolean;
	setIsSignInOpen: (open: boolean) => void;

	isNewTodoOpen: boolean;
	setIsNewTodoOpen: (open: boolean) => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
	isAppModalOpen: false,
	setIsAppModalOpen: (open) => set({ isAppModalOpen: open }),

	isSignInOpen: false,
	setIsSignInOpen: (open) => set({ isSignInOpen: open }),

	isNewTodoOpen: false,
	setIsNewTodoOpen: (open) => set({ isNewTodoOpen: open }),
}));
