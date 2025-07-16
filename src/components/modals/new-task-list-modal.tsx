"use client";

import NewTaskListForm from "@/components/forms/new-task-list-form";
import { Button } from "@/components/ui/button";
import {
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modals";
import { useDialogStore } from "@/store/use-dialog-store";

export default function NewTaskListModal() {
	const { isNewTaskListOpen, setIsNewTaskListOpen } = useDialogStore();

	return (
		<Modal open={isNewTaskListOpen} onOpenChange={setIsNewTaskListOpen}>
			<ModalContent className="sm:max-w-md">
				<ModalHeader>
					<ModalTitle>New List</ModalTitle>
					<ModalDescription>Create new list</ModalDescription>
				</ModalHeader>

				<NewTaskListForm />

				<ModalFooter className="md:grid md:grid-cols-2">
					<ModalClose asChild>
						<Button variant="outline" className="w-full">
							Cancel
						</Button>
					</ModalClose>
					<Button type="submit" form="new-task-list-form" className="w-full">
						Add New
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
