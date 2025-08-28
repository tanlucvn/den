"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type React from "react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";
import { ToolbarFormat } from "./editor-toolbar";

interface TiptapEditorProps {
	value?: string;
	onChange?: (val: string) => void;
	className?: string;
	editorClassName?: string;
	placeholder?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
	value = "",
	onChange,
	className,
	editorClassName,
	placeholder = "Write something...",
}) => {
	const debouncedOnChange = useDebouncedCallback((value: string) => {
		onChange?.(value);
	}, 500);

	const editor = useEditor({
		extensions: [StarterKit],
		content: value,
		onUpdate({ editor }) {
			if (editor.isEmpty) {
				debouncedOnChange("");
			} else {
				debouncedOnChange(editor.getHTML());
			}
		},
		onCreate: ({ editor }) => {
			editor.commands.focus("end");
		},
		editorProps: {
			attributes: {
				spellcheck: "false",
				class: cn(
					"!outline-none !focus-visible:!outline-none rounded-lg border p-2 dark:bg-input/30",
					"size-full max-h-[100px] overflow-y-auto",
					editorClassName,
				),
			},
		},
		immediatelyRender: true,
	});

	return (
		<div className={cn("space-y-2", className)}>
			<ToolbarFormat editor={editor} />
			<EditorContent editor={editor} placeholder={placeholder} />
		</div>
	);
};
