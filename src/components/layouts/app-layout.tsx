"use client";

import { useTheme } from "next-themes";
import { type ReactNode, useEffect } from "react";
import { AppSidebar } from "@/components/common/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAppSettingsStore } from "@/store/use-app-settings-store";
import { AppQuickActions } from "../common/app-quick-actions";

interface Props {
	header: React.ReactNode;
	children: ReactNode;
}

export default function AppLayout({ header, children }: Props) {
	const { theme } = useTheme();
	const { appColor } = useAppSettingsStore();

	// Apply theme
	useEffect(() => {
		document.documentElement.className = `${appColor} ${theme}`;
	}, [appColor, theme]);

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "19rem",
				} as React.CSSProperties
			}
		>
			<AppSidebar />

			<SidebarInset>
				<div className="relative mx-auto size-full max-w-3xl space-y-4 p-4">
					{header}

					<div className="sticky top-2 z-10 w-full rounded-full bg-background">
						<AppQuickActions />
					</div>

					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
