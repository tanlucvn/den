import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useOptimisticMutation } from "tanstack-query-optimistic-updates";
import type { NewTag, Tag } from "@/db/schema/tags";

const TAGS_KEY = "tags";

//* Fetch all tags
export function useTags() {
	return useQuery<Tag[]>({
		queryKey: [TAGS_KEY],
		queryFn: async () => (await axios.get("/api/tags")).data,
		refetchOnWindowFocus: false,
	});
}

//* Create tag with optimistic update
export function useCreateTag() {
	return useOptimisticMutation({
		mutationFn: async (tag: NewTag) =>
			(await axios.post("/api/tags", tag)).data,
		optimisticUpdateOptions: {
			queryKey: [TAGS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: Tag[];
				variables: NewTag;
			}) => {
				const optimisticId = crypto.randomUUID();
				const newTag: Tag = {
					id: optimisticId,
					userId: variables.userId,
					title: variables.title,
					color: variables.color ?? null,
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				return [newTag, ...(prevQueryData ?? [])];
			},
			invalidateQueryOnSuccess: true,
		},
	});
}

//* Update tag with optimistic update
export function useUpdateTag() {
	return useOptimisticMutation({
		mutationFn: async (tag: Tag) =>
			(await axios.put(`/api/tags/${tag.id}`, tag)).data,
		optimisticUpdateOptions: {
			queryKey: [TAGS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: Tag[];
				variables: Tag;
			}) =>
				(prevQueryData ?? []).map((t) =>
					t.id === variables.id ? { ...t, ...variables } : t,
				),
			invalidateQueryOnSuccess: true,
		},
	});
}

//* Delete tag with optimistic update
export function useDeleteTag() {
	return useOptimisticMutation({
		mutationFn: async (tag: Tag) => {
			await axios.delete(`/api/tags/${tag.id}`);
			return tag;
		},
		optimisticUpdateOptions: {
			queryKey: [TAGS_KEY],
			getOptimisticState: ({
				prevQueryData,
				variables,
			}: {
				prevQueryData: Tag[];
				variables: Tag;
			}) => (prevQueryData ?? []).filter((t) => t.id !== variables.id),
			invalidateQueryOnSuccess: true,
		},
	});
}
