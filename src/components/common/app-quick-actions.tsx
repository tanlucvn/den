"use client";

import {
	Calculator,
	Calendar,
	CreditCard,
	Settings,
	Smile,
	User,
} from "lucide-react";
import { useState } from "react";
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
	CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export function AppQuickActions() {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="w-full justify-between text-muted-foreground"
				>
					<span className="flex items-center gap-2">
						<IconRenderer name="Command" />
						Quick Actions
					</span>
					<Kbd keys="Ctrl+K" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
				<Command>
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

						<CommandGroup heading="Settings">
							<CommandItem>
								<User />
								<span>Profile</span>
								<CommandShortcut>⌘P</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<CreditCard />
								<span>Billing</span>
								<CommandShortcut>⌘B</CommandShortcut>
							</CommandItem>
							<CommandItem>
								<Settings />
								<span>Settings</span>
								<CommandShortcut>⌘S</CommandShortcut>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
