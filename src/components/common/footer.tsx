import { QuickAddTodoForm } from "../features/todo/quick-add-todo-form";

export default function AppFooter() {
	return (
		<div className="flex w-full items-center justify-between py-2">
			<QuickAddTodoForm />
		</div>
	);
}
