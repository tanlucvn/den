"use client";

import QuickAddTag from "@/components/features/tags/quick-add-tag";
import TagItem from "@/components/features/tags/tag-item";
import { IconRenderer } from "@/components/icon-renderer";
import { EmptyState } from "@/components/ui/empty-state";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tag } from "@/db/schema/tags";
import { ENTITY_ICONS } from "@/lib/constants";
import { useSearchStore } from "@/store/use-search-store";
import { SearchTagsWrapper } from "./search-tags-wrapper";

interface AllTagsProps {
	iconName?: string;
	title: string;
	description?: string;
	tags: Tag[];
	isLoading: boolean;
}

export default function AllTags({
	iconName,
	title,
	description,
	tags,
	isLoading,
}: AllTagsProps) {
	const { isSearchOpen, searchQuery } = useSearchStore();

	const isSearching = isSearchOpen && searchQuery.trim() !== "";
	const hasTags = tags.length > 0;

	if (isLoading) return <AllTagsSkeleton />;

	return (
		<section className="flex size-full flex-col gap-4 px-2">
			<Header
				iconName={iconName}
				title={title}
				description={description}
				tagCount={tags.length}
			/>

			<QuickAddTag />

			<TagsContent tags={tags} isSearching={isSearching} hasTags={hasTags} />
		</section>
	);
}

function Header({
	iconName,
	title,
	description,
	tagCount,
}: {
	iconName?: string;
	title: string;
	description?: string;
	tagCount: number;
}) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-2 truncate">
				<IconRenderer
					name={iconName || ENTITY_ICONS.tags}
					className="text-muted-foreground"
				/>
				<h2 className="truncate font-medium">{title}</h2>
				<NumberFlowBadge value={tagCount} />
			</div>
			{description && (
				<p className="truncate text-muted-foreground text-sm">{description}</p>
			)}
		</div>
	);
}

function TagsContent({
	tags,
	isSearching,
	hasTags,
}: {
	tags: Tag[];
	isSearching: boolean;
	hasTags: boolean;
}) {
	if (isSearching) return <SearchTagsWrapper tags={tags} />;

	if (!hasTags) {
		return (
			<EmptyState
				icon={ENTITY_ICONS.tags}
				title="No tags created yet"
				description="Use the input above to quickly add a tag."
				className="h-full"
				contentClassName="h-full"
			/>
		);
	}

	return (
		<div className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2">
			{tags.map((tag) => (
				<TagItem key={tag.id} tag={tag} />
			))}
		</div>
	);
}

export function AllTagsSkeleton() {
	return (
		<section className="flex size-full flex-col gap-4 px-2">
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<Skeleton className="size-5 rounded-full" />
					<Skeleton className="h-5 w-24" />
					<Skeleton className="size-5" />
				</div>
				<Skeleton className="h-5 w-40" />
			</div>

			<Skeleton className="h-9 w-full rounded-full" />

			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full rounded-lg" />
				))}
			</div>
		</section>
	);
}
