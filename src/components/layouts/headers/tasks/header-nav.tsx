"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchStore } from "@/store/use-search-store";
import HeaderNavSearch from "./header-nav-search";
import Notifications from "./notifications";

export default function HeaderNav() {
	const isMobile = useIsMobile();
	const { isSearchOpen } = useSearchStore();

	return (
		<div className="flex h-12 w-full items-center justify-between border-b p-2">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="size-8" />

				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				{(!isSearchOpen || !isMobile) && <span className="text-sm">Tasks</span>}
			</div>

			<div className="flex items-center gap-2">
				<HeaderNavSearch />

				{(!isSearchOpen || !isMobile) && <Notifications />}
			</div>
		</div>
	);
}
