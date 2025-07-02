import type { SupabaseClient } from "@supabase/supabase-js";
import { create } from "zustand";
import type { NewTodo, Todo } from "@/lib/models";

interface TodoStore {
	todos: Todo[];
	isLoading: boolean;
	error: string | null;

	fetchTodos: (supabase: SupabaseClient) => Promise<void>;
	createTodo: (supabase: SupabaseClient, todo: NewTodo) => Promise<void>;
	updateTodo: (supabase: SupabaseClient, todo: Todo) => Promise<void>;
	deleteTodo: (supabase: SupabaseClient, id: number) => Promise<void>;

	setTodos: (todos: Todo[]) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
	todos: [],
	isLoading: false,
	error: null,

	// Fetch all todos
	fetchTodos: async (supabase) => {
		try {
			set({ isLoading: true, error: null });

			const { data, error } = await supabase
				.from("todos")
				.select("*")
				.order("updated_at", { ascending: false });

			if (error) throw error;

			set({ todos: data || [], isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "Failed to fetch todos",
				isLoading: false,
			});
		}
	},

	// Create a new todo
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
		} catch (error) {
			console.error("Failed to create todo:", error);
		}
	},

	// Update an existing todo
	updateTodo: async (supabase, todo) => {
		try {
			const { data, error } = await supabase
				.from("todos")
				.update({ ...todo })
				.eq("id", todo.id)
				.select()
				.single();

			if (error) throw error;

			if (data) {
				set((state) => ({
					todos: state.todos.map((t) => (t.id === data.id ? data : t)),
				}));
			}
		} catch (error) {
			console.error("Failed to update todo:", error);
		}
	},

	// Delete a todo
	deleteTodo: async (supabase, id) => {
		try {
			const { error } = await supabase.from("todos").delete().eq("id", id);
			if (error) throw error;

			set((state) => ({
				todos: state.todos.filter((t) => t.id !== id),
			}));
		} catch (error) {
			console.error("Failed to delete todo:", error);
		}
	},

	// Set todos manually
	setTodos: (todos) => set({ todos }),
}));
