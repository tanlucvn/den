import { IconRenderer } from "@/components/icon-renderer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface StatItemProps {
	label: string;
	value: string | number;
	icon: string;
	iconClassName?: string;
	description?: string;
	className?: string;
}

export function StatItem({
	label,
	value,
	icon,
	iconClassName,
	description,
	className,
}: StatItemProps) {
	return (
		<Popover>
			<div
				className={cn(
					"flex flex-col items-center gap-1 text-muted-foreground",

					className,
				)}
			>
				<PopoverTrigger asChild>
					<span
						className={cn(
							"flex items-center justify-center rounded-md border bg-card p-2",
							description && "cursor-pointer",
						)}
					>
						<IconRenderer
							name={icon}
							className={cn("text-primary/60", iconClassName)}
						/>
					</span>
				</PopoverTrigger>
				<div className="font-medium text-foreground text-xl">{value}</div>
				<div className="text-xs capitalize tracking-wide">{label}</div>
			</div>

			{description && (
				<PopoverContent className="w-fit max-w-xs p-2 text-center text-muted-foreground text-sm">
					{description}
				</PopoverContent>
			)}
		</Popover>
	);
}
