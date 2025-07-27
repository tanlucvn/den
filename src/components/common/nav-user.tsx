"use client";

import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import EditProfileModal from "@/components/modals/accounts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropDrawer,
	DropDrawerContent,
	DropDrawerGroup,
	DropDrawerItem,
	DropDrawerLabel,
	DropDrawerSeparator,
	DropDrawerTrigger,
} from "@/components/ui/dropdrawer";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "@/lib/auth-client";

export function NavUser() {
	const router = useRouter();

	const { data: session } = useSession();
	const { isMobile } = useSidebar();

	const [openProfileModal, setOpenProfileModal] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut();
			toast.success("Signed out successfully");
			router.push("/signin");
		} catch {
			toast.error("Failed to sign out");
		}
	};

	if (!session) return <NavUserSkeleton />;

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropDrawer>
						<DropDrawerTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="size-8">
									<AvatarImage
										src={`https://api.dicebear.com/9.x/glass/svg?seed=${session.user.email}`}
										alt={session?.user.name ?? "User Avatar"}
									/>
									<AvatarFallback>
										{session.user.name?.[0]}
										{session.user.name?.split(" ")?.[1]?.[0] ?? ""}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{session.user.name}
									</span>
									<span className="truncate text-xs">{session.user.email}</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropDrawerTrigger>
						<DropDrawerContent
							className="min-w-56"
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}
						>
							<DropDrawerLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="size-8">
										<AvatarImage
											src={`https://api.dicebear.com/9.x/glass/svg?seed=${session.user.email}`}
											alt={session.user.name ?? "User Avatar"}
										/>
										<AvatarFallback>
											{session.user.name?.[0]}
											{session.user.name?.split(" ")?.[1]?.[0] ?? ""}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{session.user.name}
										</span>
										<span className="truncate text-xs">
											{session.user.email}
										</span>
									</div>
								</div>
							</DropDrawerLabel>

							<DropDrawerSeparator />

							<DropDrawerGroup>
								<DropDrawerItem
									icon={
										<IconRenderer
											name="Sparkles"
											className="!text-primary/60"
										/>
									}
								>
									Change Plan
								</DropDrawerItem>
							</DropDrawerGroup>

							<DropDrawerSeparator />

							<DropDrawerGroup>
								<DropDrawerItem
									icon={
										<IconRenderer name="User" className="!text-primary/60" />
									}
									onClick={() => setOpenProfileModal(true)}
								>
									Edit Profile
								</DropDrawerItem>
								<DropDrawerItem
									icon={
										<IconRenderer name="Bell" className="!text-primary/60" />
									}
								>
									Notifications
								</DropDrawerItem>
							</DropDrawerGroup>

							<DropDrawerSeparator />

							<DropDrawerItem
								className="!text-destructive"
								icon={
									<IconRenderer name="LogOut" className="!text-destructive" />
								}
								onClick={handleSignOut}
							>
								Log out
							</DropDrawerItem>
						</DropDrawerContent>
					</DropDrawer>
				</SidebarMenuItem>
			</SidebarMenu>

			<EditProfileModal
				session={session}
				open={openProfileModal}
				onOpenChange={setOpenProfileModal}
			/>
		</>
	);
}

export function NavUserSkeleton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" className="pointer-events-none">
					<Skeleton className="size-8 shrink-0 rounded-lg" />
					<div className="flex-1 space-y-1 overflow-hidden">
						<Skeleton className="h-4 w-3/5" />
						<Skeleton className="h-3 w-4/5" />
					</div>
					<ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
