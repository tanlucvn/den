"use client";

import { useParams } from "next/navigation";
import ListDropdownMenu from "@/components/features/lists/list-dropdown-menu";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { List } from "@/db/schema/lists";
import { useLists } from "@/hooks/mutations/use-list-mutation";
import { useTasks } from "@/hooks/mutations/use-task-mutation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchStore } from "@/store/use-search-store";
import NavBreadcrumb from "./header-nav-breadcrumb";
import HeaderNavSearch from "./header-nav-search";

interface HeaderNavProps {
	list: List;
}

export default function HeaderNav({ list: taskList }: HeaderNavProps) {
	const { id } = useParams() as { id: string };
	const isMobile = useIsMobile();

	const { isSearchOpen } = useSearchStore();

	const { data: tasks = [] } = useTasks();
	const { data: taskLists = [] } = useLists();
	const currentList = taskLists.find((list) => list.id === id);

	return (
		<div className="flex h-12 w-full items-center justify-between border-b p-2">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="size-8" />

				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				{(!isSearchOpen || !isMobile) && (
					<NavBreadcrumb
						tasks={tasks}
						lists={taskLists}
						currentList={currentList}
					/>
				)}
			</div>

			<div className="flex items-center gap-2">
				<HeaderNavSearch />

				{(!isSearchOpen || !isMobile) && (
					<ListDropdownMenu list={taskList}>
						<Button variant="outline" size="icon">
							<IconRenderer name="EllipsisVertical" />
						</Button>
					</ListDropdownMenu>
				)}
			</div>
		</div>
	);
}
