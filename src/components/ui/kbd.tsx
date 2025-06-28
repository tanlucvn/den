import type React from "react";
import { cn } from "@/lib/utils";

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
	keys?: string | string[];
}

export function Kbd({ className, children, keys, ...props }: KbdProps) {
	if (keys) {
		const keyList = Array.isArray(keys) ? keys : keys.split("+");
		return (
			<span className="flex flex-nowrap items-center gap-1">
				{keyList.map((key, i) => (
					<kbd
						key={i}
						className={cn(
							"inline-flex items-center justify-center rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground shadow-xs",
							className,
						)}
						{...props}
					>
						{key}
					</kbd>
				))}
			</span>
		);
	}

	return (
		<kbd
			className={cn(
				"inline-flex items-center justify-center rounded border border-muted-foreground/30 bg-muted px-1.5 py-0.5 font-mono text-muted-foreground text-xs",
				className,
			)}
			{...props}
		>
			{children}
		</kbd>
	);
}
