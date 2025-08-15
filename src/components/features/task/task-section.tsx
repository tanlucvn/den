"use client";

import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import type { TaskWithTagsAndList } from "@/db/schema/tasks";
import { cn } from "@/lib/utils";
import TaskItem from "./task-item";

type TaskSectionProps = {
	icon: React.ReactNode;
	title: string;
	tasks: TaskWithTagsAndList[];
	defaultOpen?: boolean;
	className?: string;
};

export default function TaskSection({
	icon,
	title,
	tasks,
	defaultOpen,
	className,
}: TaskSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	if (tasks.length === 0) return null;

	return (
		<Accordion
			type="single"
			collapsible
			value={isOpen ? "section" : ""}
			onValueChange={(val) => setIsOpen(val === "section")}
		>
			<AccordionItem value="section" className="space-y-2">
				<div
					className={cn(
						"flex w-full select-none items-center justify-between text-muted-foreground text-sm",
						isOpen && "font-medium text-primary",
						className,
					)}
				>
					<div className="flex items-center gap-2">
						{icon}
						<span className="text-foreground">{title}</span>
						<NumberFlowBadge value={tasks.length} />
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="rounded-full"
						onClick={() => setIsOpen((prev) => !prev)}
					>
						<IconRenderer name={isOpen ? "ChevronDown" : "ChevronRight"} />
					</Button>
				</div>

				<AccordionContent className="p-1">
					<div className="space-y-4">
						{tasks.map((task) => (
							<TaskItem key={task.id} task={task} />
						))}
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
