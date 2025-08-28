import { iconNames } from "lucide-react/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Modal,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import { cn, formatIconName } from "@/lib/utils";

interface IconPickerProps {
	icons?: string[];
	onValueChange: (icon: string | null) => void;
	value?: string | null;
	className?: string;
}

const BATCH = 100;

export function IconPicker({
	icons = iconNames,
	onValueChange,
	value = null,
	className,
}: IconPickerProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [count, setCount] = useState(BATCH);
	const [temp, setTemp] = useState<string | null>(value);

	const [debounced] = useDebounce(search, 300);

	const filtered = useMemo(() => {
		if (!debounced.trim()) return icons;
		const term = debounced.toLowerCase().trim();
		return icons.filter((n) => n.toLowerCase().includes(term));
	}, [icons, debounced]);

	const view = filtered.slice(0, count);

	useEffect(() => {
		if (!open || !value) return;
		const index = filtered.indexOf(value);
		if (index === -1) return;

		// Make sure icon is loaded
		const needed = Math.ceil((index + 1) / BATCH) * BATCH;
		setCount(needed);

		// Scroll after DOM render
		requestAnimationFrame(() => {
			const el = document.querySelector<HTMLButtonElement>(
				`[data-icon-name="${value}"]`,
			);
			el?.scrollIntoView({ block: "center" });
		});
	}, [open, value, filtered]);

	const handleSelect = (icon: string) => {
		const newVal = temp === icon ? null : icon;
		setTemp(newVal);
		onValueChange(newVal);
	};

	return (
		<Modal
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (v) {
					setTemp(value);
					setSearch("");
					setCount(BATCH);
				}
			}}
		>
			{/* Trigger */}
			<ModalTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className={cn(
						"w-full justify-between truncate font-normal",
						!value && "text-muted-foreground",
						className,
					)}
				>
					{value ? (
						<div className="flex items-center gap-2 truncate">
							<IconRenderer name={value} />
							<span className="truncate">{formatIconName(value)}</span>
						</div>
					) : (
						<span>Select an icon</span>
					)}
					<IconRenderer name="Maximize2" className="ml-2 opacity-50" />
				</Button>
			</ModalTrigger>

			{/* Content */}
			<ModalContent showCloseButton={false} className="sm:max-w-[400px]">
				<ModalHeader>
					<ModalTitle>Select an icon</ModalTitle>
					<ModalDescription>Choose your favorite icon</ModalDescription>
				</ModalHeader>

				{/* Search */}
				<div className="relative">
					<Input
						placeholder="Search icon..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setCount(BATCH);
						}}
						className="peer ps-9"
					/>
					<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground/80">
						<IconRenderer name="Search" aria-hidden="true" />
					</div>
				</div>

				{/* Grid */}
				<div
					className="grid max-h-80 gap-2 overflow-y-auto"
					style={{
						gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))",
					}}
					onScroll={(e) => {
						const el = e.currentTarget;
						if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
							setCount((p) => Math.min(p + BATCH, filtered.length));
						}
					}}
				>
					{view.map((icon) => (
						<Button
							key={icon}
							data-icon-name={icon}
							variant={temp === icon ? "default" : "outline"}
							size="icon"
							title={icon}
							onClick={() => handleSelect(icon)}
							className="size-10"
						>
							<IconRenderer name={icon} />
						</Button>
					))}
				</div>

				{/* Footer */}
				<ModalFooter className="grid grid-cols-2 gap-2 p-0">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							onValueChange(temp);
							setOpen(false);
						}}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
