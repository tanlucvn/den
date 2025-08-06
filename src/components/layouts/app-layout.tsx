"use client";

import { useTheme } from "next-themes";
import { type ReactNode, useEffect } from "react";
import ClientProviders from "@/components/client-providers";
import { AppSidebar } from "@/components/common/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAppSettingsStore } from "@/store/use-app-settings-store";

interface Props {
	children: ReactNode;
}

export default function AppLayout({ children }: Props) {
	const { theme } = useTheme();
	const { appColor } = useAppSettingsStore();

	// Apply theme
	useEffect(() => {
		document.documentElement.className = `${appColor} ${theme}`;
	}, [appColor, theme]);

	return (
		<ClientProviders>
			<SidebarProvider
				style={
					{
						"--sidebar-width": "19rem",
					} as React.CSSProperties
				}
			>
				<AppSidebar />

				<SidebarInset>
					<div className="relative mx-auto min-h-screen w-full max-w-3xl">
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
		</ClientProviders>
	);
}
