import type { ReactNode } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import {
	DropDrawer,
	DropDrawerContent,
	DropDrawerGroup,
	DropDrawerItem,
	DropDrawerSeparator,
	DropDrawerTrigger,
} from "@/components/ui/dropdrawer";
import type { Task } from "@/db/schema/tasks";
import { useTaskActions } from "@/hooks/use-task-actions";
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
		<DropDrawer>
			<DropDrawerTrigger asChild>{children}</DropDrawerTrigger>
			<DropDrawerContent className="min-w-44" side="bottom" forceMount>
				<p className="select-none p-2 text-muted-foreground text-xs">
					Created at {formatDate(task.updatedAt)}.
				</p>
				<DropDrawerGroup>
					<DropDrawerItem
						className="gap-2"
						icon={<IconRenderer name="Pen" className="!text-primary/60" />}
						onClick={() => handleEdit(task)}
					>
						<span>Edit</span>
					</DropDrawerItem>

					<DropDrawerItem
						className="gap-2"
						icon={<IconRenderer name="CopyPlus" className="!text-primary/60" />}
						onClick={() => onDuplicate(task)}
					>
						<span>Duplicate</span>
					</DropDrawerItem>

					<DropDrawerItem
						className="gap-2"
						icon={
							<IconRenderer name="Clipboard" className="!text-primary/60" />
						}
						onClick={() => onCopyToClipboard(task)}
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
						onClick={() => onArchive(task)}
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
	);
}
