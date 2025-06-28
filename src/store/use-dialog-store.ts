import { create } from "zustand";

interface DialogStore {
	isSignInOpen: boolean;
	setIsSignInOpen: (open: boolean) => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
	isSignInOpen: false,
	setIsSignInOpen: (open) => set({ isSignInOpen: open }),
}));
