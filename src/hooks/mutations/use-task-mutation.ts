import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { NewTask, Task, TaskWithTags } from "@/db/schema/tasks";

const TASKS_KEY = "tasks";

//* Generate a React Query key base on listId
function getTaskQueryKey(listId?: string | null) {
	return listId ? [TASKS_KEY, { listId }] : [TASKS_KEY];
}

//* Fetch all tasks (with tags)
export function useTasks() {
	return useQuery<TaskWithTags[]>({
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

//* Create a new task with optimistic update and rollback
export function useCreateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (task: NewTask) =>
			(await axios.post("/api/tasks", task)).data,

		// Optimistically add new task to cache
		onMutate: async (task) => {
			const queryKey = getTaskQueryKey(task.listId);
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<Task[]>(queryKey);
			const optimisticId = crypto.randomUUID();
			const newTask: TaskWithTags = {
				id: optimisticId,
				userId: task.userId,
				listId: task.listId ?? null,
				title: task.title,
				note: task.note ?? null,
				priority: task.priority ?? "none",
				location: task.location ?? null,
				sortIndex: 0,
				isCompleted: false,
				isPinned: false,
				isArchived: false,
				deletedAt: null,
				remindAt: task.remindAt ?? null,
				createdAt: new Date(),
				updatedAt: new Date(),
				tags: [],
			};

			queryClient.setQueryData<Task[]>(queryKey, (old = []) => [
				newTask,
				...old,
			]);

			return { previous, queryKey, optimisticId };
		},

		// Merge real task list and replace optimistic one
		onSuccess: (realTask, _data, context) => {
			if (!context) return;
			queryClient.setQueryData<Task[]>(context.queryKey, (old = []) =>
				old.map((t) => (t.id === context.optimisticId ? realTask : t)),
			);
		},

		// Rollback on error
		onError: (_err, _task, context) => {
			if (context?.previous) {
				queryClient.setQueryData(context.queryKey, context.previous);
			}
		},
	});
}

//* Update task-tag relationships with optimistic UI
export function useUpdateTaskTags() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			taskId,
			tagIds,
		}: {
			taskId: string;
			tagIds: string[];
		}) => {
			return (await axios.post("/api/task-tags", { taskId, tagIds })).data;
		},

		// Optimistically update task tags
		onMutate: async ({ taskId, tagIds }) => {
			await queryClient.cancelQueries({ queryKey: ["task", taskId] });
			const previous = queryClient.getQueryData<TaskWithTags>(["task", taskId]);

			queryClient.setQueryData(["task", taskId], (old: any) => ({
				...old,
				tags: tagIds.map((id) => ({ id })),
			}));

			return { previous };
		},

		// Rollback on error
		onError: (_err, { taskId }, context) => {
			if (context?.previous) {
				queryClient.setQueryData(["task", taskId], context.previous);
			}
		},
	});
}

//* Update task with optimistic update and rollback
export function useUpdateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (task: Task) =>
			(await axios.put(`/api/tasks/${task.id}`, task)).data,

		// Optimistically update task in cache
		onMutate: async (task) => {
			const queryKey = getTaskQueryKey(task.listId);
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<Task[]>(queryKey);
			queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
				old.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
			);

			return { previous, queryKey };
		},

		// Rollback on error
		onError: (_err, _task, context) => {
			if (context?.previous) {
				queryClient.setQueryData(context.queryKey, context.previous);
			}
		},
	});
}

//* Delete a task with optimistic UI and rollback
export function useDeleteTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (task: Task) => {
			await axios.delete(`/api/tasks/${task.id}`);
			return task;
		},

		// Optimistically remove task from cache
		onMutate: async (task) => {
			const queryKey = getTaskQueryKey(task.listId);
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<Task[]>(queryKey);
			queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
				old.filter((t) => t.id !== task.id),
			);

			return { previous, queryKey };
		},

		// Rollback on error
		onError: (_err, _task, context) => {
			if (context?.previous) {
				queryClient.setQueryData(context.queryKey, context.previous);
			}
		},
	});
}

//* Batch update tasks with optimistic update and rollback
export function useBatchUpdateTasks() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (tasks: Task[]) => {
			await axios.put("/api/tasks/batch", tasks);
		},

		// Optimistically update multiple tasks
		onMutate: async (tasks) => {
			const backup = new Map();
			const listMap = new Map();

			for (const task of tasks) {
				const queryKey = getTaskQueryKey(task.listId);
				const prev = queryClient.getQueryData<Task[]>(queryKey);
				backup.set(queryKey.toString(), prev);
				listMap.set(queryKey.toString(), queryKey);

				queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
					old.map((t) =>
						tasks.find((ut) => ut.id === t.id)
							? { ...t, ...tasks.find((ut) => ut.id === t.id)! }
							: t,
					),
				);
			}

			return { backup, listMap };
		},

		// Rollback on error
		onError: (_err, _tasks, context) => {
			if (!context?.backup) return;

			for (const [keyStr, data] of context.backup.entries()) {
				const queryKey = keyStr.split(",");
				queryClient.setQueryData(queryKey, data);
			}
		},
	});
}
