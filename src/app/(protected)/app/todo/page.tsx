"use client";

import { QuickAddTodoForm } from "@/components/features/todo/quick-add-todo-form";
import TodoSection from "@/components/features/todo/todo-section";
import { IconRenderer } from "@/components/icon-renderer";
import { NumberFlowBadge } from "@/components/ui/number-flow-badge";
import { useGroupedTodos } from "@/hooks/use-grouped-todos";
import { useTodoStore } from "@/store/use-todo-store";

export default function Page() {
	const { todos } = useTodoStore();
	const { pinned, recent, completed } = useGroupedTodos(todos);

	return (
		<div className="flex size-full flex-col gap-4 rounded-2xl border border-dashed p-3 shadow-xs">
			<div className="flex select-none items-center gap-2 text-muted-foreground text-sm">
				<IconRenderer name="List" className="!text-primary/60" />
				<span className="text-foreground">All Tasks</span>
				<NumberFlowBadge value={todos.length} />
			</div>

			<QuickAddTodoForm />

			{todos.length > 0 ? (
				<div className="space-y-4">
					<TodoSection
						icon={<IconRenderer name="Pin" />}
						title="Pinned"
						todos={pinned}
					/>
					<TodoSection
						icon={<IconRenderer name="History" />}
						title="Recent"
						todos={recent}
						defaultOpen
					/>
					<TodoSection
						icon={<IconRenderer name="CircleCheck" />}
						title="Completed"
						todos={completed}
						defaultOpen
					/>
				</div>
			) : (
				<p className="text-center text-muted-foreground text-sm">
					No tasks found.
				</p>
			)}
		</div>
	);
}
