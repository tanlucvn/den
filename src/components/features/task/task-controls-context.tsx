import { type ReactNode, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import EditTaskModal from "@/components/modals/edit-task-modal";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { Task } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { formatDate } from "@/lib/utils";

interface TaskControlsContextProps {
	task: Task;
	children: ReactNode;
}

export default function TaskControlsContext({
	task,
	children,
}: TaskControlsContextProps) {
	const [openModal, setOpenModal] = useState(false);

	const {
		handleEdit,
		handlePinToggle,
		handleArchive,
		handleDelete,
		handleDuplicate,
		handleCopyToClipboard,
	} = useTaskActions();

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
				<ContextMenuContent className="min-w-44" forceMount>
					<p className="select-none p-2 text-muted-foreground text-xs">
						Created at {formatDate(task.updatedAt)}.
					</p>

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => {
							handleEdit(task);
							setOpenModal(true);
						}}
					>
						<span>Edit</span>
						<IconRenderer name="Pen" className="!text-primary/60" />
					</ContextMenuItem>

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => handleDuplicate(task)}
					>
						<span>Duplicate</span>
						<IconRenderer name="CopyPlus" className="!text-primary/60" />
					</ContextMenuItem>

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => handleCopyToClipboard(task)}
					>
						<span>Copy Task</span>
						<IconRenderer name="Clipboard" className="!text-primary/60" />
					</ContextMenuItem>

					<ContextMenuSeparator />

					<p className="select-none px-2 py-1 text-muted-foreground text-xs">
						Status
					</p>

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => handlePinToggle(task)}
					>
						{task.isPinned ? (
							<>
								<span>Unpin</span>
								<IconRenderer name="PinOff" className="!text-primary/60" />
							</>
						) : (
							<>
								<span>Pin</span>
								<IconRenderer name="Pin" className="!text-primary/60" />
							</>
						)}
					</ContextMenuItem>

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => handleArchive(task)}
					>
						{task.isArchived ? (
							<>
								<span>Unarchive</span>
								<IconRenderer name="ArchiveX" className="!text-primary/60" />
							</>
						) : (
							<>
								<span>Archive</span>
								<IconRenderer name="Archive" className="!text-primary/60" />
							</>
						)}
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem
						className="!text-destructive justify-between gap-2"
						onClick={() => handleDelete(task)}
					>
						<span>Delete</span>
						<IconRenderer name="Trash2" className="!text-destructive" />
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<EditTaskModal open={openModal} onOpenChange={setOpenModal} />
		</>
	);
}
