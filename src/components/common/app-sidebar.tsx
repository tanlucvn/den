"use client";

import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { AppLogo } from "@/components/app-logo";
import { IconRenderer } from "@/components/icon-renderer";
import SettingsModal from "@/components/modals/settings";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavUser } from "./nav-user";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const isActive = (href: string) => pathname === href;

	return (
		<Sidebar variant="floating" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/dashboard">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<AppLogo className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-medium">Den.</span>
									<span className="text-muted-foreground">Version 1.0.0</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="flex flex-col gap-2">
						<SidebarMenu>
							<SidebarMenuItem>
								<Link href="/dashboard" className="w-full">
									<SidebarMenuButton
										className={cn(
											isActive("/dashboard") &&
												"bg-sidebar-accent text-sidebar-accent-foreground",
										)}
									>
										<IconRenderer
											name="LayoutDashboard"
											className="text-sidebar-foreground/60"
										/>
										Dashboard
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<Link href="/lists" className="w-full">
									<SidebarMenuButton
										className={cn(
											isActive("/lists") &&
												"bg-sidebar-accent text-sidebar-accent-foreground",
										)}
									>
										<IconRenderer
											name="ListChecks"
											className="text-sidebar-foreground/60"
										/>
										Task Lists
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<Link href="/tasks" className="w-full">
									<SidebarMenuButton
										className={cn(
											isActive("/tasks") &&
												"bg-sidebar-accent text-sidebar-accent-foreground",
										)}
									>
										<IconRenderer
											name="CircleCheck"
											className="text-sidebar-foreground/60"
										/>
										Tasks
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<Link href="/tags" className="w-full">
									<SidebarMenuButton
										className={cn(
											isActive("/tags") &&
												"bg-sidebar-accent text-sidebar-accent-foreground",
										)}
									>
										<IconRenderer
											name="Tags"
											className="text-sidebar-foreground/60"
										/>
										Tags
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="mt-auto">
					<SidebarMenu>
						<SettingsModal>
							<SidebarMenuItem>
								<SidebarMenuButton>
									<IconRenderer
										name="Settings"
										className="text-sidebar-foreground/60"
									/>
									Settings
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SettingsModal>

						<SidebarMenuItem>
							<SidebarMenuButton>
								<IconRenderer
									name="LifeBuoy"
									className="text-sidebar-foreground/60"
								/>
								Get Help
							</SidebarMenuButton>
						</SidebarMenuItem>

						<SidebarMenuItem>
							<SidebarMenuButton>
								<IconRenderer
									name="MessageCircle"
									className="text-sidebar-foreground/60"
								/>
								Feedback
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
