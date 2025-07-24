"use client";

import { AnimatePresence, motion, type Transition } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

interface Tab {
	title: string;
	icon: React.JSX.Element;
	type?: never;
}

interface Separator {
	type: "separator";
	title?: never;
	icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
	tabs: TabItem[];
	className?: string;
	activeColor?: string;
	value?: number | null;
	onChange?: (index: number | null) => void;
}

const buttonVariants = {
	initial: {
		gap: 0,
		paddingLeft: ".5rem",
		paddingRight: ".5rem",
	},
	animate: (isSelected: boolean) => ({
		gap: isSelected ? ".5rem" : 0,
		paddingLeft: isSelected ? "1rem" : ".5rem",
		paddingRight: isSelected ? "1rem" : ".5rem",
	}),
};

const spanVariants = {
	initial: { width: 0, opacity: 0 },
	animate: { width: "auto", opacity: 1 },
	exit: { width: 0, opacity: 0 },
};

const transition: Transition = {
	delay: 0.1,
	type: "spring",
	bounce: 0,
	duration: 0.6,
};

export function ExpandableTabs({
	tabs,
	className,
	activeColor = "text-primary-foreground",
	value,
	onChange,
}: ExpandableTabsProps) {
	const [selected, setSelected] = React.useState<number | null>(value ?? null);

	const handleSelect = (index: number) => {
		setSelected(index);
		onChange?.(index);
	};

	const Separator = () => (
		<div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
	);

	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-2 rounded-full border bg-muted p-1 shadow-xs",
				className,
			)}
		>
			{tabs.map((tab, index) => {
				if (tab.type === "separator") {
					return <Separator key={`separator-${index}`} />;
				}

				return (
					<motion.button
						key={tab.title}
						variants={buttonVariants}
						initial={false}
						animate="animate"
						custom={selected === index}
						onClick={() => handleSelect(index)}
						transition={transition}
						className={cn(
							"relative flex items-center rounded-full px-2 py-1.5 font-medium text-sm transition-colors duration-300",
							selected === index
								? cn("bg-primary", activeColor)
								: "text-muted-foreground hover:bg-muted hover:text-foreground",
						)}
					>
						{tab.icon}
						<AnimatePresence initial={false}>
							{selected === index && (
								<motion.span
									variants={spanVariants}
									initial="initial"
									animate="animate"
									exit="exit"
									transition={transition}
									className="overflow-hidden"
								>
									{tab.title}
								</motion.span>
							)}
						</AnimatePresence>
					</motion.button>
				);
			})}
		</div>
	);
}
