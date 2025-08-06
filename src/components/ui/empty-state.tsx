import { IconRenderer } from "@/components/icon-renderer";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon?: string;
	title?: string;
	description?: string;
	className?: string;
	contentClassName?: string;
}

export function EmptyState({
	icon = "",
	title = "Nothing here yet.",
	description = "Start by adding a new item.",
	className,
	contentClassName,
}: EmptyStateProps) {
	return (
		<div
			className={cn("relative w-full select-none overflow-hidden", className)}
		>
			<div
				className={cn(
					"h-28 rounded-md border text-center text-muted-foreground text-sm",
					"bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)]",
					contentClassName,
				)}
			>
				<div className="relative z-10 flex h-full flex-col items-center justify-center gap-1">
					{icon && (
						<IconRenderer name={icon} className="size-4 text-primary/60" />
					)}
					<p className="text-foreground">{title}</p>
					<p className="text-xs">{description}</p>
				</div>
			</div>

			<div className="pointer-events-none absolute right-0 bottom-0 left-0 h-12 rounded-b-md bg-gradient-to-t from-background/70 to-transparent" />
		</div>
	);
}
