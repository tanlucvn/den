"use client";

import AllLists from "@/components/features/lists/all-lists";
import AppLayout from "@/components/layouts/app-layout";
import Aside from "@/components/layouts/asides/lists/aside";
import Header from "@/components/layouts/headers/lists/header";
import { useLists } from "@/hooks/mutations/use-list-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";

export default function ListsPage() {
	const { data: allTaskLists = [], isLoading } = useLists();
	const { data: allTasks = [] } = useTasks();

	return (
		<AppLayout
			header={<Header />}
			aside={<Aside lists={allTaskLists} tasks={allTasks} />}
		>
			<AllLists
				title="All Lists"
				description="Organize and track your tasks across multiple lists."
				lists={allTaskLists}
				tasks={allTasks}
				isLoading={isLoading}
			/>
		</AppLayout>
	);
}
