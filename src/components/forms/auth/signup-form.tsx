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
import { authClient } from "@/lib/auth-client";
import { type SignUpFormValues, signUpSchema } from "@/lib/validators/auth";

type LoadingProvider = "email" | "google" | "github" | null;

export function SignUpForm() {
	const router = useTransitionRouter();

	const [loadingProvider, setLoadingProvider] = useState<LoadingProvider>(null);

	const isLoading = (provider: LoadingProvider) => loadingProvider === provider;
	const isAnyLoading = loadingProvider !== null;

	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
	});

	const onSubmit = async (values: SignUpFormValues) => {
		setLoadingProvider("email");

		await authClient.signUp.email(
			{ ...values },
			{
				onSuccess: () => {
					toast.success("Account created", {
						description: "Redirecting...",
					});
					router.push("/dashboard");
				},
				onError: (ctx) => {
					toast.error("Sign Up Error", {
						description: ctx.error.message,
					});
					setLoadingProvider(null);
				},
				onSettled: () => setLoadingProvider(null),
			},
		);
	};

	const handleOAuthSignUp = (provider: "google" | "github") => async () => {
		await authClient.signIn.social(
			{ provider, callbackURL: "/dashboard" },
			{
				onRequest: () => setLoadingProvider(provider),
				onSuccess: () => {
					toast.success("Signed up successfully", {
						description: "Redirecting...",
					});
				},
				onError: () => {
					toast.error(`${provider} Sign up failed`, {
						description: `Could not sign up with ${provider}`,
					});
					setLoadingProvider(null);
				},
				onSettled: () => setLoadingProvider(null),
			},
		);
	};

	return (
		<section className="flex flex-col gap-6">
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Create an account</CardTitle>
					<CardDescription>
						Sign up with Google, GitHub or email
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
									name="name"
									disabled={isAnyLoading}
									render={({ field }) => (
										<FormItem className="grid gap-3">
											<FormLabel>
												Name <span className="text-destructive">*</span>
											</FormLabel>
											<FormControl>
												<Input placeholder="Hello Den" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									disabled={isAnyLoading}
									render={({ field }) => (
										<FormItem className="grid gap-3">
											<FormLabel>
												Email <span className="text-destructive">*</span>
											</FormLabel>
											<FormControl>
												<Input
													type="email"
													autoComplete="email"
													placeholder="den@example.com"
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
											<FormLabel>
												Password <span className="text-destructive">*</span>
											</FormLabel>
											<FormControl>
												<Input
													type="password"
													autoComplete="new-password"
													placeholder="********"
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
											<span>Creating account...</span>
										</div>
									) : (
										"Sign Up"
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
								onClick={handleOAuthSignUp("google")}
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
								onClick={handleOAuthSignUp("github")}
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
							Already have an account?{" "}
							<Link href="/signin" className="text-primary hover:underline">
								Sign in
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="text-balance text-center text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
				By signing up, you agree to our <Link href="#">Terms of Service</Link>{" "}
				and <Link href="#">Privacy Policy</Link>.
			</div>
		</section>
	);
}
