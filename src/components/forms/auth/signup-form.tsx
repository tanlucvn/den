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
import { authClient } from "@/lib/auth-client";
import { type SignUpFormValues, signUpSchema } from "@/lib/validators/auth";

export function SignUpForm() {
	const [isEmailLoading, setIsEmailLoading] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);
	const [isGithubLoading, setIsGithubLoading] = useState(false);

	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
	});

	const onSubmit = async (values: SignUpFormValues) => {
		const { email, password, name } = values;

		await authClient.signUp.email(
			{ email, password, name, callbackURL: "/tasks" },
			{
				onRequest: () => setIsEmailLoading(true),
				onSuccess: () => {
					toast.success("Account created", {
						description: "Redirecting...",
					});
				},
				onError: (ctx) => {
					toast.error("Sign Up Error", {
						description: ctx.error.message,
					});
				},
				onSettled: () => setIsEmailLoading(false),
			},
		);
	};

	const handleGoogleSignUp = async () => {
		await authClient.signIn.social(
			{ provider: "google", callbackURL: "/tasks" },
			{
				onRequest: () => setIsGoogleLoading(true),
				onSuccess: () => {
					toast.success("Signed up successfully", {
						description: "Redirecting...",
					});
				},
				onError: () => {
					toast.error("Google Sign Up Error", {
						description: "Could not sign up with Google",
					});
				},
				onSettled: () => setIsGoogleLoading(false),
			},
		);
	};

	const handleGithubSignUp = async () => {
		await authClient.signIn.social(
			{ provider: "github", callbackURL: "/tasks" },
			{
				onRequest: () => setIsGithubLoading(true),
				onSuccess: () => {
					toast.success("Signed up successfully", {
						description: "Redirecting...",
					});
				},
				onError: () => {
					toast.error("GitHub Sign Up Error", {
						description: "Could not sign up with GitHub",
					});
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
											<FormLabel className="gap-1">
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
											<FormLabel className="gap-1">
												Email <span className="text-destructive">*</span>
											</FormLabel>
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
											<FormLabel className="gap-1">
												Password <span className="text-destructive">*</span>
											</FormLabel>
											<FormControl>
												<Input
													placeholder="********"
													type="password"
													autoComplete="new-password"
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
								onClick={handleGoogleSignUp}
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
								onClick={handleGithubSignUp}
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
								onClick={handleGithubSignUp}
								disabled={isAnyLoading}
							>
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
