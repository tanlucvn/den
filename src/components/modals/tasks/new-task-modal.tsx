"use client";

import type React from "react";
import { useState } from "react";
import NewTaskForm from "@/components/forms/tasks/new-task-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import type { Task } from "@/db/schema/tasks";

interface NewTaskModalProps {
	initialData?: Partial<Task>;
	children: React.ReactNode;
}

export default function NewTaskModal({
	initialData,
	children,
}: NewTaskModalProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Modal open={isOpen} onOpenChange={setIsOpen}>
			<ModalTrigger asChild>{children}</ModalTrigger>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:max-w-[400px]">
				<ModalHeader className="p-0">
					<ModalTitle>New Task</ModalTitle>
					<ModalDescription>Add a task to stay on track.</ModalDescription>
				</ModalHeader>

				<NewTaskForm
					initialData={initialData}
					onSubmit={() => {
						setIsOpen(false);
					}}
				/>
			</ModalContent>
		</Modal>
	);
}
