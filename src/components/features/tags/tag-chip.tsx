"use client";

import { IconRenderer } from "@/components/icon-renderer";
import type { Tag } from "@/db/schema/tags";
import { cn } from "@/lib/utils";

type TagChipProps = {
	tag: Tag;
	className?: string;
	iconClassName?: string;
	deletable?: boolean;
	onClick?: () => void;
};

export default function TagChip({
	tag,
	className,
	iconClassName,
	deletable = false,
	onClick,
}: TagChipProps) {
	return (
		<div
			className={cn(
				"relative flex cursor-pointer select-none items-center gap-1 rounded-full border border-border px-2 py-0.5 font-medium text-foreground text-xs",
				deletable && "hover:border-destructive",
				className,
			)}
		>
			<IconRenderer
				name="Tag"
				className={cn(
					"size-3 fill-transparent text-primary/60",
					`text-${tag.color}-500`,
					iconClassName,
				)}
			/>

			{tag.title}

			{deletable && (
				<span onClick={() => onClick?.()}>
					<IconRenderer name="X" className="size-3 text-destructive" />
				</span>
			)}
		</div>
	);
}
