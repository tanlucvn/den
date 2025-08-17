"use client";

import { useState } from "react";
import QuickAddTag from "@/components/features/tags/quick-add-tag";
import TagItem from "@/components/features/tags/tag-item";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tag } from "@/db/schema/tags";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/use-search-store";
import { SearchTagsView } from "./search-tags";

interface TagManagerSectionProps {
	iconName?: string;
	title: string;
	description?: string;
	tags: Tag[];
	isLoading: boolean;
	isFetched: boolean;
	className?: string;
}

export default function TagManagerSection({
	iconName = "Tags",
	title = "",
	description,
	tags,
	isLoading,
	className,
}: TagManagerSectionProps) {
	const { isSearchOpen, searchQuery } = useSearchStore();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const isSearching = isSearchOpen && searchQuery.trim() !== "";
	const filteredTags = isSearching
		? tags.filter((tag) =>
				tag.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
			)
		: tags;

	const hasTags = filteredTags.length > 0;

	if (isLoading) return <TagManagerSectionSkeleton className={className} />;

	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			{/* Header */}
			<CardHeader className="p-0">
				<CardTitle className="flex items-center gap-2 font-normal text-sm">
					<IconRenderer name={iconName} className="text-primary/60" />
					<span>{title}</span>
					<NumberFlowBadge value={tags.length} />
				</CardTitle>
				{description && (
					<CardDescription className="text-sm">{description}</CardDescription>
				)}
				<CardAction>
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full text-muted-foreground"
						onClick={() => setIsCollapsed(!isCollapsed)}
					>
						<IconRenderer
							name={isCollapsed ? "ChevronsUpDown" : "ChevronsDownUp"}
						/>
					</Button>
				</CardAction>
			</CardHeader>

			{!isCollapsed && (
				<CardContent className="space-y-4 p-0">
					{/* Quick add */}
					<QuickAddTag />

					{/* Tag list */}
					{isSearching ? (
						<SearchTagsView />
					) : (
						hasTags && (
							<div className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2">
								{tags.map((tag) => (
									<TagItem key={tag.id} tag={tag} />
								))}
							</div>
						)
					)}
					{/* Empty state */}
					{!isSearching && !hasTags && (
						<EmptyState
							icon="Tag"
							title="No tags created yet"
							description="Use the input above to quickly add a tag."
						/>
					)}
				</CardContent>
			)}
		</Card>
	);
}

interface TagManagerSectionSkeletonProps {
	className?: string;
}

export function TagManagerSectionSkeleton({
	className,
}: TagManagerSectionSkeletonProps) {
	return (
		<Card className={cn("gap-4 bg-secondary/20 p-4", className)}>
			{/* Header */}
			<CardHeader className="space-y-1 p-0">
				<CardTitle className="flex items-center gap-2 font-normal text-sm">
					<Skeleton className="size-4 rounded-full" />
					<Skeleton className="h-6 w-20" />
					<Skeleton className="size-6" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="h-6 w-44" />
				</CardDescription>
				<CardAction>
					<Skeleton className="size-7 rounded-full" />
				</CardAction>
			</CardHeader>

			<CardContent className="space-y-4 p-0">
				{/* Quick add tag input skeleton */}
				<Skeleton className="h-9 w-full rounded-full" />

				{/* Tag list skeleton grid */}
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-12 w-full rounded-lg" />
					))}
				</div>
			</CardContent>
		</Card>
	);
}
