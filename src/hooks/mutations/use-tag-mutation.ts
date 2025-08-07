import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { NewTag, Tag } from "@/db/schema/tags";

const TAGS_KEY = "tags";

//* Generate a React Query key for tags
function getTagsQueryKey() {
	return [TAGS_KEY];
}

//* Fetch all tags
export function useTags() {
	return useQuery<Tag[]>({
		queryKey: getTagsQueryKey(),
		queryFn: async () => (await axios.get("/api/tags")).data,
		refetchOnWindowFocus: false,
	});
}

//* Fetch tag by ID
export function useTagById(id: string | null) {
	return useQuery<Tag>({
		enabled: !!id,
		queryKey: [TAGS_KEY, id],
		queryFn: async () => (await axios.get(`/api/tags/${id}`)).data,
	});
}

//* Create a new tag with optimistic update and rollback
export function useCreateTag() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: NewTag) =>
			(await axios.post("/api/tags", data)).data,

		// Optimistically add tag to cache
		onMutate: async (data) => {
			const queryKey = getTagsQueryKey();
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<Tag[]>(queryKey);
			const optimisticId = crypto.randomUUID();
			const newTag: Tag = {
				id: optimisticId,
				title: data.title,
				userId: data.userId,
				color: data.color ?? null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			queryClient.setQueryData<Tag[]>(queryKey, (old = []) => [newTag, ...old]);

			return { previous, queryKey, optimisticId };
		},

		// Merge real task list and replace optimistic one
		onSuccess: (realTag, _data, context) => {
			if (!context) return;
			queryClient.setQueryData<Tag[]>(context.queryKey, (old = []) =>
				old.map((tag) => (tag.id === context.optimisticId ? realTag : tag)),
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

//* Update tag with optimistic update and rollback
export function useUpdateTag() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (tag: Tag) =>
			(await axios.put(`/api/tags/${tag.id}`, tag)).data,

		// Optimistically update tag in cache
		onMutate: async (tag) => {
			const queryKey = getTagsQueryKey();
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<Tag[]>(queryKey);
			queryClient.setQueryData<Tag[]>(queryKey, (old = []) =>
				old.map((t) => (t.id === tag.id ? { ...t, ...tag } : t)),
			);

			return { previous, queryKey };
		},

		// Rollback on error
		onError: (_err, _tag, context) => {
			if (context?.previous) {
				queryClient.setQueryData(context.queryKey, context.previous);
			}
		},
	});
}

//* Delete tag with optimistic update and rollback
export function useDeleteTag() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (tag: Tag) => {
			await axios.delete(`/api/tags/${tag.id}`);
			return tag;
		},

		// Optimistically remove tag from cache
		onMutate: async (tag) => {
			const queryKey = getTagsQueryKey();
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData<Tag[]>(queryKey);
			queryClient.setQueryData<Tag[]>(queryKey, (old = []) =>
				old.filter((t) => t.id !== tag.id),
			);

			return { previous, queryKey };
		},

		// Rollback on error
		onError: (_err, _tag, context) => {
			if (context?.previous) {
				queryClient.setQueryData(context.queryKey, context.previous);
			}
		},
	});
}
