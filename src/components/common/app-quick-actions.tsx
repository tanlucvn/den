"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Calculator, Calendar, Smile } from "lucide-react";
import { useState } from "react";
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
import { useDialogStore } from "@/store/use-dialog-store";

export function AppQuickActions() {
	const { user } = useUser();
	const { signOut } = useClerk();

	const { setIsSignInOpen } = useDialogStore();

	const [open, setOpen] = useState(false);

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
					<Kbd keys="Ctrl+K" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-[var(--radix-popover-trigger-width)] rounded-xl p-0">
				<Command className="rounded-xl">
					<CommandInput placeholder="Type a command or search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>

						<CommandGroup heading="Suggestions">
							<CommandItem>
								<Calendar />
								<span>Calendar</span>
							</CommandItem>
							<CommandItem>
								<Smile />
								<span>Search Emoji</span>
							</CommandItem>
							<CommandItem>
								<Calculator />
								<span>Calculator</span>
							</CommandItem>
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading="Accounts">
							{user ? (
								<CommandItem
									onSelect={async () => {
										toast.promise(signOut({ redirectUrl: "/" }), {
											loading: "Signing out...",
											success: "Signed out successfully",
											error: "Sign out failed",
										});
									}}
								>
									<IconRenderer name="LogOut" className="text-destructive" />
									<span>Log out</span>
								</CommandItem>
							) : (
								<CommandItem onSelect={() => setIsSignInOpen(true)}>
									<IconRenderer name="LogIn" />
									<span>Sign In</span>
								</CommandItem>
							)}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
