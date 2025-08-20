import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
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
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { ALL_STATUS, STATUS_COLORS, type StatusId } from "@/lib/constants";

interface TaskStatusSelectorProps {
	task: TaskWithTagsAndList;
}

export function TaskStatusSelector({ task }: TaskStatusSelectorProps) {
	const { handleUpdate } = useTaskActions();
	const [open, setOpen] = useState(false);

	const handleStatusChange = (statusId: StatusId) => {
		handleUpdate({ ...task, status: statusId });
		setOpen(false);
	};

	const currentStatus = ALL_STATUS.find((s) => s.id === task.status);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon">
					{currentStatus && (
						<IconRenderer
							name={currentStatus.icon}
							className={STATUS_COLORS[currentStatus.id]}
						/>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-54 p-0">
				<Command>
					<CommandInput placeholder="Set status..." />
					<CommandList>
						<CommandEmpty className="p-0">
							<EmptyState
								icon="SearchX"
								title="No status found"
								description="Try another keyword."
							/>
						</CommandEmpty>
						<CommandGroup>
							{ALL_STATUS.map((item) => (
								<CommandItem
									key={item.id}
									value={item.id}
									onSelect={() => handleStatusChange(item.id)}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-2">
										<IconRenderer
											name={item.icon}
											className={STATUS_COLORS[item.id]}
										/>
										{item.name}
									</div>
									{task.status === item.id && (
										<IconRenderer name="Check" size={16} className="ml-auto" />
									)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
