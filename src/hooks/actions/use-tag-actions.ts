"use client";

import { toast } from "sonner";
import type { NewTag, Tag } from "@/db/schema/tags";
import {
	useCreateTag,
	useDeleteTag,
	useUpdateTag,
} from "@/hooks/mutations/use-tag-mutation";

export const useTagActions = () => {
	const { mutateAsync: createTag, isPending: isCreating } = useCreateTag();
	const { mutateAsync: updateTag, isPending: isUpdating } = useUpdateTag();
	const { mutateAsync: deleteTag, isPending: isDeleting } = useDeleteTag();

	const handleCreate = async (tag: NewTag) => {
		if (!tag.title.trim()) return;

		try {
			await createTag(tag);
		} catch {
			toast.error("Failed to create tag.");
		}
	};

	const handleUpdate = async (tag: Tag) => {
		try {
			await updateTag(tag);
		} catch {
			toast.error("Failed to update tag.");
		}
	};

	const handleDelete = async (tag: Tag) => {
		try {
			await deleteTag(tag);
		} catch {
			toast.error("Failed to delete tag.");
		}
	};

	return {
		loading: isCreating || isUpdating || isDeleting,
		handleCreate,
		handleUpdate,
		handleDelete,
	};
};
