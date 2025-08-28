"use client";

import { useEffect, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { useSearchStore } from "@/store/use-search-store";
import { useViewStore } from "@/store/use-view-store";
import { TasksView } from "./tasks-view";

interface SearchTasksWrapperProps {
	tasks: TaskWithTagsAndList[];
}

export function SearchTasksWrapper({ tasks }: SearchTasksWrapperProps) {
	const { viewType } = useViewStore();
	const { searchQuery, isSearchOpen } = useSearchStore();
	const [results, setResults] = useState<TaskWithTagsAndList[]>([]);

	const isViewTypeGrid = viewType === "grid";

	useEffect(() => {
		if (!searchQuery.trim()) {
			setResults([]);
			return;
		}

		const q = searchQuery.toLowerCase();
		setResults(
			tasks.filter(
				(task) =>
					task.title.toLowerCase().includes(q) ||
					task.note?.toLowerCase().includes(q),
			),
		);
	}, [searchQuery, tasks]);

	if (!isSearchOpen || !searchQuery.trim()) return null;

	if (results.length === 0) {
		return (
			<EmptyState
				icon="SearchX"
				title="No results found"
				description={`No results found for "${searchQuery}"`}
				className="h-full"
				contentClassName="h-full"
			/>
		);
	}

	return (
		<div className="flex size-full flex-col gap-4">
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<div className="h-px flex-1 bg-border" />
				<Badge variant="secondary" className="rounded-full">
					<IconRenderer
						name="Search"
						className="size-3 text-muted-foreground"
					/>
					{results.length} task{results.length !== 1 && "s"} found
				</Badge>
				<div className="h-px flex-1 bg-border" />
			</div>

			<TasksView tasks={results} isViewTypeGrid={isViewTypeGrid} />
		</div>
	);
}
