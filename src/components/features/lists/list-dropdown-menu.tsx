"use client";

import { type ReactNode, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import EditTaskListModal from "@/components/modals/lists/edit-task-list-modal";
import TaskListNoteModal from "@/components/modals/lists/task-list-note-modal";
import {
	DropDrawer,
	DropDrawerContent,
	DropDrawerGroup,
	DropDrawerItem,
	DropDrawerSeparator,
	DropDrawerTrigger,
} from "@/components/ui/dropdrawer";
import type { List } from "@/db/schema/lists";
import { useTaskListActions } from "@/hooks/actions/use-list-actions";

interface ListDropdownMenuProps {
	list: List;
	children: ReactNode;
}

export default function ListDropdownMenu({
	list: taskList,
	children,
}: ListDropdownMenuProps) {
	const [openNoteModal, setOpenNoteModal] = useState(false);
	const [openEditModal, setOpenEditModal] = useState(false);

	const { handleDelete } = useTaskListActions();

	return (
		<>
			<DropDrawer>
				<DropDrawerTrigger asChild>{children}</DropDrawerTrigger>
				<DropDrawerContent className="min-w-44" side="bottom" forceMount>
					<DropDrawerGroup>
						<DropDrawerItem
							className="gap-2"
							icon={
								<IconRenderer
									name="Captions"
									className="text-muted-foreground"
								/>
							}
							onClick={() => {
								setOpenNoteModal(true);
							}}
						>
							<span>View Note</span>
						</DropDrawerItem>

						<DropDrawerItem
							className="gap-2"
							icon={
								<IconRenderer name="Pen" className="text-muted-foreground" />
							}
							onClick={() => setOpenEditModal(true)}
						>
							<span>Edit</span>
						</DropDrawerItem>
					</DropDrawerGroup>

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

			<TaskListNoteModal
				list={taskList}
				open={openNoteModal}
				onOpenChange={setOpenNoteModal}
			/>
			<EditTaskListModal
				list={taskList}
				open={openEditModal}
				onOpenChange={setOpenEditModal}
			/>
		</>
	);
}
