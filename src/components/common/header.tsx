"use client";

import Link from "next/link";
import { AppLogo } from "@/components/app-logo";
import { IconRenderer } from "@/components/icon-renderer";
import AppModal from "@/components/modals/app-modal";
import { ThemeSwitcher } from "@/components/theme";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/user-button";
import SettingsModal from "../modals/settings";

export default function AppHeader() {
	return (
		<div className="flex w-full items-center justify-between">
			<div className="flex items-center gap-1">
				<Button size="icon" asChild>
					<Link href="/tasks">
						<AppLogo />
					</Link>
				</Button>

				<AppModal>
					<Button variant="ghost" size="icon">
						<IconRenderer name="AlignLeft" />
					</Button>
				</AppModal>
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
