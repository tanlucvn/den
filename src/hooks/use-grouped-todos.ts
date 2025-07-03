import type { Todo } from "@/lib/models";

export const useGroupedTodos = (todos: Todo[]) => {
	const pinned = todos.filter((todo) => todo.isPinned && !todo.isCompleted);
	const recent = todos.filter((todo) => !todo.isPinned && !todo.isCompleted);
	const completed = todos.filter((todo) => todo.isCompleted);

	return {
		pinned,
		recent,
		completed,
	};
};
