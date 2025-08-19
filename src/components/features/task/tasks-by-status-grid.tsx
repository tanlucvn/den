"use client";

import { useEffect, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import {
	type DragEndEvent,
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanHeader,
	KanbanProvider,
} from "@/components/ui/kanban";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { ALL_STATUS, STATUS_COLORS } from "@/lib/constants";
import { sortByPriority } from "@/lib/helpers/tasks-sort-by-priority";
import TaskItem from "./task-item";

interface TasksByStatusGridProps {
	tasks: TaskWithTagsAndList[];
}

export function TasksByStatusGrid({ tasks }: TasksByStatusGridProps) {
	const { handleUpdate } = useTaskActions();

	const columns = ALL_STATUS.map((status) => ({
		id: status.id,
		name: status.name,
		color: STATUS_COLORS[status.id],
		icon: status.icon,
	}));

	const [kanbanData, setKanbanData] = useState(
		tasks
			.slice()
			.sort(sortByPriority)
			.map((task) => ({
				id: task.id,
				name: task.title,
				column: task.status,
				raw: task,
			})),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const status = columns.find(({ id }) => id === over.id);
		if (!status) return;

		setKanbanData((prev) =>
			prev.map((item) => {
				if (item.id === active.id) {
					handleUpdate({
						...item.raw,
						status: status.id,
					});

					return {
						...item,
						column: status.id,
						raw: { ...item.raw, status: status.id },
					};
				}
				return item;
			}),
		);
	};

	// Only show columns that have tasks (for search/filter)
	const filteredColumns = columns.filter((column) =>
		kanbanData.some((item) => item.column === column.id),
	);

	useEffect(() => {
		setKanbanData(
			tasks
				.slice()
				.sort(sortByPriority)
				.map((task) => ({
					id: task.id,
					name: task.title,
					column: task.status,
					raw: task,
				})),
		);
	}, [tasks]);

	return (
		<ScrollArea className="w-full overflow-x-auto">
			<div className="flex min-w-max gap-4 p-1 pb-4">
				<KanbanProvider
					columns={filteredColumns}
					data={kanbanData}
					onDragEnd={handleDragEnd}
				>
					{(column) => (
						<KanbanBoard
							id={column.id}
							key={column.id}
							className="h-[400px] min-w-[350px] flex-shrink-0 overflow-y-auto"
						>
							<KanbanHeader className="px-4">
								<div className="flex items-center gap-2">
									<IconRenderer name={column.icon} className={column.color} />
									<span>{column.name}</span>
									<NumberFlowBadge
										value={
											kanbanData.filter((item) => item.column === column.id)
												.length
										}
									/>
								</div>
							</KanbanHeader>

							<KanbanCards id={column.id}>
								{(item) => {
									const task = (item as any).raw as TaskWithTagsAndList;
									return (
										<KanbanCard
											column={column.id}
											id={task.id}
											key={task.id}
											name={task.title}
											className="rounded-xl border-none p-0 shadow-none"
										>
											<TaskItem task={task} showStatusSelector={false} />
										</KanbanCard>
									);
								}}
							</KanbanCards>
						</KanbanBoard>
					)}
				</KanbanProvider>
			</div>

			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
