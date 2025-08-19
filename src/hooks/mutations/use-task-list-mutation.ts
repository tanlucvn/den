import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useOptimisticMutation } from "tanstack-query-optimistic-updates";
import type { NewTaskList, TaskList } from "@/db/schema/task-lists";

const TASK_LISTS_KEY = "task-lists";

//* Fetch all task lists
export function useTaskLists() {
	return useQuery<TaskList[]>({
		queryKey: [TASK_LISTS_KEY],
		queryFn: async () => (await axios.get("/api/task-lists")).data,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
}

//* Create task list with optimistic update
export function useCreateTaskList() {
	return useOptimisticMutation({
		mutationFn: async (data: NewTaskList) =>
			(await axios.post("/api/task-lists", data)).data,
		optimisticUpdateOptions: {
			queryKey: [TASK_LISTS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: TaskList[];
				variables: NewTaskList;
			}) => {
				const optimisticId = crypto.randomUUID();
				const newList: TaskList = {
					id: optimisticId,
					userId: variables.userId,
					title: variables.title,
					description: variables.description ?? null,
					note: variables.note ?? null,
					icon: variables.icon ?? null,
					color: variables.color ?? null,
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				return [newList, ...(prevQueryData ?? [])];
			},
			invalidateQueryOnSuccess: true,
		},
	});
}

//* Update task list with optimistic update
export function useUpdateTaskList() {
	return useOptimisticMutation({
		mutationFn: async (list: TaskList) =>
			(await axios.put(`/api/task-lists/${list.id}`, list)).data,
		optimisticUpdateOptions: {
			queryKey: [TASK_LISTS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: TaskList[];
				variables: TaskList;
			}) =>
				(prevQueryData ?? []).map((l) =>
					l.id === variables.id ? { ...l, ...variables } : l,
				),
			invalidateQueryOnSuccess: true,
		},
	});
}

//* Delete task list with optimistic update
export function useDeleteTaskList() {
	return useOptimisticMutation({
		mutationFn: async (list: TaskList) => {
			await axios.delete(`/api/task-lists/${list.id}`);
			return list;
		},
		optimisticUpdateOptions: {
			queryKey: [TASK_LISTS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: TaskList[];
				variables: TaskList;
			}) => (prevQueryData ?? []).filter((l) => l.id !== variables.id),
			invalidateQueryOnSuccess: true,
		},
	});
}
