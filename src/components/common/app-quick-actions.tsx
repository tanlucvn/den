"use client";

import { useTransitionRouter } from "next-view-transitions";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import NewTaskListModal from "@/components/modals/task-lists/new-task-list-modal";
import NewTaskModal from "@/components/modals/tasks/new-task-modal";
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
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

export function AppQuickActions() {
	const router = useTransitionRouter();

	const defaultInputRef = useRef<HTMLInputElement>(null);
	const aiInputRef = useRef<HTMLInputElement>(null);

	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<"default" | "ai">("default");
	const [defaultInputValue, setDefaultInputValue] = useState("");
	const [aiInputValue, setAIInputValue] = useState("");

	useHotkeys(
		"ctrl+k",
		(e) => {
			e.preventDefault();
			setOpen((prev) => !prev);
		},
		{ enableOnFormTags: ["INPUT", "TEXTAREA"] },
	);

	useHotkeys(
		"tab",
		(e) => {
			if (!open) return;
			e.preventDefault();
			setMode((prev) => (prev === "default" ? "ai" : "default"));
		},
		{
			enableOnFormTags: ["INPUT", "TEXTAREA"],
			enableOnContentEditable: true,
		},
		[open],
	);

	useEffect(() => {
		if (mode === "default" && defaultInputRef.current) {
			defaultInputRef.current.focus();
		}
		if (mode === "ai" && aiInputRef.current) {
			aiInputRef.current.focus();
		}
	}, [mode]);

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push("/");
	};

	const handleBackToMenu = () => {
		setMode("default");
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
					Quick Actions
					<Kbd keys="Ctrl+K" className="ml-auto" />
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
						aiInputRef={aiInputRef}
						inputValue={aiInputValue}
						setInputValue={setAIInputValue}
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
	setMode: (mode: "default" | "ai") => void;
	handleSignOut: () => Promise<void>;
}) {
	return (
		<Command className="rounded-xl">
			<div className="relative">
				<CommandInput
					ref={defaultInputRef}
					value={defaultInputValue}
					onValueChange={setDefaultInputValue}
					placeholder="Type a command or search..."
				/>

				<div
					className="absolute top-2 right-2 flex select-none items-center gap-2"
					onClick={() => setMode("ai")}
				>
					<span className="text-muted-foreground text-xs">Ask AI</span>
					<Kbd keys="Tab" />
				</div>
			</div>

			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandSeparator />

				<CommandGroup heading="Tasks">
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

			<div className="mt-auto flex items-center justify-between border-t p-2">
				<Kbd keys="Ctrl+K" />

				<div className="flex h-6 items-center gap-2">
					<span className="select-none text-muted-foreground text-xs">
						Navigate
					</span>
					<Kbd className="size-5 p-0">
						<IconRenderer name="ArrowUp" className="size-3" />
					</Kbd>
					<Kbd className="size-5 p-0">
						<IconRenderer name="ArrowDown" className="size-3" />
					</Kbd>

					<Separator orientation="vertical" />

					<span className="select-none text-muted-foreground text-xs">
						Execute
					</span>
					<Kbd className="size-5 p-0">
						<IconRenderer name="CornerDownLeft" className="size-3" />
					</Kbd>
				</div>
			</div>
		</Command>
	);
}

function SearchMode({
	aiInputRef,
	inputValue,
	setInputValue,
	handleBackToMenu,
}: {
	aiInputRef: React.RefObject<HTMLInputElement | null>;
	inputValue: string;
	setInputValue: (term: string) => void;
	handleBackToMenu: () => void;
}) {
	return (
		<Command className="rounded-xl">
			<div className="relative">
				<CommandInput
					ref={aiInputRef}
					placeholder="Ask AI anything..."
					value={inputValue}
					onValueChange={setInputValue}
					className="mr-17"
					icon={<IconRenderer name="Zap" className="shrink-0 opacity-50" />}
				/>

				<div
					className="absolute top-2 right-2 flex select-none items-center gap-2"
					onClick={handleBackToMenu}
				>
					<span className="text-muted-foreground text-xs">Back</span>
					<Kbd keys="Tab" />
				</div>
			</div>

			<div className="p-4">
				<h3 className="mb-2 font-medium text-sm">AI Assistant</h3>
				<p className="mb-4 text-muted-foreground text-xs">
					Ask anything and get AI-powered assistance. Type your question above
					and press Enter to submit.
				</p>
				<div className="flex flex-col gap-2">
					<div className="flex items-start gap-2">
						<div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
							<IconRenderer name="Zap" className="size-3" />
						</div>
						<div className="space-y-1 text-xs">
							<p className="font-medium">Example questions:</p>
							<ul className="space-y-1 text-muted-foreground">
								<li>• How do I create a new task?</li>
								<li>• How do I organize tasks into lists?</li>
								<li>• What's the best way to prioritize tasks?</li>
								<li>• Can you explain how tags work in this app?</li>
								<li>• How can I start a Pomodoro session?</li>
								<li>• What's the difference between lists and tags?</li>
								<li>• Suggest a productivity method I can use</li>
								<li>• Generate a weekly task schedule for me</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="mt-4 flex justify-between">
					<Button variant="secondary" size="xs" className="rounded text-xs">
						Cancel
					</Button>
					<Button size="xs" className="rounded text-xs">
						Submit
					</Button>
				</div>
			</div>
		</Command>
	);
}
