import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
	const session = await auth.api
		.getSession({
			headers: await headers(),
		})
		.catch(() => {
			redirect("/signin");
		});

	if (!session) {
		redirect("/signin");
	}

	return <AuthTabs session={session} />;
}
