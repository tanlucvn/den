"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconRenderer } from "./icon-renderer";
import { Button } from "./ui/button";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider
			enableSystem={true}
			attribute="class"
			storageKey="theme"
			defaultTheme="system"
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}

export function ThemeSwitcher({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"flex h-fit w-fit items-center rounded-full border bg-secondary/30 text-foreground/60 group-hover:bg-background dark:bg-secondary/30",
				className,
			)}
		>
			<ThemeButton iconName="Sun" themeTitle="light" />
			<ThemeButton iconName="Moon" themeTitle="dark" />
			<ThemeButton iconName="Laptop" themeTitle="system" />
		</div>
	);
}

function ThemeButton({
	iconName,
	themeTitle,
}: {
	iconName: string;
	themeTitle: "light" | "dark" | "system";
}) {
	const { theme, setTheme } = useTheme();

	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className={cn(
							"aspect-square size-5 rounded-full border border-transparent p-0 transition-all hover:bg-transparent hover:text-foreground [&_svg]:size-3",
							theme === themeTitle && "border-foreground/20 text-foreground",
						)}
						onClick={() => setTheme(themeTitle)}
					>
						<IconRenderer name={iconName} />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p className="capitalize">{themeTitle}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
