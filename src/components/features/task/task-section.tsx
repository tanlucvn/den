"use client";

import { Reorder } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import TaskItem from "@/components/features/task/task-item";
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
	const { batchUpdateTasks } = useTaskActions();

	useEffect(() => {
		const sorted = sortTasks(tasks, "sortIndex-asc");
		setItems(sorted);
	}, [tasks]);

	const handleDragEnd = async () => {
		const updatedTasks = items
			.map((task, index) => {
				if (task.sortIndex !== index) {
					return { ...task, sortIndex: index };
				}
				return null;
			})
			.filter((task) => task !== null);

		if (updatedTasks.length === 0) return;

		await batchUpdateTasks(updatedTasks);
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
				<Reorder.Group
					axis="y"
					values={items}
					onReorder={setItems}
					className="space-y-4 px-2"
				>
					{items.map((task) => (
						<Reorder.Item
							key={task.id}
							value={task}
							onDragEnd={handleDragEnd}
							transition={{ duration: 0.2, ease: "easeInOut" }}
						>
							<TaskItem task={task} />
						</Reorder.Item>
					))}
				</Reorder.Group>
			</CollapsibleContent>

			{isOpen && <Separator />}
		</Collapsible>
	);
}
