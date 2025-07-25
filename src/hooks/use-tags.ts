import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { NewTag, Tag } from "@/db/schema/tags";

// ========== CONFIG ==========

const TAGS_KEY = "tags";

// ========== QUERIES ==========

export function useTags() {
	return useQuery<Tag[]>({
		queryKey: [TAGS_KEY],
		queryFn: async () => (await axios.get("/api/tags")).data,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		refetchOnMount: false,
	});
}

export function useTagById(id: string | null) {
	return useQuery<Tag>({
		enabled: !!id,
		queryKey: [TAGS_KEY, id],
		queryFn: async () => (await axios.get(`/api/tags/${id}`)).data,
	});
}

// ========== MUTATIONS ==========

export function useCreateTag() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (tag: NewTag) =>
			(await axios.post("/api/tags", tag)).data,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [TAGS_KEY] });
		},
	});
}

export function useUpdateTag() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (tag: Tag) =>
			(await axios.put(`/api/tags/${tag.id}`, tag)).data,

		onSuccess: (_data, tag) => {
			queryClient.invalidateQueries({ queryKey: [TAGS_KEY] });
			queryClient.invalidateQueries({ queryKey: [TAGS_KEY, tag.id] });
		},
	});
}

export function useDeleteTag() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (tag: Tag) => {
			await axios.delete(`/api/tags/${tag.id}`);
			return tag;
		},

		onSuccess: (_data, tag) => {
			queryClient.invalidateQueries({ queryKey: [TAGS_KEY] });
			queryClient.removeQueries({ queryKey: [TAGS_KEY, tag.id] });
		},
	});
}
