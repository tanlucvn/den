"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import HeaderNavSearch from "./header-nav-search";

export default function HeaderNav() {
	return (
		<div className="flex h-12 w-full items-center justify-between border-b p-2">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="size-8" />

				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				<span className="text-sm">Tags</span>
			</div>

			<HeaderNavSearch />
		</div>
	);
}
