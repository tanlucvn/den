"use client";

import { useParams } from "next/navigation";
import TaskListControlsDropdown from "@/components/features/task-list/task-list-controls-dropdown";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { TaskList } from "@/db/schema/task-lists";
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchStore } from "@/store/use-search-store";
import NavBreadcrumb from "./header-nav-breadcrumb";
import HeaderNavSearch from "./header-nav-search";

interface HeaderNavProps {
	taskList: TaskList;
}

export default function HeaderNav({ taskList }: HeaderNavProps) {
	const { id } = useParams() as { id: string };
	const isMobile = useIsMobile();

	const { isSearchOpen } = useSearchStore();

	const { data: tasks = [] } = useTasks();
	const { data: taskLists = [] } = useTaskLists();
	const currentList = taskLists.find((list) => list.id === id);

	return (
		<div className="flex h-8 w-full items-center justify-between">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-1 size-8" />

				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				{(!isSearchOpen || !isMobile) && (
					<NavBreadcrumb
						tasks={tasks}
						taskLists={taskLists}
						currentList={currentList}
					/>
				)}
			</div>

			<div className="flex items-center gap-2">
				<HeaderNavSearch />

				{(!isSearchOpen || !isMobile) && (
					<TaskListControlsDropdown taskList={taskList}>
						<Button variant="outline" size="icon">
							<IconRenderer name="EllipsisVertical" />
						</Button>
					</TaskListControlsDropdown>
				)}
			</div>
		</div>
	);
}
