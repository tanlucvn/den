"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { NewTask, Task } from "@/lib/models";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useAppStore } from "@/store/use-app-store";
import { useDialogStore } from "@/store/use-dialog-store";
import { useTaskStore } from "@/store/use-task-store";

export const useTaskActions = () => {
	const router = useRouter();
	const { user } = useUser();
	const { supabase, isLoaded } = useSupabase();

	const { setEditTask } = useAppStore();
	const { setIsEditTaskOpen } = useDialogStore();
	const { createTask, updateTask, deleteTask, fetchTasks, batchUpdateTasks } =
		useTaskStore();

	// ! Guard: avoid calling APIs before client is ready
	if (!supabase || !isLoaded) {
		return {
			onCreate: async () => {},
			onToggle: async () => {},
			onUpdate: async () => {},
			onDelete: async () => {},
			onSort: async () => {},
			onDuplicate: async () => {},
			onCopyToClipboard: async () => {},
			onRefresh: async () => {},
			handleEdit: () => {},
			handlePinToggle: () => {},
			handleDelete: () => {},
		};
	}

	const onCreate = async (task: NewTask) => {
		if (!task.title.trim()) return;

		const promise = createTask(supabase, task);
		await promise;
	};

	const onToggle = async (task: Task) => {
		const updated = { ...task, isCompleted: !task.isCompleted };
		const promise = updateTask(supabase, updated);

		await promise;
	};

	const onUpdate = async (task: Task) => {
		const promise = updateTask(supabase, task);
		await promise;
	};

	const onDelete = async (id: string) => {
		const promise = deleteTask(supabase, id);
		toast.promise(promise, {
			loading: "Deleting task...",
			success: "Task deleted!",
			error: "Failed to delete task.",
		});
		await promise;

		// Optional: redirect if you're on the deleted task page
		if (
			typeof window !== "undefined" &&
			window.location.pathname === `/tasks/${id}`
		) {
			router.push("/");
		}
	};

	const onSort = async (tasks: Task[]) => {
		return batchUpdateTasks(supabase, tasks);
	};

	const onDuplicate = async (task: NewTask) => {
		if (!user) return;

		const duplicatedTask: NewTask = {
			userId: user.id,
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
		await fetchTasks(supabase);
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
		onUpdate,
		onDelete,
		onSort,
		onDuplicate,
		onCopyToClipboard,
		onRefresh,
		handleEdit,
		handlePinToggle,
		handleDelete,
	};
};
