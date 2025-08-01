"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import { IconRenderer } from "@/components/icon-renderer";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import type { TaskWithTags } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { sortTasks } from "@/lib/helpers/sort-tasks";
import { cn } from "@/lib/utils";
import DraggableTaskItem from "./draggable-task-item";

type TaskSectionCollapsibleProps = {
	icon: React.ReactNode;
	title: string;
	tasks: TaskWithTags[];
	defaultOpen?: boolean;
};

export default function TaskSectionCollapsible({
	icon,
	title,
	tasks,
	defaultOpen,
}: TaskSectionCollapsibleProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const [items, setItems] = useState<TaskWithTags[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const { debouncedSort } = useTaskActions();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		}),
	);

	useEffect(() => {
		const sorted = sortTasks(tasks, "sortIndex-asc");
		setItems(sorted);
	}, [tasks]);

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = items.findIndex((t) => t.id === active.id);
		const newIndex = items.findIndex((t) => t.id === over.id);
		const reordered = arrayMove(items, oldIndex, newIndex);

		setItems(reordered);

		const updatedTasks = reordered
			.map((task, index) =>
				task.sortIndex !== index ? { ...task, sortIndex: index } : null,
			)
			.filter((tasks) => tasks !== null);

		if (updatedTasks.length > 0) {
			await debouncedSort(updatedTasks as TaskWithTags[]);
		}
	};

	if (items.length === 0) return null;

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
			<CollapsibleTrigger asChild>
				<div
					className={cn(
						"flex w-fit cursor-pointer select-none items-center gap-2 text-muted-foreground text-sm",
						isOpen && "font-medium text-primary",
					)}
				>
					{icon}
					<span className="text-foreground">{title}</span>
					<NumberFlowBadge value={items.length} />
					<IconRenderer
						name={isOpen ? "ChevronDown" : "ChevronRight"}
						className="!text-primary/60"
					/>
				</div>
			</CollapsibleTrigger>

			<CollapsibleContent>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={(event) => setActiveId(event.active.id as string)}
					onDragEnd={(event) => {
						setActiveId(null);
						handleDragEnd(event);
					}}
				>
					<SortableContext
						items={items.map((t) => t.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="space-y-4">
							{items.map((task) => (
								<DraggableTaskItem key={task.id} task={task} />
							))}
						</div>
					</SortableContext>

					<DragOverlay>
						{activeId ? (
							<div className="pointer-events-none">
								<DraggableTaskItem
									task={items.find((t) => t.id === activeId)!}
								/>
							</div>
						) : null}
					</DragOverlay>
				</DndContext>
			</CollapsibleContent>
		</Collapsible>
	);
}
