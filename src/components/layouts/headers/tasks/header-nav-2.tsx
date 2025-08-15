"use client";

import { SearchIcon } from "lucide-react";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSearchStore } from "@/store/use-search-store";
import Notifications from "./notifications";

export default function HeaderNav() {
	const { searchQuery, setSearchQuery } = useSearchStore();
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Focus when press "/"
	useHotkeys(
		["slash"],
		(e) => {
			e.preventDefault();
			searchInputRef.current?.focus();
		},
		{ enableOnFormTags: ["INPUT", "TEXTAREA"] },
	);

	return (
		<div className="flex h-8 w-full items-center justify-between">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-1 size-8" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<span className="text-sm">Tasks</span>
			</div>

			<div className="flex items-center gap-2">
				<div className="relative w-64">
					<SearchIcon className="-translate-y-1/2 absolute top-1/2 left-2 h-4 w-4 text-muted-foreground" />
					<Input
						ref={searchInputRef}
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search issues..."
						className="h-8 pl-8 text-sm"
					/>
					<Kbd keys="/" className="-translate-y-1/2 absolute top-1/2 right-2" />
				</div>
				<Notifications />
			</div>
		</div>
	);
}
