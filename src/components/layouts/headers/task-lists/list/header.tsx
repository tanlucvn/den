import HeaderOptions from "@/components/layouts/headers/tasks/header-options";
import type { TaskList } from "@/db/schema/task-lists";
import HeaderNav from "./header-nav";

interface HeaderProps {
	taskList: TaskList;
}

export default function Header({ taskList }: HeaderProps) {
	return (
		<div className="flex w-full flex-col items-center">
			<HeaderNav taskList={taskList} />
			<HeaderOptions />
		</div>
	);
}
