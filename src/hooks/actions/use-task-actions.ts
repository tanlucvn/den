"use client";

import { toast } from "sonner";
import type { NewTask, Task, TaskWithTagsAndList } from "@/db/schema/tasks";
import {
	useCreateTask,
	useDeleteTask,
	useUpdateTask,
} from "@/hooks/mutations/use-task-mutation";
import { useSession } from "@/lib/auth-client";

export const useTaskActions = () => {
	const { data: session } = useSession();

	const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();
	const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();
	const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();

	const handleCreate = async (task: NewTask) => {
		if (!task.title.trim()) return;

		try {
			await createTask({ ...task, updatedAt: new Date() });
		} catch {
			toast.error("Failed to create task.");
		}
	};

	const handleUpdate = async (task: Task) => {
		try {
			await updateTask({ ...task, updatedAt: new Date() });
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

	const handleUpdateTags = async (
		task: TaskWithTagsAndList,
		tagIds: string[],
	) => {
		try {
			const payload = {
				...task,
				tagIds,
			};

			await updateTask({ ...payload, updatedAt: new Date() });
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

	return {
		loading: isCreating || isUpdating || isDeleting,
		handleCreate,
		handleUpdate,
		handleToggle,
		handleArchive,
		handlePinToggle,
		handleUpdateTags,
		handleDelete,
		handleDuplicate,
		handleCopyToClipboard,
	};
};
