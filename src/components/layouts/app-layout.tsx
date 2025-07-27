"use client";

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

	return <>{children}</>;
}
