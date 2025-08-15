"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSearchStore } from "@/store/use-search-store";

export default function HeaderNav() {
	const {
		isSearchOpen,
		toggleSearch,
		closeSearch,
		setSearchQuery,
		searchQuery,
	} = useSearchStore();
	const searchInputRef = useRef<HTMLInputElement>(null);
	const searchContainerRef = useRef<HTMLDivElement>(null);
	const previousValueRef = useRef<string>("");

	useEffect(() => {
		if (isSearchOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isSearchOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchContainerRef.current &&
				!searchContainerRef.current.contains(event.target as Node) &&
				isSearchOpen
			) {
				if (searchQuery.trim() === "") {
					closeSearch();
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isSearchOpen, closeSearch, searchQuery]);

	useHotkeys(
		["slash"],
		(e) => {
			e.preventDefault();
			toggleSearch();
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

				<span className="text-sm">Tags</span>
			</div>

			<div className="flex items-center gap-2">
				{isSearchOpen ? (
					<div
						ref={searchContainerRef}
						className="relative flex w-64 items-center justify-center transition-all duration-200 ease-in-out"
					>
						<SearchIcon className="-translate-y-1/2 absolute top-1/2 left-2 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							ref={searchInputRef}
							value={searchQuery}
							onChange={(e) => {
								previousValueRef.current = searchQuery;
								const newValue = e.target.value;
								setSearchQuery(newValue);

								if (previousValueRef.current && newValue === "") {
									const inputEvent = e.nativeEvent as InputEvent;
									if (
										inputEvent.inputType !== "deleteContentBackward" &&
										inputEvent.inputType !== "deleteByCut"
									) {
										closeSearch();
									}
								}
							}}
							placeholder="What tag are you looking for?"
							className="h-8 pl-8 text-sm"
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									if (searchQuery.trim() === "") {
										closeSearch();
									} else {
										setSearchQuery("");
									}
								}
							}}
						/>
					</div>
				) : (
					<Button
						variant="outline"
						size="sm"
						onClick={toggleSearch}
						className="font-normal text-muted-foreground"
						aria-label="Search"
					>
						Search tags...
						<Kbd keys="/" className="ml-2" />
					</Button>
				)}
			</div>
		</div>
	);
}
