import type { Task } from "@/db/schema/tasks";
import { filterTasks } from "@/lib/utils";
import { useGroupedTasks } from "./use-grouped-tasks";

export function useSections(tasks: Task[], searchTerm: string) {
	const { all, pinned, active, completed, archive } = useGroupedTasks(tasks);
	return {
		filtered: {
			all: filterTasks(all, searchTerm),
			pinned: filterTasks(pinned, searchTerm),
			active: filterTasks(active, searchTerm),
			completed: filterTasks(completed, searchTerm),
			archive: filterTasks(archive, searchTerm),
		},
	};
}
