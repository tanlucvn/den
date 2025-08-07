"use client";

import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import type { NewTaskList, TaskList } from "@/db/schema/task-lists";
import {
	useCreateTaskList,
	useDeleteTaskList,
	useUpdateTaskList,
} from "@/hooks/mutations/use-task-list-mutation";
import { useAppStore } from "@/store/use-app-store";

//* Custom hook for task list actions (CRUD, refresh, edit modal)
//* Use mutation logic with toast notifications
export const useTaskListActions = () => {
	const router = useTransitionRouter();
	const { setEditTaskList } = useAppStore();

	const { mutateAsync: createTaskList, isPending: isCreating } =
		useCreateTaskList();
	const { mutateAsync: updateTaskList, isPending: isUpdating } =
		useUpdateTaskList();
	const { mutateAsync: deleteTaskList, isPending: isDeleting } =
		useDeleteTaskList();

	const handleCreate = async (list: NewTaskList) => {
		if (!list.title.trim()) return;

		try {
			await createTaskList(list);
		} catch {
			toast.error("Failed to create task list.");
		}
	};

	const handleUpdate = async (list: TaskList) => {
		try {
			await updateTaskList(list);
		} catch {
			toast.error("Failed to update task list.");
		}
	};

	const handleDelete = async (list: TaskList) => {
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

	const handleEdit = (list: TaskList) => {
		setEditTaskList(list);
	};

	return {
		loading: isCreating || isUpdating || isDeleting,
		handleCreate,
		handleUpdate,
		handleDelete,
		handleEdit,
	};
};
