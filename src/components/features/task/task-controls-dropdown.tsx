import { type ReactNode, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import EditTaskModal from "@/components/modals/edit-task-modal";
import { PomodoroTimerDialog } from "@/components/modals/pomodoro-timer-modal";
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
import { formatDate } from "@/lib/utils";

interface TaskControlsDropdownProps {
	task: Task;
	children: ReactNode;
}

export default function TaskControlsDropdown({
	task,
	children,
}: TaskControlsDropdownProps) {
	const [openEditModal, setOpenEditModal] = useState(false);
	const [openFocusModal, setOpenFocusModal] = useState(false);

	const {
		handleEdit,
		handlePinToggle,
		handleArchive,
		handleDelete,
		handleDuplicate,
		handleCopyToClipboard,
		handleToggle,
	} = useTaskActions();

	return (
		<div
			/* Ignore task item context menu here */
			onContextMenu={(e) => {
				e.preventDefault();
			}}
		>
			<DropDrawer>
				<DropDrawerTrigger asChild>{children}</DropDrawerTrigger>
				<DropDrawerContent className="min-w-44" side="bottom" forceMount>
					<p className="select-none p-2 text-muted-foreground text-xs">
						Created at {formatDate(task.updatedAt)}.
					</p>

					<DropDrawerItem
						className="gap-2"
						icon={<IconRenderer name="Timer" className="!text-primary/60" />}
						onClick={() => {
							setOpenFocusModal(true);
						}}
					>
						<span>Focus</span>
					</DropDrawerItem>

					<DropDrawerSeparator />

					<DropDrawerGroup>
						<DropDrawerItem
							className="gap-2"
							icon={<IconRenderer name="Pen" className="!text-primary/60" />}
							onClick={() => {
								handleEdit(task);
								setOpenEditModal(true);
							}}
						>
							<span>Edit</span>
						</DropDrawerItem>

						<DropDrawerItem
							className="gap-2"
							icon={
								<IconRenderer name="CopyPlus" className="!text-primary/60" />
							}
							onClick={() => handleDuplicate(task)}
						>
							<span>Duplicate</span>
						</DropDrawerItem>

						<DropDrawerItem
							className="gap-2"
							icon={
								<IconRenderer name="Clipboard" className="!text-primary/60" />
							}
							onClick={() => handleCopyToClipboard(task)}
						>
							<span>Copy Task</span>
						</DropDrawerItem>
					</DropDrawerGroup>

					<DropDrawerSeparator />

					<p className="select-none px-2 py-1 text-muted-foreground text-xs">
						Status
					</p>

					<DropDrawerGroup>
						<DropDrawerItem
							className="gap-2"
							icon={
								task.isPinned ? (
									<IconRenderer name="PinOff" className="!text-primary/60" />
								) : (
									<IconRenderer name="Pin" className="!text-primary/60" />
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
									<IconRenderer name="ArchiveX" className="!text-primary/60" />
								) : (
									<IconRenderer name="Archive" className="!text-primary/60" />
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

			<EditTaskModal open={openEditModal} onOpenChange={setOpenEditModal} />
			<PomodoroTimerDialog
				title={task.title}
				onFinish={() => handleToggle({ ...task, isCompleted: true })}
				open={openFocusModal}
				onOpenChange={setOpenFocusModal}
			/>
		</div>
	);
}
