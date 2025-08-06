import type { AppColor } from "@/store/use-app-settings-store";
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

export const COLOR_OPTIONS: { label: string; value: AppColor; desc: string }[] =
	[
		{
			label: "Default",
			value: "default",
			desc: "A neutral and balanced theme for a clean and minimal interface.",
		},
		{
			label: "Beige",
			value: "beige",
			desc: "Soft, warm tones for a calm and cozy look.",
		},
		{
			label: "Zinc",
			value: "zinc",
			desc: "Muted and modern with a hint of industrial tone.",
		},
		{
			label: "Neutral",
			value: "neutral",
			desc: "Flat and subtle grayscale for a distraction-free experience.",
		},
	];

export const FILTER_LABELS: Record<string, string> = {
	all: "All",
	today: "Today",
	week: "This Week",
	month: "This Month",
};
