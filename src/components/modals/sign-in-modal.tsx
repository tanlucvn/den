"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modals";
import { Separator } from "@/components/ui/separator";
import { useDialogStore } from "@/store/use-dialog-store";
import { IconRenderer } from "../icon-renderer";
import { Label } from "../ui/label";

export default function SignInModal() {
	const { signIn } = useSignIn();

	const { isSignInOpen, setIsSignInOpen } = useDialogStore();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const signInWithEmail = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!signIn) {
			toast.error("Sign-in service is unavailable.");
			return;
		}

		setLoading(true);
		try {
			await signIn.create({
				identifier: email,
				password,
			});
			window.location.href = "/";
		} catch (error) {
			console.error(error);
			toast.error("Sign in failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	const signInWithOAuth = async (provider: "google" | "github" | "discord") => {
		if (!signIn) {
			toast.error("Sign-in service is unavailable.");
			return;
		}

		setLoading(true);

		const redirectUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;
		const redirectUrlComplete = `${redirectUrl}/`;

		try {
			await signIn.authenticateWithRedirect({
				redirectUrl,
				redirectUrlComplete,
				strategy: `oauth_${provider}`,
			});
		} catch (error) {
			console.error(error);
			toast.error(`Sign in with ${provider} failed.`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal open={isSignInOpen} onOpenChange={setIsSignInOpen}>
			<ModalContent className="sm:max-w-md">
				<ModalHeader>
					<ModalTitle>Sign in to Den</ModalTitle>
					<ModalDescription>
						Welcome back. Please enter your credentials.
					</ModalDescription>
				</ModalHeader>

				<div className="space-y-6">
					<form onSubmit={signInWithEmail} className="space-y-6">
						<div className="space-y-3">
							<Label>Email</Label>
							<Input
								type="email"
								placeholder="den@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center">
								<Label>Password</Label>
								<span className="ml-auto cursor-pointer text-sm underline-offset-2 hover:underline">
									Forgot your password?
								</span>
							</div>
							<Input
								type="password"
								placeholder="**********"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<Button type="submit" className="w-full" disabled={loading}>
							Sign In
						</Button>
					</form>

					<div className="flex items-center gap-4">
						<Separator className="flex-1" />
						<span className="text-muted-foreground text-xs">
							Or continue with
						</span>
						<Separator className="flex-1" />
					</div>

					<div className="grid grid-cols-3 gap-4">
						<Button
							variant="outline"
							size="icon"
							className="w-full"
							onClick={() => signInWithOAuth("google")}
							disabled={loading}
						>
							<IconRenderer name="Mail" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="w-full"
							onClick={() => signInWithOAuth("github")}
							disabled={loading}
						>
							<IconRenderer name="Github" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="w-full"
							onClick={() => signInWithOAuth("discord")}
							disabled={loading}
						>
							<IconRenderer name="Smile" />
						</Button>
					</div>
				</div>
			</ModalContent>
		</Modal>
	);
}
