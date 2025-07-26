import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { NewTask, Task, TaskWithTags } from "@/db/schema/tasks";

// ========== CONFIG ==========
const TASKS_KEY = "tasks";

function getTaskQueryKey(listId?: string | null) {
	return listId ? [TASKS_KEY, { listId }] : [TASKS_KEY];
}

// ========== QUERIES ==========

export function useTasks() {
	return useQuery<TaskWithTags[]>({
		queryKey: getTaskQueryKey(),
		queryFn: async () => (await axios.get("/api/tasks")).data,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		refetchOnMount: false,
	});
}

export function useTasksByListId(listId: string | null) {
	return useQuery<Task[]>({
		enabled: !!listId,
		queryKey: getTaskQueryKey(listId),
		queryFn: async () =>
			(await axios.get("/api/tasks", { params: { listId } })).data,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		refetchOnMount: false,
	});
}

// ========== MUTATIONS ==========

export function useCreateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (task: NewTask) =>
			(await axios.post("/api/tasks", task)).data,

		onMutate: async (task) => {
			const queryKey = getTaskQueryKey(task.listId);
			await queryClient.cancelQueries({ queryKey });

			const prev = queryClient.getQueryData<Task[]>(queryKey);

			const newTask: TaskWithTags = {
				id: crypto.randomUUID(),
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

			return { prev, queryKey };
		},

		onError: (_err, _task, ctx) => {
			if (ctx?.prev && ctx?.queryKey) {
				queryClient.setQueryData(ctx.queryKey, ctx.prev);
			}
		},

		onSettled: (_data, _err, task) => {
			const queryKey = getTaskQueryKey(task.listId);
			queryClient.invalidateQueries({ queryKey });
		},
	});
}

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
			const res = await axios.post("/api/task-tags", { taskId, tagIds });
			return res.data;
		},

		onMutate: async ({ taskId, tagIds }) => {
			await queryClient.cancelQueries({ queryKey: ["task", taskId] });

			const previousTask = queryClient.getQueryData<any>(["task", taskId]);

			queryClient.setQueryData(["task", taskId], (old: any) => ({
				...old,
				tags: tagIds.map((id) => ({ id })),
			}));

			return { previousTask };
		},

		onError: (_err, { taskId }, context) => {
			if (context?.previousTask) {
				queryClient.setQueryData(["task", taskId], context.previousTask);
			}
		},

		onSettled: (_data, _err, { taskId }) => {
			queryClient.invalidateQueries({ queryKey: ["task", taskId] });
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});
}

export function useUpdateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (task: Task) =>
			(await axios.put(`/api/tasks/${task.id}`, task)).data,

		onMutate: async (task) => {
			const queryKey = getTaskQueryKey(task.listId);
			await queryClient.cancelQueries({ queryKey });

			const prev = queryClient.getQueryData<Task[]>(queryKey);

			queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
				old.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
			);

			return { prev, queryKey };
		},

		onError: (_err, _task, ctx) => {
			if (ctx?.prev && ctx?.queryKey) {
				queryClient.setQueryData(ctx.queryKey, ctx.prev);
			}
		},

		onSettled: (_data, _err, task) => {
			const queryKey = getTaskQueryKey(task.listId);
			queryClient.invalidateQueries({ queryKey });
		},
	});
}

export function useDeleteTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (task: Task) => {
			await axios.delete(`/api/tasks/${task.id}`);
			return task;
		},

		onMutate: async (task) => {
			const queryKey = getTaskQueryKey(task.listId);
			await queryClient.cancelQueries({ queryKey });

			const prev = queryClient.getQueryData<Task[]>(queryKey);

			queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
				old.filter((t) => t.id !== task.id),
			);

			return { prev, queryKey };
		},

		onError: (_err, _task, ctx) => {
			if (ctx?.prev && ctx?.queryKey) {
				queryClient.setQueryData(ctx.queryKey, ctx.prev);
			}
		},

		onSettled: (_data, _err, task) => {
			const queryKey = getTaskQueryKey(task.listId);
			queryClient.invalidateQueries({ queryKey });
		},
	});
}

export function useBatchUpdateTasks() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (tasks: Task[]) => {
			await axios.put("/api/tasks/batch", tasks);
		},

		onMutate: async (tasksToUpdate) => {
			const backupTasks = new Map();

			for (const task of tasksToUpdate) {
				const queryKey = getTaskQueryKey(task.listId);
				await queryClient.cancelQueries({ queryKey });

				const currentTasks = queryClient.getQueryData<Task[]>(queryKey);
				backupTasks.set(queryKey.toString(), currentTasks);

				const taskMap = new Map(tasksToUpdate.map((t) => [t.id, t]));

				queryClient.setQueryData<Task[]>(queryKey, (existingTasks = []) =>
					existingTasks.map((task) =>
						taskMap.has(task.id) ? { ...task, ...taskMap.get(task.id)! } : task,
					),
				);
			}

			return { backupTasks };
		},

		onError: (_err, _tasks, ctx) => {
			if (!ctx?.backupTasks) return;

			for (const [queryKeyStr, backupData] of ctx.backupTasks.entries()) {
				const queryKey = queryKeyStr.split(",");
				queryClient.setQueryData(queryKey, backupData);
			}
		},

		onSettled: (_data, _err, updatedTasks) => {
			const uniqueListIds = new Set(updatedTasks.map((t) => t.listId ?? null));

			for (const listId of uniqueListIds) {
				const queryKey = getTaskQueryKey(listId);
				queryClient.invalidateQueries({ queryKey });
			}
		},
	});
}
