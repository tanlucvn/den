"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useTasks } from "@/hooks/use-tasks";
import { authClient } from "@/lib/auth-client";
import { filterTasks } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import NewTaskListModal from "../modals/new-task-list-modal";
import NewTaskModal from "../modals/new-task-modal";

export function AppQuickActions() {
	const router = useRouter();
	const { data: tasks = [] } = useTasks();
	const { searchTerm, setSearchTerm } = useAppStore();

	const defaultInputRef = useRef<HTMLInputElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<"default" | "search">("default");
	const [defaultInputValue, setDefaultInputValue] = useState("");

	const filteredTasks = useMemo(
		() => filterTasks(tasks, searchTerm),
		[tasks, searchTerm],
	);
	const isSearching = mode === "search" && searchTerm.trim().length > 0;

	useHotkeys(
		"ctrl+k",
		(e) => {
			e.preventDefault();
			setOpen((prev) => !prev);
		},
		{ enableOnFormTags: ["INPUT", "TEXTAREA"] },
	);

	useEffect(() => {
		if (mode === "search" && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [mode]);

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push("/");
	};

	const handleBackToMenu = () => {
		setMode("default");
		setSearchTerm("");
		setDefaultInputValue("");
		setTimeout(() => {
			defaultInputRef.current?.focus();
		}, 100);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="hover:!border-ring w-full justify-between rounded-full font-normal hover:ring-[3px] hover:ring-ring/20"
				>
					<span className="flex items-center gap-2">
						<IconRenderer name="Command" className="!text-primary/60" />
						{isSearching ? "Searching..." : "Quick Actions"}
					</span>

					<div className="ml-auto flex items-center gap-2">
						{isSearching && (
							<span className="text-muted-foreground text-xs">
								{filteredTasks.length > 0 &&
									`${filteredTasks.length} tasks found`}
							</span>
						)}

						<Kbd keys="Ctrl+K" />
					</div>
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-[var(--radix-popover-trigger-width)] rounded-xl p-0">
				{mode === "default" ? (
					<DefaultMode
						defaultInputRef={defaultInputRef}
						defaultInputValue={defaultInputValue}
						setDefaultInputValue={setDefaultInputValue}
						setMode={setMode}
						handleSignOut={handleSignOut}
					/>
				) : (
					<SearchMode
						searchInputRef={searchInputRef}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						handleBackToMenu={handleBackToMenu}
					/>
				)}
			</PopoverContent>
		</Popover>
	);
}

function DefaultMode({
	defaultInputRef,
	defaultInputValue,
	setDefaultInputValue,
	setMode,
	handleSignOut,
}: {
	defaultInputRef: React.RefObject<HTMLInputElement | null>;
	defaultInputValue: string;
	setDefaultInputValue: (value: string) => void;
	setMode: (mode: "default" | "search") => void;
	handleSignOut: () => Promise<void>;
}) {
	return (
		<Command className="rounded-xl">
			<CommandInput
				ref={defaultInputRef}
				value={defaultInputValue}
				onValueChange={setDefaultInputValue}
				placeholder="Type a command or search..."
			/>

			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandSeparator />

				<CommandGroup heading="Tasks">
					<CommandItem onSelect={() => setMode("search")}>
						<IconRenderer name="Search" />
						<span>Search task</span>
					</CommandItem>

					<NewTaskModal>
						<div>
							<CommandItem>
								<IconRenderer name="Plus" />
								<span>Add a new task</span>
							</CommandItem>
						</div>
					</NewTaskModal>
				</CommandGroup>

				<CommandGroup heading="Task Lists">
					<NewTaskListModal>
						<div>
							<CommandItem>
								<IconRenderer name="Plus" />
								<span>Add a new task list</span>
							</CommandItem>
						</div>
					</NewTaskListModal>
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading="Accounts">
					<Link href="/profile">
						<CommandItem>
							<IconRenderer name="User" />
							<span>Profile</span>
						</CommandItem>
					</Link>
					<CommandItem
						onSelect={() =>
							toast.promise(handleSignOut, {
								loading: "Signing out...",
								success: "Signed out successfully",
								error: "Sign out failed",
							})
						}
					>
						<IconRenderer name="LogOut" className="text-destructive" />
						<span>Log out</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	);
}

function SearchMode({
	searchInputRef,
	searchTerm,
	setSearchTerm,
	handleBackToMenu,
}: {
	searchInputRef: React.RefObject<HTMLInputElement | null>;
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	handleBackToMenu: () => void;
}) {
	return (
		<Command className="rounded-xl">
			<div className="relative">
				<CommandInput
					ref={searchInputRef}
					placeholder="Search tasks by title or note..."
					value={searchTerm}
					onValueChange={setSearchTerm}
					className="mr-20"
				/>

				<Button
					variant="ghost"
					size="sm"
					className="absolute top-1 right-2 h-7 gap-1 rounded-full font-normal text-xs"
					onClick={handleBackToMenu}
				>
					<IconRenderer name="X" className="text-primary/60" />
					Cancel
				</Button>
			</div>
		</Command>
	);
}
