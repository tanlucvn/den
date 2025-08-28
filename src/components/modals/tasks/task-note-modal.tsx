"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconRenderer } from "@/components/icon-renderer";
import { TiptapEditor } from "@/components/shared/tiptap-editor";
import { Button } from "@/components/ui/button";
import {
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/ui/modal";
import type { Task } from "@/db/schema";
import { useTaskActions } from "@/hooks/actions/use-task-actions";
import { getNoteSummary } from "@/lib/helpers/get-note-summary";

interface TaskNoteModalProps {
	task: Task;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export default function TaskNoteModal({
	task,
	open,
	onOpenChange,
}: TaskNoteModalProps) {
	const { loading, handleUpdate } = useTaskActions();
	const [note, setNote] = useState(task.note || "");

	const [summary, setSummary] = useState({
		letters: 0,
		words: 0,
		paragraphs: 0,
		sentences: 0,
	});

	const handleUpdateNote = async () => {
		try {
			await handleUpdate({
				...task,
				note,
			});

			onOpenChange?.(false);
		} catch {
			toast.error("Failed to update task .");
		}
	};

	useEffect(() => {
		setSummary(getNoteSummary(note || ""));
	}, [note]);

	return (
		<Modal open={open} onOpenChange={onOpenChange}>
			<ModalContent
				className="rounded-2xl ring-4 ring-accent sm:max-w-[500px]"
				showCloseButton={false}
			>
				<ModalHeader className="p-0">
					<ModalTitle>Note: {task.title}</ModalTitle>
					<ModalDescription>Add notes or thoughts to this .</ModalDescription>
				</ModalHeader>

				<div className="space-y-2">
					<TiptapEditor
						value={note}
						onChange={setNote}
						className="rounded-lg"
						editorClassName="h-[350px] max-h-[400px] py-2 px-4"
					/>

					<div className="mt-2 grid grid-cols-4 gap-1 text-muted-foreground text-xs">
						<SummaryItem label="Letters" value={summary.letters} />
						<SummaryItem label="Words" value={summary.words} />
						<SummaryItem label="Sentences" value={summary.sentences} />
						<SummaryItem label="Paragraphs" value={summary.paragraphs} />
					</div>
				</div>

				<ModalFooter className="grid grid-cols-2 p-0">
					<ModalClose asChild>
						<Button type="button" variant="outline" className="w-full">
							Cancel
						</Button>
					</ModalClose>
					<Button
						type="submit"
						className="w-full"
						disabled={loading || note === (task.note || "")}
						onClick={handleUpdateNote}
					>
						{loading && (
							<IconRenderer name="Loader2" className="animate-spin" />
						)}
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

function SummaryItem({ label, value }: { label: string; value: number }) {
	return (
		<div className="flex justify-between rounded-md border bg-muted px-2 py-1">
			<span>{label}:</span>
			<span className="font-medium">{value}</span>
		</div>
	);
}
