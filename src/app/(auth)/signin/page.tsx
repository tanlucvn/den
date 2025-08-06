import { Link } from "next-view-transitions";
import { AppLogo } from "@/components/app-logo";
import { SignInForm } from "@/components/forms/auth/signin-form";

export default function SignInPage() {
	return (
		<div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<AppLogo />
					</div>
					den.
				</Link>

				<SignInForm />
			</div>
		</div>
	);
}
