"use client";

import { useTransitionRouter } from "next-view-transitions";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import type { Task } from "@/db/schema";
import type { List } from "@/db/schema/lists";
import {
	type ColorId,
	ENTITY_ICONS,
	TEXT_COLOR_CLASSES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import ListDropdownMenu from "./list-dropdown-menu";

interface ListItemProps {
	list: List;
	tasks: Task[];
	className?: string;
}

export function ListItem({ list: taskList, tasks, className }: ListItemProps) {
	const router = useTransitionRouter();

	const totalCount = tasks?.length;
	const completedCount = tasks?.filter((t) => t.status === "completed").length;

	const progress =
		totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

	console.log(tasks);

	return (
		<div
			className={cn(
				"group relative flex h-28 cursor-pointer flex-col gap-2 rounded-xl border bg-card px-3 py-2 shadow-xs transition-all duration-300",
				"hover:border-ring hover:ring-[3px] hover:ring-ring/20",
				className,
			)}
			onClick={() => router.push(`/lists/${taskList.id}`)}
		>
			<MainRow list={taskList} />
			<MetadataRow
				title={taskList.title}
				description={taskList.description}
				progress={progress}
				totalCount={totalCount}
				completedCount={completedCount}
			/>
		</div>
	);
}

function MainRow({ list: taskList }: { list: List }) {
	return (
		<div className="flex items-center justify-between">
			{/* Left: icon */}
			<Button variant="outline" size="icon" className="size-9 rounded-lg">
				<IconRenderer
					name={taskList.icon || ENTITY_ICONS.lists}
					className={
						TEXT_COLOR_CLASSES[taskList?.color as ColorId] ??
						"text-muted-foreground"
					}
				/>
			</Button>

			{/* Right: dropdown */}
			<span onClick={(e) => e.stopPropagation()}>
				<ListDropdownMenu list={taskList}>
					<Button variant="ghost" size="icon" className="size-7">
						<IconRenderer name="EllipsisVertical" />
					</Button>
				</ListDropdownMenu>
			</span>
		</div>
	);
}

function MetadataRow({
	title,
	description,
	progress,
	totalCount,
	completedCount,
}: {
	title: string;
	description?: string | null;
	progress: number;
	totalCount: number;
	completedCount: number;
}) {
	const progressColor =
		progress < 50
			? "text-rose-500"
			: progress < 80
				? "text-amber-500"
				: "text-emerald-500";

	return (
		<div className="space-y-1">
			<h3 className="truncate font-medium text-sm">{title || "No title"}</h3>

			<div className="flex items-center text-muted-foreground text-xs">
				<p className="truncate">{description || "No description"}</p>
				<span className="ml-auto flex items-center gap-1">
					<span className={cn("font-medium", progressColor)}>{progress}%</span>
					<span className="text-muted-foreground">
						({completedCount}/{totalCount})
					</span>
				</span>
			</div>
		</div>
	);
}
