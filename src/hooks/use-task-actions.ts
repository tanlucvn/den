"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { NewTask, Task } from "@/lib/models";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useTaskStore } from "@/store/use-task-store";

export const useTaskActions = () => {
	const router = useRouter();
	const { supabase, isLoaded } = useSupabase();
	const { createTask, updateTask, deleteTask, fetchTasks } = useTaskStore();

	// ! Guard: avoid calling APIs before client is ready
	if (!supabase || !isLoaded) {
		return {
			onCreate: async () => {},
			onToggle: async () => {},
			onUpdate: async () => {},
			onDelete: async () => {},
			onRefresh: async () => {},
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

	const onDelete = async (id: number) => {
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

	const onRefresh = async () => {
		await fetchTasks(supabase);
	};

	return {
		onCreate,
		onToggle,
		onUpdate,
		onDelete,
		onRefresh,
	};
};
