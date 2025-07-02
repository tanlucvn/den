import type { ReactNode } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useTodoActions } from "@/hooks/use-todo-actions";
import type { Todo } from "@/lib/models";

interface TodoControlsContextProps {
	todo: Todo;
	children: ReactNode;
}

export function TodoControlsContext({
	todo,
	children,
}: TodoControlsContextProps) {
	const { onUpdate, onDelete } = useTodoActions();

	const handlePinToggle = () => {
		onUpdate({ ...todo, isPinned: !todo.isPinned });
	};

	const handleDelete = () => {
		onDelete(todo.id);
	};
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent forceMount>
				<ContextMenuItem className="gap-2" onClick={handlePinToggle}>
					{todo.isPinned ? (
						<>
							<IconRenderer name="PinOff" className="!text-primary" />
							<span>Unpin</span>
						</>
					) : (
						<>
							<IconRenderer name="Pin" className="!text-primary" />
							<span>Pin</span>
						</>
					)}
				</ContextMenuItem>

				<ContextMenuItem
					className="!text-destructive gap-2"
					onClick={handleDelete}
				>
					<IconRenderer name="Trash2" className="!text-destructive" />
					<span>Delete</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
