"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import { IconRenderer } from "@/components/icon-renderer";
import NewTaskModal from "@/components/modals/tasks/new-task-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { STATUS_COLORS, type Status, type StatusId } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useViewStore } from "@/store/use-view-store";
import TaskGridItem, { DragType } from "./task-grid-item";
import TaskItem from "./task-item";

interface TaskSectionProps {
	status: Status;
	tasks: TaskWithTagsAndList[];
}

export function TaskSection({ status, tasks }: TaskSectionProps) {
	const { viewType } = useViewStore();
	const { handleUpdate } = useTaskActions();
	const isViewTypeGrid = viewType === "grid";

	return (
		<div
			className={cn(
				"space-y-2",
				isViewTypeGrid &&
					"flex h-full min-w-[19rem] flex-shrink-0 flex-col overflow-hidden rounded-md border bg-secondary/60",
			)}
		>
			<SectionHeader
				status={status}
				tasksLength={tasks.length}
				isViewTypeGrid={isViewTypeGrid}
			/>

			{isViewTypeGrid ? (
				<TaskGridList
					tasks={tasks}
					statusId={status.id}
					updateTaskStatus={(task, newStatus) =>
						handleUpdate({ ...task, status: newStatus as StatusId })
					}
				/>
			) : (
				<div className="space-y-2">
					<AnimatePresence>
						{tasks.map((task) => (
							<TaskItem key={task.id} task={task} />
						))}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
}

function SectionHeader({
	status,
	tasksLength,
	isViewTypeGrid,
}: {
	status: Status;
	tasksLength: number;
	isViewTypeGrid: boolean;
}) {
	return (
		<div
			className={cn(
				"-top-2 sticky z-[1] flex h-10 w-full items-center justify-between bg-container",
				isViewTypeGrid && "border-b bg-secondary px-4",
			)}
		>
			<div className="flex items-center gap-2">
				<IconRenderer name={status.icon} className={STATUS_COLORS[status.id]} />
				<span className="font-medium text-sm">{status.name}</span>
				<Badge variant="secondary" className="rounded">
					{tasksLength}
				</Badge>
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
			<AnimatePresence>{isOver && <DropOverlay />}</AnimatePresence>
			{tasks.map((task) => (
				<TaskGridItem key={task.id} task={task} />
			))}
		</div>
	);
}

function DropOverlay() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.1 }}
			className={cn(
				"pointer-events-none absolute inset-0 z-[2] flex select-none items-center justify-center",
				"bg-[repeating-linear-gradient(45deg,_theme(colors.border)_0_1px,_transparent_1px_10px)]",
				"backdrop-blur-lg",
			)}
		>
			<p className="text-center font-medium text-sm">Drop to move task</p>
		</motion.div>
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
			<MiscTaskSectionHeader
				title={title}
				icon={icon}
				tasksLength={tasks.length}
			/>
			{tasks.map((task) => (
				<TaskItem key={task.id} task={task} />
			))}
		</div>
	);
}

function MiscTaskSectionHeader({
	title,
	icon,
	tasksLength,
}: {
	title: string;
	icon?: string;
	tasksLength: number;
}) {
	return (
		<div className="sticky top-0 z-[1] flex h-10 w-full items-center justify-between">
			<div className="flex items-center gap-2">
				{icon && <IconRenderer name={icon} className="text-muted-foreground" />}
				<span className="font-medium text-sm">{title}</span>
				<NumberFlowBadge value={tasksLength} />
			</div>
		</div>
	);
}
