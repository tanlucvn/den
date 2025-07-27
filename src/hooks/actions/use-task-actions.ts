"use client";

import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import type { NewTask, Task } from "@/db/schema/tasks";

import { useSession } from "@/lib/auth-client";
import { useAppStore } from "@/store/use-app-store";
import {
	useBatchUpdateTasks,
	useCreateTask,
	useDeleteTask,
	useUpdateTask,
	useUpdateTaskTags,
} from "../mutations/use-task-mutation";

//* Custom hook for task-related actions (CRUD, tags, archive, etc.)
//* Use mutation logic with toast notifications
export const useTaskActions = () => {
	const { data: session } = useSession();
	const { setEditTask } = useAppStore();

	// Task mutation hooks
	const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();
	const { mutateAsync: updateTaskTags, isPending: isUpdatingTags } =
		useUpdateTaskTags();
	const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();
	const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();
	const { mutateAsync: batchUpdateTasks, isPending: isBatching } =
		useBatchUpdateTasks();

	const handleCreate = async (task: NewTask) => {
		if (!task.title.trim()) return;

		const promise = createTask(task);
		toast.promise(promise, {
			loading: "Creating task...",
			success: "Task created!",
			error: "Failed to create task.",
		});
		await promise;
	};

	const handleToggle = async (task: Task) => {
		const updated = { ...task, isCompleted: !task.isCompleted };
		await updateTask(updated);
	};

	const handleArchive = async (task: Task) => {
		const updated = { ...task, isArchived: !task.isArchived };
		const promise = updateTask(updated);

		toast.promise(promise, {
			loading: task.isArchived ? "Unarchiving task..." : "Archiving task...",
			success: task.isArchived ? "Task unarchived!" : "Task archived!",
			error: "Failed to update task archive status.",
		});

		await promise;
	};

	const handleUpdateTags = async (taskId: string, tagIds: string[]) => {
		const promise = updateTaskTags({ taskId, tagIds });
		toast.promise(promise, {
			loading: "Updating tags...",
			success: "Tags updated!",
			error: "Failed to update tags.",
		});
		await promise;
	};

	const handleUpdate = async (task: Task) => {
		const promise = updateTask(task);
		toast.promise(promise, {
			loading: "Updating task...",
			success: "Task updated!",
			error: "Failed to update task.",
		});
		await promise;
	};

	const handleDelete = async (task: Task) => {
		const promise = deleteTask(task);
		toast.promise(promise, {
			loading: "Deleting task...",
			success: "Task deleted!",
			error: "Failed to delete task.",
		});
		await promise;
	};

	const handleClearCompleted = async (tasks: Task[]) => {
		const toDelete = tasks.filter((t) => t.isCompleted);
		await Promise.all(toDelete.map((t) => deleteTask(t)));
	};

	const handleSort = async (tasks: Task[]) => {
		await batchUpdateTasks(tasks);
	};

	const debouncedSort = useDebouncedCallback((tasks: Task[]) => {
		handleSort(tasks);
	}, 500);

	const handleDuplicate = async (task: NewTask) => {
		if (!session) return;

		const duplicatedTask: NewTask = {
			userId: session.user.id,
			listId: task.listId,
			title: task.title,
			note: task.note || "",
			location: task.location || "",
			isPinned: task.isPinned,
			isCompleted: task.isCompleted,
			remindAt: task.remindAt,
			priority: task.priority,
		};

		await handleCreate(duplicatedTask);
		toast.success("Task duplicated!");
	};

	const handleCopyToClipboard = async (task: Task) => {
		const content = `${task.title}\n${task.note ?? ""}`;
		await navigator.clipboard.writeText(content);
		toast.success("Task copied to clipboard!");
	};

	const handleEdit = (task: Task) => {
		setEditTask(task);
	};

	const handlePinToggle = (task: Task) => {
		const promise = updateTask({ ...task, isPinned: !task.isPinned });
		toast.promise(promise, {
			loading: task.isPinned ? "Unpinning task..." : "Pinning task...",
			success: task.isPinned ? "Task unpinned!" : "Task pinned!",
			error: "Failed to update pin status.",
		});
	};

	return {
		loading:
			isCreating || isUpdatingTags || isUpdating || isDeleting || isBatching,

		handleCreate,
		handleToggle,
		handleArchive,
		handleUpdateTags,
		handleUpdate,
		handleDelete,
		handleClearCompleted,
		handleSort,
		handleDuplicate,
		handleCopyToClipboard,
		handleEdit,
		handlePinToggle,
		debouncedSort,
	};
};
