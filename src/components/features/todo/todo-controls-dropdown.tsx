import type { ReactNode } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTodoActions } from "@/hooks/use-todo-actions";
import type { Todo } from "@/lib/models";

interface TodoControlsDropdownProps {
	todo: Todo;
	children: ReactNode;
}

export function TodoControlsDropdown({
	todo,
	children,
}: TodoControlsDropdownProps) {
	const { onUpdate, onDelete } = useTodoActions();

	const handlePinToggle = () => {
		onUpdate({ ...todo, isPinned: !todo.isPinned });
	};

	const handleDelete = () => {
		onDelete(todo.id);
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent side="bottom" forceMount>
				<DropdownMenuItem className="gap-2" onClick={handlePinToggle}>
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
				</DropdownMenuItem>

				<DropdownMenuItem
					className="!text-destructive gap-2"
					onClick={handleDelete}
				>
					<IconRenderer name="Trash2" className="!text-destructive" />
					<span>Delete</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
