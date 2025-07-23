"use client";

import EditTaskForm from "@/components/forms/edit-task-form";
import { IconRenderer } from "@/components/icon-renderer";
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
			<ModalContent className="sm:max-w-[400px]">
				<div className="flex flex-col gap-2">
					<div
						className="flex size-11 shrink-0 items-center justify-center rounded-full border"
						aria-hidden="true"
					>
						<IconRenderer name="Pencil" className="size-5 opacity-80" />
					</div>

					<ModalHeader className="p-0">
						<ModalTitle className="text-left">Edit Task</ModalTitle>
						<ModalDescription className="text-left">
							Update your plan
						</ModalDescription>
					</ModalHeader>
				</div>

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
