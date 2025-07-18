"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import NewTaskListModal from "@/components/modals/new-task-list-modal";
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
import { useTaskActions } from "@/hooks/use-task-actions";
import { useTasks } from "@/hooks/use-tasks";
import { authClient } from "@/lib/auth-client";
import { filterTasks } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export function AppQuickActions() {
	const router = useRouter();

	const { data: tasks = [] } = useTasks();

	const { searchTerm, setSearchTerm } = useAppStore();

	const { handleEdit } = useTaskActions();

	const [open, setOpen] = useState(false);

	const filteredTasks = filterTasks(tasks, searchTerm);

	const isSearching = searchTerm.trim().length > 0;

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push("/");
	};

	useHotkeys(
		"ctrl+k",
		(event) => {
			event.preventDefault(); // Prevent the browser's default behavior
			setOpen((prev) => !prev);
		},
		{ enableOnFormTags: ["INPUT", "TEXTAREA"] },
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="w-full justify-between rounded-full font-normal dark:bg-card dark:hover:border-primary dark:hover:bg-card"
				>
					<span className="flex items-center gap-2">
						<IconRenderer name="Command" className="!text-primary/60" />
						Quick Actions
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
				<Command className="rounded-xl">
					<CommandInput
						placeholder="Type a command or search..."
						value={searchTerm}
						onValueChange={setSearchTerm}
					/>
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>

						{isSearching && filteredTasks.length > 0 && (
							<CommandGroup heading="Search Tasks">
								{filteredTasks.map((task) => (
									<CommandItem key={task.id} onSelect={() => handleEdit(task)}>
										<IconRenderer name="ListTodo" />
										<span className="truncate">{task.title}</span>

										<span className="ml-auto text-muted-foreground text-xs">
											Click to Edit
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						)}

						<CommandSeparator />

						<CommandGroup heading="Suggestions">
							<NewTaskListModal>
								<div>
									<CommandItem>
										<IconRenderer name="Plus" />
										<span>Create new task</span>
									</CommandItem>
								</div>
							</NewTaskListModal>
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading="Accounts">
							<CommandItem
								onSelect={async () => {
									toast.promise(handleSignOut, {
										loading: "Signing out...",
										success: "Signed out successfully",
										error: "Sign out failed",
									});
								}}
							>
								<IconRenderer name="LogOut" className="text-destructive" />
								<span>Log out</span>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
