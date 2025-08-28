"use client";

import { useTheme } from "next-themes";
import { type ReactNode, useEffect } from "react";
import { AppSidebar } from "@/components/common/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAppSettingsStore } from "@/store/use-app-settings-store";
import { Aside, AsideProvider } from "./app-aside";

interface AppLayoutProps {
	header?: ReactNode;
	headersNumber?: 1 | 2;
	aside?: ReactNode;
	children: ReactNode;
}

export default function AppLayout({
	header,
	headersNumber = 1,
	aside,
	children,
}: AppLayoutProps) {
	const { theme } = useTheme();
	const { appColor } = useAppSettingsStore();

	const height = {
		1: "h-[calc(100svh-48px)] lg:h-[calc(100svh-66px)]",
		2: "h-[calc(100svh-88px)] lg:h-[calc(100svh-106px)]",
	};

	// Apply theme
	useEffect(() => {
		document.documentElement.className = `${appColor} ${theme}`;
	}, [appColor, theme]);

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "17rem",
				} as React.CSSProperties
			}
		>
			<AsideProvider>
				<AppSidebar />
				<div className="h-svh w-full overflow-hidden lg:p-2">
					<div className="flex h-full w-full flex-col items-center justify-start overflow-hidden bg-container shadow-xs ring-4 ring-accent lg:rounded-lg lg:border">
						{header}

						<div
							className={cn(
								"flex size-full",
								height[headersNumber as keyof typeof height],
							)}
						>
							<div className="scrollbar flex size-full flex-col gap-4 overflow-auto px-4 py-2">
								{children}
							</div>
							{aside && <Aside>{aside}</Aside>}
						</div>
					</div>
				</div>
			</AsideProvider>
		</SidebarProvider>
	);
}
