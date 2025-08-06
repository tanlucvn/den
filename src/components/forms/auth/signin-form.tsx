"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Link, useTransitionRouter } from "next-view-transitions";
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
} from "@/components/ui/modal";
import { authClient } from "@/lib/auth-client";
import {
	type ForgotPasswordFormValues,
	forgotPasswordSchema,
	type SignInFormValues,
	signInSchema,
} from "@/lib/validators/auth";

type Provider = "email" | "google" | "github" | null;

export function SignInForm() {
	const router = useTransitionRouter();

	const [loadingProvider, setLoadingProvider] = useState<Provider>(null);
	const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
		useState(false);

	const isLoading = (provider: Provider) => loadingProvider === provider;
	const isAnyLoading = loadingProvider !== null;

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
		setLoadingProvider("email");

		await authClient.signIn.email(
			{ ...values },
			{
				onSuccess: () => {
					toast.success("Signed in successfully", {
						description: "Redirecting...",
					});
					router.push("/dashboard");
				},
				onError: (ctx) => {
					toast.error("Sign in failed", {
						description: ctx.error.message,
					});
					setLoadingProvider(null);
				},
				onSettled: () => setLoadingProvider(null),
			},
		);
	};

	const handleOAuthSignIn = (provider: "google" | "github") => async () => {
		await authClient.signIn.social(
			{ provider, callbackURL: "/dashboard" },
			{
				onRequest: () => setLoadingProvider(provider),
				onSuccess: () => {
					toast.success("Signed in successfully", {
						description: "Redirecting...",
					});
				},
				onError: () => {
					toast.error(`${provider} Sign in failed`, {
						description: `Could not sign in with ${provider}`,
					});
					setLoadingProvider(null);
				},
				onSettled: () => setLoadingProvider(null),
			},
		);
	};

	const onForgotPassword = async (values: ForgotPasswordFormValues) => {
		setLoadingProvider("email");

		try {
			await authClient.forgetPassword({
				email: values.email,
				redirectTo: "/reset-password",
			});

			toast.success("Password Reset Email Sent", {
				description: "Check your inbox for the reset link.",
			});

			setIsForgotPasswordModalOpen(false);
		} catch (error) {
			toast.error("Reset Password Error", {
				description:
					error instanceof Error
						? error.message
						: "Unable to send reset link. Try again later.",
			});
		} finally {
			setLoadingProvider(null);
		}
	};

	return (
		<section className="flex flex-col gap-6">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>
						Login with your Google, GitHub, or email
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
									render={({ field }) => (
										<FormItem className="grid gap-3">
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													autoComplete="email"
													placeholder="den@example.com"
													disabled={isAnyLoading}
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
																We'll send a reset link to your email address.
															</ModalDescription>
														</ModalHeader>

														<Form {...forgotPasswordForm}>
															<form className="grid gap-6">
																<FormField
																	control={forgotPasswordForm.control}
																	name="email"
																	render={({ field }) => (
																		<FormItem className="grid gap-3">
																			<FormLabel>Email</FormLabel>
																			<FormControl>
																				<Input
																					type="email"
																					placeholder="Enter your email"
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
																	disabled={isLoading("email")}
																	onClick={forgotPasswordForm.handleSubmit(
																		onForgotPassword,
																	)}
																>
																	{isLoading("email") ? (
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
													type="password"
													autoComplete="current-password"
													placeholder="********"
													disabled={isAnyLoading}
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
									{isLoading("email") ? (
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
								onClick={handleOAuthSignIn("google")}
								disabled={isAnyLoading}
							>
								{isLoading("google") ? (
									<IconRenderer name="Loader2" className="animate-spin" />
								) : (
									<IconRenderer name="Chrome" />
								)}
							</Button>

							<Button
								variant="outline"
								size="icon"
								className="w-full"
								onClick={handleOAuthSignIn("github")}
								disabled={isAnyLoading}
							>
								{isLoading("github") ? (
									<IconRenderer name="Loader2" className="animate-spin" />
								) : (
									<IconRenderer name="Github" />
								)}
							</Button>

							<Button variant="outline" size="icon" className="w-full" disabled>
								<IconRenderer name="Facebook" />
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
