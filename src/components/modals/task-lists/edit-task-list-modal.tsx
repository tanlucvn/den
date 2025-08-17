"use client";

import EditTaskListForm from "@/components/forms/task-lists/edit-task-list-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import { useAppStore } from "@/store/use-app-store";

interface EditTaskListModalProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function EditTaskListModal({
	open,
	onOpenChange,
}: EditTaskListModalProps) {
	const { editTaskList } = useAppStore();

	if (!editTaskList) return null;

	return (
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:max-w-[400px]">
				<ModalHeader className="p-0">
					<ModalTitle>Edit List</ModalTitle>
					<ModalDescription>
						Adjust the details of your task list.
					</ModalDescription>
				</ModalHeader>

				<EditTaskListForm
					initialData={editTaskList}
					onFinish={(resetForm) => {
						resetForm();
						onOpenChange?.(false);
					}}
				/>
			</ModalContent>
		</Modal>
	);
}
