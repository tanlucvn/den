import type React from "react";
import { AppSwitcher } from "@/components/common/app-switcher";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";

interface AppModalProps {
	children: React.ReactNode;
}

export default function AppModal({ children }: AppModalProps) {
	return (
		<Modal direction="left" shouldScaleBackground={false} onlyDrawer>
			<ModalTrigger asChild>{children}</ModalTrigger>
			<ModalContent
				className="rounded-lg p-0 after:hidden after:content-none"
				showCloseButton={false}
			>
				<ModalHeader className="sr-only">
					<ModalTitle className="sr-only">Sidebar</ModalTitle>
					<ModalDescription className="sr-only">
						Displays the mobile sidebar.
					</ModalDescription>
				</ModalHeader>

				<div className="flex h-full w-full flex-col p-2">
					<AppSwitcher />
				</div>
			</ModalContent>
		</Modal>
	);
}
