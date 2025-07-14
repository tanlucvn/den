import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { NewTask, Task } from "@/db/schema/tasks";

// ! Config
const TASKS_KEY = ["tasks"];

// * Fetch all tasks
export function useTasks() {
	return useQuery<Task[]>({
		queryKey: TASKS_KEY,
		queryFn: async () => (await axios.get("/api/tasks")).data,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		refetchOnMount: false,
	});
}

// * Create task (optimistic)
export function useCreateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (task: NewTask) =>
			(await axios.post("/api/tasks", task)).data,

		onMutate: async (task) => {
			await queryClient.cancelQueries({ queryKey: TASKS_KEY });

			const prev = queryClient.getQueryData<Task[]>(TASKS_KEY);

			const newTask: Task = {
				id: crypto.randomUUID(),
				userId: task.userId,
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
			};

			queryClient.setQueryData<Task[]>(TASKS_KEY, (old = []) => [
				newTask,
				...old,
			]);

			return { prev };
		},

		onError: (_err, _task, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(TASKS_KEY, ctx.prev);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
		},
	});
}

// * Update task (optimistic)
export function useUpdateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (task: Task) =>
			(await axios.put(`/api/tasks/${task.id}`, task)).data,

		onMutate: async (task) => {
			await queryClient.cancelQueries({ queryKey: TASKS_KEY });

			const prev = queryClient.getQueryData<Task[]>(TASKS_KEY);

			queryClient.setQueryData<Task[]>(TASKS_KEY, (old = []) =>
				old.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
			);

			return { prev };
		},

		onError: (_err, _task, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(TASKS_KEY, ctx.prev);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
		},
	});
}

// * Delete task (optimistic)
export function useDeleteTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await axios.delete(`/api/tasks/${id}`);
			return id;
		},

		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: TASKS_KEY });

			const prev = queryClient.getQueryData<Task[]>(TASKS_KEY);

			queryClient.setQueryData<Task[]>(TASKS_KEY, (old = []) =>
				old.filter((t) => t.id !== id),
			);

			return { prev };
		},

		onError: (_err, _id, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(TASKS_KEY, ctx.prev);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
		},
	});
}

// * Batch update (optimistic)
export function useBatchUpdateTasks() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (tasks: Task[]) => {
			await axios.put("/api/tasks/batch", tasks);
		},

		onMutate: async (updated) => {
			await queryClient.cancelQueries({ queryKey: TASKS_KEY });

			const prev = queryClient.getQueryData<Task[]>(TASKS_KEY);

			const updateMap = new Map(updated.map((t) => [t.id, t]));

			queryClient.setQueryData<Task[]>(TASKS_KEY, (old = []) =>
				old.map((t) =>
					updateMap.has(t.id) ? { ...t, ...updateMap.get(t.id)! } : t,
				),
			);

			return { prev };
		},

		onError: (_err, _tasks, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(TASKS_KEY, ctx.prev);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
		},
	});
}
