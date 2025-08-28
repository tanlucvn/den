import { TaskSummary } from "@/components/layouts/asides/tasks/task-summary";
import type { Task } from "@/db/schema/tasks";

interface TaskAsideProps {
	tasks: Task[];
	isLoading?: boolean;
	className?: string;
}

export default function TaskAside({ tasks }: TaskAsideProps) {
	return (
		<div className="flex flex-col gap-4">
			<TaskSummary tasks={tasks} />
		</div>
	);
}
