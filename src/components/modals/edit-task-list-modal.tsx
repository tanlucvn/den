"use client";

import EditTaskListForm from "@/components/forms/edit-task-list-form";
import { IconRenderer } from "@/components/icon-renderer";
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
			<ModalContent className="sm:max-w-[400px]">
				<div className="flex flex-col items-center justify-center gap-2">
					<div
						className="flex size-11 shrink-0 items-center justify-center rounded-full border"
						aria-hidden="true"
					>
						<IconRenderer name="FolderPen" className="size-5 opacity-80" />
					</div>

					<ModalHeader className="items-center justify-center p-0">
						<ModalTitle>Edit Task List</ModalTitle>
						<ModalDescription>Update your task list name</ModalDescription>
					</ModalHeader>
				</div>

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
