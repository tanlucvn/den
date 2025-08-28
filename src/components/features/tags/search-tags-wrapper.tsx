"use client";

import { useEffect, useState } from "react";
import TagItem from "@/components/features/tags/tag-item";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { Tag } from "@/db/schema/tags";
import { useSearchStore } from "@/store/use-search-store";

interface SearchTagsWrapperProps {
	tags: Tag[];
}

export function SearchTagsWrapper({ tags }: SearchTagsWrapperProps) {
	const { searchQuery, isSearchOpen } = useSearchStore();
	const [results, setResults] = useState<Tag[]>([]);

	useEffect(() => {
		if (!searchQuery.trim()) {
			setResults([]);
			return;
		}

		const q = searchQuery.toLowerCase();
		setResults(
			tags.filter(
				(tag) =>
					tag.title.toLowerCase().includes(q) ||
					tag.color?.toLowerCase().includes(q),
			),
		);
	}, [searchQuery, tags]);

	// Return null if search is not opened or searching
	if (!isSearchOpen || !searchQuery.trim()) return null;

	// No matching tags fallback
	if (results.length === 0) {
		return (
			<EmptyState
				icon="SearchX"
				title="No matching tags"
				description={`No tags found for "${searchQuery}"`}
			/>
		);
	}

	// Render results
	return (
		<div className="flex size-full flex-col gap-4">
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<div className="h-px flex-1 bg-border" />
				<Badge variant="secondary" className="rounded-full">
					<IconRenderer
						name="Search"
						className="size-3 text-muted-foreground"
					/>
					{results.length} tag{results.length !== 1 && "s"} found
				</Badge>
				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2">
				{results.map((tag) => (
					<TagItem key={tag.id} tag={tag} />
				))}
			</div>
		</div>
	);
}
