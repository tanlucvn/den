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

	if (isViewTypeGrid) {
		return (
			<DndProvider backend={HTML5Backend}>
				<GridLayout>
					{tasksByStatus.map((status) => (
						<TaskSection key={status.id} status={status} tasks={status.tasks} />
					))}
				</GridLayout>
			</DndProvider>
		);
	}

	return (
		<ListLayout>
			{tasksByStatus.map((status) => (
				<TaskSection key={status.id} status={status} tasks={status.tasks} />
			))}
		</ListLayout>
	);
}

function GridLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="scrollbar size-full overflow-x-auto">
			<div className="grid h-full min-w-max grid-cols-4 gap-4 pb-2">
				{children}
			</div>
		</div>
	);
}

function ListLayout({ children }: { children: React.ReactNode }) {
	return <div className="space-y-4 pb-2">{children}</div>;
}
