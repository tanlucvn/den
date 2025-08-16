"use client";

import { SearchIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Link } from "next-view-transitions";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { IconRenderer } from "@/components/icon-renderer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import { type ColorId, TEXT_COLOR_CLASSES } from "@/lib/constants";
import { filterByLists } from "@/lib/helpers/filter-by";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/use-search-store";

export default function HeaderNav() {
	const { id } = useParams() as { id: string };

	const { data: tasks = [] } = useTasks();
	const { data: taskLists = [] } = useTaskLists();
	const currentList = taskLists.find((list) => list.id === id);

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

				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/lists" className="w-full">
									Lists
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="font-normal text-foreground"
									>
										<IconRenderer
											name={currentList?.icon ?? "List"}
											className={cn(
												"size-4",
												TEXT_COLOR_CLASSES[currentList?.color as ColorId] ??
													"text-primary/60",
											)}
										/>
										{currentList?.title}
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									align="start"
									className="min-w-44 space-y-0.5"
								>
									{taskLists.map((list) => (
										<DropdownMenuItem
											key={list.id}
											asChild
											className={cn("w-full", list.id === id && "bg-accent")}
										>
											<Link
												href={`/lists/${list.id}`}
												className="flex items-center justify-between"
											>
												<div className="flex items-center gap-2">
													<IconRenderer
														name={list?.icon ?? "List"}
														className={cn(
															"size-4",
															TEXT_COLOR_CLASSES[list?.color as ColorId] ??
																"text-primary/60",
														)}
													/>
													{list.title}
												</div>

												<span className="text-muted-foreground text-xs">
													{filterByLists(tasks, list.id).length}
												</span>
											</Link>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
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
							placeholder="What task are you looking for?"
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
						Search tasks...
						<Kbd keys="/" className="ml-2" />
					</Button>
				)}
			</div>
		</div>
	);
}
