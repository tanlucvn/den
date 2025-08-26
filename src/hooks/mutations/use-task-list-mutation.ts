import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useOptimisticMutation } from "tanstack-query-optimistic-updates";
import type { List, NewList } from "@/db/schema/lists";

const TASK_LISTS_KEY = "lists";

//* Fetch all task lists
export function useTaskLists() {
	return useQuery<List[]>({
		queryKey: [TASK_LISTS_KEY],
		queryFn: async () => (await axios.get("/api/lists")).data,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});
}

//* Create task list with optimistic update
export function useCreateTaskList() {
	return useOptimisticMutation({
		mutationFn: async (data: NewList) =>
			(await axios.post("/api/lists", data)).data,
		optimisticUpdateOptions: {
			queryKey: [TASK_LISTS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: List[];
				variables: NewList;
			}) => {
				const optimisticId = crypto.randomUUID();
				const newList: List = {
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
		mutationFn: async (list: List) =>
			(await axios.put(`/api/lists/${list.id}`, list)).data,
		optimisticUpdateOptions: {
			queryKey: [TASK_LISTS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: List[];
				variables: List;
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
		mutationFn: async (list: List) => {
			await axios.delete(`/api/lists/${list.id}`);
			return list;
		},
		optimisticUpdateOptions: {
			queryKey: [TASK_LISTS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: List[];
				variables: List;
			}) => (prevQueryData ?? []).filter((l) => l.id !== variables.id),
			invalidateQueryOnSuccess: true,
		},
	});
}
