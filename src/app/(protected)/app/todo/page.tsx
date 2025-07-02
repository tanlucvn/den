"use client";

import { QuickAddTodoForm } from "@/components/features/todo/quick-add-todo-form";
import { TodoItem } from "@/components/features/todo/todo-item";
import { IconRenderer } from "@/components/icon-renderer";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { useTodoStore } from "@/store/use-todo-store";

export default function Page() {
	const { todos } = useTodoStore();

	return (
		<div className="flex size-full flex-col gap-4 rounded-2xl border border-dashed p-3 shadow-xs">
			<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
				<IconRenderer name="List" className="!text-primary/60" />
				<span className="text-foreground">Tasks</span>
				<NumberFlowBadge value={todos.length} />
			</div>

			<QuickAddTodoForm />

			<div className="space-y-4 rounded-xl border bg-input/10 p-4">
				{todos.length > 0 ? (
					todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
				) : (
					<p className="text-center text-muted-foreground text-sm">
						No tasks found.
					</p>
				)}
			</div>
		</div>
	);
}
