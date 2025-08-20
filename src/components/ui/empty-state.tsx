import { IconRenderer } from "@/components/icon-renderer";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon?: string;
	title?: string;
	description?: string;
	className?: string;
	contentClassName?: string;
	children?: React.ReactNode;
}

export function EmptyState({
	icon = "",
	title = "Nothing here yet.",
	description = "Start by adding a new item.",
	className,
	contentClassName,
	children,
}: EmptyStateProps) {
	return (
		<div
			className={cn("relative w-full select-none overflow-hidden", className)}
		>
			<div
				className={cn(
					"relative z-10 h-34 rounded-md text-center text-muted-foreground text-sm",
					"bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)]",
					contentClassName,
				)}
			>
				<div className="relative z-10 flex h-full flex-col items-center justify-center gap-4">
					<div className="flex flex-col items-center justify-center gap-1">
						{icon && (
							<IconRenderer
								name={icon}
								className="size-5 text-muted-foreground"
							/>
						)}
						<p className="text-foreground">{title}</p>
						<p className="px-4 text-xs">{description}</p>
					</div>

					{children}
				</div>

				<div className="absolute inset-x-0 bottom-0 z-0 h-12 rounded-b-md bg-gradient-to-t from-background/70 to-transparent" />
			</div>
		</div>
	);
}
