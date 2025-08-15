"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";
import { useSearchStore } from "@/store/use-search-store";
import { TaskListItem } from "./task-list-item";

interface SearchTaskListViewProps {
	taskLists: TaskList[];
	tasks: Task[];
}

export function SearchTaskListView({
	taskLists,
	tasks,
}: SearchTaskListViewProps) {
	const { searchQuery, isSearchOpen } = useSearchStore();
	const [results, setResults] = useState<TaskList[]>([]);

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
			/>
		);
	}

	// Render results
	return (
		<div className="flex flex-col gap-2">
			<div className="text-foreground text-sm">
				Found <span className="font-medium">{results.length}</span> list
				{results.length !== 1 && "s"} for "
				<span className="font-medium italic">{searchQuery}</span>"
			</div>

			<div className="grid auto-rows-min gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{results.map((list) => {
					const listTasks = tasks.filter((t) => t.listId === list.id);
					const totalCount = listTasks.length;
					const completedCount = listTasks.filter((t) => t.isCompleted).length;

					return (
						<TaskListItem
							key={list.id}
							taskList={list}
							totalCount={totalCount}
							completedCount={completedCount}
						/>
					);
				})}
			</div>
		</div>
	);
}
