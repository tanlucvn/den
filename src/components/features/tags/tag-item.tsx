"use client";

import TagControlsDropdown from "@/components/features/tags/tag-controls-dropdown";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import type { Tag } from "@/db/schema/tags";
import { type ColorId, TEXT_COLOR_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TagItemProps {
	tag: Tag;
}

export default function TagItem({ tag }: TagItemProps) {
	return (
		<div
			className={cn(
				"relative flex min-w-[160px] select-none items-center justify-between rounded-lg border bg-card px-3 py-1.5 shadow-xs transition hover:border-ring hover:ring-[3px] hover:ring-ring/20",
			)}
		>
			<div className="flex items-center gap-2 overflow-hidden">
				<IconRenderer
					name="Tag"
					className={cn(
						"shrink-0",
						TEXT_COLOR_CLASSES[tag.color as ColorId] ?? "text-muted-foreground",
					)}
				/>

				<h3 className="truncate font-medium text-sm">{tag.title}</h3>
			</div>

			<TagControlsDropdown tag={tag}>
				<Button variant="ghost" size="icon" className="rounded-full">
					<IconRenderer name="EllipsisVertical" />
				</Button>
			</TagControlsDropdown>
		</div>
	);
}
