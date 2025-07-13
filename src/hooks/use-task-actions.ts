"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { NewTask, Task } from "@/db/schema/tasks";
import { useSession } from "@/lib/auth-client";
import { useAppStore } from "@/store/use-app-store";
import { useDialogStore } from "@/store/use-dialog-store";
import { useTaskStore } from "@/store/use-task-store";

export const useTaskActions = () => {
	const router = useRouter();
	const { data } = useSession();

	const { setEditTask } = useAppStore();
	const { setIsEditTaskOpen } = useDialogStore();
	const { createTask, updateTask, deleteTask, fetchTasks, batchUpdateTasks } =
		useTaskStore();

	const onCreate = async (task: NewTask) => {
		if (!task.title.trim()) return;

		const promise = createTask(task);
		await promise;
	};

	const onToggle = async (task: Task) => {
		const updated = { ...task, isCompleted: !task.isCompleted };
		const promise = updateTask(updated);

		await promise;
	};

	const onArchive = async (task: Task) => {
		const updated = { ...task, isArchived: !task.isArchived };

		const promise = updateTask(updated);
		toast.promise(promise, {
			loading: task.isArchived ? "Unarchiving task..." : "Archiving task...",
			success: task.isArchived ? "Task unarchived!" : "Task archived!",
			error: "Failed to update task archive status.",
		});

		await promise;
	};

	const onUpdate = async (task: Task) => {
		const promise = updateTask(task);
		await promise;
	};

	const onDelete = async (id: string) => {
		const promise = deleteTask(id);
		toast.promise(promise, {
			loading: "Deleting task...",
			success: "Task deleted!",
			error: "Failed to delete task.",
		});
		await promise;

		// ? Optional: redirect if you're on the deleted task page
		if (router && window.location.pathname.includes(`/tasks/${id}`)) {
			router.push("/");
		}
	};

	const onClearCompleted = async (tasks: Task[]) => {
		const toDelete = tasks.filter((t) => t.isCompleted);
		await Promise.all(toDelete.map((t) => deleteTask(t.id)));
	};

	const onSort = async (tasks: Task[]) => {
		return batchUpdateTasks(tasks);
	};

	const onDuplicate = async (task: NewTask) => {
		if (!data) return;

		const duplicatedTask: NewTask = {
			userId: data.user.id,
			title: task.title,
			note: task.note || "",
			location: task.location || "",
			isPinned: task.isPinned,
			isCompleted: task.isCompleted,
			remindAt: task.remindAt,
			priority: task.priority,
		};

		await onCreate(duplicatedTask);
		toast.success("Task duplicated!");
	};

	const onCopyToClipboard = async (task: Task) => {
		const content = `${task.title}\n${task.note ?? ""}`;
		await navigator.clipboard.writeText(content);
		toast.success("Task copied to clipboard!");
	};

	const onRefresh = async () => {
		await fetchTasks();
	};

	const handleEdit = (task: Task) => {
		setEditTask(task);
		setIsEditTaskOpen(true);
	};

	const handlePinToggle = (task: Task) => {
		onUpdate({ ...task, isPinned: !task.isPinned });
	};

	const handleDelete = (task: Task) => {
		onDelete(task.id);
	};

	return {
		onCreate,
		onToggle,
		onArchive,
		onUpdate,
		onDelete,
		onClearCompleted,
		onSort,
		onDuplicate,
		onCopyToClipboard,
		onRefresh,
		handleEdit,
		handlePinToggle,
		handleDelete,
	};
};
