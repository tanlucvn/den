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

export const ALL_COLORS = [
	{ id: "red", name: "Red", text: "text-red-500", background: "bg-red-500" },
	{
		id: "orange",
		name: "Orange",
		text: "text-orange-500",
		background: "bg-orange-500",
	},
	{
		id: "amber",
		name: "Amber",
		text: "text-amber-500",
		background: "bg-amber-500",
	},
	{
		id: "yellow",
		name: "Yellow",
		text: "text-yellow-500",
		background: "bg-yellow-500",
	},
	{
		id: "lime",
		name: "Lime",
		text: "text-lime-500",
		background: "bg-lime-500",
	},
	{
		id: "green",
		name: "Green",
		text: "text-green-500",
		background: "bg-green-500",
	},
	{
		id: "emerald",
		name: "Emerald",
		text: "text-emerald-500",
		background: "bg-emerald-500",
	},
	{
		id: "teal",
		name: "Teal",
		text: "text-teal-500",
		background: "bg-teal-500",
	},
	{
		id: "cyan",
		name: "Cyan",
		text: "text-cyan-500",
		background: "bg-cyan-500",
	},
	{ id: "sky", name: "Sky", text: "text-sky-500", background: "bg-sky-500" },
	{
		id: "blue",
		name: "Blue",
		text: "text-blue-500",
		background: "bg-blue-500",
	},
	{
		id: "indigo",
		name: "Indigo",
		text: "text-indigo-500",
		background: "bg-indigo-500",
	},
	{
		id: "violet",
		name: "Violet",
		text: "text-violet-500",
		background: "bg-violet-500",
	},
	{
		id: "purple",
		name: "Purple",
		text: "text-purple-500",
		background: "bg-purple-500",
	},
	{
		id: "fuchsia",
		name: "Fuchsia",
		text: "text-fuchsia-500",
		background: "bg-fuchsia-500",
	},
	{
		id: "pink",
		name: "Pink",
		text: "text-pink-500",
		background: "bg-pink-500",
	},
	{
		id: "rose",
		name: "Rose",
		text: "text-rose-500",
		background: "bg-rose-500",
	},
	{
		id: "slate",
		name: "Slate",
		text: "text-slate-500",
		background: "bg-slate-500",
	},
	{
		id: "gray",
		name: "Gray",
		text: "text-gray-500",
		background: "bg-gray-500",
	},
	{
		id: "zinc",
		name: "Zinc",
		text: "text-zinc-500",
		background: "bg-zinc-500",
	},
	{
		id: "neutral",
		name: "Neutral",
		text: "text-neutral-500",
		background: "bg-neutral-500",
	},
	{
		id: "stone",
		name: "Stone",
		text: "text-stone-500",
		background: "bg-stone-500",
	},
] as const;

export type ColorId = (typeof ALL_COLORS)[number]["id"];
export type Color = (typeof ALL_COLORS)[number];

export const TEXT_COLOR_CLASSES: Record<ColorId, string> = Object.fromEntries(
	ALL_COLORS.map((c) => [c.id, c.text]),
) as Record<ColorId, string>;

export const BG_COLOR_CLASSES: Record<ColorId, string> = Object.fromEntries(
	ALL_COLORS.map((c) => [c.id, c.background]),
) as Record<ColorId, string>;
