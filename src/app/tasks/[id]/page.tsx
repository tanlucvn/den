"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AppQuickActions } from "@/components/common/app-quick-actions";
import GroupedTaskSection from "@/components/features/task/grouped-task-section";
import { IconRenderer } from "@/components/icon-renderer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTaskLists } from "@/hooks/mutations/use-task-list-mutation";
import { useTasksByListId } from "@/hooks/mutations/use-task-mutation";
import { cn } from "@/lib/utils";

export default function TaskListPage() {
	const { id } = useParams() as { id: string };

	const { data: taskLists = [], isFetched: listFetched } = useTaskLists();
	const currentList = taskLists.find((list) => list.id === id);

	const { data: tasks = [], isLoading, isFetched } = useTasksByListId(id);

	if (!currentList && listFetched && isFetched) {
		return (
			<p className="text-center text-muted-foreground text-sm">
				Task list not found.
			</p>
		);
	}

	return (
		<div className="flex flex-col px-4">
			<div className="flex h-16 items-center gap-2">
				<SidebarTrigger className="-ml-1" />

				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link href="/tasks" className="w-full">
									Home
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 text-muted-foreground text-sm hover:text-foreground">
									<IconRenderer name="Signpost" />
									Task Lists
								</DropdownMenuTrigger>

								<DropdownMenuContent
									align="start"
									className="min-w-44 space-y-0.5"
								>
									{taskLists.map((list) => (
										<DropdownMenuItem
											key={list.id}
											asChild
											className={cn(
												"w-full",
												list.id === id && "bg-accent text-foreground",
											)}
										>
											<Link
												href={`/tasks/${list.id}`}
												className="flex w-full items-center gap-2"
											>
												<IconRenderer name="List" className="text-primary/60" />
												<span className="truncate">
													{list.title || "Untitled"}
												</span>
											</Link>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>
								{currentList?.title ?? "Untitled"}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className="sticky top-2 z-10 mb-6 w-full rounded-full bg-background">
				<AppQuickActions />
			</div>

			<div className="mb-4 flex size-full flex-col gap-2 rounded-2xl border border-dashed p-1 shadow-xs">
				<GroupedTaskSection
					iconName="Folder"
					title={currentList?.title ?? "Untitled"}
					tasks={tasks}
					isLoading={isLoading}
					isFetched={isFetched}
					listId={id}
				/>
			</div>
		</div>
	);
}
