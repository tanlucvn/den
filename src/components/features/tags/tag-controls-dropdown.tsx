import { type ReactNode, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import EditTagModal from "@/components/modals/tags/edit-tag-modal";
import {
	DropDrawer,
	DropDrawerContent,
	DropDrawerItem,
	DropDrawerSeparator,
	DropDrawerTrigger,
} from "@/components/ui/dropdrawer";
import type { Tag } from "@/db/schema/tags";
import { useTagActions } from "@/hooks/actions/use-tag-actions";
import { formatDate } from "@/lib/utils";

interface TagControlsDropdownProps {
	tag: Tag;
	children: ReactNode;
}

export default function TagControlsDropdown({
	tag,
	children,
}: TagControlsDropdownProps) {
	const [openModal, setOpenModal] = useState(false);

	const { handleEdit, handleDelete } = useTagActions();

	return (
		<>
			<DropDrawer>
				<DropDrawerTrigger asChild>{children}</DropDrawerTrigger>
				<DropDrawerContent className="min-w-44" side="bottom" forceMount>
					<p className="select-none p-2 text-muted-foreground text-xs">
						Created at {formatDate(tag.updatedAt)}.
					</p>
					<DropDrawerItem
						className="gap-2"
						icon={<IconRenderer name="Pen" className="!text-primary/60" />}
						onClick={() => {
							handleEdit(tag);
							setOpenModal(true);
						}}
					>
						<span>Edit</span>
					</DropDrawerItem>

					<DropDrawerSeparator />

					<DropDrawerItem
						className="!text-destructive gap-2"
						icon={<IconRenderer name="Trash2" className="!text-destructive" />}
						onClick={() => handleDelete(tag)}
					>
						<span>Delete</span>
					</DropDrawerItem>
				</DropDrawerContent>
			</DropDrawer>

			<EditTagModal open={openModal} onOpenChange={setOpenModal} />
		</>
	);
}
