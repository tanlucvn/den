"use client";

import { toast } from "sonner";
import type { NewTag, Tag } from "@/db/schema/tags";
import {
	useCreateTag,
	useDeleteTag,
	useTags,
	useUpdateTag,
} from "@/hooks/use-tags";
import { useAppStore } from "@/store/use-app-store";

export const useTagActions = () => {
	const { setEditTag } = useAppStore();

	const { mutateAsync: createTag, isPending: isCreating } = useCreateTag();
	const { mutateAsync: updateTag, isPending: isUpdating } = useUpdateTag();
	const { mutateAsync: deleteTag, isPending: isDeleting } = useDeleteTag();
	const { refetch: refetchTags } = useTags();

	const onCreate = async (tag: NewTag) => {
		if (!tag.title.trim()) return;

		const promise = createTag(tag);
		toast.promise(promise, {
			loading: "Creating tag...",
			success: "Tag created!",
			error: "Failed to create tag.",
		});
		await promise;
	};

	const onUpdate = async (tag: Tag) => {
		const promise = updateTag(tag);
		toast.promise(promise, {
			loading: "Updating tag...",
			success: "Tag updated!",
			error: "Failed to update tag.",
		});
		await promise;
	};

	const onDelete = async (tag: Tag) => {
		const promise = deleteTag(tag);
		toast.promise(promise, {
			loading: "Deleting tag...",
			success: "Tag deleted!",
			error: "Failed to delete tag.",
		});
		await promise;
	};

	const onRefresh = async () => {
		await refetchTags();
	};

	const handleEdit = (tag: Tag) => {
		setEditTag(tag);
	};

	return {
		loading: isCreating || isUpdating || isDeleting,
		onCreate,
		onUpdate,
		onDelete,
		onRefresh,
		handleEdit,
	};
};
