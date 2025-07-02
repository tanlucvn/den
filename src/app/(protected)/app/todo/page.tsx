"use client";

import { QuickAddTodoForm } from "@/components/features/todo/quick-add-todo-form";
import { TodoItem } from "@/components/features/todo/todo-item";
import { useTodoStore } from "@/store/use-todo-store";

export default function Page() {
	const { todos } = useTodoStore();

	return (
		<div className="flex size-full flex-col gap-4">
			<div className="size-full space-y-4">
				{todos.map((todo) => (
					<TodoItem key={todo.id} todo={todo} />
				))}
			</div>

			<QuickAddTodoForm />
		</div>
	);
}
