"use client";

import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import type { List, NewList } from "@/db/schema/lists";
import {
	useCreateList,
	useDeleteList,
	useUpdateList,
} from "@/hooks/mutations/use-list-mutation";

export const useTaskListActions = () => {
	const router = useTransitionRouter();

	const { mutateAsync: createTaskList, isPending: isCreating } =
		useCreateList();
	const { mutateAsync: updateTaskList, isPending: isUpdating } =
		useUpdateList();
	const { mutateAsync: deleteTaskList, isPending: isDeleting } =
		useDeleteList();

	const handleCreate = async (list: NewList) => {
		if (!list.title.trim()) return;

		try {
			await createTaskList(list);
		} catch {
			toast.error("Failed to create task list.");
		}
	};

	const handleUpdate = async (list: List) => {
		try {
			await updateTaskList(list);
		} catch {
			toast.error("Failed to update task list.");
		}
	};

	const handleDelete = async (list: List) => {
		try {
			await deleteTaskList(list);

			// Redirect if user is on the deleted list page
			if (window.location.pathname.includes(`/lists/${list.id}`)) {
				router.push("/");
			}
		} catch {
			toast.error("Failed to delete task list.");
		}
	};

	return {
		loading: isCreating || isUpdating || isDeleting,
		handleCreate,
		handleUpdate,
		handleDelete,
	};
};
