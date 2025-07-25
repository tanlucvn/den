"use client";

import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ColorInputProps {
	onChange?: (color: string) => void;
	defaultValue?: string;
	showOpacity?: boolean;
}

const namedColors: { name: string; hex: string }[] = [
	{ name: "Slate", hex: "#64748b" },
	{ name: "Gray", hex: "#6b7280" },
	{ name: "Zinc", hex: "#71717a" },
	{ name: "Neutral", hex: "#737373" },
	{ name: "Stone", hex: "#78716c" },
	{ name: "Red", hex: "#ef4444" },
	{ name: "Orange", hex: "#f97316" },
	{ name: "Amber", hex: "#f59e0b" },
	{ name: "Yellow", hex: "#eab308" },
	{ name: "Lime", hex: "#84cc16" },
	{ name: "Green", hex: "#22c55e" },
	{ name: "Emerald", hex: "#10b981" },
	{ name: "Teal", hex: "#14b8a6" },
	{ name: "Cyan", hex: "#06b6d4" },
	{ name: "Sky", hex: "#0ea5e9" },
	{ name: "Blue", hex: "#3b82f6" },
	{ name: "Indigo", hex: "#6366f1" },
	{ name: "Violet", hex: "#8b5cf6" },
	{ name: "Purple", hex: "#a855f7" },
	{ name: "Fuchsia", hex: "#d946ef" },
	{ name: "Pink", hex: "#ec4899" },
	{ name: "Rose", hex: "#f43f5e" },
];

// Generate hex with alpha
const withAlpha = (hex: string, opacity: number): string => {
	if (opacity === 100) return hex;
	const alpha = Math.round(opacity * 2.55)
		.toString(16)
		.padStart(2, "0");
	return `${hex}${alpha}`;
};

export function ColorInput({
	onChange,
	defaultValue = "#ef4444",
	showOpacity = true,
}: ColorInputProps) {
	const [baseColor, setBaseColor] = useState(defaultValue);
	const [opacity, setOpacity] = useState(100);

	const finalColor = withAlpha(baseColor, opacity);

	const handleChange = (newColor: string) => {
		setBaseColor(newColor);
		onChange?.(withAlpha(newColor, opacity));
	};

	const handleOpacityChange = (newOpacity: number) => {
		setOpacity(newOpacity);
		onChange?.(withAlpha(baseColor, newOpacity));
	};

	return (
		<div className="space-y-4">
			{/* Grid of color buttons */}
			<div className="grid max-h-40 grid-cols-3 gap-2 overflow-y-auto">
				<button
					type="button"
					onClick={() => handleChange("")}
					className={cn(
						"flex items-center justify-between rounded-md border px-3 py-1.5 text-sm transition-colors",
						!baseColor
							? "border-ring bg-accent text-accent-foreground"
							: "hover:bg-muted",
					)}
				>
					<div className="flex items-center gap-2">
						<IconRenderer name="Ban" />
						<span>None</span>
					</div>
					{!baseColor && (
						<IconRenderer
							name="Check"
							className="size-4 text-muted-foreground"
						/>
					)}
				</button>

				{namedColors.map(({ name, hex }) => (
					<button
						type="button"
						key={name}
						onClick={() => handleChange(hex)}
						className={cn(
							"flex items-center justify-between gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors",
							baseColor === hex
								? "border-ring bg-accent text-accent-foreground"
								: "hover:bg-muted",
						)}
					>
						<div className="flex items-center gap-2">
							<div
								className="aspect-square size-4 rounded-[3px] border"
								style={{ backgroundColor: hex }}
							/>
							<span>{name}</span>
						</div>
						{baseColor === hex && (
							<IconRenderer
								name="Check"
								className="size-4 shrink-0 text-muted-foreground"
							/>
						)}
					</button>
				))}
			</div>

			{/* Color preview & code */}
			<div className="flex items-center gap-2">
				<div
					className="aspect-square size-8 rounded border"
					style={{ backgroundColor: finalColor }}
				/>
				<Input
					value={finalColor.toUpperCase()}
					onChange={(e) => {
						const val = e.target.value.slice(0, 7);
						if (/^#[0-9A-F]{6}$/i.test(val)) {
							handleChange(val);
						}
					}}
				/>
			</div>

			{/* Opacity */}
			{showOpacity && (
				<div className="select-none space-y-2">
					<div className="flex justify-between text-muted-foreground text-xs">
						<span>Opacity</span>
						<span>{opacity}%</span>
					</div>
					<Slider
						value={[opacity]}
						onValueChange={(val) => handleOpacityChange(val[0])}
						min={0}
						max={100}
						step={1}
					/>
				</div>
			)}
		</div>
	);
}
