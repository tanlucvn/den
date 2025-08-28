"use client";

import { useEffect, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { List } from "@/db/schema/lists";
import type { Task } from "@/db/schema/tasks";
import { useSearchStore } from "@/store/use-search-store";
import { ListItem } from "./list-item";

interface SearchListsWrapperProps {
	lists: List[];
	tasks: Task[];
}

export function SearchListsWrapper({
	lists: taskLists,
	tasks,
}: SearchListsWrapperProps) {
	const { searchQuery, isSearchOpen } = useSearchStore();
	const [results, setResults] = useState<List[]>([]);

	useEffect(() => {
		if (!searchQuery.trim()) {
			setResults([]);
			return;
		}

		const q = searchQuery.toLowerCase();
		setResults(
			taskLists.filter((list) => list.title.toLowerCase().includes(q)),
		);
	}, [searchQuery, taskLists]);

	// Return null if search is not opened or searching
	if (!isSearchOpen || !searchQuery.trim()) return null;

	// No matching lists fallback
	if (results.length === 0) {
		return (
			<EmptyState
				icon="SearchX"
				title="No matching lists"
				description={`No lists found for "${searchQuery}"`}
				className="h-full"
				contentClassName="h-full"
			/>
		);
	}

	// Render results
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<div className="h-px flex-1 bg-border" />
				<Badge variant="secondary" className="rounded-full">
					<IconRenderer
						name="Search"
						className="size-3 text-muted-foreground"
					/>
					{results.length} list{results.length !== 1 && "s"} found
				</Badge>
				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,max-content))] gap-2">
				{results.map((list) => {
					const tasksInList = tasks.filter((t) => t.listId === list.id);

					return (
						<ListItem
							key={list.id}
							list={list}
							tasks={tasksInList}
							className="max-w-[250px]"
						/>
					);
				})}
			</div>
		</div>
	);
}
