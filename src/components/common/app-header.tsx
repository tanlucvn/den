"use client";

import { IconRenderer } from "@/components/icon-renderer";
import SettingsModal from "@/components/modals/settings";
import { ThemeSwitcher } from "@/components/theme";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserButton from "@/components/user-button";

export default function AppHeader() {
	return (
		<div className="flex w-full items-center justify-between">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-1" />

				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>Home</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className="flex items-center gap-2">
				<ThemeSwitcher />
				<UserButton />
				<SettingsModal>
					<Button variant="outline" size="icon">
						<IconRenderer name="Settings" />
					</Button>
				</SettingsModal>
			</div>
		</div>
	);
}
