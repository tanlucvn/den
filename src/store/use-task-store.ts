import type { SupabaseClient } from "@supabase/supabase-js";
import { create } from "zustand";
import type { NewTask, Task } from "@/lib/models";

interface TaskStore {
	tasks: Task[];
	isLoading: boolean;
	error: string | null;

	updatingIds: string[];
	setUpdating: (id: string, isUpdating: boolean) => void;

	fetchTasks: (supabase: SupabaseClient) => Promise<void>;
	createTask: (supabase: SupabaseClient, task: NewTask) => Promise<void>;
	updateTask: (supabase: SupabaseClient, task: Task) => Promise<void>;
	deleteTask: (supabase: SupabaseClient, id: string) => Promise<void>;

	batchUpdateTasks: (supabase: SupabaseClient, tasks: Task[]) => Promise<void>;

	setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
	tasks: [],
	isLoading: false,
	error: null,

	// * Track tasks being updated/deleted
	updatingIds: [],
	setUpdating: (id, isUpdating) => {
		set((state) => ({
			updatingIds: isUpdating
				? [...state.updatingIds, id]
				: state.updatingIds.filter((i) => i !== id),
		}));
	},

	// * Fetch tasks
	fetchTasks: async (supabase) => {
		try {
			set({ isLoading: true, error: null });

			const { data, error } = await supabase
				.from("tasks")
				.select("*")
				.order("updatedAt", { ascending: false });

			if (error) throw error;

			set({ tasks: data || [], isLoading: false });
		} catch (err) {
			set({
				error: err instanceof Error ? err.message : "Failed to fetch tasks",
				isLoading: false,
			});
		}
	},

	// * Create task
	createTask: async (supabase, task) => {
		try {
			const { data, error } = await supabase
				.from("tasks")
				.insert(task)
				.select()
				.single();

			if (error) throw error;

			if (data) {
				set((state) => ({
					tasks: [data, ...state.tasks],
				}));
			}
		} catch (err) {
			console.error("Failed to create task", err);
		}
	},

	// * Update task (optimistic with rollback)
	updateTask: async (supabase, task) => {
		const { tasks } = get();
		const prevTasks = [...tasks];

		get().setUpdating(task.id, true);

		try {
			// Optimistically update UI
			set((state) => ({
				tasks: state.tasks.map((t) =>
					t.id === task.id ? { ...t, ...task } : t,
				),
			}));

			const { data, error } = await supabase
				.from("tasks")
				.update(task)
				.eq("id", task.id)
				.select()
				.single();

			if (error) throw error;

			if (data) {
				set((state) => ({
					tasks: state.tasks.map((t) => (t.id === data.id ? data : t)),
				}));
			}
		} catch (err) {
			// Rollback UI
			set({ tasks: prevTasks });

			console.error("Failed to update task", err);
		} finally {
			get().setUpdating(task.id, false);
		}
	},

	// * Delete task (optimistic with rollback)
	deleteTask: async (supabase, id) => {
		const { tasks } = get();
		const prevTasks = [...tasks];

		get().setUpdating(id, true);

		try {
			// Optimistically remove
			set((state) => ({
				tasks: state.tasks.filter((t) => t.id !== id),
			}));

			const { error } = await supabase.from("tasks").delete().eq("id", id);

			if (error) throw error;
		} catch (err) {
			// Rollback UI
			set({ tasks: prevTasks });

			console.error("Failed to delete task", err);
		} finally {
			get().setUpdating(id, false);
		}
	},

	// * Batch update tasks (optimistic with rollback)
	batchUpdateTasks: async (supabase, updatedTasks) => {
		const { tasks: prevTasks } = get();

		try {
			// Optimistically update UI
			const updatedTaskMap = new Map(updatedTasks.map((t) => [t.id, t]));

			set((state) => ({
				tasks: state.tasks.map((task) =>
					updatedTaskMap.has(task.id)
						? { ...task, ...updatedTaskMap.get(task.id)! }
						: task,
				),
			}));

			// Send to Supabase
			const { error } = await supabase.from("tasks").upsert(updatedTasks, {
				onConflict: "id",
			});

			if (error) throw error;
		} catch (err) {
			console.error("Failed to batch update tasks", err);

			// Rollback UI
			set({ tasks: prevTasks });
		}
	},

	// * Manual set
	setTasks: (tasks) => set({ tasks }),
}));
