import { type ReactNode, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import EditTaskModal from "@/components/modals/tasks/edit-task-modal";
import PomodoroTimerModal from "@/components/modals/tasks/pomodoro-timer-modal";
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
		handleUpdate,
	} = useTaskActions();

	return (
		<>
			<DropDrawer>
				<DropDrawerTrigger asChild>{children}</DropDrawerTrigger>
				<DropDrawerContent className="min-w-44" side="bottom" forceMount>
					<p className="select-none p-2 text-muted-foreground text-xs">
						Created at {formatDate(task.updatedAt)}.
					</p>

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

					<DropDrawerSeparator />

					<p className="select-none px-2 py-1 text-muted-foreground text-xs">
						Actions
					</p>

					<DropDrawerGroup>
						<DropDrawerItem
							className="gap-2"
							icon={
								<IconRenderer name="Pen" className="text-muted-foreground" />
							}
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

					<p className="select-none px-2 py-1 text-muted-foreground text-xs">
						Status
					</p>

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

			<EditTaskModal open={openEditModal} onOpenChange={setOpenEditModal} />
			<PomodoroTimerModal
				title={task.title}
				onFinish={() => handleUpdate({ ...task, status: "completed" })}
				open={openFocusModal}
				onOpenChange={setOpenFocusModal}
			/>
		</>
	);
}
