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

	// Task list mutation hooks
	const { mutateAsync: createTaskList, isPending: isCreating } =
		useCreateTaskList();
	const { mutateAsync: updateTaskList, isPending: isUpdating } =
		useUpdateTaskList();
	const { mutateAsync: deleteTaskList, isPending: isDeleting } =
		useDeleteTaskList();

	const handleCreate = async (list: NewTaskList) => {
		if (!list.title.trim()) return;

		const promise = createTaskList(list);
		toast.promise(promise, {
			loading: "Creating task list...",
			success: "Task list created!",
			error: "Failed to create task list.",
		});
		await promise;
	};

	const handleUpdate = async (list: TaskList) => {
		const promise = updateTaskList(list);
		toast.promise(promise, {
			loading: "Updating task list...",
			success: "Task list updated!",
			error: "Failed to update task list.",
		});
		await promise;
	};

	const handleDelete = async (list: TaskList) => {
		const promise = deleteTaskList(list);
		toast.promise(promise, {
			loading: "Deleting task list...",
			success: "Task list deleted!",
			error: "Failed to delete task list.",
		});
		await promise;

		// Redirect if user is on the deleted list page
		if (window.location.pathname.includes(`/task-lists/${list.id}`)) {
			router.push("/");
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
