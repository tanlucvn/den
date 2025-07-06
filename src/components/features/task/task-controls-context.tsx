import type { ReactNode } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useTaskActions } from "@/hooks/use-task-actions";
import type { Task } from "@/lib/models";
import { formatDate } from "@/lib/utils";

interface TaskControlsContextProps {
	task: Task;
	children: ReactNode;
}

export default function TaskControlsContext({
	task,
	children,
}: TaskControlsContextProps) {
	const { handleEdit, handlePinToggle, handleDelete } = useTaskActions();

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent forceMount>
				<p className="select-none p-2 text-muted-foreground text-xs">
					Created at {formatDate(task.updatedAt)}.
				</p>

				<ContextMenuItem className="gap-2" onClick={() => handleEdit(task)}>
					<IconRenderer name="Pen" className="!text-primary/60" />
					<span>Edit</span>
				</ContextMenuItem>

				<ContextMenuItem
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
				</ContextMenuItem>

				<ContextMenuSeparator />

				<ContextMenuItem
					className="!text-destructive gap-2"
					onClick={() => handleDelete(task)}
				>
					<IconRenderer name="Trash2" className="!text-destructive" />
					<span>Delete</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
