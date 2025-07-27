"use client";

import { TagIcon } from "lucide-react";
import TagControlsDropdown from "@/components/features/tags/tag-controls-dropdown";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import type { Tag } from "@/db/schema/tags";
import { cn } from "@/lib/utils";

interface TagItemProps {
	tag: Tag;
}

export default function TagItem({ tag }: TagItemProps) {
	return (
		<div
			className={cn(
				"relative flex select-none items-center justify-between rounded-lg border bg-card px-3 py-1.5 shadow-xs transition hover:border-ring hover:ring-[3px] hover:ring-ring/20",
			)}
		>
			<div className="flex items-center gap-2 overflow-hidden">
				{tag.color ? (
					<TagIcon className="size-4 shrink-0" style={{ color: tag.color }} />
				) : (
					<IconRenderer name="Tag" className="shrink-0 text-primary/60" />
				)}

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
