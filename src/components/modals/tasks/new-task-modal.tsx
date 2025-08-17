"use client";

import type React from "react";
import { useState } from "react";
import NewTaskForm from "@/components/forms/new-task-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";

interface NewTaskModalProps {
	children: React.ReactNode;
}

export default function NewTaskModal({ children }: NewTaskModalProps) {
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
					onFinish={() => {
						setIsOpen(false);
					}}
				/>
			</ModalContent>
		</Modal>
	);
}
