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
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import type { TaskWithTags } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { sortTasks } from "@/lib/helpers/sort-tasks";
import { cn } from "@/lib/utils";
import DraggableTaskItem from "./draggable-task-item";

type TaskSectionProps = {
	icon: React.ReactNode;
	title: string;
	tasks: TaskWithTags[];
	defaultOpen?: boolean;
};

export default function TaskSection({
	icon,
	title,
	tasks,
	defaultOpen,
}: TaskSectionProps) {
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
		<Accordion
			type="single"
			collapsible
			value={isOpen ? "section" : ""}
			onValueChange={(val) => setIsOpen(val === "section")}
		>
			<AccordionItem value="section" className="space-y-2">
				<div
					className={cn(
						"flex w-full select-none items-center justify-between text-muted-foreground text-sm",
						isOpen && "font-medium text-primary",
					)}
				>
					<div className="flex items-center gap-2">
						{icon}
						<span className="text-foreground">{title}</span>
						<NumberFlowBadge value={items.length} />
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="rounded-full"
						onClick={() => setIsOpen((prev) => !prev)}
					>
						<IconRenderer name={isOpen ? "ChevronDown" : "ChevronRight"} />
					</Button>
				</div>

				<AccordionContent className="p-1">
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
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
