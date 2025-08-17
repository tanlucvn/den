"use client";

import { useState } from "react";
import NewTagForm from "@/components/forms/tags/new-tag-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";

interface NewTagModalProps {
	children: React.ReactNode;
}

export default function NewTagModal({ children }: NewTagModalProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Modal open={isOpen} onOpenChange={setIsOpen}>
			<ModalTrigger asChild>{children}</ModalTrigger>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:max-w-[400px]">
				<ModalHeader className="p-0">
					<ModalTitle>New Tag</ModalTitle>
					<ModalDescription>
						Create a tag to organize your tasks.
					</ModalDescription>
				</ModalHeader>

				<NewTagForm
					onFinish={() => {
						setIsOpen(false);
					}}
				/>
			</ModalContent>
		</Modal>
	);
}
