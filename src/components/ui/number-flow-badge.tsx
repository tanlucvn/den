import NumberFlow from "@number-flow/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NumberFlowBadgeProps = {
	value: number;
	className?: string;
	variant?: "default" | "secondary" | "destructive" | "outline";
};

export function NumberFlowBadge({
	value,
	className,
	variant = "outline",
}: NumberFlowBadgeProps) {
	return (
		<Badge
			variant={variant}
			className={cn("select-none rounded-[4px] px-2 font-medium", className)}
		>
			<NumberFlow value={value} />
		</Badge>
	);
}
