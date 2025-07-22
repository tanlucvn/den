import type { Task } from "@/db/schema/tasks";
import { filterTasks } from "@/lib/utils";
import { useGroupedTasks } from "./use-grouped-tasks";

export function useSections(tasks: Task[], searchTerm: string) {
	const { pinned, active, completed, archive } = useGroupedTasks(tasks);
	return {
		filtered: {
			pinned: filterTasks(pinned, searchTerm),
			active: filterTasks(active, searchTerm),
			completed: filterTasks(completed, searchTerm),
			archive: filterTasks(archive, searchTerm),
		},
	};
}
