"use client";

import AllTasks from "@/components/features/tasks/all-tasks";
import AppLayout from "@/components/layouts/app-layout";
import TaskAside from "@/components/layouts/asides/tasks/task-aside";
import Header from "@/components/layouts/headers/tasks/header";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function TasksPage() {
	const { data: allTasks = [], isLoading } = useTasks();

	return (
		<AppLayout
			header={<Header />}
			headersNumber={2}
			aside={<TaskAside tasks={allTasks} isLoading={isLoading} />}
		>
			<AllTasks
				title="All Tasks"
				description="Keep track of everything in one place."
				tasks={allTasks}
				isLoading={isLoading}
			/>
		</AppLayout>
	);
}
