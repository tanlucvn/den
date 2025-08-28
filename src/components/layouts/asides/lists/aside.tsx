import type { List, Task } from "@/db/schema";
import { TaskListSummary } from "./task-list-summary";

interface AsideProps {
	lists: List[];
	tasks: Task[];
	isLoading?: boolean;
	className?: string;
}

export default function Aside({ lists: taskLists, tasks }: AsideProps) {
	return (
		<div className="flex flex-col gap-4">
			<TaskListSummary lists={taskLists} tasks={tasks} />
		</div>
	);
}
