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
	const {
		handleEdit,
		handlePinToggle,
		onArchive,
		handleDelete,
		onDuplicate,
		onCopyToClipboard,
	} = useTaskActions();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-44" side="bottom" forceMount>
				<p className="select-none p-2 text-muted-foreground text-xs">
					Created at {formatDate(task.updatedAt)}.
				</p>

				<DropdownMenuItem className="gap-2" onClick={() => handleEdit(task)}>
					<IconRenderer name="Pen" className="!text-primary/60" />
					<span>Edit</span>
				</DropdownMenuItem>

				<DropdownMenuItem className="gap-2" onClick={() => onDuplicate(task)}>
					<IconRenderer name="CopyPlus" className="!text-primary/60" />
					<span>Duplicate</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					className="gap-2"
					onClick={() => onCopyToClipboard(task)}
				>
					<IconRenderer name="Clipboard" className="!text-primary/60" />
					<span>Copy Task</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<p className="select-none px-2 py-1 text-muted-foreground text-xs">
					Status
				</p>

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

				<DropdownMenuItem className="gap-2" onClick={() => onArchive(task)}>
					{task.isArchived ? (
						<>
							<IconRenderer name="ArchiveX" className="!text-primary/60" />
							<span>Unarchive</span>
						</>
					) : (
						<>
							<IconRenderer name="Archive" className="!text-primary/60" />
							<span>Archive</span>
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
