import type React from "react";
import { useState } from "react";
import { IconRenderer } from "@/components/icon-renderer";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import type { Todo } from "@/lib/models";
import { TodoItem } from "./todo-item";

type SectionProps = {
	icon: React.ReactNode;
	title: string;
	todos: Todo[];
	defaultOpen?: boolean;
};

export default function TodoSection({
	icon,
	title,
	todos,
	defaultOpen,
}: SectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	if (todos.length === 0) return null;

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
			<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
				{icon}
				<span className="text-foreground">{title}</span>
				<NumberFlowBadge value={todos.length} />

				<CollapsibleTrigger>
					<Button variant="ghost" size="icon" className="size-6 rounded">
						<IconRenderer
							name={isOpen ? "ChevronsDownUp" : "ChevronsUpDown"}
							className="!text-primary/60 size-3.5"
						/>
					</Button>
				</CollapsibleTrigger>
			</div>

			<CollapsibleContent className="space-y-4 px-2">
				{todos.map((todo) => (
					<TodoItem key={todo.id} todo={todo} />
				))}
			</CollapsibleContent>
		</Collapsible>
	);
}
