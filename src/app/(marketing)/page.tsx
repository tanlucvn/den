"use client";

import { Link } from "next-view-transitions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";

export default function Page() {
	const { data } = useSession();

	const handleSignOut = async () => {
		try {
			await authClient.signOut();
			toast.success("Signed out successfully");
		} catch {
			toast.error("Failed to sign out");
		}
	};

	console.log("data", data);

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-4">
			<Link href="/dashboard">Open app</Link>

			{data ? (
				<>
					<p className="text-muted-foregroundted-fosm">
						Welcome, {data.user.name}
					</p>
					<Button onClick={handleSignOut}>Sign out</Button>
				</>
			) : (
				<Link href="/signin">Sign in</Link>
			)}
		</div>
	);
}
