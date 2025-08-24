"use client";

import { useParams } from "next/navigation";
import { Link } from "next-view-transitions";
import { IconRenderer } from "@/components/icon-renderer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { EmptyState } from "@/components/ui/empty-state";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { TaskList } from "@/db/schema/task-lists";
import type { Task } from "@/db/schema/tasks";
import {
	type ColorId,
	ENTITY_ICONS,
	TEXT_COLOR_CLASSES,
} from "@/lib/constants";
import { filterByLists } from "@/lib/helpers/tasks-filter-by";
import { cn } from "@/lib/utils";

interface HeaderNavBreadcrumbProps {
	taskLists: TaskList[];
	tasks: Task[];
	currentList?: TaskList;
}

export default function HeaderNavBreadcrumb({
	taskLists,
	tasks,
	currentList,
}: HeaderNavBreadcrumbProps) {
	const { id } = useParams() as { id: string };

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/lists" className="w-full">
							Lists
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				<BreadcrumbSeparator />

				<BreadcrumbItem>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="max-w-24 overflow-hidden font-normal text-foreground"
							>
								<IconRenderer
									name={currentList?.icon || ENTITY_ICONS.taskList}
									className={cn(
										"size-4",
										TEXT_COLOR_CLASSES[currentList?.color as ColorId] ??
											"text-muted-foreground",
									)}
								/>
								<span className="truncate">{currentList?.title}</span>
							</Button>
						</PopoverTrigger>

						<PopoverContent className="w-54 p-0">
							<Command>
								<CommandInput placeholder="Search lists..." />
								<CommandList>
									<CommandEmpty className="p-0">
										<EmptyState
											icon="SearchX"
											title="No lists found"
											description="Try another keyword."
										/>
									</CommandEmpty>
									<CommandGroup className="max-h-[200px] overflow-y-auto">
										{taskLists.map((list) => (
											<CommandItem key={list.id} asChild>
												<Link
													href={`/lists/${list.id}`}
													className={cn(
														"flex w-full items-center justify-between rounded-sm px-2 py-1",
														list.id === id && "bg-accent",
													)}
												>
													<div className="flex items-center gap-2 overflow-hidden">
														<IconRenderer
															name={list?.icon || ENTITY_ICONS.taskList}
															className={cn(
																"size-4",
																TEXT_COLOR_CLASSES[list?.color as ColorId] ??
																	"text-muted-foreground",
															)}
														/>
														<span className="truncate">{list.title}</span>
													</div>

													<span className="text-muted-foreground text-xs">
														{filterByLists(tasks, list.id).length}
													</span>
												</Link>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
