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
import { cn } from "@/lib/utils";

interface ColorInputProps {
	value?: string | null;
	onChange?: (color: string | null) => void;
}

const colorFamilies = [
	"slate",
	"gray",
	"zinc",
	"neutral",
	"stone",
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
] as const;

export function ColorInput({ value = null, onChange }: ColorInputProps) {
	const [open, setOpen] = useState(false);
	const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			if (value) {
				const match = value.match(/^bg-([a-z]+)-\d{2,3}$/);
				if (match) {
					setSelectedFamily(match[1]);
				} else {
					setSelectedFamily(null);
				}
			} else {
				setSelectedFamily(null);
			}
		}
	}, [open, value]);

	const handleSave = () => {
		onChange?.(selectedFamily);
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
									`bg-${value}-500`,
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

				{/* Color family picker */}
				<div
					className="grid max-h-80 gap-2 overflow-y-auto"
					style={{
						gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
					}}
				>
					{colorFamilies.map((family) => {
						const isSelected = family === selectedFamily;
						const bgClass = `bg-${family}-500`;
						return (
							<Button
								key={family}
								variant={isSelected ? "default" : "outline"}
								size="sm"
								onClick={() => setSelectedFamily(family)}
								className="justify-start font-normal"
							>
								<div className={cn("size-4 shrink-0 rounded-full", bgClass)} />
								<span className="capitalize">{family}</span>
							</Button>
						);
					})}
				</div>

				<ModalFooter className="grid grid-cols-2 gap-2 p-0">
					<Button
						variant="outline"
						onClick={() => {
							setSelectedFamily(null);
							setOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={!selectedFamily}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
