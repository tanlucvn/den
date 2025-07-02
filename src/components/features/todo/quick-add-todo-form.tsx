"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Input, InputSuffix, InputWrapper } from "@/components/ui/input";
import { useTodoActions } from "@/hooks/use-todo-actions";
import { useDialogStore } from "@/store/use-dialog-store";

export function QuickAddTodoForm() {
	const { user } = useUser();
	const { onCreate } = useTodoActions();
	const { setIsNewTodoOpen } = useDialogStore();
	const [title, setTitle] = useState("");

	const handleSubmit = async () => {
		if (!user || !title.trim()) return;

		await onCreate({
			title: title.trim(),
			userId: user.id,
			isCompleted: false,
			isPinned: false,
			note: "",
			location: "",
			priority: "none",
		});

		setTitle("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			void handleSubmit();
		}
	};

	return (
		<InputWrapper>
			<Input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Add a quick todo..."
				className="rounded-full pr-28 text-foreground"
			/>

			<InputSuffix className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					className="size-7 rounded-full text-muted-foreground"
					onClick={() => setIsNewTodoOpen(true)}
				>
					<IconRenderer name="Maximize2" />
				</Button>

				<Button
					size="sm"
					onClick={handleSubmit}
					className="h-7 gap-1 rounded-full text-xs"
				>
					Add
					<IconRenderer name="Plus" className="size-3.5" />
				</Button>
			</InputSuffix>
		</InputWrapper>
	);
}
