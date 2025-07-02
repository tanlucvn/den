"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { NewTodo, Todo } from "@/lib/models";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useTodoStore } from "@/store/use-todo-store";

export const useTodoActions = () => {
	const router = useRouter();
	const { supabase, isLoaded } = useSupabase();
	const { createTodo, updateTodo, deleteTodo, fetchTodos } = useTodoStore();

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

	const onCreate = async (todo: NewTodo) => {
		if (!todo.title.trim()) return;

		const promise = createTodo(supabase, todo);
		/* toast.promise(promise, {
			loading: "Creating todo...",
			success: "Todo created!",
			error: "Failed to create todo.",
		}); */

		await promise;
	};

	const onToggle = async (todo: Todo) => {
		const updated = { ...todo, isCompleted: !todo.isCompleted };
		const promise = updateTodo(supabase, updated);

		await promise;
	};

	const onUpdate = async (todo: Todo) => {
		const promise = updateTodo(supabase, todo);
		/* toast.promise(promise, {
			loading: "Updating todo...",
			success: "Todo updated!",
			error: "Failed to update todo.",
		}); */
		await promise;
	};

	const onDelete = async (id: number) => {
		const promise = deleteTodo(supabase, id);
		toast.promise(promise, {
			loading: "Deleting todo...",
			success: "Todo deleted!",
			error: "Failed to delete todo.",
		});
		await promise;

		// Optional: redirect if you're on the deleted todo page
		if (
			typeof window !== "undefined" &&
			window.location.pathname === `/todos/${id}`
		) {
			router.push("/");
		}
	};

	const onRefresh = async () => {
		await fetchTodos(supabase);
	};

	return {
		onCreate,
		onToggle,
		onUpdate,
		onDelete,
		onRefresh,
	};
};
