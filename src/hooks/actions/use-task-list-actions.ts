"use client";

import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import type { List, NewList } from "@/db/schema/lists";
import {
	useCreateTaskList,
	useDeleteTaskList,
	useUpdateTaskList,
} from "@/hooks/mutations/use-task-list-mutation";

//* Custom hook for task list actions (CRUD, refresh, edit modal)
//* Use mutation logic with toast notifications
export const useTaskListActions = () => {
	const router = useTransitionRouter();

	const { mutateAsync: createTaskList, isPending: isCreating } =
		useCreateTaskList();
	const { mutateAsync: updateTaskList, isPending: isUpdating } =
		useUpdateTaskList();
	const { mutateAsync: deleteTaskList, isPending: isDeleting } =
		useDeleteTaskList();

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
