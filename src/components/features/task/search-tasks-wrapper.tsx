"use client";

import { useEffect, useState } from "react";
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
			/>
		);
	}

	return (
		<div className="flex size-full flex-col gap-4">
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<div className="h-px flex-1 bg-border" />
				<span>
					<span className="font-semibold text-foreground text-sm">
						{results.length}
					</span>{" "}
					task{results.length !== 1 && "s"} found
				</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<TasksView tasks={results} isViewTypeGrid={isViewTypeGrid} />
		</div>
	);
}
