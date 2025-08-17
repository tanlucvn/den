"use client";

import { useState } from "react";
import NewTaskListForm from "@/components/forms/task-lists/new-task-list-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";

interface NewTaskListModalProps {
	children: React.ReactNode;
}

export default function NewTaskListModal({ children }: NewTaskListModalProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Modal open={isOpen} onOpenChange={setIsOpen}>
			<ModalTrigger asChild>{children}</ModalTrigger>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:max-w-[400px]">
				<ModalHeader className="p-0">
					<ModalTitle>New List</ModalTitle>
					<ModalDescription>
						Create a list to group related tasks.
					</ModalDescription>
				</ModalHeader>

				<NewTaskListForm
					onFinish={() => {
						setIsOpen(false);
					}}
				/>
			</ModalContent>
		</Modal>
	);
}
