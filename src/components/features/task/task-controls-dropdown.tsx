import type { ReactNode } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskActions } from "@/hooks/use-task-actions";
import type { Task } from "@/lib/models";
import { formatDate } from "@/lib/utils";

interface TaskControlsDropdownProps {
	task: Task;
	children: ReactNode;
}

export default function TaskControlsDropdown({
	task,
	children,
}: TaskControlsDropdownProps) {
	const { handleEdit, handlePinToggle, handleDelete } = useTaskActions();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent side="bottom" forceMount>
				<p className="select-none p-2 text-muted-foreground text-xs">
					Created at {formatDate(task.updatedAt)}.
				</p>

				<DropdownMenuItem className="gap-2" onClick={() => handleEdit(task)}>
					<IconRenderer name="Pen" className="!text-primary/60" />
					<span>Edit</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					className="gap-2"
					onClick={() => handlePinToggle(task)}
				>
					{task.isPinned ? (
						<>
							<IconRenderer name="PinOff" className="!text-primary/60" />
							<span>Unpin</span>
						</>
					) : (
						<>
							<IconRenderer name="Pin" className="!text-primary/60" />
							<span>Pin</span>
						</>
					)}
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="!text-destructive gap-2"
					onClick={() => handleDelete(task)}
				>
					<IconRenderer name="Trash2" className="!text-destructive" />
					<span>Delete</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
