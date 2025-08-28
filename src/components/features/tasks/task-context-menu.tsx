import { type ReactNode, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import EditTaskModal from "@/components/modals/tasks/edit-task-modal";
import PomodoroTimerModal from "@/components/modals/tasks/pomodoro-timer-modal";
import TaskNoteModal from "@/components/modals/tasks/task-note-modal";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { Task } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";

interface TaskContextMenuProps {
	task: Task;
	children: ReactNode;
}

export default function TaskContextMenu({
	task,
	children,
}: TaskContextMenuProps) {
	const [openEditModal, setOpenEditModal] = useState(false);
	const [openNoteModal, setOpenNoteModal] = useState(false);
	const [openFocusModal, setOpenFocusModal] = useState(false);

	const {
		handleUpdate,
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
				<ContextMenuContent className="w-54" forceMount>
					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => {
							setOpenNoteModal(true);
						}}
					>
						<span>Note</span>
						<IconRenderer name="Notebook" className="text-muted-foreground" />
					</ContextMenuItem>

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => setOpenFocusModal(true)}
					>
						<span>Focus</span>
						<IconRenderer name="Timer" className="text-muted-foreground" />
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => setOpenEditModal(true)}
					>
						<span>Edit</span>
						<IconRenderer name="Pen" className="text-muted-foreground" />
					</ContextMenuItem>

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => handleDuplicate(task)}
					>
						<span>Duplicate</span>
						<IconRenderer name="CopyPlus" className="text-muted-foreground" />
					</ContextMenuItem>

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => handleCopyToClipboard(task)}
					>
						<span>Copy Task</span>
						<IconRenderer name="Clipboard" className="text-muted-foreground" />
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => handlePinToggle(task)}
					>
						{task.isPinned ? (
							<>
								<span>Unpin</span>
								<IconRenderer name="PinOff" className="text-muted-foreground" />
							</>
						) : (
							<>
								<span>Pin</span>
								<IconRenderer name="Pin" className="text-muted-foreground" />
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
								<IconRenderer
									name="ArchiveX"
									className="text-muted-foreground"
								/>
							</>
						) : (
							<>
								<span>Archive</span>
								<IconRenderer
									name="Archive"
									className="text-muted-foreground"
								/>
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

			<EditTaskModal
				task={task}
				open={openEditModal}
				onOpenChange={setOpenEditModal}
			/>
			<TaskNoteModal
				task={task}
				open={openNoteModal}
				onOpenChange={setOpenNoteModal}
			/>
			<PomodoroTimerModal
				task={task}
				onFinish={() => handleUpdate({ ...task, status: "completed" })}
				open={openFocusModal}
				onOpenChange={setOpenFocusModal}
			/>
		</>
	);
}
