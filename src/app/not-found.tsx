import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";

export default function NotFoundError() {
	return (
		<div className="h-svh">
			<div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
				<h1 className="font-bold text-[7rem] leading-tight">404</h1>
				<span className="font-medium">Oops! Page Not Found!</span>
				<p className="text-center text-muted-foreground">
					It seems like the page you're looking for <br />
					does not exist or might have been removed.
				</p>
				<div className="mt-6 flex gap-4">
					<Button asChild>
						<Link href="/dashboard">Back to Dashboard</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
