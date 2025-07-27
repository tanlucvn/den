"use client";

import Link from "next/link";
import { AppLogo } from "@/components/app-logo";
import { IconRenderer } from "@/components/icon-renderer";
import SettingsModal from "@/components/modals/settings";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="floating" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg">
							<Link
								href="/"
								className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
							>
								<AppLogo className="size-4" />
							</Link>
							<div className="flex flex-col gap-0.5 leading-none">
								<span className="font-medium">Den</span>
								<span className="text-muted-foreground text-xs">
									Version 1.0.0
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="relative">
						<SettingsModal>
							<SidebarMenuItem>
								<SidebarMenuButton>
									<IconRenderer
										name="Settings"
										className="text-sidebar-foreground/60"
									/>
									Open Settings
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SettingsModal>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
