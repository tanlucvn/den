"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
		<div className="flex w-full items-center gap-2 p-0.5">
			<div className="relative flex w-full items-center">
				<Input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Add a quick todo..."
					className="rounded-full text-foreground"
				/>
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-1 size-7 rounded-full"
					onClick={() => setIsNewTodoOpen(true)}
				>
					<IconRenderer name="Maximize2" />
				</Button>
			</div>

			<Button
				size="sm"
				onClick={handleSubmit}
				disabled={!title.trim()}
				className="rounded-full"
			>
				Add
			</Button>
		</div>
	);
}
