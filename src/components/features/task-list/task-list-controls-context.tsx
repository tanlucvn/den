import { type ReactNode, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import EditTaskListModal from "@/components/modals/edit-task-list-modal";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { TaskList } from "@/db/schema/task-lists";
import { useTaskListActions } from "@/hooks/use-task-list-actions";
import { formatDate } from "@/lib/utils";

interface TaskListControlsContextProps {
	taskList: TaskList;
	children: ReactNode;
}

export default function TaskListControlsContext({
	taskList,
	children,
}: TaskListControlsContextProps) {
	const [openModal, setOpenModal] = useState(false);

	const { handleEdit, onDelete } = useTaskListActions();

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
				<ContextMenuContent className="min-w-44" forceMount>
					<p className="select-none p-2 text-muted-foreground text-xs">
						Created at {formatDate(taskList.updatedAt)}.
					</p>

					<ContextMenuItem
						className="justify-between gap-2"
						onClick={() => {
							handleEdit(taskList);
							setOpenModal(true);
						}}
					>
						<span>Edit</span>
						<IconRenderer name="Pen" className="!text-primary/60" />
					</ContextMenuItem>

					<ContextMenuSeparator />

					<ContextMenuItem
						className="!text-destructive justify-between gap-2"
						onClick={() => onDelete(taskList.id)}
					>
						<span>Delete</span>
						<IconRenderer name="Trash2" className="!text-destructive" />
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<EditTaskListModal open={openModal} onOpenChange={setOpenModal} />
		</>
	);
}
