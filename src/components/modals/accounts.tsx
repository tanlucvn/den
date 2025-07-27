"use client";

import ProfileForm from "@/components/forms/auth/profile-form";
import { IconRenderer } from "@/components/icon-renderer";
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
			<ModalContent className="sm:max-w-lg">
				<div className="flex flex-col items-center justify-center gap-2">
					<div
						className="flex size-11 shrink-0 items-center justify-center rounded-full border"
						aria-hidden="true"
					>
						<IconRenderer name="User" className="size-5 opacity-80" />
					</div>

					<ModalHeader className="items-center justify-center p-0">
						<ModalTitle>Edit Profile</ModalTitle>
						<ModalDescription>
							Change your profile details and preferences.
						</ModalDescription>
					</ModalHeader>
				</div>

				<ProfileForm session={session} onFinish={() => onOpenChange?.(false)} />
			</ModalContent>
		</Modal>
	);
}
