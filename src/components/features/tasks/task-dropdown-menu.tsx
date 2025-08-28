import { type ReactNode, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import EditTaskModal from "@/components/modals/tasks/edit-task-modal";
import PomodoroTimerModal from "@/components/modals/tasks/pomodoro-timer-modal";
import TaskNoteModal from "@/components/modals/tasks/task-note-modal";
import {
	DropDrawer,
	DropDrawerContent,
	DropDrawerGroup,
	DropDrawerItem,
	DropDrawerSeparator,
	DropDrawerTrigger,
} from "@/components/ui/dropdrawer";
import type { Task } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/actions/use-task-actions";

interface TaskDropdownMenuProps {
	task: Task;
	children: ReactNode;
}

export default function TaskDropdownMenu({
	task,
	children,
}: TaskDropdownMenuProps) {
	const [openEditModal, setOpenEditModal] = useState(false);
	const [openNoteModal, setOpenNoteModal] = useState(false);
	const [openFocusModal, setOpenFocusModal] = useState(false);

	const {
		handlePinToggle,
		handleArchive,
		handleDelete,
		handleDuplicate,
		handleCopyToClipboard,
		handleUpdate,
	} = useTaskActions();

	return (
		<>
			<DropDrawer>
				<DropDrawerTrigger asChild>{children}</DropDrawerTrigger>
				<DropDrawerContent
					className="sm:w-54"
					side="bottom"
					align="center"
					forceMount
					onContextMenu={(e) => e.stopPropagation()}
				>
					<DropDrawerGroup>
						<DropDrawerItem
							className="gap-2"
							icon={
								<IconRenderer
									name="Notebook"
									className="text-muted-foreground"
								/>
							}
							onClick={() => {
								setOpenNoteModal(true);
							}}
						>
							<span>Note</span>
						</DropDrawerItem>

						<DropDrawerItem
							className="gap-2"
							icon={
								<IconRenderer name="Timer" className="text-muted-foreground" />
							}
							onClick={() => {
								setOpenFocusModal(true);
							}}
						>
							<span>Focus</span>
						</DropDrawerItem>
					</DropDrawerGroup>

					<DropDrawerSeparator />

					<DropDrawerGroup>
						<DropDrawerItem
							className="gap-2"
							icon={
								<IconRenderer name="Pen" className="text-muted-foreground" />
							}
							onClick={() => setOpenEditModal(true)}
						>
							<span>Edit</span>
						</DropDrawerItem>

						<DropDrawerItem
							className="gap-2"
							icon={
								<IconRenderer
									name="CopyPlus"
									className="text-muted-foreground"
								/>
							}
							onClick={() => handleDuplicate(task)}
						>
							<span>Duplicate</span>
						</DropDrawerItem>

						<DropDrawerItem
							className="gap-2"
							icon={
								<IconRenderer
									name="Clipboard"
									className="text-muted-foreground"
								/>
							}
							onClick={() => handleCopyToClipboard(task)}
						>
							<span>Copy Task</span>
						</DropDrawerItem>
					</DropDrawerGroup>

					<DropDrawerSeparator />

					<DropDrawerGroup>
						<DropDrawerItem
							className="gap-2"
							icon={
								task.isPinned ? (
									<IconRenderer
										name="PinOff"
										className="text-muted-foreground"
									/>
								) : (
									<IconRenderer name="Pin" className="text-muted-foreground" />
								)
							}
							onClick={() => handlePinToggle(task)}
						>
							{task.isPinned ? <span>Unpin</span> : <span>Pin</span>}
						</DropDrawerItem>

						<DropDrawerItem
							className="gap-2"
							icon={
								task.isArchived ? (
									<IconRenderer
										name="ArchiveX"
										className="text-muted-foreground"
									/>
								) : (
									<IconRenderer
										name="Archive"
										className="text-muted-foreground"
									/>
								)
							}
							onClick={() => handleArchive(task)}
						>
							{task.isArchived ? <span>Unarchive</span> : <span>Archive</span>}
						</DropDrawerItem>
					</DropDrawerGroup>

					<DropDrawerSeparator />

					<DropDrawerItem
						className="!text-destructive gap-2"
						icon={<IconRenderer name="Trash2" className="!text-destructive" />}
						onClick={() => handleDelete(task)}
					>
						<span>Delete</span>
					</DropDrawerItem>
				</DropDrawerContent>
			</DropDrawer>

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
