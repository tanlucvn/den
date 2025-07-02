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
				size="sm"
				onClick={() => setIsAppModalOpen(true)}
				className="font-normal"
			>
				<IconRenderer name="AlignLeft" className="!text-primary/60" />
				Menu
			</Button>

			<ThemeSwitcher />
		</div>
	);
}
