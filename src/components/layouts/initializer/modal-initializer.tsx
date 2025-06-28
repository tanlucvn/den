"use client";

import dynamic from "next/dynamic";
import { useDialogStore } from "@/store/use-dialog-store";

const SignInModal = dynamic(() => import("@/components/modals/sign-in-modal"), {
	ssr: false,
});

export function ModalInitializer() {
	const { isSignInOpen } = useDialogStore();

	// Modal definitions
	const modals = [{ open: isSignInOpen, Component: SignInModal }];

	return (
		<>
			{modals.map(({ open, Component }, i) =>
				open ? <Component key={Component.name || i} /> : null,
			)}
		</>
	);
}
