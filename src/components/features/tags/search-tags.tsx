"use client";

import { useEffect, useState } from "react";
import TagItem from "@/components/features/tags/tag-item";
import { EmptyState } from "@/components/ui/empty-state";
import type { Tag } from "@/db/schema/tags";
import { useTags } from "@/hooks/mutations/use-tag-mutation"; // hook lấy tags
import { useSearchStore } from "@/store/use-search-store";

export function SearchTagsView() {
	const { data: tags = [] } = useTags();
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
		<div className="flex flex-col gap-2">
			<div className="text-foreground text-sm">
				Found <span className="font-medium">{results.length}</span> tag
				{results.length !== 1 && "s"} for "
				<span className="font-medium italic">{searchQuery}</span>"
			</div>

			<div className="grid auto-rows-min gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{results.map((tag) => (
					<TagItem key={tag.id} tag={tag} />
				))}
			</div>
		</div>
	);
}
