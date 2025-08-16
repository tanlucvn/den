"use client";

import { useEffect, useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import { ALL_COLORS, BG_COLOR_CLASSES, type ColorId } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
	value?: ColorId | null;
	onChange?: (color: ColorId | null) => void;
}

export function ColorPicker({ value = null, onChange }: ColorPickerProps) {
	const [open, setOpen] = useState(false);
	const [selectedColor, setSelectedColor] = useState<ColorId | null>(null);

	// Set init state when opening modal
	useEffect(() => {
		if (open) {
			setSelectedColor(value ?? null);
		}
	}, [open, value]);

	const handleSave = () => {
		onChange?.(selectedColor);
		setOpen(false);
	};

	return (
		<Modal open={open} onOpenChange={setOpen}>
			<ModalTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className={cn(
						"flex w-full items-center justify-between gap-2 truncate font-normal",
						!value && "text-muted-foreground",
					)}
				>
					{value ? (
						<div className="flex items-center gap-2 truncate">
							<div
								className={cn(
									"size-4 shrink-0 rounded-full",
									BG_COLOR_CLASSES[value],
								)}
							/>
							<span className="truncate capitalize">{value}</span>
						</div>
					) : (
						<span>Select a color</span>
					)}
					<IconRenderer name="Maximize2" className="opacity-50" />
				</Button>
			</ModalTrigger>

			<ModalContent className="sm:max-w-[400px]">
				<ModalHeader>
					<ModalTitle>Select a color</ModalTitle>
					<ModalDescription>Choose your favorite color</ModalDescription>
				</ModalHeader>

				{/* Color picker */}
				<div
					className="grid max-h-80 gap-2 overflow-y-auto"
					style={{
						gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
					}}
				>
					{ALL_COLORS.map((color) => {
						const isSelected = color.id === selectedColor;
						return (
							<Button
								key={color.id}
								variant={isSelected ? "default" : "outline"}
								size="sm"
								onClick={() => setSelectedColor(color.id)}
								className="justify-start font-normal"
							>
								<div
									className={cn(
										"size-4 shrink-0 rounded-full",
										color.background,
									)}
								/>
								<span className="capitalize">{color.name}</span>
							</Button>
						);
					})}
				</div>

				<ModalFooter className="grid grid-cols-2 gap-2 p-0">
					<Button
						variant="outline"
						onClick={() => {
							setSelectedColor(null);
							setOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={!selectedColor}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
