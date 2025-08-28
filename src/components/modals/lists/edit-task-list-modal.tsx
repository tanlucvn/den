"use client";

import EditListForm from "@/components/forms/lists/edit-list-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import type { List } from "@/db/schema";

interface EditTaskListModalProps {
	list: List;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function EditTaskListModal({
	list: taskList,
	open,
	onOpenChange,
}: EditTaskListModalProps) {
	return (
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:max-w-[400px]">
				<ModalHeader className="p-0">
					<ModalTitle>Edit List</ModalTitle>
					<ModalDescription>
						Adjust the details of your task list.
					</ModalDescription>
				</ModalHeader>

				<EditListForm
					initialData={taskList}
					onSubmit={() => onOpenChange?.(false)}
				/>
			</ModalContent>
		</Modal>
	);
}
