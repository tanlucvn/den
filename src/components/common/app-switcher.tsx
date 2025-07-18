"use client";

import Link from "next/link";
import * as React from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

const APPS = [
	{
		name: "Task",
		iconName: "Check",
		description: "Tasks & lists",
		shortcut: "Ctrl+1",
	},
	{
		name: "Habit",
		iconName: "Sparkle",
		description: "Track routines",
		shortcut: "Ctrl+2",
	},
	{
		name: "Note",
		iconName: "Pen",
		description: "Write freely",
		shortcut: "Ctrl+3",
	},
	{
		name: "Pomodoro",
		iconName: "Clock",
		description: "Focus timer",
		shortcut: "Ctrl+4",
	},
];

const RESOURCES = [
	{
		href: "https://github.com/tanlucvn/den",
		iconName: "Github",
		label: "GitHub",
		external: true,
	},
	{
		href: "/feedback",
		iconName: "MessageCircle",
		label: "Feedback",
	},
];

export function AppSwitcher() {
	const [activeIndex, setActiveIndex] = React.useState(0);
	const activeApp = APPS[activeIndex];

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<IconRenderer name={activeApp.iconName} />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{activeApp.name}</span>
								<span className="truncate text-xs">
									{activeApp.description}
								</span>
							</div>
							<IconRenderer name="ChevronsUpDown" className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="min-w-54 space-y-1 rounded-lg"
						align="start"
						side="bottom"
						sideOffset={4}
					>
						<DropdownMenuLabel className="select-none text-muted-foreground text-xs">
							Switch App
						</DropdownMenuLabel>

						{APPS.map((app, index) => (
							<DropdownMenuItem
								key={app.name}
								onClick={() => setActiveIndex(index)}
								className={cn(index === activeIndex && "bg-muted")}
							>
								<Button
									variant={index === activeIndex ? "default" : "outline"}
									size="icon"
									className="size-5.5 rounded"
								>
									<IconRenderer
										name={app.iconName}
										className={cn(
											"size-3 shrink-0",
											index === activeIndex && "text-primary-foreground",
										)}
									/>
								</Button>
								<span className="truncate">{app.name}</span>
								<DropdownMenuShortcut>{app.shortcut}</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}

						<DropdownMenuSeparator />

						<DropdownMenuLabel className="select-none text-muted-foreground text-xs">
							Resources
						</DropdownMenuLabel>

						{RESOURCES.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								passHref
								target={item.external ? "_blank" : undefined}
								rel={item.external ? "noopener noreferrer" : undefined}
							>
								<DropdownMenuItem asChild>
									<span className="flex items-center">
										<Button
											variant="outline"
											size="icon"
											className="size-5.5 rounded"
										>
											<IconRenderer
												name={item.iconName}
												className="size-3 shrink-0"
											/>
										</Button>
										<span>{item.label}</span>
									</span>
								</DropdownMenuItem>
							</Link>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
