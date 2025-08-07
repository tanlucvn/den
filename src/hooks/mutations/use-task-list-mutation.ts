import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { NewTaskList, TaskList } from "@/db/schema/task-lists";

const TASK_LISTS_KEY = "task-lists";

//* Generate a React Query key for task lists
function getTaskListsQueryKey() {
	return [TASK_LISTS_KEY];
}

//* Fetch all task lists
export function useTaskLists() {
	return useQuery<TaskList[]>({
		queryKey: getTaskListsQueryKey(),
		queryFn: async () => (await axios.get("/api/task-lists")).data,
		refetchOnWindowFocus: false,
	});
}

//* Create a new task list with optimistic update and rollback
export function useCreateTaskList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: NewTaskList) =>
			(await axios.post("/api/task-lists", data)).data,

		// Optimistically add new task list to cache
		onMutate: async (data) => {
			const queryKey = getTaskListsQueryKey();
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<TaskList[]>(queryKey);
			const optimisticId = crypto.randomUUID();
			const newList: TaskList = {
				id: optimisticId,
				userId: data.userId,
				title: data.title,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			queryClient.setQueryData<TaskList[]>(queryKey, (old = []) => [
				newList,
				...old,
			]);

			return { previous, queryKey, optimisticId };
		},

		// Merge real task list and replace optimistic one
		onSuccess: (realList, _data, context) => {
			if (!context) return;
			queryClient.setQueryData<TaskList[]>(context.queryKey, (old = []) =>
				old.map((list) => (list.id === context.optimisticId ? realList : list)),
			);
		},

		// Rollback on error
		onError: (_err, _data, context) => {
			if (context?.previous) {
				queryClient.setQueryData(context.queryKey, context.previous);
			}
		},
	});
}

//* Update task list with optimistic update and rollback
export function useUpdateTaskList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (list: TaskList) =>
			(await axios.put(`/api/task-lists/${list.id}`, list)).data,

		// Optimistically update task list in cache
		onMutate: async (list) => {
			const queryKey = getTaskListsQueryKey();
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<TaskList[]>(queryKey);
			queryClient.setQueryData<TaskList[]>(queryKey, (old = []) =>
				old.map((l) => (l.id === list.id ? { ...l, ...list } : l)),
			);

			return { previous, queryKey };
		},

		// Rollback on error
		onError: (_err, _list, context) => {
			if (context?.previous) {
				queryClient.setQueryData(context.queryKey, context.previous);
			}
		},
	});
}

//* Delete a task list with optimistic UI and rollback
export function useDeleteTaskList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (list: TaskList) => {
			await axios.delete(`/api/task-lists/${list.id}`);
			return list;
		},

		// Optimistically remove task list from cache
		onMutate: async (list) => {
			const queryKey = getTaskListsQueryKey();
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<TaskList[]>(queryKey);
			queryClient.setQueryData<TaskList[]>(queryKey, (old = []) =>
				old.filter((l) => l.id !== list.id),
			);

			return { previous, queryKey };
		},

		// Rollback on error
		onError: (_err, _list, context) => {
			if (context?.previous) {
				queryClient.setQueryData(context.queryKey, context.previous);
			}
		},
	});
}
