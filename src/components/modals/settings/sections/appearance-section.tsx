import { ThemeButton } from "@/components/theme";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { COLOR_OPTIONS } from "@/lib/constants";
import {
	type AppColor,
	useAppSettingsStore,
} from "@/store/use-app-settings-store";

const AppearanceSection = () => {
	const { appColor, setAppColor } = useAppSettingsStore();
	const selectedColor = COLOR_OPTIONS.find((opt) => opt.value === appColor);

	return (
		<div className="space-y-4">
			{/* App Color */}
			<div className="space-y-1">
				<Label className="text-muted-foreground text-xs">App color</Label>
				<div className="flex items-center justify-between">
					<span className="font-medium text-sm">Color</span>
					<Select
						value={appColor}
						onValueChange={(value) => setAppColor(value as AppColor)}
					>
						<SelectTrigger className="h-8 w-40 text-sm">
							<SelectValue placeholder="Select a color" />
						</SelectTrigger>
						<SelectContent>
							{COLOR_OPTIONS.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
									className="text-sm"
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				{selectedColor?.desc && (
					<p className="select-none text-muted-foreground text-xs">
						{selectedColor.desc}
					</p>
				)}
			</div>

			<Separator />

			{/* App Theme */}
			<div className="space-y-1">
				<Label className="text-muted-foreground text-xs">App theme</Label>
				<div className="flex items-center justify-between">
					<span className="font-medium text-sm">Theme</span>
					<div className="flex items-center gap-1">
						<ThemeButton
							iconName="Sun"
							themeTitle="light"
							className="size-8 rounded-md border-border shadow-xs"
							activeClassName="!bg-primary !text-primary-foreground border-border"
						/>
						<ThemeButton
							iconName="Moon"
							themeTitle="dark"
							className="size-8 rounded-md border-border shadow-xs"
							activeClassName="!bg-primary !text-primary-foreground border-border"
						/>
						<ThemeButton
							iconName="Laptop"
							themeTitle="system"
							className="size-8 rounded-md border-border shadow-xs"
							activeClassName="!bg-primary !text-primary-foreground border-border"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppearanceSection;
