import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useOptimisticMutation } from "tanstack-query-optimistic-updates";
import type { NewTask, Task, TaskWithTagsAndList } from "@/db/schema/tasks";

const TASKS_KEY = "tasks";

//* Generate a React Query key base on listId
function getTaskQueryKey(listId?: string | null) {
	return listId ? [TASKS_KEY, { listId }] : [TASKS_KEY];
}

//* Fetch all tasks (with tags)
export function useTasks() {
	return useQuery<TaskWithTagsAndList[]>({
		queryKey: getTaskQueryKey(),
		queryFn: async () => (await axios.get("/api/tasks")).data,
		refetchOnWindowFocus: false,
	});
}

//* Fetch tasks by specific listId
export function useTasksByListId(listId: string | null) {
	return useQuery<Task[]>({
		enabled: !!listId,
		queryKey: getTaskQueryKey(listId),
		queryFn: async () =>
			(await axios.get("/api/tasks", { params: { listId } })).data,
		refetchOnWindowFocus: false,
	});
}

//* Create a new task with optimistic update
export function useCreateTask() {
	return useOptimisticMutation({
		mutationFn: async (task: NewTask) =>
			(await axios.post("/api/tasks", task)).data,
		optimisticUpdateOptions: {
			queryKey: [TASKS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: Task[];
				variables: NewTask;
			}) => {
				const optimisticId = crypto.randomUUID();
				const newTask: Task = {
					id: optimisticId,
					userId: variables.userId,
					listId: variables.listId ?? null,
					title: variables.title,
					note: variables.note ?? null,
					priority: variables.priority ?? "none",
					location: variables.location ?? null,
					sortIndex: 0,
					isCompleted: false,
					isPinned: false,
					isArchived: false,
					deletedAt: null,
					remindAt: variables.remindAt ?? null,
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				return [newTask, ...(prevQueryData ?? [])];
			},
			invalidateQueryOnSuccess: true,
		},
	});
}

//* Update task-tag relationships with optimistic UI
export function useUpdateTaskTags() {
	return useOptimisticMutation({
		mutationFn: async ({
			taskId,
			tagIds,
		}: {
			taskId: string;
			tagIds: string[];
		}) => {
			return (await axios.post("/api/task-tags", { taskId, tagIds })).data;
		},
		optimisticUpdateOptions: {
			queryKey: [TASKS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: TaskWithTagsAndList[];
				variables: { taskId: string; tagIds: string[] };
			}) => {
				if (!Array.isArray(prevQueryData)) return prevQueryData ?? [];
				return prevQueryData.map((task) =>
					task.id === variables.taskId
						? {
								...task,
								tags: variables.tagIds.map((id) => ({
									id,
									userId: task.userId,
									title: "",
									color: null,
									createdAt: new Date(),
									updatedAt: new Date(),
								})),
							}
						: task,
				);
			},
			invalidateQueryOnSuccess: true,
		},
	});
}

//* Update task with optimistic update
export function useUpdateTask() {
	return useOptimisticMutation({
		mutationFn: async (task: Task) =>
			(await axios.put(`/api/tasks/${task.id}`, task)).data,
		optimisticUpdateOptions: {
			queryKey: [TASKS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: Task[];
				variables: Task;
			}) =>
				(prevQueryData ?? []).map((t) =>
					t.id === variables.id ? { ...t, ...variables } : t,
				),
			invalidateQueryOnSuccess: true,
		},
	});
}

//* Delete a task with optimistic UI
export function useDeleteTask() {
	return useOptimisticMutation({
		mutationFn: async (task: Task) => {
			await axios.delete(`/api/tasks/${task.id}`);
			return task;
		},
		optimisticUpdateOptions: {
			queryKey: [TASKS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: Task[];
				variables: Task;
			}) => (prevQueryData ?? []).filter((t) => t.id !== variables.id),
			invalidateQueryOnSuccess: true,
		},
	});
}

//* Batch update tasks with optimistic update
export function useBatchUpdateTasks() {
	return useOptimisticMutation({
		mutationFn: async (tasks: Task[]) => {
			await axios.put("/api/tasks/batch", tasks);
		},
		optimisticUpdateOptions: {
			queryKey: [TASKS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: Task[];
				variables: Task[];
			}) => {
				return (prevQueryData ?? []).map((t) => {
					const updated = variables.find((ut) => ut.id === t.id);
					return updated ? { ...t, ...updated } : t;
				});
			},
			invalidateQueryOnSuccess: true,
		},
	});
}
