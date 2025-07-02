export interface Todo {
	id: number;
	userId: string;
	title: string;
	note?: string;
	priority: "none" | "low" | "medium" | "high";
	location?: string;

	isCompleted: boolean;
	isPinned: boolean;

	deletedAt?: string;
	remindAt?: string;

	createdAt: string;
	updatedAt: string;
}

export type NewTodo = Omit<Todo, "id" | "createdAt" | "updatedAt">;
