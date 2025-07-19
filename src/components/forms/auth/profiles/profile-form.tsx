"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import { authClient, type Session } from "@/lib/auth-client";
import {
	type EmailFormValues,
	type NameFormValues,
	profileEmailSchema,
	profileNameSchema,
} from "@/lib/validators/profile";

interface ProfileFormProps {
	data: Session | null;
}

export function ProfileForm({ data }: ProfileFormProps) {
	const [isUpdatingName, setIsUpdatingName] = useState(false);
	const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
	const [openModals, setOpenModals] = useState({
		name: false,
		email: false,
		image: false,
	});
	const [userData, setUserData] = useState({
		name: data?.user.name || "",
		email: data?.user.email || "",
		image: data?.user.image || "",
		emailVerified: data?.user.emailVerified || false,
	});

	const nameForm = useForm<NameFormValues>({
		resolver: zodResolver(profileNameSchema),
		defaultValues: {
			name: data?.user.name || "",
		},
	});

	const emailForm = useForm<EmailFormValues>({
		resolver: zodResolver(profileEmailSchema),
		defaultValues: {
			email: data?.user.email || "",
		},
	});

	const onUpdateName = async (data: NameFormValues) => {
		try {
			setIsUpdatingName(true);
			await authClient.updateUser({ name: data.name });
			setUserData((prev) => ({ ...prev, name: data.name }));
			setOpenModals((prev) => ({ ...prev, name: false }));
			toast.success("Name updated successfully");
		} catch {
			toast.error("Failed to update name");
		} finally {
			setIsUpdatingName(false);
		}
	};

	const onUpdateEmail = async (data: EmailFormValues) => {
		try {
			setIsUpdatingEmail(true);
			if (data.email !== userData.email) {
				await authClient.changeEmail({
					newEmail: data.email,
					callbackURL: "/profile",
				});
				setUserData((prev) => ({
					...prev,
					email: data.email,
					emailVerified: false,
				}));
				setOpenModals((prev) => ({ ...prev, email: false }));
				toast.success("Verification email sent. Please check your inbox.");
			}
		} catch {
			toast.error("Failed to update email");
		} finally {
			setIsUpdatingEmail(false);
		}
	};

	if (!data) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="font-semibold text-xl tracking-tight">
					Profile Settings
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-8">
				{/* Name Section */}
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div className="space-y-1.5">
						<p className="font-medium text-sm">Display name</p>
						<p className="text-muted-foreground text-sm">{userData.name}</p>
					</div>

					<Modal
						open={openModals.name}
						onOpenChange={(open) => {
							setOpenModals((prev) => ({ ...prev, name: open }));
							if (!open) nameForm.reset({ name: userData.name });
						}}
					>
						<ModalTrigger asChild>
							<Button variant="outline" size="sm" className="w-full sm:w-auto">
								Change name
							</Button>
						</ModalTrigger>
						<ModalContent className="sm:max-w-md">
							<div className="flex flex-col items-center justify-center gap-2">
								<div
									className="flex size-11 shrink-0 items-center justify-center rounded-full border"
									aria-hidden="true"
								>
									<IconRenderer name="UserPen" className="size-5 opacity-80" />
								</div>

								<ModalHeader className="items-center justify-center p-0">
									<ModalTitle>Update your name</ModalTitle>
									<ModalDescription>
										This name will be visible across your account.
									</ModalDescription>
								</ModalHeader>
							</div>
							<Form {...nameForm}>
								<form
									onSubmit={nameForm.handleSubmit(onUpdateName)}
									className="space-y-4"
								>
									<FormField
										control={nameForm.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Full name</FormLabel>
												<FormControl>
													<Input {...field} placeholder="Enter your name" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<ModalFooter className="p-0">
										<Button
											type="submit"
											className="w-full"
											disabled={
												isUpdatingName ||
												nameForm.watch("name") === userData.name
											}
										>
											{isUpdatingName && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Save
										</Button>
									</ModalFooter>
								</form>
							</Form>
						</ModalContent>
					</Modal>
				</div>

				{/* Email Section */}
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div className="space-y-1.5">
						<div className="flex items-center gap-2">
							<p className="font-medium text-sm">Email address</p>
							<Badge
								className="rounded-full"
								variant={userData.emailVerified ? "default" : "secondary"}
							>
								<IconRenderer
									name={userData.emailVerified ? "CircleCheck" : "ShieldAlert"}
								/>
								{userData.emailVerified ? "Verified" : "Unverified"}
							</Badge>
						</div>
						<p className="text-muted-foreground text-sm">{userData.email}</p>
					</div>

					<Modal
						open={openModals.email}
						onOpenChange={(open) => {
							setOpenModals((prev) => ({ ...prev, email: open }));
							if (!open) emailForm.reset({ email: userData.email });
						}}
					>
						<ModalTrigger asChild>
							<Button variant="outline" size="sm" className="w-full sm:w-auto">
								Change email
							</Button>
						</ModalTrigger>
						<ModalContent className="sm:max-w-md">
							<div className="flex flex-col items-center justify-center gap-2">
								<div
									className="flex size-11 shrink-0 items-center justify-center rounded-full border"
									aria-hidden="true"
								>
									<IconRenderer name="UserPen" className="size-5 opacity-80" />
								</div>

								<ModalHeader className="items-center justify-center p-0">
									<ModalTitle>Update email address</ModalTitle>
									<ModalDescription>
										You will receive a verification email if the new email is
										valid.
									</ModalDescription>
								</ModalHeader>
							</div>
							<Form {...emailForm}>
								<form
									onSubmit={emailForm.handleSubmit(onUpdateEmail)}
									className="space-y-4"
								>
									<FormField
										control={emailForm.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>New email</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="email"
														placeholder="name@example.com"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<ModalFooter className="p-0">
										<Button
											type="submit"
											className="w-full"
											disabled={
												isUpdatingEmail ||
												emailForm.watch("email") === userData.email
											}
										>
											{isUpdatingEmail && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Save
										</Button>
									</ModalFooter>
								</form>
							</Form>
						</ModalContent>
					</Modal>
				</div>
			</CardContent>
		</Card>
	);
}
