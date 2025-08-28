"use client";

import EditTagForm from "@/components/forms/tags/edit-tag-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import type { Tag } from "@/db/schema";

interface EditTagModalProps {
	tag: Tag;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function EditTagModal({
	tag,
	open,
	onOpenChange,
}: EditTagModalProps) {
	return (
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:max-w-[400px]">
				<ModalHeader className="p-0">
					<ModalTitle>Edit Tag</ModalTitle>
					<ModalDescription>
						Update the name or color of this tag.
					</ModalDescription>
				</ModalHeader>

				<EditTagForm initialData={tag} onFinish={() => onOpenChange?.(false)} />
			</ModalContent>
		</Modal>
	);
}
