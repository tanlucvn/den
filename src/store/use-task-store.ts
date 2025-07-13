import axios from "axios";
import { create } from "zustand";
import type { NewTask, Task } from "@/db/schema/tasks";

interface TaskStore {
	tasks: Task[];
	isLoading: boolean;
	error: string | null;

	updatingIds: string[];
	setUpdating: (id: string, isUpdating: boolean) => void;

	fetchTasks: () => Promise<void>;
	createTask: (task: NewTask) => Promise<void>;
	updateTask: (task: Task) => Promise<void>;
	deleteTask: (id: string) => Promise<void>;
	batchUpdateTasks: (tasks: Task[]) => Promise<void>;

	setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
	tasks: [],
	isLoading: false,
	error: null,

	updatingIds: [],
	setUpdating: (id, isUpdating) => {
		set((state) => ({
			updatingIds: isUpdating
				? [...state.updatingIds, id]
				: state.updatingIds.filter((i) => i !== id),
		}));
	},

	// * Fetch tasks
	fetchTasks: async () => {
		try {
			set({ isLoading: true, error: null });
			const res = await axios.get<Task[]>("/api/tasks");
			set({ tasks: res.data, isLoading: false });
		} catch (err: any) {
			set({
				error: err.response?.data?.error || "Failed to fetch tasks",
				isLoading: false,
			});
		}
	},

	// * Create task
	createTask: async (task) => {
		try {
			const res = await axios.post<Task>("/api/tasks", task);
			set((state) => ({
				tasks: [res.data, ...state.tasks],
			}));
		} catch (err) {
			console.error("Failed to create task", err);
		}
	},

	// * Update task (optimistic with rollback)
	updateTask: async (task) => {
		const { tasks } = get();
		const prevTasks = [...tasks];

		get().setUpdating(task.id, true);

		try {
			set((state) => ({
				tasks: state.tasks.map((t) =>
					t.id === task.id ? { ...t, ...task } : t,
				),
			}));

			const res = await axios.put<Task>(`/api/tasks/${task.id}`, task);

			set((state) => ({
				tasks: state.tasks.map((t) => (t.id === res.data.id ? res.data : t)),
			}));
		} catch (err) {
			console.error("Failed to update task", err);
			set({ tasks: prevTasks });
		} finally {
			get().setUpdating(task.id, false);
		}
	},

	// * Delete task (optimistic with rollback)
	deleteTask: async (id) => {
		const { tasks } = get();
		const prevTasks = [...tasks];

		get().setUpdating(id, true);

		try {
			set((state) => ({
				tasks: state.tasks.filter((t) => t.id !== id),
			}));

			await axios.delete(`/api/tasks/${id}`);
		} catch (err) {
			console.error("Failed to delete task", err);
			set({ tasks: prevTasks });
		} finally {
			get().setUpdating(id, false);
		}
	},

	// * Batch update
	batchUpdateTasks: async (updatedTasks) => {
		const { tasks: prevTasks } = get();

		try {
			const updatedMap = new Map(updatedTasks.map((t) => [t.id, t]));

			set((state) => ({
				tasks: state.tasks.map((t) =>
					updatedMap.has(t.id) ? { ...t, ...updatedMap.get(t.id)! } : t,
				),
			}));

			await axios.put("/api/tasks/batch", updatedTasks);
		} catch (err) {
			console.error("Failed to batch update", err);
			set({ tasks: prevTasks });
		}
	},

	setTasks: (tasks) => set({ tasks }),
}));
