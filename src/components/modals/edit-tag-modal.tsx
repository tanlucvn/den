"use client";

import EditTagForm from "@/components/forms/edit-tag-form";
import { IconRenderer } from "@/components/icon-renderer";
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
			<ModalContent className="sm:max-w-[400px]">
				<div className="flex flex-col items-center justify-center gap-2">
					<div
						className="flex size-11 shrink-0 items-center justify-center rounded-full border"
						aria-hidden="true"
					>
						<IconRenderer name="Tags" className="size-5 opacity-80" />
					</div>

					<ModalHeader className="items-center justify-center p-0">
						<ModalTitle className="text-left">Edit Tag</ModalTitle>
						<ModalDescription className="text-left">
							Edit the details of your tag.
						</ModalDescription>
					</ModalHeader>
				</div>

				<EditTagForm
					initialData={editTag}
					onFinish={() => onOpenChange?.(false)}
				/>
			</ModalContent>
		</Modal>
	);
}
