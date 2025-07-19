"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
import { useTaskLists } from "@/hooks/use-task-lists";
import { useTasksByListId } from "@/hooks/use-tasks";
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
		<div className="flex size-full flex-col gap-2 rounded-2xl border border-dashed p-1 shadow-xs">
			<Breadcrumb className="p-2">
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
						<BreadcrumbPage>{currentList?.title ?? "Untitled"}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<GroupedTaskSection
				iconName="Folder"
				title={currentList?.title ?? "Untitled"}
				tasks={tasks}
				isLoading={isLoading}
				isFetched={isFetched}
				listId={id}
			/>
		</div>
	);
}
