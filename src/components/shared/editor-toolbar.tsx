"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconRenderer } from "../icon-renderer";

interface ToolbarFormatProps {
	editor: any;
}

export const ToolbarFormat = ({ editor }: ToolbarFormatProps) => {
	const [, forceUpdate] = useState(0);

	useEffect(() => {
		if (!editor) return;

		const update = () => forceUpdate((n) => n + 1);
		editor.on("selectionUpdate", update);
		editor.on("transaction", update);

		return () => {
			editor.off("selectionUpdate", update);
			editor.off("transaction", update);
		};
	}, [editor]);

	if (!editor) return null;

	const textBlockTypes = [
		{
			label: "Heading 1",
			icon: <IconRenderer name="Heading1" className="!size-3.5" />,
			action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			active: editor.isActive("heading", { level: 1 }),
		},
		{
			label: "Heading 2",
			icon: <IconRenderer name="Heading2" className="!size-3.5" />,
			action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			active: editor.isActive("heading", { level: 2 }),
		},
		{
			label: "Heading 3",
			icon: <IconRenderer name="Heading3" className="!size-3.5" />,
			action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			active: editor.isActive("heading", { level: 3 }),
		},
		{
			label: "Heading 4",
			icon: <IconRenderer name="Heading4" className="!size-3.5" />,
			action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
			active: editor.isActive("heading", { level: 4 }),
		},
	];

	const inlineButtons = [
		{
			label: "Bold",
			icon: <IconRenderer name="Bold" className="!size-3.5" />,
			action: () => editor.chain().focus().toggleBold().run(),
			active: editor.isActive("bold"),
		},
		{
			label: "Italic",
			icon: <IconRenderer name="Italic" className="!size-3.5" />,
			action: () => editor.chain().focus().toggleItalic().run(),
			active: editor.isActive("italic"),
		},
		{
			label: "Underline",
			icon: <IconRenderer name="Underline" className="!size-3.5" />,
			action: () => editor.chain().focus().toggleUnderline().run(),
			active: editor.isActive("underline"),
		},
	];

	return (
		<div className="flex items-center gap-1">
			{textBlockTypes.map((btn) => (
				<Tooltip key={btn.label}>
					<TooltipTrigger asChild>
						<Button
							type="button"
							size="icon"
							variant={btn.active ? "default" : "outline"}
							onClick={btn.action}
							aria-label={btn.label}
						>
							{btn.icon}
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" sideOffset={4}>
						{btn.label}
					</TooltipContent>
				</Tooltip>
			))}

			{/* Inline formatting */}
			{inlineButtons.map((btn) => (
				<Tooltip key={btn.label}>
					<TooltipTrigger asChild>
						<Button
							type="button"
							size="icon"
							variant={btn.active ? "default" : "outline"}
							onClick={btn.action}
							aria-label={btn.label}
						>
							{btn.icon}
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" sideOffset={4}>
						{btn.label}
					</TooltipContent>
				</Tooltip>
			))}
		</div>
	);
};
