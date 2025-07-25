"use client";

import QuickAddTag from "@/components/features/tags/quick-add-tag";
import TagItem from "@/components/features/tags/tag-item";
import { IconRenderer } from "@/components/icon-renderer";
import { EmptyState } from "@/components/ui/empty-state";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTags } from "@/hooks/use-tags";
import { cn } from "@/lib/utils";

interface TagManagerSectionProps {
	className?: string;
}

export default function TagManagerSection({
	className,
}: TagManagerSectionProps) {
	const { data: tags = [], isLoading, isFetched } = useTags();

	const hasTags = tags.length > 0;

	return (
		<section className={cn("flex flex-col gap-4 p-1", className)}>
			{/* Header */}
			<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
				<IconRenderer name="Tags" className="!text-primary/60" />
				<span className="text-foreground">Manage Tags</span>
				<NumberFlowBadge value={tags.length} />
			</div>

			{/* Quick add */}
			<QuickAddTag />

			{/* Loading skeleton */}
			{isLoading && (
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full rounded-xl" />
					))}
				</div>
			)}

			{/* Tag list */}
			{!isLoading && hasTags && (
				<ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{tags.map((tag) => (
						<TagItem key={tag.id} tag={tag} />
					))}
				</ul>
			)}

			{/* Empty state */}
			{!isLoading && isFetched && !hasTags && (
				<EmptyState
					icon="Tag"
					title="No tags created yet"
					description="Use the input above to quickly add a tag."
				/>
			)}
		</section>
	);
}
