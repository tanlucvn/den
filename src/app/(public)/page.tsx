import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-4">
			<Link href="/app/tasks">Open app</Link>
			<SignInButton />
		</div>
	);
}
