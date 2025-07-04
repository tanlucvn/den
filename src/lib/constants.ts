import type { TaskSortOption } from "./helpers/sort-tasks";

export const TASK_SORT_OPTIONS: { label: string; value: TaskSortOption }[] = [
	{ label: "Created ↓", value: "created-desc" },
	{ label: "Created ↑", value: "created-asc" },
	{ label: "Updated ↓", value: "updated-desc" },
	{ label: "Updated ↑", value: "updated-asc" },
	{ label: "Reminder ↑", value: "remind-asc" },
	{ label: "Reminder ↓", value: "remind-desc" },
	{ label: "Priority ↑", value: "priority-asc" },
	{ label: "Priority ↓", value: "priority-desc" },
	{ label: "Title A-Z", value: "title-asc" },
	{ label: "Title Z-A", value: "title-desc" },
	{ label: "Custom Sort ↑", value: "sortIndex-asc" },
	{ label: "Custom Sort ↓", value: "sortIndex-desc" },
];

export const TASK_FILTER_OPTIONS = [
	{ label: "All", value: "all" },
	{ label: "Active", value: "active" },
	{ label: "Completed", value: "completed" },
	{ label: "Pinned", value: "pinned" },
	{ label: "Unpinned", value: "unpinned" },
];
