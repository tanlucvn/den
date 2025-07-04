"use client";

import NewTaskForm from "@/components/forms/new-task-form";
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

export default function NewTaskModal() {
	const { isNewTaskOpen, setIsNewTaskOpen } = useDialogStore();

	return (
		<Modal open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
			<ModalContent className="sm:max-w-md">
				<ModalHeader>
					<ModalTitle>New Task</ModalTitle>
					<ModalDescription>Plan something new</ModalDescription>
				</ModalHeader>

				<NewTaskForm />

				<ModalFooter>
					<ModalClose asChild>
						<Button variant="outline">Cancel</Button>
					</ModalClose>
					<Button type="submit" form="new-task-form">
						Add New
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
