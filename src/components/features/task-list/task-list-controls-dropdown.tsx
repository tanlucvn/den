"use client";

import { type ReactNode, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import EditTaskListModal from "@/components/modals/edit-task-list-modal";
import {
	DropDrawer,
	DropDrawerContent,
	DropDrawerItem,
	DropDrawerSeparator,
	DropDrawerTrigger,
} from "@/components/ui/dropdrawer";
import type { TaskList } from "@/db/schema/task-lists";
import { useTaskListActions } from "@/hooks/actions/use-task-list-actions";
import { formatDate } from "@/lib/utils";

interface TaskListControlsDropdownProps {
	taskList: TaskList;
	children: ReactNode;
}

export default function TaskListControlsDropdown({
	taskList,
	children,
}: TaskListControlsDropdownProps) {
	const [openModal, setOpenModal] = useState(false);

	const { handleEdit, handleDelete } = useTaskListActions();

	return (
		<>
			<DropDrawer>
				<DropDrawerTrigger asChild>{children}</DropDrawerTrigger>
				<DropDrawerContent className="min-w-44" side="bottom" forceMount>
					<p className="select-none p-2 text-muted-foreground text-xs">
						Created at {formatDate(taskList.createdAt)}.
					</p>

					<DropDrawerItem
						className="gap-2"
						icon={<IconRenderer name="Pen" className="!text-primary/60" />}
						onClick={() => {
							handleEdit(taskList);
							setOpenModal(true);
						}}
					>
						<span>Edit</span>
					</DropDrawerItem>

					<DropDrawerSeparator />

					<DropDrawerItem
						className="!text-destructive gap-2"
						icon={<IconRenderer name="Trash2" className="!text-destructive" />}
						onClick={() => handleDelete(taskList)}
					>
						<span>Delete</span>
					</DropDrawerItem>
				</DropDrawerContent>
			</DropDrawer>

			<EditTaskListModal open={openModal} onOpenChange={setOpenModal} />
		</>
	);
}
