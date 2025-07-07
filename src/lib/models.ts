export interface Task {
	id: string;
	userId: string;
	title: string;
	note?: string;
	priority: "none" | "low" | "medium" | "high";
	location?: string;
	sortIndex?: number;

	isCompleted: boolean;
	isPinned: boolean;
	isArchived?: boolean;

	deletedAt?: string;
	remindAt?: string;

	createdAt: string;
	updatedAt: string;
}

export type NewTask = Omit<Task, "id" | "createdAt" | "updatedAt">;
