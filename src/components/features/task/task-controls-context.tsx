import type { ReactNode } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useTaskActions } from "@/hooks/use-task-actions";
import type { Task } from "@/lib/models";
import { useAppStore } from "@/store/use-app-store";
import { useDialogStore } from "@/store/use-dialog-store";

interface TaskControlsContextProps {
	task: Task;
	children: ReactNode;
}

export default function TaskControlsContext({
	task,
	children,
}: TaskControlsContextProps) {
	const { setEditTask } = useAppStore();
	const { setIsEditTaskOpen } = useDialogStore();

	const { onUpdate, onDelete } = useTaskActions();

	const handleEdit = () => {
		setEditTask(task);
		setIsEditTaskOpen(true);
	};

	const handlePinToggle = () => {
		onUpdate({ ...task, isPinned: !task.isPinned });
	};

	const handleDelete = () => {
		onDelete(task.id);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent forceMount>
				<ContextMenuItem className="gap-2" onClick={handleEdit}>
					<IconRenderer name="Pen" className="!text-primary/60" />
					<span>Edit</span>
				</ContextMenuItem>

				<ContextMenuItem className="gap-2" onClick={handlePinToggle}>
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

				<ContextMenuItem
					className="!text-destructive gap-2"
					onClick={handleDelete}
				>
					<IconRenderer name="Trash2" className="!text-destructive" />
					<span>Delete</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
