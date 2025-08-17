"use client";

import EditTaskForm from "@/components/forms/tasks/edit-task-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import { useAppStore } from "@/store/use-app-store";

interface EditTaskModalProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function EditTaskModal({
	open,
	onOpenChange,
}: EditTaskModalProps) {
	const { editTask } = useAppStore();

	if (!editTask) return null;

	return (
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:max-w-[400px]">
				<ModalHeader className="p-0">
					<ModalTitle>Edit Task</ModalTitle>
					<ModalDescription>
						Refine title, priority, or notes of this task.
					</ModalDescription>
				</ModalHeader>

				<EditTaskForm
					initialData={editTask}
					onFinish={(resetForm) => {
						resetForm();
						onOpenChange?.(false);
					}}
				/>
			</ModalContent>
		</Modal>
	);
}
