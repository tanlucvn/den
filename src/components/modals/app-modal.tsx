import type React from "react";
import { Drawer } from "vaul";
import { useDialogStore } from "@/store/use-dialog-store";
import { AppSwitcher } from "../common/app-switcher";

export default function AppModal() {
	const { isAppModalOpen, setIsAppModalOpen } = useDialogStore();

	return (
		<Drawer.Root
			open={isAppModalOpen}
			onOpenChange={setIsAppModalOpen}
			direction="left"
		>
			<Drawer.Overlay className="fixed inset-0 z-10 bg-black/40" />
			<Drawer.Content
				data-sidebar="sidebar"
				data-slot="sidebar"
				data-mobile="true"
				className="fixed top-2 bottom-2 left-2 z-20 h-[98%] w-(--sidebar-width) rounded-xl border bg-sidebar text-sidebar-foreground shadow-xl after:hidden after:content-none [&>button]:hidden"
				style={
					{
						"--sidebar-width": "18rem",
					} as React.CSSProperties
				}
			>
				<Drawer.Title className="sr-only">Sidebar</Drawer.Title>
				<Drawer.Description className="sr-only">
					Displays the mobile sidebar.
				</Drawer.Description>
				<div className="flex h-full w-full flex-col p-2">
					<AppSwitcher />
				</div>
			</Drawer.Content>
		</Drawer.Root>
	);
}
