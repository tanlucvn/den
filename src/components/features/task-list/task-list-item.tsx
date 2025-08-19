import { useTransitionRouter } from "next-view-transitions";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TaskList } from "@/db/schema/task-lists";
import { type ColorId, TEXT_COLOR_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import TaskListControlsDropdown from "./task-list-controls-dropdown";

interface TaskListItemProps {
	taskList: TaskList;
	totalCount: number;
	completedCount: number;
	className?: string;
}

export function TaskListItem({
	taskList,
	totalCount,
	completedCount,
	className,
}: TaskListItemProps) {
	const router = useTransitionRouter();

	const progress =
		totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

	const progressColor =
		progress < 50
			? "text-rose-300"
			: progress < 80
				? "text-amber-300"
				: "text-emerald-300";

	return (
		<Card
			className={cn(
				"relative size-full h-28 min-w-[200px] cursor-pointer gap-2 rounded-xl p-4 shadow-none",
				"hover:border-ring hover:ring-[3px] hover:ring-ring/20",
				className,
			)}
			onClick={() => router.push(`/lists/${taskList.id}`)}
		>
			<div className="flex items-center justify-between">
				<Button variant="outline" size="icon" className="size-9 rounded-lg">
					<IconRenderer
						name={taskList.icon ?? "List"}
						className={
							TEXT_COLOR_CLASSES[taskList?.color as ColorId] ??
							"text-primary/60"
						}
					/>
				</Button>

				<span onClick={(e) => e.stopPropagation()}>
					<TaskListControlsDropdown taskList={taskList}>
						<Button variant="ghost" size="icon" className="ml-auto size-6">
							<IconRenderer name="EllipsisVertical" />
						</Button>
					</TaskListControlsDropdown>
				</span>
			</div>

			<div className="space-y-1">
				<p className="truncate font-medium text-sm">{taskList.title}</p>
				<div className="flex items-center gap-1 text-muted-foreground text-xs">
					<span className="truncate">
						{taskList.description || "No description"}
					</span>
					<span className={cn("ml-auto pl-4", progressColor)}>
						({progress}%)
					</span>
				</div>
			</div>
		</Card>
	);
}
