"use client";

import NewTaskListForm from "@/components/forms/new-task-list-form";
import { Button } from "@/components/ui/button";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import { IconRenderer } from "../icon-renderer";

interface NewTaskListModalProps {
	children: React.ReactNode;
}

export default function NewTaskListModal({ children }: NewTaskListModalProps) {
	return (
		<Modal>
			<ModalTrigger asChild>{children}</ModalTrigger>
			<ModalContent className="sm:max-w-md">
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

				<NewTaskListForm />

				<ModalFooter className="p-0">
					<Button type="submit" form="new-task-list-form" className="w-full">
						Create
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
