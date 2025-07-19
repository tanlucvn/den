"use client";

import { IconRenderer } from "@/components/icon-renderer";
import NewTaskModal from "@/components/modals/new-task-modal";
import { Button } from "@/components/ui/button";
import { InputSuffix, InputWrapper } from "@/components/ui/input";
import QuickAddTaskForm from "../../forms/quick-add-task-form";

interface QuickAddTaskProps {
	listId?: string;
}

export default function QuickAddTask({ listId }: QuickAddTaskProps) {
	const formId = "quick-add-task-form";

	return (
		<InputWrapper>
			<QuickAddTaskForm formId={formId} listId={listId} />

			<InputSuffix className="top-4.5 right-1 flex items-center gap-1">
				<NewTaskModal>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-7 rounded-full text-muted-foreground"
					>
						<IconRenderer name="Maximize2" />
					</Button>
				</NewTaskModal>

				<Button
					size="sm"
					type="submit"
					form={formId}
					className="h-7 gap-1 rounded-full text-xs"
				>
					Add
					<IconRenderer name="Plus" className="size-3.5" />
				</Button>
			</InputSuffix>
		</InputWrapper>
	);
}
