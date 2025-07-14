"use client";

import Link from "next/link";
import { AppLogo } from "@/components/app-logo";
import { IconRenderer } from "@/components/icon-renderer";
import { ThemeSwitcher } from "@/components/theme";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/user-button";
import { useDialogStore } from "@/store/use-dialog-store";

export default function AppHeader() {
	const { setIsAppModalOpen } = useDialogStore();

	return (
		<div className="flex w-full items-center justify-between">
			<div className="flex items-center gap-1">
				<Button size="icon" asChild>
					<Link href="/tasks">
						<AppLogo />
					</Link>
				</Button>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsAppModalOpen(true)}
				>
					<IconRenderer name="AlignLeft" />
				</Button>
			</div>

			<div className="flex items-center gap-2">
				<ThemeSwitcher />
				<UserButton />
			</div>
		</div>
	);
}
