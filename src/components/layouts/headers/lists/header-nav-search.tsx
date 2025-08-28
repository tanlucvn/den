import { SearchIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { useSearchStore } from "@/store/use-search-store";

export default function HeaderNavSearch() {
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
		<>
			{isSearchOpen ? (
				<div
					ref={searchContainerRef}
					className="relative flex w-44 items-center justify-center transition-all duration-200 ease-in-out"
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
						placeholder="Search lists..."
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
					<Kbd keys="/" className="-translate-y-1/2 absolute top-1/2 right-2" />
				</div>
			) : (
				<Button
					variant="outline"
					size="icon"
					onClick={toggleSearch}
					aria-label="Search"
				>
					<IconRenderer name="Search" />
				</Button>
			)}
		</>
	);
}
