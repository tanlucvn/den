import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { ALL_STATUS } from "@/lib/constants";
import { TaskSection } from "./task-section";

interface TasksViewProps {
	tasks: TaskWithTagsAndList[];
	isViewTypeGrid: boolean;
}

export function TasksView({ tasks, isViewTypeGrid }: TasksViewProps) {
	const tasksByStatus = ALL_STATUS.map((status) => ({
		...status,
		tasks: tasks.filter((task) => task.status === status.id),
	}));

	return isViewTypeGrid ? (
		<DndProvider backend={HTML5Backend}>
			<div className="scrollbar h-full w-full overflow-x-auto">
				<div className="grid h-full min-w-max grid-cols-4 gap-4 pb-2">
					{tasksByStatus.map((status) => (
						<TaskSection key={status.id} status={status} tasks={status.tasks} />
					))}
				</div>
			</div>
		</DndProvider>
	) : (
		tasksByStatus.map((status) => (
			<TaskSection key={status.id} status={status} tasks={status.tasks} />
		))
	);
}
