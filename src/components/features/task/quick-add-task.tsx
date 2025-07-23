"use client";

import { IconRenderer } from "@/components/icon-renderer";
import NewTaskModal from "@/components/modals/new-task-modal";
import { Button } from "@/components/ui/button";
import QuickAddTaskForm from "../../forms/quick-add-task-form";

interface QuickAddTaskProps {
	listId?: string;
}

export default function QuickAddTask({ listId }: QuickAddTaskProps) {
	const formId = "quick-add-task-form";

	return (
		<div className="relative w-full">
			<QuickAddTaskForm formId={formId} listId={listId} />

			<NewTaskModal>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="absolute top-1 right-17 size-7 rounded-full text-muted-foreground"
				>
					<IconRenderer name="Maximize2" />
				</Button>
			</NewTaskModal>
		</div>
	);
}
