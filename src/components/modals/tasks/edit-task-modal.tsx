import EditTaskForm from "@/components/forms/tasks/edit-task-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import type { Task } from "@/db/schema";

interface EditTaskModalProps {
	task: Task;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditTaskModal({
	task,
	open,
	onOpenChange,
}: EditTaskModalProps) {
	return (
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:max-w-[400px]">
				<ModalHeader className="p-0">
					<ModalTitle>Edit Task</ModalTitle>
					<ModalDescription>
						Refine title, priority, or notes of this task.
					</ModalDescription>
				</ModalHeader>

				<EditTaskForm initialData={task} onSubmit={() => onOpenChange(false)} />
			</ModalContent>
		</Modal>
	);
}
