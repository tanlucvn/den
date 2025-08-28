import HeaderOptions from "@/components/layouts/headers/tasks/header-options";
import type { List } from "@/db/schema/lists";
import HeaderNav from "./header-nav";

interface HeaderProps {
	list: List;
}

export default function Header({ list: taskList }: HeaderProps) {
	return (
		<div className="flex w-full flex-col items-center">
			<HeaderNav list={taskList} />
			<HeaderOptions />
		</div>
	);
}
