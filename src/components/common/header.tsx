import { useDialogStore } from "@/store/use-dialog-store";
import { IconRenderer } from "../icon-renderer";
import { ThemeSwitcher } from "../theme";
import { Button } from "../ui/button";

export default function AppHeader() {
	const { setIsAppModalOpen } = useDialogStore();

	return (
		<div className="flex w-full items-center justify-between">
			<Button
				variant="outline"
				size="icon"
				onClick={() => setIsAppModalOpen(true)}
			>
				<IconRenderer name="AlignLeft" />
			</Button>

			<ThemeSwitcher />
		</div>
	);
}
