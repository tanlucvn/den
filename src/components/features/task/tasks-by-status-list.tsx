import { IconRenderer } from "@/components/icon-renderer";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { ALL_STATUS, STATUS_COLORS } from "@/lib/constants";
import TaskSection from "./task-section";

interface TasksByStatusListProps {
	tasks: TaskWithTagsAndList[];
}

export function TasksByStatusList({ tasks }: TasksByStatusListProps) {
	const tasksByStatus = ALL_STATUS.map((status) => ({
		...status,
		tasks: tasks.filter((task) => task.status === status.id),
	}));

	if (tasks.length === 0) return null;

	return (
		<>
			{tasksByStatus.map((status) => (
				<TaskSection
					key={status.id}
					icon={
						<IconRenderer
							name={status.icon}
							className={STATUS_COLORS[status.id]}
						/>
					}
					title={status.name}
					tasks={status.tasks}
					defaultOpen={status.id === "todo" || status.id === "in_progress"}
				/>
			))}
		</>
	);
}
