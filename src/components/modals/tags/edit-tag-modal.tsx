"use client";

import EditTagForm from "@/components/forms/edit-tag-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import { useAppStore } from "@/store/use-app-store";

interface EditTagModalProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function EditTagModal({
	open,
	onOpenChange,
}: EditTagModalProps) {
	const { editTag } = useAppStore();

	if (!editTag) return null;

	return (
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:max-w-[400px]">
				<ModalHeader className="p-0">
					<ModalTitle>Edit Tag</ModalTitle>
					<ModalDescription>
						Update the name or color of this tag.
					</ModalDescription>
				</ModalHeader>

				<EditTagForm
					initialData={editTag}
					onFinish={() => onOpenChange?.(false)}
				/>
			</ModalContent>
		</Modal>
	);
}
