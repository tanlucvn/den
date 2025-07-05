"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	PointerSensor,
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
import { Separator } from "@/components/ui/separator";
import { useTaskActions } from "@/hooks/use-task-actions";
import { sortTasks } from "@/lib/helpers/sort-tasks";
import type { Task } from "@/lib/models";
import { cn } from "@/lib/utils";
import DraggableTaskItem from "./draggable-task-item";

type SectionProps = {
	icon: React.ReactNode;
	title: string;
	tasks: Task[];
	defaultOpen?: boolean;
};

export default function TaskSection({
	icon,
	title,
	tasks,
	defaultOpen,
}: SectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const [items, setItems] = useState<Task[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const { onSort } = useTaskActions();

	const sensors = useSensors(useSensor(PointerSensor));

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
			await onSort(updatedTasks as Task[]);
		}
	};

	if (items.length === 0) return null;

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
			<CollapsibleTrigger asChild>
				<div
					className={cn(
						"flex cursor-pointer select-none items-center gap-2 text-muted-foreground text-sm",
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

			{isOpen && <Separator />}
		</Collapsible>
	);
}
