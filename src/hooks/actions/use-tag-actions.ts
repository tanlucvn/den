"use client";

import { toast } from "sonner";
import type { NewTag, Tag } from "@/db/schema/tags";
import {
	useCreateTag,
	useDeleteTag,
	useUpdateTag,
} from "@/hooks/mutations/use-tag-mutation";
import { useAppStore } from "@/store/use-app-store";

//* Custom hook for tag actions (CRUD, refresh, edit modal)
//* Use mutation logic with toast notifications
export const useTagActions = () => {
	const { setEditTag } = useAppStore();

	// Tag mutation hooks
	const { mutateAsync: createTag, isPending: isCreating } = useCreateTag();
	const { mutateAsync: updateTag, isPending: isUpdating } = useUpdateTag();
	const { mutateAsync: deleteTag, isPending: isDeleting } = useDeleteTag();

	const handleCreate = async (tag: NewTag) => {
		if (!tag.title.trim()) return;

		const promise = createTag(tag);
		toast.promise(promise, {
			loading: "Creating tag...",
			success: "Tag created!",
			error: "Failed to create tag.",
		});
		await promise;
	};

	const handleUpdate = async (tag: Tag) => {
		const promise = updateTag(tag);
		toast.promise(promise, {
			loading: "Updating tag...",
			success: "Tag updated!",
			error: "Failed to update tag.",
		});
		await promise;
	};

	const handleDelete = async (tag: Tag) => {
		const promise = deleteTag(tag);
		toast.promise(promise, {
			loading: "Deleting tag...",
			success: "Tag deleted!",
			error: "Failed to delete tag.",
		});
		await promise;
	};

	const handleEdit = (tag: Tag) => {
		setEditTag(tag);
	};

	return {
		loading: isCreating || isUpdating || isDeleting,
		handleCreate,
		handleUpdate,
		handleDelete,
		handleEdit,
	};
};
