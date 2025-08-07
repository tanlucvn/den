"use client";

import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import type { NewTask, Task } from "@/db/schema/tasks";
import {
	useBatchUpdateTasks,
	useCreateTask,
	useDeleteTask,
	useUpdateTask,
	useUpdateTaskTags,
} from "@/hooks/mutations/use-task-mutation";
import { useSession } from "@/lib/auth-client";
import { useAppStore } from "@/store/use-app-store";

export const useTaskActions = () => {
	const { data: session } = useSession();
	const { setEditTask } = useAppStore();

	const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();
	const { mutateAsync: updateTaskTags, isPending: isUpdatingTags } =
		useUpdateTaskTags();
	const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();
	const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();
	const { mutateAsync: batchUpdateTasks, isPending: isBatching } =
		useBatchUpdateTasks();

	const handleCreate = async (task: NewTask) => {
		if (!task.title.trim()) return;

		try {
			await createTask(task);
		} catch {
			toast.error("Failed to create task.");
		}
	};

	const handleUpdate = async (task: Task) => {
		try {
			await updateTask(task);
		} catch {
			toast.error("Failed to update task.");
		}
	};

	const handleToggle = async (task: Task) => {
		try {
			await updateTask({ ...task, isCompleted: !task.isCompleted });
		} catch {
			toast.error("Failed to toggle completion.");
		}
	};

	const handleArchive = async (task: Task) => {
		try {
			await updateTask({ ...task, isArchived: !task.isArchived });
		} catch {
			toast.error("Failed to archive/unarchive task.");
		}
	};

	const handlePinToggle = async (task: Task) => {
		try {
			await updateTask({ ...task, isPinned: !task.isPinned });
		} catch {
			toast.error("Failed to update pin status.");
		}
	};

	const handleUpdateTags = async (taskId: string, tagIds: string[]) => {
		try {
			await updateTaskTags({ taskId, tagIds });
		} catch {
			toast.error("Failed to update tags.");
		}
	};

	const handleDelete = async (task: Task) => {
		try {
			await deleteTask(task);
		} catch {
			toast.error("Failed to delete task.");
		}
	};

	const handleClearCompleted = async (tasks: Task[]) => {
		const toDelete = tasks.filter((t) => t.isCompleted);
		await Promise.allSettled(toDelete.map((t) => deleteTask(t)));
	};

	const handleSort = async (tasks: Task[]) => {
		try {
			await batchUpdateTasks(tasks);
		} catch {
			toast.error("Failed to sort tasks.");
		}
	};

	const debouncedSort = useDebouncedCallback((tasks: Task[]) => {
		handleSort(tasks);
	}, 500);

	const handleDuplicate = async (task: NewTask) => {
		if (!session) return;

		try {
			await createTask({
				userId: session.user.id,
				listId: task.listId,
				title: task.title,
				note: task.note || "",
				location: task.location || "",
				isPinned: task.isPinned,
				isCompleted: task.isCompleted,
				remindAt: task.remindAt,
				priority: task.priority,
			});

			toast.success("Task duplicated!");
		} catch {
			toast.error("Failed to duplicate task.");
		}
	};

	const handleCopyToClipboard = async (task: Task) => {
		try {
			const content = `${task.title}\n${task.note ?? ""}`;
			await navigator.clipboard.writeText(content);
			toast.success("Task copied to clipboard!");
		} catch {
			toast.error("Failed to copy task.");
		}
	};

	const handleEdit = (task: Task) => {
		setEditTask(task);
	};

	return {
		loading:
			isCreating || isUpdatingTags || isUpdating || isDeleting || isBatching,
		handleCreate,
		handleUpdate,
		handleToggle,
		handleArchive,
		handlePinToggle,
		handleUpdateTags,
		handleDelete,
		handleClearCompleted,
		handleSort,
		debouncedSort,
		handleDuplicate,
		handleCopyToClipboard,
		handleEdit,
	};
};
