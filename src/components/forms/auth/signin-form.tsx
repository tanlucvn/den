"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modals";
import { authClient } from "@/lib/auth-client";
import {
	type ForgotPasswordFormValues,
	forgotPasswordSchema,
	type SignInFormValues,
	signInSchema,
} from "@/lib/validators/auth";

export function SignInForm() {
	const [isEmailLoading, setIsEmailLoading] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);
	const [isGithubLoading, setIsGithubLoading] = useState(false);
	const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
		useState(false);

	const form = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: form.getValues("email") || "",
		},
	});

	const onSubmit = async (values: SignInFormValues) => {
		const { email, password } = values;

		await authClient.signIn.email(
			{ email, password, callbackURL: "/tasks" },
			{
				onRequest: () => setIsEmailLoading(true),
				onSuccess: () => {
					toast.success("Signed in successfully", {
						description: "Redirecting...",
					});
				},
				onError: (ctx) => {
					toast.error("Sign In Error", {
						description: ctx.error.message,
					});
					setIsEmailLoading(false);
				},
				onSettled: () => setIsEmailLoading(false),
			},
		);
	};

	const onForgotPassword = async (values: ForgotPasswordFormValues) => {
		const { email } = values;

		try {
			setIsEmailLoading(true);
			await authClient.forgetPassword({
				email,
				redirectTo: "/reset-password",
			});

			toast.success("Password Reset", {
				description: "A password reset link has been sent to your email.",
			});

			setIsForgotPasswordModalOpen(false);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Unable to send password reset email";

			toast.error("Reset Password Error", {
				description: errorMessage,
			});
		} finally {
			setIsEmailLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		await authClient.signIn.social(
			{ provider: "google", callbackURL: "/tasks" },
			{
				onRequest: () => setIsGoogleLoading(true),
				onSuccess: () => {
					toast.success("Signed in successfully", {
						description: "Redirecting...",
					});
				},
				onError: () => {
					toast.error("Sign In Error", {
						description: "Failed to sign in with Google",
					});
					setIsGoogleLoading(false);
				},
				onSettled: () => setIsGoogleLoading(false),
			},
		);
	};

	const handleGithubSignIn = async () => {
		await authClient.signIn.social(
			{ provider: "github", callbackURL: "/tasks" },
			{
				onRequest: () => setIsGithubLoading(true),
				onSuccess: () => {
					toast.success("Signed in successfully", {
						description: "Redirecting...",
					});
				},
				onError: () => {
					toast.error("Sign In Error", {
						description: "Failed to sign in with Github",
					});
					setIsGithubLoading(false);
				},
				onSettled: () => setIsGithubLoading(false),
			},
		);
	};

	const isAnyLoading = isEmailLoading || isGoogleLoading || isGithubLoading;

	return (
		<section className="flex flex-col gap-6">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>
						Login with your Github or Google account
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div className="grid gap-6">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="grid gap-6"
							>
								<FormField
									control={form.control}
									name="email"
									disabled={isAnyLoading}
									render={({ field }) => (
										<FormItem className="grid gap-3">
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder="den@example.com"
													type="email"
													autoComplete="email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									disabled={isAnyLoading}
									render={({ field }) => (
										<FormItem className="grid gap-3">
											<div className="flex items-center justify-between">
												<FormLabel>Password</FormLabel>
												<Modal
													open={isForgotPasswordModalOpen}
													onOpenChange={setIsForgotPasswordModalOpen}
												>
													<ModalTrigger asChild>
														<Button
															type="button"
															variant="link"
															className="h-auto p-0 text-sm"
														>
															Forgot password?
														</Button>
													</ModalTrigger>
													<ModalContent className="sm:max-w-md">
														<ModalHeader>
															<ModalTitle>Reset Your Password</ModalTitle>
															<ModalDescription>
																Enter your email address and we&#39;ll send you
																a link to reset your password.
															</ModalDescription>
														</ModalHeader>

														<Form {...forgotPasswordForm}>
															<form className="mt-2 grid gap-6">
																<FormField
																	control={forgotPasswordForm.control}
																	name="email"
																	render={({ field }) => (
																		<FormItem className="grid gap-3">
																			<FormLabel>Email Address</FormLabel>
																			<FormControl>
																				<Input
																					placeholder="Enter your email"
																					type="email"
																					{...field}
																				/>
																			</FormControl>
																			<FormMessage />
																		</FormItem>
																	)}
																/>
																<Button
																	type="button"
																	className="w-full"
																	disabled={isAnyLoading}
																	onClick={forgotPasswordForm.handleSubmit(
																		onForgotPassword,
																	)}
																>
																	{isEmailLoading ? (
																		<div className="flex items-center justify-center gap-2">
																			<Loader2 className="h-4 w-4 animate-spin" />
																			<span>Sending...</span>
																		</div>
																	) : (
																		"Send Reset Link"
																	)}
																</Button>
															</form>
														</Form>
													</ModalContent>
												</Modal>
											</div>
											<FormControl>
												<Input
													placeholder="********"
													type="password"
													autoComplete="current-password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full"
									disabled={isAnyLoading}
								>
									{isEmailLoading ? (
										<div className="flex items-center justify-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											<span>Signing in...</span>
										</div>
									) : (
										"Sign In"
									)}
								</Button>
							</form>
						</Form>

						<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
							<span className="relative z-10 bg-card px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<Button
								variant="outline"
								size="icon"
								className="w-full"
								onClick={handleGoogleSignIn}
								disabled={isAnyLoading}
							>
								{isGoogleLoading ? (
									<IconRenderer name="Loader2" className="animate-spin" />
								) : (
									<IconRenderer name="Chrome" />
								)}
							</Button>

							<Button
								variant="outline"
								size="icon"
								className="w-full"
								onClick={handleGithubSignIn}
								disabled={isAnyLoading}
							>
								{isGithubLoading ? (
									<IconRenderer name="Loader2" className="animate-spin" />
								) : (
									<IconRenderer name="Github" />
								)}
							</Button>

							<Button
								variant="outline"
								size="icon"
								className="w-full"
								onClick={handleGithubSignIn}
								disabled={isAnyLoading}
							>
								{isGithubLoading ? (
									<IconRenderer name="Loader2" className="animate-spin" />
								) : (
									<IconRenderer name="Facebook" />
								)}
							</Button>
						</div>

						<div className="mt-4 text-center text-muted-foreground text-sm">
							Don&apos;t have an account?{" "}
							<Link href="/signup" className="text-primary hover:underline">
								Sign up
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="text-balance text-center text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
				By clicking continue, you agree to our{" "}
				<Link href="#">Terms of Service</Link> and{" "}
				<Link href="#">Privacy Policy</Link>.
			</div>
		</section>
	);
}
