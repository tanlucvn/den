import type { SupabaseClient } from "@supabase/supabase-js";
import { create } from "zustand";
import type { NewTodo, Todo } from "@/lib/models";

// Store type
interface TodoStore {
	todos: Todo[];
	isLoading: boolean;
	error: string | null;

	updatingIds: number[];
	setUpdating: (id: number, isUpdating: boolean) => void;

	fetchTodos: (supabase: SupabaseClient) => Promise<void>;
	createTodo: (supabase: SupabaseClient, todo: NewTodo) => Promise<void>;
	updateTodo: (supabase: SupabaseClient, todo: Todo) => Promise<void>;
	deleteTodo: (supabase: SupabaseClient, id: number) => Promise<void>;

	setTodos: (todos: Todo[]) => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
	todos: [],
	isLoading: false,
	error: null,

	// * Track todos being updated/deleted
	updatingIds: [],
	setUpdating: (id, isUpdating) => {
		set((state) => ({
			updatingIds: isUpdating
				? [...state.updatingIds, id]
				: state.updatingIds.filter((i) => i !== id),
		}));
	},

	// * Fetch todos
	fetchTodos: async (supabase) => {
		try {
			set({ isLoading: true, error: null });

			const { data, error } = await supabase
				.from("todos")
				.select("*")
				.order("updatedAt", { ascending: false });

			if (error) throw error;

			set({ todos: data || [], isLoading: false });
		} catch (err) {
			set({
				error: err instanceof Error ? err.message : "Failed to fetch todos",
				isLoading: false,
			});
		}
	},

	// * Create todo
	createTodo: async (supabase, todo) => {
		try {
			const { data, error } = await supabase
				.from("todos")
				.insert(todo)
				.select()
				.single();

			if (error) throw error;

			if (data) {
				set((state) => ({
					todos: [data, ...state.todos],
				}));
			}
		} catch (err) {
			console.error("Failed to create todo", err);
		}
	},

	// * Update todo (optimistic with rollback)
	updateTodo: async (supabase, todo) => {
		const { todos } = get();
		const prevTodos = [...todos];

		get().setUpdating(todo.id, true);

		try {
			// Optimistically update UI
			set((state) => ({
				todos: state.todos.map((t) =>
					t.id === todo.id ? { ...t, ...todo } : t,
				),
			}));

			const { data, error } = await supabase
				.from("todos")
				.update(todo)
				.eq("id", todo.id)
				.select()
				.single();

			if (error) throw error;

			if (data) {
				set((state) => ({
					todos: state.todos.map((t) => (t.id === data.id ? data : t)),
				}));
			}
		} catch (err) {
			// Rollback UI
			set({ todos: prevTodos });

			console.error("Failed to update todo", err);
		} finally {
			get().setUpdating(todo.id, false);
		}
	},

	// * Delete todo (optimistic with rollback)
	deleteTodo: async (supabase, id) => {
		const { todos } = get();
		const prevTodos = [...todos];

		get().setUpdating(id, true);

		try {
			// Optimistically remove
			set((state) => ({
				todos: state.todos.filter((t) => t.id !== id),
			}));

			const { error } = await supabase.from("todos").delete().eq("id", id);

			if (error) throw error;
		} catch (err) {
			// Rollback UI
			set({ todos: prevTodos });

			console.error("Failed to delete todo", err);
		} finally {
			get().setUpdating(id, false);
		}
	},

	// * Manual set
	setTodos: (todos) => set({ todos }),
}));
