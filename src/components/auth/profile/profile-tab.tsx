"use client";

import { AccountConnect } from "@/components/auth/profile/account-connect";
import { ProfileForm } from "@/components/forms/auth/profiles/profile-form";
import type { Session } from "@/lib/auth-client";

interface ProfileTabProps {
	data: Session | null;
}

export function ProfileTab({ data }: ProfileTabProps) {
	return (
		<div className="space-y-6">
			<ProfileForm data={data} />
			<AccountConnect data={data} />
		</div>
	);
}
