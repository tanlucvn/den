"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import { IconRenderer } from "@/components/icon-renderer";
import NewTaskModal from "@/components/modals/tasks/new-task-modal";
import { Button } from "@/components/ui/button";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { STATUS_COLORS, type Status, type StatusId } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useViewStore } from "@/store/use-view-store";
import TaskGridItem, { DragType } from "./task-grid-item";
import TaskItem from "./task-item";

type TaskSectionProps = {
	status: Status;
	tasks: TaskWithTagsAndList[];
};

export function TaskSection({ status, tasks }: TaskSectionProps) {
	const { viewType } = useViewStore();
	const { handleUpdate } = useTaskActions();
	const isViewTypeGrid = viewType === "grid";

	return (
		<div
			className={cn(
				"space-y-2",
				isViewTypeGrid &&
					"flex size-full flex-shrink-0 flex-col overflow-hidden rounded-md border bg-secondary/60",
			)}
		>
			{/* Header */}
			<div
				className={cn(
					"sticky top-0 z-[1] flex h-10 w-full items-center justify-between",
					isViewTypeGrid && "border-b px-4",
				)}
			>
				<div className="flex items-center gap-2">
					<IconRenderer
						name={status.icon}
						className={STATUS_COLORS[status.id]}
					/>
					<span className="font-medium text-sm">{status.name}</span>
					<NumberFlowBadge value={tasks.length} />
				</div>

				<NewTaskModal initialData={{ status: status.id as StatusId }}>
					<Button
						size="icon"
						variant="ghost"
						className="size-6 text-muted-foreground"
					>
						<IconRenderer name="Plus" />
					</Button>
				</NewTaskModal>
			</div>

			{/* Body */}
			{isViewTypeGrid ? (
				<TaskGridList
					tasks={tasks}
					statusId={status.id}
					updateTaskStatus={(task, newStatus) => {
						handleUpdate({ ...task, status: newStatus as StatusId });
					}}
				/>
			) : (
				<div className="space-y-2">
					{tasks.map((task) => (
						<TaskItem key={task.id} task={task} />
					))}
				</div>
			)}
		</div>
	);
}

interface TaskGridListProps {
	tasks: TaskWithTagsAndList[];
	statusId: string;
	updateTaskStatus: (task: TaskWithTagsAndList, newStatus: string) => void;
}

function TaskGridList({
	tasks,
	statusId,
	updateTaskStatus,
}: TaskGridListProps) {
	const ref = useRef<HTMLDivElement>(null);

	const [{ isOver }, drop] = useDrop(() => ({
		accept: DragType,
		drop(item: TaskWithTagsAndList, monitor) {
			if (monitor.didDrop() || item.status === statusId) return;
			updateTaskStatus(item, statusId);
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	drop(ref);

	return (
		<div
			ref={ref}
			className="relative h-full flex-1 space-y-2 overflow-y-auto px-2"
		>
			<AnimatePresence>
				{isOver && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.1 }}
						className={cn(
							"pointer-events-none absolute inset-0 z-[2] flex items-center justify-center",
							"bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)]",
							"backdrop-blur-lg",
						)}
					>
						<p className="text-center font-medium text-sm">Drop to move task</p>
					</motion.div>
				)}
			</AnimatePresence>
			{tasks.map((task) => (
				<TaskGridItem key={task.id} task={task} />
			))}
		</div>
	);
}

interface MiscTaskSectionProps {
	title: string;
	icon?: string;
	tasks: TaskWithTagsAndList[];
}

export function MiscTaskSection({ title, icon, tasks }: MiscTaskSectionProps) {
	return (
		<div className="space-y-2">
			{/* Header */}
			<div className="sticky top-0 z-[1] flex h-10 w-full items-center justify-between">
				<div className="flex items-center gap-2">
					{icon && (
						<IconRenderer name={icon} className="text-muted-foreground" />
					)}
					<span className="font-medium text-sm">{title}</span>
					<NumberFlowBadge value={tasks.length} />
				</div>
			</div>

			{/* Body */}
			{tasks.map((task) => (
				<TaskItem key={task.id} task={task} />
			))}
		</div>
	);
}
