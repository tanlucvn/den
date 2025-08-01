"use client";

import type React from "react";
import { useState } from "react";
import NewTaskForm from "@/components/forms/new-task-form";
import { IconRenderer } from "@/components/icon-renderer";
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
			<ModalContent className="sm:max-w-[400px]">
				<div className="flex flex-col gap-2">
					<div
						className="flex size-11 shrink-0 items-center justify-center rounded-full border"
						aria-hidden="true"
					>
						<IconRenderer name="Plus" className="size-5 opacity-80" />
					</div>

					<ModalHeader className="p-0">
						<ModalTitle className="text-left">New Task</ModalTitle>
						<ModalDescription className="text-left">
							What do you want to get done?
						</ModalDescription>
					</ModalHeader>
				</div>

				<NewTaskForm
					onFinish={() => {
						setIsOpen(false);
					}}
				/>
			</ModalContent>
		</Modal>
	);
}
