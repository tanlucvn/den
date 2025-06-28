import { ThemeSwitcher } from "../theme";
import { AppSwitcher } from "./app-switcher";

export default function AppHeader() {
	return (
		<div className="flex w-full items-center justify-between">
			<AppSwitcher />

			<ThemeSwitcher />
		</div>
	);
}
