"use client";

import TagDropdownMenu from "@/components/features/tags/tag-dropdown-menu";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import type { Tag } from "@/db/schema/tags";
import {
	type ColorId,
	ENTITY_ICONS,
	TEXT_COLOR_CLASSES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TagItemProps {
	tag: Tag;
}

export default function TagItem({ tag }: TagItemProps) {
	const colorClass =
		TEXT_COLOR_CLASSES[tag.color as ColorId] ?? "text-muted-foreground";

	return (
		<div
			className={cn(
				"flex cursor-default items-center justify-between gap-2 rounded-lg border bg-card px-3 py-1.5 shadow-xs transition hover:border-ring hover:ring-[3px] hover:ring-ring/20",
			)}
		>
			<div className="flex items-center gap-2 overflow-hidden">
				<IconRenderer name={ENTITY_ICONS.tags} className={colorClass} />
				<h3 className="truncate font-medium text-sm">{tag.title}</h3>
			</div>

			<TagDropdownMenu tag={tag}>
				<Button variant="ghost" size="icon" className="size-7">
					<IconRenderer name="EllipsisVertical" />
				</Button>
			</TagDropdownMenu>
		</div>
	);
}
