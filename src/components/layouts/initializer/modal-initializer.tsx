"use client";

import dynamic from "next/dynamic";
import { useDialogStore } from "@/store/use-dialog-store";

const AppModal = dynamic(() => import("@/components/modals/app-modal"), {
	ssr: false,
});

const SignInModal = dynamic(() => import("@/components/modals/sign-in-modal"), {
	ssr: false,
});

const NewTaskModal = dynamic(
	() => import("@/components/modals/new-task-modal"),
	{
		ssr: false,
	},
);

const EditTaskModal = dynamic(
	() => import("@/components/modals/edit-task-modal"),
	{
		ssr: false,
	},
);

export function ModalInitializer() {
	const { isAppModalOpen, isSignInOpen, isNewTaskOpen, isEditTaskOpen } =
		useDialogStore();

	// Modal definitions
	const modals = [
		{ open: isAppModalOpen, Component: AppModal },
		{ open: isSignInOpen, Component: SignInModal },
		{ open: isNewTaskOpen, Component: NewTaskModal },
		{ open: isEditTaskOpen, Component: EditTaskModal },
	];

	return (
		<>
			{modals.map(({ open, Component }, i) =>
				open ? <Component key={Component.name || i} /> : null,
			)}
		</>
	);
}
