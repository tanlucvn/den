"use client";

import dynamic from "next/dynamic";
import { useDialogStore } from "@/store/use-dialog-store";

const AppModal = dynamic(() => import("@/components/modals/app-modal"), {
	ssr: false,
});

const SignInModal = dynamic(() => import("@/components/modals/sign-in-modal"), {
	ssr: false,
});

const NewTodoModal = dynamic(() => import("@/components/modals/new-todo"), {
	ssr: false,
});

export function ModalInitializer() {
	const { isAppModalOpen, isSignInOpen, isNewTodoOpen } = useDialogStore();

	// Modal definitions
	const modals = [
		{ open: isAppModalOpen, Component: AppModal },
		{ open: isSignInOpen, Component: SignInModal },
		{ open: isNewTodoOpen, Component: NewTodoModal },
	];

	return (
		<>
			{modals.map(({ open, Component }, i) =>
				open ? <Component key={Component.name || i} /> : null,
			)}
		</>
	);
}
