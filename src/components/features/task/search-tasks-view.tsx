"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { useSearchStore } from "@/store/use-search-store";
import { useViewStore } from "@/store/use-view-store";
import { TasksByStatusGrid } from "./tasks-by-status-grid";
import { TasksByStatusList } from "./tasks-by-status-list";

interface SearchTasksViewProps {
	tasks: TaskWithTagsAndList[];
}

export function SearchTasksView({ tasks }: SearchTasksViewProps) {
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
			/>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="text-foreground text-sm">
				Found <span className="font-medium">{results.length}</span> task
				{results.length !== 1 && "s"} for "
				<span className="font-medium italic">{searchQuery}</span>"
			</div>

			{isViewTypeGrid ? (
				<TasksByStatusGrid tasks={results} />
			) : (
				<TasksByStatusList tasks={results} />
			)}
		</div>
	);
}
