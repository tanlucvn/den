import { iconNames } from "lucide-react/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
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
import { Input } from "./input";

interface IconPickerProps {
	icons?: string[];
	onIconSelect: (iconName: string | null) => void;
	selectedIcon?: string | null;
	className?: string;
}

const BATCH_SIZE = 100;

export function IconPicker({
	icons = iconNames,
	onIconSelect,
	selectedIcon,
	className,
}: IconPickerProps) {
	const [modalOpen, setModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
	const [tempSelectedIcon, setTempSelectedIcon] = useState<string | null>(
		selectedIcon ?? null,
	);

	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const filteredCountRef = useRef<number>(0);

	const handleSelect = (icon: string) => {
		const newValue = tempSelectedIcon === icon ? null : icon;
		setTempSelectedIcon(newValue);
		onIconSelect(newValue);
	};

	// Debounce search term (use-debounce returns array)
	const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

	// Filter icons (runs on debounced term)
	const filteredIcons = useMemo(() => {
		if (!debouncedSearchTerm.trim()) return icons;
		const lower = debouncedSearchTerm.toLowerCase().trim();
		return icons.filter((name) => name.toLowerCase().includes(lower));
	}, [icons, debouncedSearchTerm]);

	// keep up-to-date count in a ref so scroll handler always sees the latest
	useEffect(() => {
		filteredCountRef.current = filteredIcons.length;
	}, [filteredIcons.length]);

	// Reset states when modal opens (only when modalOpen changes)
	useEffect(() => {
		if (!modalOpen) return;
		setTempSelectedIcon(selectedIcon ?? null);
		setVisibleCount(BATCH_SIZE);
		setSearchTerm(""); // clear previous search when opening (optional)
	}, [modalOpen, selectedIcon]);

	// When the (debounced) search changes, reset visibleCount so we show top results
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setVisibleCount(BATCH_SIZE);
	}, [debouncedSearchTerm]);

	// Attach scroll listener after a small timeout when modal opens
	useEffect(() => {
		if (!modalOpen) return;

		const timeout = setTimeout(() => {
			const container = scrollContainerRef.current;
			if (!container) return;

			const handleScroll = () => {
				if (
					container.scrollTop + container.clientHeight >=
					container.scrollHeight - 20
				) {
					setVisibleCount((prev) =>
						Math.min(prev + BATCH_SIZE, filteredCountRef.current),
					);
				}
			};

			container.addEventListener("scroll", handleScroll);

			// run once in case initial content is short and needs more to fill
			handleScroll();

			return () => {
				container.removeEventListener("scroll", handleScroll);
			};
		}, 50); // keep 50ms delay as you requested

		return () => clearTimeout(timeout);
	}, [modalOpen]); // NOTE: not dependent on filteredIcons to avoid re-running unnecessarily

	const visibleIcons = filteredIcons.slice(0, visibleCount);

	function formatIconName(name: string) {
		return name
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	return (
		<Modal open={modalOpen} onOpenChange={setModalOpen}>
			<ModalTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className={cn(
						"w-full justify-between truncate font-normal",
						!selectedIcon && "text-muted-foreground",
						className,
					)}
					onClick={() => setModalOpen(true)}
				>
					{selectedIcon ? (
						<div className="flex items-center gap-2 truncate">
							<IconRenderer name={selectedIcon} />
							<span className="truncate">{formatIconName(selectedIcon)}</span>
						</div>
					) : (
						<span>Select an icon</span>
					)}
					<IconRenderer name="Maximize2" className="ml-2 opacity-50" />
				</Button>
			</ModalTrigger>
			<ModalContent showCloseButton={false} className="sm:max-w-[400px]">
				<ModalHeader>
					<ModalTitle>Select an icon</ModalTitle>
					<ModalDescription>Choose your favorite icon</ModalDescription>
				</ModalHeader>

				<div className="relative">
					<Input
						placeholder="Search icon..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="peer ps-9"
					/>
					<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
						<IconRenderer name="Search" aria-hidden="true" />
					</div>
				</div>

				<div
					ref={scrollContainerRef}
					className="grid max-h-80 gap-2 overflow-y-auto"
					style={{
						gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))",
					}}
				>
					{visibleIcons.map((iconName) => (
						<Button
							key={iconName}
							variant={tempSelectedIcon === iconName ? "default" : "outline"}
							size="icon"
							title={iconName}
							onClick={() => handleSelect(iconName)}
							className="size-10"
						>
							<IconRenderer
								name={iconName}
								className="transition-transform group-hover:scale-110"
							/>
						</Button>
					))}
				</div>

				<ModalFooter className="grid grid-cols-2 gap-2 p-0">
					<Button variant="outline" onClick={() => setModalOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							if (tempSelectedIcon) {
								onIconSelect(tempSelectedIcon);
							}
							setModalOpen(false);
						}}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
