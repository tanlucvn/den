import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { NewTaskList, TaskList } from "@/db/schema/task-lists";

// ========== CONFIG ==========

const TASK_LISTS_KEY = ["task-lists"];

// ========== QUERIES ==========

export function useTaskLists() {
	return useQuery<TaskList[]>({
		queryKey: TASK_LISTS_KEY,
		queryFn: async () => (await axios.get("/api/task-lists")).data,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		refetchOnMount: false,
	});
}

export function useCreateTaskList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (taskList: NewTaskList) =>
			(await axios.post("/api/task-lists", taskList)).data,

		onMutate: async (taskList) => {
			await queryClient.cancelQueries({ queryKey: TASK_LISTS_KEY });

			const prev = queryClient.getQueryData<TaskList[]>(TASK_LISTS_KEY);

			const newList: TaskList = {
				id: crypto.randomUUID(),
				userId: taskList.userId,
				title: taskList.title,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			queryClient.setQueryData<TaskList[]>(TASK_LISTS_KEY, (old = []) => [
				newList,
				...old,
			]);

			return { prev };
		},

		onError: (_err, _taskList, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(TASK_LISTS_KEY, ctx.prev);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: TASK_LISTS_KEY });
		},
	});
}

export function useUpdateTaskList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (taskList: TaskList) =>
			(await axios.put(`/api/task-lists/${taskList.id}`, taskList)).data,

		onMutate: async (taskList) => {
			await queryClient.cancelQueries({ queryKey: TASK_LISTS_KEY });

			const prev = queryClient.getQueryData<TaskList[]>(TASK_LISTS_KEY);

			queryClient.setQueryData<TaskList[]>(TASK_LISTS_KEY, (old = []) =>
				old.map((l) => (l.id === taskList.id ? { ...l, ...taskList } : l)),
			);

			return { prev };
		},

		onError: (_err, _taskList, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(TASK_LISTS_KEY, ctx.prev);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: TASK_LISTS_KEY });
		},
	});
}

export function useDeleteTaskList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await axios.delete(`/api/task-lists/${id}`);
			return id;
		},

		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: TASK_LISTS_KEY });

			const prev = queryClient.getQueryData<TaskList[]>(TASK_LISTS_KEY);

			queryClient.setQueryData<TaskList[]>(TASK_LISTS_KEY, (old = []) =>
				old.filter((l) => l.id !== id),
			);

			return { prev };
		},

		onError: (_err, _id, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(TASK_LISTS_KEY, ctx.prev);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: TASK_LISTS_KEY });
		},
	});
}
