"use client";

import { useEffect, useRef } from "react";
import { useTaskStore } from "@/store/use-task-store";

export function AppInitializer() {
	const { fetchTasks } = useTaskStore();
	const fetchedRef = useRef(false);

	useEffect(() => {
		if (!fetchedRef.current) {
			fetchedRef.current = true;
			fetchTasks();
		}
	}, [fetchTasks]);

	return null;
}
