"use client";

import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { NewTaskList, TaskList } from "@/db/schema/task-lists";
import {
	useCreateTaskList,
	useDeleteTaskList,
	useTaskLists,
	useUpdateTaskList,
} from "@/hooks/use-task-lists";
import { useAppStore } from "@/store/use-app-store";

export const useTaskListActions = () => {
	const router = useRouter();
	const pathname = usePathname();

	const { setEditTaskList } = useAppStore();

	const { mutateAsync: createTaskList } = useCreateTaskList();
	const { mutateAsync: updateTaskList } = useUpdateTaskList();
	const { mutateAsync: deleteTaskList } = useDeleteTaskList();
	const { refetch: fetchTaskLists } = useTaskLists();

	const onSelect = (taskList: TaskList) => {
		if (pathname !== `/tasks/${taskList.id}`) {
			router.push(`/tasks/${taskList.id}`);
		}
	};

	const onCreate = async (list: NewTaskList) => {
		if (!list.title.trim()) return;

		const promise = createTaskList(list);
		await promise;
		toast.success("Task list created!");
	};

	const onUpdate = async (list: TaskList) => {
		const promise = updateTaskList(list);
		await promise;
		toast.success("Task list updated!");
	};

	const onDelete = async (id: string) => {
		const promise = deleteTaskList(id);
		toast.promise(promise, {
			loading: "Deleting task list...",
			success: "Task list deleted!",
			error: "Failed to delete task list.",
		});
		await promise;

		if (router && window.location.pathname.includes(`/task-lists/${id}`)) {
			router.push("/");
		}
	};

	const onRefresh = async () => {
		await fetchTaskLists();
	};

	const handleEdit = (list: TaskList) => {
		setEditTaskList(list);
	};

	return {
		onSelect,
		onCreate,
		onUpdate,
		onDelete,
		onRefresh,
		handleEdit,
	};
};
