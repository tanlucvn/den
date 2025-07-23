"use client";

import { useState } from "react";
import NewTaskListForm from "@/components/forms/new-task-list-form";
import { IconRenderer } from "@/components/icon-renderer";
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
			<ModalContent className="sm:max-w-[400px]">
				<div className="flex flex-col items-center justify-center gap-2">
					<div
						className="flex size-11 shrink-0 items-center justify-center rounded-full border"
						aria-hidden="true"
					>
						<IconRenderer name="FolderPlus" className="size-5 opacity-80" />
					</div>

					<ModalHeader className="items-center justify-center p-0">
						<ModalTitle>New List</ModalTitle>
						<ModalDescription>
							Organize your tasks by creating a new list.
						</ModalDescription>
					</ModalHeader>
				</div>

				<NewTaskListForm
					onFinish={() => {
						setIsOpen(false);
					}}
				/>
			</ModalContent>
		</Modal>
	);
}
