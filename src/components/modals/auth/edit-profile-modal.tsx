"use client";

import ProfileForm from "@/components/forms/auth/profile-form";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import type { Session } from "@/lib/auth-client";

interface EditProfileModalProps {
	session: Session;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function EditProfileModal({
	session,
	open,
	onOpenChange,
}: EditProfileModalProps) {
	return (
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent className="rounded-2xl ring-4 ring-accent sm:max-w-[400px]">
				<ModalHeader className="p-0">
					<ModalTitle>Edit Profile</ModalTitle>
					<ModalDescription>Change your profile details.</ModalDescription>
				</ModalHeader>

				<ProfileForm session={session} onFinish={() => onOpenChange?.(false)} />
			</ModalContent>
		</Modal>
	);
}
