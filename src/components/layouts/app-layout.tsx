import { useTheme } from "next-themes";
import { type ReactNode, useEffect } from "react";
import { useAppSettingsStore } from "@/store/use-app-settings-store";

interface Props {
	children: ReactNode;
}

export default function AppLayout({ children }: Props) {
	const { theme } = useTheme();
	const { appColor } = useAppSettingsStore();

	// Apply theme
	useEffect(() => {
		document.documentElement.className = `${appColor} ${theme}`;
	}, [appColor, theme]);

	return (
		<div className="size-full">
			<div className="mx-auto flex h-full flex-col py-4 md:w-11/12 lg:w-9/12 lg:px-20 xl:w-7/12">
				{children}
			</div>
		</div>
	);
}
