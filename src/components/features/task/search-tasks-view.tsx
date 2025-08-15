"use client";

import { useEffect, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { EmptyState } from "@/components/ui/empty-state";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import { ALL_STATUS, STATUS_COLORS } from "@/lib/constants";
import { useSearchStore } from "@/store/use-search-store";
import TaskSection from "./task-section";

export function SearchTasksView() {
	const { data: tasks = [] } = useTasks();
	const { searchQuery, isSearchOpen } = useSearchStore();
	const [results, setResults] = useState<TaskWithTagsAndList[]>([]);

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
			<div className="space-y-4">
				{ALL_STATUS.map(({ id, name, icon }) => {
					const tasksByStatus = results.filter((t) => t.status === id);
					if (!tasksByStatus.length) return null;

					return (
						<TaskSection
							key={id}
							icon={<IconRenderer name={icon} className={STATUS_COLORS[id]} />}
							title={name}
							tasks={tasksByStatus}
							defaultOpen
						/>
					);
				})}
			</div>
		</div>
	);
}
