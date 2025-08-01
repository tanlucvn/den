"use client";

import { TagIcon, XIcon } from "lucide-react";
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
			<TagIcon
				className={cn("size-3 fill-transparent text-primary/60", iconClassName)}
				style={{ color: tag.color ?? undefined }}
			/>

			{tag.title}

			{deletable && (
				<XIcon
					className="size-3 text-destructive"
					onClick={() => onClick?.()}
				/>
			)}
		</div>
	);
}
