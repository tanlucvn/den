"use client";

import AppProviders from "@/components/app-providers";
import { AppQuickActions } from "@/components/common/app-quick-actions";
import AppHeader from "@/components/common/header";

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
	return (
		<AppProviders>
			<div className="relative flex min-h-screen flex-col gap-6 bg-background px-4">
				<header>
					<AppHeader />
				</header>

				<div className="sticky top-2 z-10 w-full">
					<AppQuickActions />
				</div>

				<main className="flex-1">{children}</main>
			</div>
		</AppProviders>
	);
}
