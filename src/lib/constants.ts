import type { AppColor } from "@/store/use-app-settings-store";

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

export const ALL_STATUS = [
	{ id: "todo", name: "Todo", icon: "Circle" },
	{
		id: "in_progress",
		name: "In Progress",
		icon: "CircleDot",
	},
	{ id: "paused", name: "Paused", icon: "CircleSlash" },
	{
		id: "completed",
		name: "Completed",
		icon: "CircleCheck",
	},
] as const;
export const STATUS_COLORS: Record<StatusId, string> = {
	todo: "text-primary/60",
	in_progress: "text-amber-500",
	paused: "text-sky-500",
	completed: "text-emerald-500",
};
export type StatusId = (typeof ALL_STATUS)[number]["id"];
export type Status = (typeof ALL_STATUS)[number];

export const ALL_PRIORITY = [
	{ id: "none", name: "None", icon: "Flag" },
	{ id: "low", name: "Low", icon: "Flag" },
	{ id: "medium", name: "Medium", icon: "Flag" },
	{ id: "high", name: "High", icon: "Flag" },
] as const;
export const PRIORITY_COLORS: Record<PriorityId, string> = {
	none: "text-muted-foreground",
	low: "text-green-500",
	medium: "text-amber-500",
	high: "text-red-500",
};
export type PriorityId = (typeof ALL_PRIORITY)[number]["id"];
export type Priority = (typeof ALL_PRIORITY)[number];
